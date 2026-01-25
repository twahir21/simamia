import { CartState } from '@/types/stock.types';
import { create } from 'zustand';


export const useCartStore = create<CartState>((set) => ({
  items: [],

  addItem: (item) =>
    set((state) => {
      // if a stock exists just add its quantity.
      const existing = state.items.find(i => i.stockId === item.stockId);

      if (existing) {
        return {
          items: state.items.map(i =>
            i.stockId === item.stockId
              ? { ...i, qty: i.qty + item.qty }
              : i
          )
        };
      }

      return { items: [...state.items, item] };
    }),

  removeItem: (stockId) =>
    set((state) => ({
      items: state.items.filter(i => i.stockId !== stockId),
    })),

  clearCart: () => set({ items: [] }),
}));
