import { Product } from './types.ts';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Handcrafted Terracotta Vase',
    description: 'Elegant terracotta vase, handcrafted by local artisans. Perfect for a rustic home decor.',
    price: 1299,
    imageUrl: 'https://picsum.photos/seed/terracotta/400/400',
    category: 'Home Decor',
  },
  {
    id: 2,
    name: 'Jaipuri Block Print Kurta',
    description: 'Comfortable cotton kurta with traditional Jaipuri block printing. Ideal for casual wear.',
    price: 1899,
    imageUrl: 'https://picsum.photos/seed/kurta/400/400',
    category: 'Fashion',
  },
  {
    id: 3,
    name: 'Ayurvedic Wellness Tea',
    description: 'A calming blend of ashwagandha and tulsi to rejuvenate your senses.',
    price: 499,
    imageUrl: 'https://picsum.photos/seed/tea/400/400',
    category: 'Wellness',
  },
  {
    id: 4,
    name: 'Brass Diya Lamp Set',
    description: 'Set of two intricately designed brass diyas for your pooja room or festive decorations.',
    price: 799,
    imageUrl: 'https://picsum.photos/seed/diya/400/400',
    category: 'Home Decor',
  },
];

export const PRODUCT_CATEGORIES: string[] = [
    'Eco-friendly Kitchenware',
    'Handmade Jewelry',
    'Organic Skincare',
    'Smart Gadgets',
    'Artisanal Coffee',
];