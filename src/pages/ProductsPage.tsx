import { useCallback, useMemo, useState } from 'react';

import { useAppDispatch } from '../app/hooks';
import { addToCart } from '../features/cart/cartSlice';
import {
  useGetProductsQuery,
  useGetCategoriesQuery,
} from '../features/products/productsApi';
import type { Product } from '../features/products/types';
import ProductCard from '../components/ProductCard';
import { useDebouncedValue } from '../hooks/useDebouncedValue';

const PAGE_SIZE = 12;

export default function ProductsPage() {
  const dispatch = useAppDispatch();

  const [page, setPage] = useState(0);
  const [category, setCategory] = useState('');
  const [searchInput, setSearchInput] = useState('');

  // Debounce the search box so we don't fire a request on every keystroke.
  const search = useDebouncedValue(searchInput, 400);

  const { data: categories } = useGetCategoriesQuery();

  const {
    data,
    isLoading,
    isFetching,
    isError,
  } = useGetProductsQuery({
    limit: PAGE_SIZE,
    skip: page * PAGE_SIZE,
    search: search || undefined,
    category: category || undefined,
  });

  // Stable callback identity → memoized ProductCard children don't re-render.
  const handleAddToCart = useCallback(
    (product: Product) => {
      dispatch(addToCart(product));
    },
    [dispatch],
  );

  const totalPages = useMemo(
    () => (data ? Math.ceil(data.total / PAGE_SIZE) : 0),
    [data],
  );

  return (
    <section>
      <div className="toolbar">
        <input
          className="search"
          type="search"
          placeholder="Search products…"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            setPage(0);
          }}
        />
        <select
          className="select"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setSearchInput('');
            setPage(0);
          }}
        >
          <option value="">All categories</option>
          {categories?.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {isLoading && <p className="muted">Loading products…</p>}
      {isError && <p className="error">Failed to load products. Try again.</p>}

      {data && (
        <>
          <div className={`grid ${isFetching ? 'grid--busy' : ''}`}>
            {data.products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>

          {data.products.length === 0 && (
            <p className="muted">No products match your search.</p>
          )}

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="btn btn--ghost"
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                ← Prev
              </button>
              <span className="muted">
                Page {page + 1} of {totalPages}
              </span>
              <button
                className="btn btn--ghost"
                disabled={page + 1 >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
