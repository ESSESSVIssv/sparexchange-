export enum Condition {
  NEW = 'New',
  USED = 'Used',
}

export const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'INR'] as const;
export type Currency = typeof CURRENCIES[number];

export const MOCK_EXCHANGE_RATES: Record<Currency, number> = {
    USD: 1.0,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 157.0,
    CAD: 1.37,
    AUD: 1.50,
    INR: 83.50,
};

export const convertCurrency = (price: number, from: Currency, to: Currency): number => {
    const priceInUsd = price / MOCK_EXCHANGE_RATES[from];
    // FIX: Corrected typo from MOCK_EXchange_RATES to MOCK_EXCHANGE_RATES.
    return priceInUsd * MOCK_EXCHANGE_RATES[to];
};

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface Review {
  id: number;
  author: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
}

export interface ChatMessage {
  id: number;
  text: string;
  sender: 'currentUser' | 'otherUser';
  timestamp: string;
}

export interface Conversation {
  id: string; // e.g., `product-1-user-currentUser`
  productId: number;
  productName: string;
  productImageUrl: string;
  participants: ['currentUser', 'otherUser'];
  messages: ChatMessage[];
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  condition: Condition;
  imageUrl: string;
  additionalImages?: string[];
  currency: Currency;
  sellerId: string;
  reviews?: Review[];
  sellerPhoneNumber: string;
  sellerLocation: Address;
  isVerified?: boolean;
}

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'info';
}

export enum OrderStatus {
  PROCESSING = 'Processing',
  SHIPPED = 'Shipped',
  DELIVERED = 'Delivered',
}

export interface Order {
  id: string;
  items: Product[];
  total: number;
  currency: Currency;
  date: string;
  status: OrderStatus;
  shippingAddress: Address;
}