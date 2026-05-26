import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'FoodLens — Australian Food Transparency',
    short_name: 'FoodLens',
    description: 'See what\'s really in your food. Scan or search any product for ingredients, additives, allergens, and nutrition.',
    start_url: '/',
    display: 'standalone',
    background_color: '#faf8f5',
    theme_color: '#1a7a6d',
    orientation: 'portrait-primary',
    categories: ['food', 'health', 'lifestyle'],
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
