import { createSlice, createSelector, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import type { Product } from '../products/types';

export interface CartItem {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const STORAGE_KEY = 'novamart-cart';

/** Rehydrate the cart from localStorage so it survives page reloads. */
function loadCart(): CartState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { items: JSON.parse(raw) as CartItem[] };
  } catch {
    // Ignore corrupt/unavailable storage — start with an empty cart.
  }
  return { items: [] };
}

const initialState: CartState = loadCart();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Immer lets us "mutate" draft state safely — RTK produces an immutable update.
    addToCart(state, action: PayloadAction<Product>) {
      const product = action.payload;
      const existing = state.items.find((i) => i.id === product.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({
          id: product.id,
          title: product.title,
          price: product.price,
          thumbnail: product.thumbnail,
          quantity: 1,
        });
      }
    },
    removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    setQuantity(state, action: PayloadAction<{ id: number; quantity: number }>) {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (!item) return;
      item.quantity = Math.max(1, action.payload.quantity);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, setQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

/* ---------------------------------------------------------------------------
 * Selectors
 * `createSelector` memoizes derived values (totals) so they're only
 * recomputed when `items` actually changes — not on every unrelated dispatch.
 * ------------------------------------------------------------------------- */
export const selectCartItems = (state: RootState) => state.cart.items;

export const selectCartCount = createSelector(selectCartItems, (items) =>
  items.reduce((sum, i) => sum + i.quantity, 0),
);

export const selectCartTotal = createSelector(selectCartItems, (items) =>
  items.reduce((sum, i) => sum + i.price * i.quantity, 0),
);

/** Persist cart changes to localStorage. Wire this up once in the store setup. */
export function persistCart(items: CartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage may be full or unavailable — non-fatal.
  }
}
