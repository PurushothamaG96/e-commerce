import { useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';

import { useAppDispatch } from '../app/hooks';
import { addToCart } from '../features/cart/cartSlice';
import { useGetProductByIdQuery } from '../features/products/productsApi';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const productId = Number(id);
  const { data: product, isLoading, isError } = useGetProductByIdQuery(productId, {
    skip: Number.isNaN(productId),
  });

  const handleAdd = useCallback(() => {
    if (product) dispatch(addToCart(product));
  }, [dispatch, product]);

  if (isLoading) return <p className="muted">Loading…</p>;
  if (isError || !product) return <p className="error">Product not found.</p>;

  const finalPrice = (product.price * (1 - product.discountPercentage / 100)).toFixed(2);

  return (
    <article className="detail">
      <div className="detail-media">
        <img src={product.thumbnail} alt={product.title} width={360} height={360} />
      </div>
      <div className="detail-body">
        <Link to="/" className="muted">
          ← Back to products
        </Link>
        <h1>{product.title}</h1>
        <p className="muted">
          {product.brand ? `${product.brand} · ` : ''}
          {product.category}
        </p>
        <p>{product.description}</p>
        <div className="price-row">
          <span className="price price--lg">${finalPrice}</span>
          {product.discountPercentage > 0 && (
            <span className="price-old">${product.price.toFixed(2)}</span>
          )}
        </div>
        <p className="muted">
          ⭐ {product.rating} · {product.stock} in stock
        </p>
        <button className="btn" onClick={handleAdd}>
          Add to cart
        </button>
      </div>
    </article>
  );
}
