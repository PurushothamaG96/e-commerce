import { memo } from 'react';
import { Link } from 'react-router-dom';

import { useAppSelector, useAppDispatch } from '../app/hooks';
import { selectCartCount } from '../features/cart/cartSlice';
import { selectAuthUser, logout } from '../features/auth/authSlice';

/**
 * `memo` prevents re-render unless props change. Navbar has no props, so it
 * only re-renders when the specific slices it subscribes to (cart count,
 * auth user) change — not on every store update.
 */
function Navbar() {
  const dispatch = useAppDispatch();
  const cartCount = useAppSelector(selectCartCount);
  const user = useAppSelector(selectAuthUser);

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        🛍️ NovaMart
      </Link>
      <nav className="nav-links">
        <Link to="/cart">
          Cart {cartCount > 0 && <span className="badge">{cartCount}</span>}
        </Link>
        {user ? (
          <>
            <span className="muted">Hi, {user.firstName}</span>
            <button className="link-btn" onClick={() => dispatch(logout())}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
    </header>
  );
}

export default memo(Navbar);
