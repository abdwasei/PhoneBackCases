/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  title: string;
  price: number;
  brand: string;      // e.g., "Apple", "Samsung", "Google", "OnePlus"
  model: string;      // e.g., "iPhone 15", "Galaxy A55", "iPhone 15 Pro", "Galaxy S24"
  material: string;   // e.g., "Silicone", "Clear Acrylic", "Leather", "Flexi-Tough"
  color: string;      // e.g., "Sky Blue", "Clear", "Abstract", "Orange", "Brown", "Paisley", "Navy"
  imageType: 'silicone-blue' | 'clear' | 'abstract' | 'leather-orange' | 'leather-brown' | 'paisley' | 'navy' | 'custom';
  imageUrl?: string;
  description: string;
  rating: number;
  reviewsCount: number;
  isNew?: boolean;
  isPopular?: boolean;
  customConfig?: CustomCoverConfig;
}

export interface CustomCoverConfig {
  baseModel: string;
  material: string;
  color: string;
  pattern: 'solid' | 'marble' | 'paisley' | 'wave' | 'leather';
  textColor: string;
  customText: string;
}

export interface CartItem {
  id: string; // for products, same as product id; for custom, is a combination or unique.
  product: Product;
  quantity: number;
  selectedModel?: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Returned';
  trackingNumber: string;
}

export interface UserProfile {
  name: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  points: number;
  avatarSeed: string;
  isLoggedIn?: boolean;
}

export interface FilterState {
  search: string;
  category: string; // "All" or Brand
  brand: string;
  model: string;
  material: string;
  color: string;
  priceRange: [number, number];
}
