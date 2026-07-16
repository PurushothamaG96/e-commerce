export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;
  thumbnail: string;
  images: string[];
}

/** Shape of DummyJSON's paginated list responses. */
export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

/** Arguments for the paginated / searchable product list query. */
export interface ProductQueryArgs {
  limit: number;
  skip: number;
  search?: string;
  category?: string;
}
