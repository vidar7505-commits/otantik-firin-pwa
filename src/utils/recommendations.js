/**
 * ─── Otantik Recommendation Engine ──────────────────────────────────────────
 * Amazon-style "customers who bought this also bought" system.
 * 
 * Strategy (layered, no backend needed):
 *  1. Co-occurrence matrix stored in localStorage — updated on every order
 *  2. Curated affinity rules (same-category bias, sweet/salty cross-sell)
 *  3. Best-seller fallback
 */

const STORAGE_KEY = 'otantik_cooccurrence';
const MAX_HISTORY  = 500; // max order events to retain

// ─── Read / Write matrix ──────────────────────────────────────────────────────
export const getMatrix = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
};

const saveMatrix = (matrix) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(matrix));
  } catch { /* quota guard */ }
};

/**
 * Call this when an order is finalised.
 * Increments the co-occurrence count for every pair of product IDs in the cart.
 */
export const recordOrderCooccurrence = (cartItems) => {
  const ids = cartItems.map(i => String(i.id));
  if (ids.length < 2) return;

  const matrix = getMatrix();

  for (let i = 0; i < ids.length; i++) {
    for (let j = 0; j < ids.length; j++) {
      if (i === j) continue;
      const a = ids[i], b = ids[j];
      if (!matrix[a]) matrix[a] = {};
      matrix[a][b] = (matrix[a][b] || 0) + 1;
    }
  }

  saveMatrix(matrix);
};

// ─── Curated affinity rules (seed data so new installs still work) ────────────
// Format: productId → [related product ids in priority order]
const CURATED_AFFINITY = {
  // Yaş Pastalar → Kekler / Cookiler
  601: [401, 105, 501, 402, 109],
  602: [401, 501, 105, 502, 403],
  603: [401, 105, 501, 109, 402],
  604: [401, 403, 501, 105, 302],
  605: [401, 403, 105, 501, 109],
  // Kekler → Cookiler / Tek Kişilik
  401: [601, 105, 501, 109, 502],
  402: [601, 109, 501, 105, 603],
  403: [601, 105, 501, 402, 109],
  // Cookiler → Kekler / Pastalar
  105: [401, 501, 601, 403, 109],
  109: [401, 501, 105, 403, 602],
  // Poğaça & Açma → diğer Poğaça, tuzlu
  301: [302, 303, 401, 105],
  302: [301, 303, 401],
  303: [301, 302, 401],
  // Tek Kişilik
  501: [502, 105, 401, 601, 403],
  502: [501, 105, 401, 601],
};

// ─── Score calculator ─────────────────────────────────────────────────────────
/**
 * Returns sorted product recommendations for a given anchor product,
 * while excluding products already in the cart (or the anchor itself).
 *
 * @param {object}   anchorProduct   - the product currently being viewed
 * @param {object[]} allProducts     - full product catalog
 * @param {number[]} excludeIds      - product ids to exclude (e.g. already in cart)
 * @param {number}   limit           - max results
 */
export const getRecommendations = (anchorProduct, allProducts, excludeIds = [], limit = 5) => {
  if (!anchorProduct) return [];

  const anchorId = String(anchorProduct.id);
  const matrix   = getMatrix();
  const coRow    = matrix[anchorId] || {};

  // Exclude the anchor itself and any already-excluded ids
  const excluded = new Set([anchorId, ...excludeIds.map(String)]);
  const candidates = allProducts.filter(p =>
    !excluded.has(String(p.id)) &&
    p.category !== 'kuru-pasta' &&
    p.category !== 'petifur'
  );

  const scores = candidates.map(p => {
    const pid = String(p.id);

    // 1. Real co-occurrence (strongest signal)
    const coScore = (coRow[pid] || 0) * 10;

    // 2. Curated affinity
    const affinityList = CURATED_AFFINITY[anchorProduct.id] || [];
    const affinityRank = affinityList.indexOf(p.id);
    const affinityScore = affinityRank === -1 ? 0 : (affinityList.length - affinityRank) * 3;

    // 3. Same category bonus
    const categoryScore = p.category === anchorProduct.category ? 2 : 0;

    // 4. Best-seller bonus
    const bestSellerScore = p.isBestSeller ? 2 : 0;

    // 5. Rating signal (normalised to 0-1)
    const ratingScore = ((p.rating || 4) - 4) * 0.5;

    const total = coScore + affinityScore + categoryScore + bestSellerScore + ratingScore;
    return { product: p, score: total };
  });

  return scores
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.product);
};

/**
 * Get recommendations for the whole cart (union of signals from all items).
 */
export const getCartRecommendations = (cartItems, allProducts, limit = 4) => {
  if (!cartItems.length) return [];

  const excludeIds = cartItems.map(i => i.id);
  const matrix     = getMatrix();

  const candidates = allProducts.filter(p =>
    !excludeIds.includes(p.id) &&
    p.category !== 'kuru-pasta' &&
    p.category !== 'petifur'
  );

  const scores = candidates.map(p => {
    const pid = String(p.id);
    let score = 0;

    // Aggregate co-occurrence signal from all cart items
    cartItems.forEach(cartItem => {
      const row = matrix[String(cartItem.id)] || {};
      score += (row[pid] || 0) * 10;

      // Curated affinity
      const affinityList = CURATED_AFFINITY[cartItem.id] || [];
      const rank = affinityList.indexOf(p.id);
      if (rank !== -1) score += (affinityList.length - rank) * 3;
    });

    if (p.isBestSeller) score += 2;
    score += ((p.rating || 4) - 4) * 0.5;

    return { product: p, score };
  });

  return scores
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.product);
};
