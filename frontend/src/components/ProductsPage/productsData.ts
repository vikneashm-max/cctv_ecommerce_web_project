
export interface WarrantyInfo {
  icon: string;
  title: string;
  desc: string;
}

export interface Product {
  id: number;
  img: string;
  images?: string[];
  warranty?: WarrantyInfo[];
  name: string;
  price: string;
  sub: string;
  category: string;
  description: string;
  rating: number;
  reviews: number;
  specs: Record<string, string>;
  features: string[];
  inStock?: boolean;
}

export const productsData: Product[] = [];
