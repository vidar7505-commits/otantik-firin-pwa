import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PRODUCTS_DATA } from '../data/products';

const PORTION_WEIGHT = 25; // 25g per item

export const useBoxStore = create(
  persist(
    (set, get) => ({
      boxes: {
        box1: [],
        box2: []
      },
      currentBox: 'box1',
      targetWeight: 500, // Total target for the order
      weightConfig: {
        '500': { warning: 400, ideal: 500, limit: 600 },
        '1000': { warning: 850, ideal: 1000, limit: 1200 }
      },
      config: {
        type: 'kuru-pasta',
        ratio: 'half-half',
        packaging: 'mixed', // 'mixed' or 'separate'
        preferences: ''
      },
      isBuilding: false,
      specialNote: '',
      noteCategory: 'Özel İstek', // ['Arayın', 'Değiştirin', 'Özel İstek']
      editingBoxId: null,

      setBuilding: (val) => set({ isBuilding: val }),
      
      setConfig: (config) => {
        set({
          config: {
            type: config.type || 'kuru-pasta',
            ratio: config.ratio || 'half-half',
            packaging: config.packaging || 'mixed',
            preferences: config.preferences || '',
            weight: config.weight,
          },
          targetWeight: config.weight === '1kg' ? 1000 : 500,
          isBuilding: true,
          boxes: { box1: [], box2: [] },
          currentBox: 'box1',
        });
      },

      setTargetWeight: (weight) => set({ targetWeight: weight }),

      upgradeTo1Kg: () => {
        set((state) => ({
          targetWeight: 1000,
          config: {
            ...state.config,
            weight: '1kg'
          }
        }));
      },

      addItem: (boxKey, product) => {
        const currentWeight = get().getBoxWeight(boxKey);
        const boxTarget = get().getBoxTarget(boxKey);
        const configLimit = get().weightConfig[get().targetWeight.toString()]?.limit || 1200;
        const boxLimit = get().config.packaging === 'mixed' ? configLimit : configLimit / 2;

        if (currentWeight + PORTION_WEIGHT > boxLimit) {
            // Hard block
            return false;
        }
        
        set((state) => ({
          boxes: {
            ...state.boxes,
            [boxKey]: [...state.boxes[boxKey], { ...product, instanceId: Math.random().toString(36).substr(2, 9), isAuto: false }]
          }
        }));
        return true;
      },

      setItemQuantity: (boxKey, product, quantity) => {
        const { getBoxWeight, targetWeight, weightConfig, config } = get();
        const currentItems = get().boxes[boxKey].filter(item => item.id !== product.id);
        const otherWeight = currentItems.length * PORTION_WEIGHT;
        const configLimit = weightConfig[targetWeight.toString()]?.limit || 1200;
        const boxLimit = config.packaging === 'mixed' ? configLimit : configLimit / 2;

        const maxQty = Math.floor((boxLimit - otherWeight) / PORTION_WEIGHT);
        const finalQty = Math.min(quantity, maxQty);

        set((state) => {
          const newItems = Array.from({ length: finalQty }, () => ({
            ...product,
            instanceId: Math.random().toString(36).substr(2, 9),
            isAuto: false
          }));
          return {
            boxes: {
              ...state.boxes,
              [boxKey]: [...currentItems, ...newItems]
            }
          };
        });
      },

      removeItem: (boxKey, instanceId) => {
        set((state) => ({
          boxes: {
            ...state.boxes,
            [boxKey]: state.boxes[boxKey].filter(i => i.instanceId !== instanceId)
          }
        }));
      },

      fillRemaining: (preference) => {
        const { boxes, currentBox, getBoxWeight, getBoxTarget, config } = get();
        const currentWeight = getBoxWeight(currentBox);
        const target = getBoxTarget(currentBox);
        const remaining = target - currentWeight;
        
        if (remaining <= 0) return;

        const itemCount = Math.floor(remaining / PORTION_WEIGHT);
        if (itemCount <= 0) return;

        // Filter products based on preference and category
        let pool = PRODUCTS_DATA.filter(p => p.category === config.type);
        
        if (preference === 'En Çok Satanlar') {
          pool = pool.filter(p => p.isBestSeller);
        } else if (preference === 'Tatlı Ağırlıklı') {
          pool = pool.filter(p => p.isSweet);
        } else if (preference === 'Tuzlu Ağırlıklı') {
          pool = pool.filter(p => p.isSalty);
        }

        if (pool.length === 0) pool = PRODUCTS_DATA.filter(p => p.category === config.type);

        const newItems = [];
        for (let i = 0; i < itemCount; i++) {
          const randomProduct = pool[Math.floor(Math.random() * pool.length)];
          newItems.push({ 
            ...randomProduct, 
            instanceId: Math.random().toString(36).substr(2, 9), 
            isAuto: true 
          });
        }

        set((state) => ({
          boxes: {
            ...state.boxes,
            [currentBox]: [...state.boxes[currentBox], ...newItems]
          }
        }));
      },

      getBoxWeight: (boxKey) => {
        return (get().boxes[boxKey]?.length || 0) * PORTION_WEIGHT;
      },

      getBoxTarget: (boxKey) => {
        const { targetWeight, config } = get();
        if (config.packaging === 'mixed') return targetWeight;
        return targetWeight / 2; // 250g if 500g, 500g if 1kg
      },

      getTotalWeight: () => {
        const b1 = get().getBoxWeight('box1');
        const b2 = get().getBoxWeight('box2');
        return b1 + b2;
      },

      isBoxValid: (boxKey) => {
        const weight = get().getBoxWeight(boxKey);
        const target = get().getBoxTarget(boxKey);
        return weight >= target;
      },

      isOrderValid: () => {
        const { targetWeight, getTotalWeight } = get();
        return getTotalWeight() >= Number(targetWeight);
      },

      setNote: (note, category) => set({ specialNote: note, noteCategory: category }),

      reset: () => set({
        boxes: { box1: [], box2: [] },
        isBuilding: false,
        specialNote: '',
        editingBoxId: null
      })
    }),
    {
      name: 'otantik-box-storage',
      getStorage: () => localStorage,
    }
  )
);
