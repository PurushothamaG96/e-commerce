import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Product, ProductsResponse, ProductQueryArgs } from './types';

/**
 * RTK Query API slice for DummyJSON (https://dummyjson.com).
 *
 * Why RTK Query for the data layer?
 *  - Automatic caching + de-duplication of identical requests.
 *  - Auto-generated, fully-typed React hooks (useGetProductsQuery, ...).
 *  - Loading / error / refetch state handled for you — no boilerplate thunks.
 * This is the biggest React performance win here: components re-render only
 * when the specific cached data they subscribe to changes.
 */
export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://dummyjson.com' }),
  // Keep unused data cached for 60s before garbage-collecting it.
  keepUnusedDataFor: 60,
  tagTypes: ['Product'],
  endpoints: (builder) => ({
    /**
     * Paginated + searchable + category-filterable product list.
     * DummyJSON uses different paths for list / search / category, so we
     * build the right URL from the args.
     */
    getProducts: builder.query<ProductsResponse, ProductQueryArgs>({
      query: ({ limit, skip, search, category }) => {
        if (search) {
          return `/products/search?q=${encodeURIComponent(search)}&limit=${limit}&skip=${skip}`;
        }
        if (category) {
          return `/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`;
        }
        return `/products?limit=${limit}&skip=${skip}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.products.map((p) => ({ type: 'Product' as const, id: p.id })),
              { type: 'Product' as const, id: 'LIST' },
            ]
          : [{ type: 'Product' as const, id: 'LIST' }],
    }),

    getProductById: builder.query<Product, number>({
      query: (id) => `/products/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Product', id }],
    }),

    getCategories: builder.query<string[], void>({
      // DummyJSON returns [{ slug, name, url }] — map to plain slugs.
      query: () => '/products/categories',
      transformResponse: (res: Array<{ slug: string }>) => res.map((c) => c.slug),
    }),
  }),
});

// Auto-generated hooks — this is what components import.
export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetCategoriesQuery,
} = productsApi;
