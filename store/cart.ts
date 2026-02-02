import { CartState } from '@/types/stock.types';
import { create } from 'zustand';

export const useCartStore = create<CartState>((set) => ({
  items: [],

  addItem: (item) =>
    set((state) => {
      const existing = state.items.find(i => i.stockId === item.stockId);

      if (existing) {
        return {
          items: state.items.map(i =>
            i.stockId === item.stockId
              ? { ...i, qty: i.qty + item.qty }
              : i
          ),
        };
      }

      return { items: [...state.items, item] };
    }),

  updateQty: (stockId: number, qty: number) =>
    set((state) => ({
      items:
        qty <= 0
          ? state.items.filter(i => i.stockId !== stockId)
          : state.items.map(i =>
              i.stockId === stockId ? { ...i, qty } : i
            ),
    })),

  removeItem: (stockId) =>
    set((state) => ({
      items: state.items.filter(i => i.stockId !== stockId),
    })),

  clearCart: () => set({ items: [] }),
}));
