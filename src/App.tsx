import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';

/**
 * Route-level code splitting: each page is a separate JS chunk, loaded only
 * when the user navigates to it. This keeps the initial bundle small — a core
 * React performance technique. `Suspense` shows a fallback while the chunk loads.
 */
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Suspense fallback={<p className="muted">Loading…</p>}>
          <Routes>
            <Route path="/" element={<ProductsPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<p>Page not found.</p>} />
          </Routes>
        </Suspense>
      </main>
    </>
  );
}
