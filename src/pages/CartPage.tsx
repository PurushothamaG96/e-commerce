import { Link } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  selectCartItems,
  selectCartTotal,
  removeFromCart,
  setQuantity,
  clearCart,
} from '../features/cart/cartSlice';

export default function CartPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);

  if (items.length === 0) {
    return (
      <div className="empty">
        <p>Your cart is empty.</p>
        <Link to="/" className="btn">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <section className="cart">
      <h1>Your cart</h1>
      <ul className="cart-list">
        {items.map((item) => (
          <li key={item.id} className="cart-item">
            <img src={item.thumbnail} alt={item.title} width={64} height={64} loading="lazy" />
            <div className="cart-item-info">
              <span className="cart-item-title">{item.title}</span>
              <span className="muted">${item.price.toFixed(2)}</span>
            </div>
            <input
              className="qty"
              type="number"
              min={1}
              value={item.quantity}
              onChange={(e) =>
                dispatch(setQuantity({ id: item.id, quantity: Number(e.target.value) }))
              }
            />
            <span className="cart-item-sub">${(item.price * item.quantity).toFixed(2)}</span>
            <button className="link-btn" onClick={() => dispatch(removeFromCart(item.id))}>
              Remove
            </button>
          </li>
        ))}
      </ul>

      <div className="cart-footer">
        <button className="link-btn" onClick={() => dispatch(clearCart())}>
          Clear cart
        </button>
        <div className="cart-total">
          Total: <strong>${total.toFixed(2)}</strong>
        </div>
      </div>
    </section>
  );
}
