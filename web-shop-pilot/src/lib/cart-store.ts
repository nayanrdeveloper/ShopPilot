import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string; // Product ID
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  maxStock: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean; // Controls Drawer state
  addItem: (
    product: { id: string; name: string; price: number; stock: number; imageUrl?: string },
    quantity: number
  ) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: (open?: boolean) => void;
  total: number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      total: 0,

      addItem: (product, quantity) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === product.id);

        if (existingItem) {
          const newQuantity = Math.min(existingItem.quantity + quantity, product.stock);
          set({
            items: currentItems.map((item) =>
              item.id === product.id ? { ...item, quantity: newQuantity } : item
            ),
          });
        } else {
          set({
            items: [
              ...currentItems,
              {
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: Math.min(quantity, product.stock),
                imageUrl: product.imageUrl,
                maxStock: product.stock,
              },
            ],
          });
        }

        // Recalculate total logic could go here or be a derived getter
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        set({
          items: get().items.map((item) => {
            if (item.id === id) {
              const validQuantity = Math.max(1, Math.min(quantity, item.maxStock));
              return { ...item, quantity: validQuantity };
            }
            return item;
          }),
        });
      },

      clearCart: () => set({ items: [] }),

      toggleCart: (open) =>
        set((state) => ({
          isOpen: open !== undefined ? open : !state.isOpen,
        })),
    }),
    {
      name: 'shoppilot-cart-storage',
    }
  )
);
