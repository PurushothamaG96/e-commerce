import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

/**
 * Pre-typed versions of the react-redux hooks.
 *
 * Always import THESE instead of the plain `useDispatch` / `useSelector`,
 * so every selector and dispatch is fully typed with no manual generics.
 */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
