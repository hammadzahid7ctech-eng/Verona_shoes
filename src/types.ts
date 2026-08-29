export type Gender = 'men' | 'women' | 'kids';
export type Category = 'sneakers' | 'formal' | 'sports' | 'casual' | 'sandals' | 'boots';

export interface Review {
  id: string;
  name: string;
  rating: number;
  date: string;
  title: string;
  body: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  gender: Gender;
  category: Category;
  price: number;
  salePrice?: number;
  image: string;
  gallery: string[];
  rating: number;
  reviewCount: number;
  reviews: Review[];
  sizes: number[];
  colors: { name: string; hex: string }[];
  stock: number;
  sku: string;
  badge?: string;
  description: string;
  specs: { label: string; value: string }[];
  tags: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
}

export interface CartItem {
  productId: string;
  size: number;
  color: string;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  size: number;
  color: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  date: string;
  status: 'Processing' | 'Packed' | 'Shipped' | 'Out for Delivery' | 'Delivered';
  items: OrderItem[];
  subtotal: number;
  discount: number;
  delivery: number;
  total: number;
  couponCode?: string;
  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
  };
  paymentMethod: string;
  estimatedDelivery: string;
}

export interface Coupon {
  code: string;
  type: 'percent' | 'flat';
  value: number;
  label: string;
  minOrder?: number;
}
