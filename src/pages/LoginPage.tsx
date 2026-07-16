import { useState, type FormEvent } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  login,
  selectAuthStatus,
  selectAuthError,
  selectIsAuthenticated,
} from '../features/auth/authSlice';

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const status = useAppSelector(selectAuthStatus);
  const error = useAppSelector(selectAuthError);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // Prefilled with DummyJSON's demo credentials so it works out of the box.
  const [username, setUsername] = useState('emilys');
  const [password, setPassword] = useState('emilyspass');

  // Already signed in → redirect declaratively (no side effects during render).
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const result = await dispatch(login({ username, password }));
    if (login.fulfilled.match(result)) {
      navigate('/', { replace: true });
    }
  }

  return (
    <form className="auth" onSubmit={handleSubmit}>
      <h1>Sign in</h1>
      <label>
        Username
        <input value={username} onChange={(e) => setUsername(e.target.value)} required />
      </label>
      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      {error && <p className="error">{error}</p>}
      <button className="btn" type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Signing in…' : 'Sign in'}
      </button>
      <p className="muted small">Demo: emilys / emilyspass</p>
    </form>
  );
}
