import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import { productsApi } from '../features/products/productsApi';
import cartReducer, { persistCart } from '../features/cart/cartSlice';
import authReducer from '../features/auth/authSlice';

/**
 * The single Redux store for the whole app.
 *
 * - `productsApi.reducer` holds RTK Query's cache (products/search/categories).
 * - `cart` / `auth` are classic RTK slices for local client state.
 * - The API middleware powers caching, invalidation, polling and refetching.
 */
export const store = configureStore({
  reducer: {
    [productsApi.reducerPath]: productsApi.reducer,
    cart: cartReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productsApi.middleware),
});

// Enables refetchOnFocus / refetchOnReconnect behaviours for RTK Query.
setupListeners(store.dispatch);

// Persist the cart to localStorage whenever it changes. We keep a reference to
// the last items array and only write when it actually changed (cheap identity
// check thanks to Immer returning new references only on real mutations).
let lastCartItems = store.getState().cart.items;
store.subscribe(() => {
  const { items } = store.getState().cart;
  if (items !== lastCartItems) {
    lastCartItems = items;
    persistCart(items);
  }
});

// Infer types straight from the store so they never drift from reality.
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
