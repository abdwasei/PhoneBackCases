/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Order, UserProfile } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Silicone Case - Sky Blue',
    price: 19.00,
    brand: 'Apple',
    model: 'iPhone 15',
    material: 'Silicone',
    color: 'Sky Blue',
    imageType: 'silicone-blue',
    description: 'Constructed from silky, soft-touch liquid silicone that resists fingerprints. Dynamic interior microfiber lining keeps your device immaculate.',
    rating: 4.8,
    reviewsCount: 142,
    isPopular: true
  },
  {
    id: '2',
    title: 'A55 Clear Case',
    price: 30.00,
    brand: 'Samsung',
    model: 'Galaxy A55',
    material: 'Clear Acrylic',
    color: 'Clear',
    imageType: 'clear',
    description: 'Optical-grade crystal clear TPU and hybrid polycarbonate blend. Specially formulated non-yellowing materials ensure absolute transparency over time.',
    rating: 4.6,
    reviewsCount: 88,
    isNew: true
  },
  {
    id: '3',
    title: 'Abstract Art Case',
    price: 34.00,
    brand: 'Apple',
    model: 'iPhone 15 Pro',
    material: 'Flexi-Tough',
    color: 'Abstract',
    imageType: 'abstract',
    description: 'Durable dual-layer shell featuring high-gloss high-definition print of sunset orange and oceanic teal waves. Full perimeter impact cushioning.',
    rating: 4.9,
    reviewsCount: 215,
    isPopular: true
  },
  {
    id: '4',
    title: 'Leather 15 Case',
    price: 29.00,
    brand: 'Apple',
    model: 'iPhone 15',
    material: 'Leather',
    color: 'Orange',
    imageType: 'leather-orange',
    description: 'Luxurious, vibrant orange full-grain French leather. Develops a gorgeous retro hand-rubbed glossy patina over cycles of usage.',
    rating: 4.7,
    reviewsCount: 65
  },
  {
    id: '5',
    title: 'Leathene Coovers',
    price: 30.00,
    brand: 'Samsung',
    model: 'Galaxy S24',
    material: 'Leather',
    color: 'Brown',
    imageType: 'leather-brown',
    description: 'Stitched distressed saddle leather, providing exceptional tactile grip and premium corporate aesthetic. Equipped with integrated magnetic arrays.',
    rating: 4.5,
    reviewsCount: 94
  },
  {
    id: '6',
    title: 'iPhone 15 Case',
    price: 72.00,
    brand: 'Apple',
    model: 'iPhone 15 Pro',
    material: 'Flexi-Tough',
    color: 'Paisley',
    imageType: 'paisley',
    description: 'Limited high-fashion edition featuring traditional royal paisley damask. Deep textured blue dye layers engineered to resist scratch cycles.',
    rating: 4.9,
    reviewsCount: 180,
    isPopular: true
  },
  {
    id: '7',
    title: 'Deep Navy Flex',
    price: 25.00,
    brand: 'Google',
    model: 'Pixel 8 Pro',
    material: 'Silicone',
    color: 'Navy',
    imageType: 'navy',
    description: 'Minimalistic matte deep navy silicone. Reinforced camera protective rim and tactile high-response metal responsive buttons.',
    rating: 4.7,
    reviewsCount: 110,
    isNew: true
  }
];

export const INITIAL_USER: UserProfile = {
  name: 'Sarah Jenkins',
  email: 'sarah.j@google-aistudio.com',
  address: '476 Neomorphic Blvd, Suite 3D',
  city: 'San Francisco',
  postalCode: '94107',
  phone: '+1 (555) 302-3901',
  points: 480,
  avatarSeed: 'sarah'
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-98441',
    date: '2026-05-10',
    items: [
      {
        id: '1',
        product: INITIAL_PRODUCTS[0], // Silicone Case - Sky Blue
        quantity: 1,
        selectedModel: 'iPhone 15'
      },
      {
        id: '4',
        product: INITIAL_PRODUCTS[3], // Leather 15 Case
        quantity: 1,
        selectedModel: 'iPhone 15'
      }
    ],
    total: 48.00,
    status: 'Delivered',
    trackingNumber: 'TRK-90212048'
  },
  {
    id: 'ORD-98210',
    date: '2026-04-18',
    items: [
      {
        id: '3',
        product: INITIAL_PRODUCTS[2], // Abstract Art Case
        quantity: 1,
        selectedModel: 'iPhone 15 Pro'
      }
    ],
    total: 34.00,
    status: 'Returned',
    trackingNumber: 'TRK-10948529'
  }
];

export const BRANDS = ['Apple', 'Samsung', 'Google', 'OnePlus'];

export const MODELS: Record<string, string[]> = {
  Apple: ['iPhone 15', 'iPhone 15 Pro', 'iPhone 14', 'iPhone 14 Pro'],
  Samsung: ['Galaxy S24', 'Galaxy A55', 'Galaxy S23', 'Galaxy S24 Ultra'],
  Google: ['Pixel 8 Pro', 'Pixel 8', 'Pixel 7 Pro'],
  OnePlus: ['OnePlus 12', 'OnePlus 12R']
};

export const MATERIALS = ['Silicone', 'Clear Acrylic', 'Leather', 'Flexi-Tough'];

export const COLORS = [
  { name: 'Sky Blue', hex: '#38bdf8' },
  { name: 'Clear', hex: '#e2e8f0', gradient: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%)' },
  { name: 'Abstract', hex: '#f97316', gradient: 'linear-gradient(135deg, #f97316 0%, #06b6d4 100%)' },
  { name: 'Orange', hex: '#ea580c' },
  { name: 'Brown', hex: '#854d0e' },
  { name: 'Paisley', hex: '#1e3a8a', gradient: 'radial-gradient(circle, #1e3a8a 20%, #111827 80%)' },
  { name: 'Navy', hex: '#1e293b' }
];
