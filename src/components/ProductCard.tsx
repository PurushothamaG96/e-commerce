import { memo } from 'react';
import { Link } from 'react-router-dom';

import type { Product } from '../features/products/types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

/**
 * A single product tile.
 *
 * Wrapped in `memo` so that when the parent list re-renders (e.g. the cart
 * count changes elsewhere), each card only re-renders if ITS `product` or the
 * `onAddToCart` reference changed. The parent passes a stable `onAddToCart`
 * via `useCallback`, so cards stay put — this is what keeps a 30-item grid
 * cheap to render.
 */
function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const finalPrice = (
    product.price *
    (1 - product.discountPercentage / 100)
  ).toFixed(2);

  return (
    <article className="card">
      <Link to={`/product/${product.id}`} className="card-media">
        {/* loading="lazy" defers off-screen images — big perf win on long grids */}
        <img src={product.thumbnail} alt={product.title} loading="lazy" width={220} height={220} />
      </Link>
      <div className="card-body">
        <Link to={`/product/${product.id}`} className="card-title">
          {product.title}
        </Link>
        <p className="muted card-cat">{product.category}</p>
        <div className="price-row">
          <span className="price">${finalPrice}</span>
          {product.discountPercentage > 0 && (
            <span className="price-old">${product.price.toFixed(2)}</span>
          )}
        </div>
        <button className="btn" onClick={() => onAddToCart(product)}>
          Add to cart
        </button>
      </div>
    </article>
  );
}

// Default memo comparison (shallow prop equality) is exactly what we want here.
export default memo(ProductCard);
