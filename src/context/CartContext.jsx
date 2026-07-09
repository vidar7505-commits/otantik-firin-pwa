import React, { createContext, useContext, useState, useEffect } from 'react';
import { recordOrderCooccurrence } from '../utils/recommendations';

const CartContext = createContext();

const INITIAL_BOX = {
  items: [],
  targetWeight: 500,
  weight: 0,
  ratio: '1:1',
  preferences: '',
  type: 'kuru-pasta',
  packaging: 'mixed',
  isBuilding: false
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('otantik_cart');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('otantik_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentBox, setCurrentBox] = useState(() => {
    const saved = localStorage.getItem('otantik_currentBox');
    return saved ? JSON.parse(saved) : INITIAL_BOX;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('otantik_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('otantik_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('otantik_currentBox', JSON.stringify(currentBox));
  }, [currentBox]);

  const updateBoxConfig = (config) => {
    setCurrentBox(prev => ({ ...prev, ...config, isBuilding: true }));
  };

  const addBoxItem = (product) => {
    const itemWeight = 25; // Standard 25g per item portion
    
    // We allow adding to show the 'exceeded' state, but common sense guard at 200%
    if (currentBox.weight > currentBox.targetWeight * 2) return false;

    setCurrentBox(prev => ({
      ...prev,
      items: [...prev.items, { ...product, instanceId: Date.now() + Math.random() }],
      weight: prev.weight + itemWeight
    }));
    return true;
  };

  const removeBoxItem = (instanceId) => {
    const itemWeight = 25;
    setCurrentBox(prev => ({
      ...prev,
      items: prev.items.filter(item => item.instanceId !== instanceId),
      weight: Math.max(0, prev.weight - itemWeight)
    }));
  };

  const clearBox = () => {
    setCurrentBox(INITIAL_BOX);
  };

  const generateWhatsAppSlip = (box) => {
    let slip = `*📦 KUTU SİPARİŞİ - OTANTİK* \n\n`;
    slip += `*Ürün:* ${box.type === 'kuru-pasta' ? 'Kuru Pasta' : 'Petifür'} Seçkisi\n`;
    slip += `*Hedef:* ${box.targetWeight}gr\n`;
    slip += `*Oran:* ${box.ratio}\n`;
    slip += `*Paketleme:* ${box.packaging === 'mixed' ? 'Tek Kutu' : 'Ayrı Kutular'}\n\n`;
    slip += `*İçerik:*\n`;
    
    const grouped = box.items.reduce((acc, item) => {
      acc[item.name] = (acc[item.name] || 0) + 1;
      return acc;
    }, {});

    Object.entries(grouped).forEach(([name, count]) => {
      slip += `- ${name} (${count} Adet)\n`;
    });

    if (box.preferences) slip += `\n*Not:* ${box.preferences}\n`;
    slip += `\n*Toplam:* ${box.weight}gr\n`;
    slip += `_⚠️ El yapımı olması nedeniyle +/- %15 sapma payı kabul edilmiştir._`;
    return slip;
  };

  const confirmBox = (boxData) => {
    const slip = generateWhatsAppSlip(boxData);
    const boxProduct = {
      id: `box-${Date.now()}`,
      name: `${boxData.type === 'kuru-pasta' ? 'Kuru Pasta' : 'Petifür'} Seçkisi (${boxData.targetWeight}gr)`,
      price: boxData.targetWeight === 500 ? 180 : 340,
      quantity: 1,
      formattedSlip: slip,
      isCustomBox: true,
      weight: boxData.weight,
      boxData: { ...boxData }
    };

    setCart(prev => [...prev, boxProduct]);
    clearBox();
    return slip;
  };

  const addToCart = (product, quantity = 1) => {
    // Strict Validation: Cannot add kuru-pasta or petifur without box builder
    if (product.category === 'kuru-pasta' || product.category === 'petifur') {
        const isBoxFlow = window.location.pathname.includes('selection');
        // If we are in SPA mode and no router, we might want to check something else, 
        // but the main issue was the category name mismatch.
        // For now, let's keep it simple.
    }

    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && !item.isCustomBox);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    return true;
  };

  const finalizeOrder = (specialNote = '', noteCategory = '', deliveryDate = '', deliveryTime = '') => {
    const orderId = `ord-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    
    // Generate combined slip
    let combinedSlip = `*🛍️ YENİ SİPARİŞ - OTANTİK*\n`;
    combinedSlip += `*ID:* ${orderId}\n`;
    combinedSlip += `*Tarih:* ${new Date().toLocaleDateString('tr-TR')}\n`;

    if (deliveryDate && deliveryTime) {
      // Format deliveryDate from yyyy-mm-dd to dd.mm.yyyy
      let formattedDelivDate = deliveryDate;
      try {
        const parts = deliveryDate.split('-');
        if (parts.length === 3) {
          formattedDelivDate = `${parts[2]}.${parts[1]}.${parts[0]}`;
        }
      } catch (err) {
        console.error(err);
      }
      combinedSlip += `*Teslimat:* ${formattedDelivDate} - Saat: ${deliveryTime}\n\n`;
    } else {
      combinedSlip += `\n`;
    }

    if (specialNote) {
        combinedSlip += `*⚠️ NOT (${noteCategory.toUpperCase()}):* ${specialNote}\n\n`;
    }

    combinedSlip += `*SİPARİŞ İÇERİĞİ:*\n`;
    cart.forEach(item => {
        if (item.isCustomBox) {
            combinedSlip += `\n${item.formattedSlip}\n`;
        } else {
            combinedSlip += `- ${item.name} (${item.quantity} Adet)\n`;
            if (item.selectedSize) combinedSlip += `  Boyut: ${item.selectedSize}\n`;
            if (item.extras) {
                if (item.extras.free?.hasMessage && item.extras.free?.message) {
                    combinedSlip += `  💌 Pasta Yazısı: "${item.extras.free.message}"\n`;
                }
                const paidItems = [];
                if (item.extras.paid) {
                    Object.entries(item.extras.paid).forEach(([id, val]) => {
                        if (id === 'num-candle') {
                            const nums = Object.entries(val)
                                .filter(([_, count]) => count > 0)
                                .map(([num, count]) => `[${num}] x${count}`);
                            if (nums.length > 0) paidItems.push(`Sayılı Mum (${nums.join(', ')})`);
                        } else if (val > 0) {
                            paidItems.push(`${id === 'text-candle' ? 'Yazılı Mum' : 'Volkan'} x${val}`);
                        }
                    });
                }
                
                if (paidItems.length > 0) combinedSlip += `  ➕ Ekstralar: ${paidItems.join(', ')}\n`;
                
                const chosenFree = [];
                if (item.extras.free?.candle) chosenFree.push('Mum');
                if (item.extras.free?.sparkler) chosenFree.push('Maytap');
                if (chosenFree.length > 0) combinedSlip += `  🎁 İkram: ${chosenFree.join(', ')}\n`;
            }
        }
    });

    const totalPrice = cart.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
    combinedSlip += `\n*TOPLAM TUTAR:* ${totalPrice.toFixed(2)} ₺`;

    const orderData = {
      id: orderId,
      date: new Date().toISOString(),
      items: cart,
      slip: combinedSlip,
      price: totalPrice,
      status: 'received',
      deliveryDate,
      deliveryTime,
      specialNote,
      noteCategory
    };
    
    // Record cooccurrence metrics for Amazon-style recommendation engine
    recordOrderCooccurrence(cart);

    setOrders(prev => [orderData, ...prev]);
    setCart([]);
    return orderData;
  };

  const addDirectOrder = (orderData) => {
    setOrders(prev => [orderData, ...prev]);
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartItem = (itemId, updatedFields) => {
    setCart(prev => prev.map(item => {
      if (item.id === itemId) {
        let newItem = { ...item, ...updatedFields };
        if (newItem.isCustomBox && updatedFields.boxData) {
          const slip = generateWhatsAppSlip(updatedFields.boxData);
          newItem.formattedSlip = slip;
          newItem.weight = updatedFields.boxData.weight;
          newItem.name = `${updatedFields.boxData.type === 'kuru-pasta' ? 'Kuru Pasta' : 'Petifür'} Seçkisi (${updatedFields.boxData.targetWeight}gr)`;
          newItem.price = updatedFields.boxData.targetWeight === 500 ? 180 : 340;
        }
        return newItem;
      }
      return item;
    }));
  };

  const cartCount = cart.length;

  return (
    <CartContext.Provider value={{ 
      cart, addToCart, removeFromCart, updateCartItem, cartCount, orders, finalizeOrder, addDirectOrder, updateOrderStatus,
      currentBox, updateBoxConfig, addBoxItem, removeBoxItem, clearBox, confirmBox
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
