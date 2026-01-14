/**
 * Pre-defined suggestion examples for quick form population
 * Each suggestion includes userInstructions and selectedFeatures
 */

import type { Suggestion } from './types';

export const SUGGESTIONS: Suggestion[] = [
  {
    id: 'landing-page',
    title: 'Modern Landing Page',
    description: 'A sleek marketing website with modern UI effects',
    userInstructions: 'Build a modern landing page for a SaaS product with a hero section featuring a gradient background, product screenshots, feature highlights with icons, pricing table with 3 tiers, testimonials carousel, FAQ accordion, and a footer with social links. Make it visually stunning with smooth animations.',
    selectedFeatures: ['dark-light-mode', 'responsive-design', 'toast-notifications'],
  },
  {
    id: 'admin-dashboard',
    title: 'Admin Dashboard',
    description: 'Data-rich interface with tables and analytics',
    userInstructions: 'Create an admin dashboard with a sidebar navigation, top stats cards showing key metrics, data tables with pagination and sorting, interactive charts for analytics, user management section with CRUD operations, and activity feed. Include proper data visualization and real-time updates.',
    selectedFeatures: ['user-authentication', 'admin-dashboard', 'search-engine'],
  },
  {
    id: 'ecommerce-store',
    title: 'E-commerce Store',
    description: 'Online shop with product catalog and checkout',
    userInstructions: 'Build an e-commerce store with product grid layout, individual product pages with image galleries, shopping cart with quantity controls, checkout flow with multiple steps, user account pages for order history, wishlist functionality, and product reviews. Make it conversion-optimized.',
    selectedFeatures: ['user-authentication', 'payment-integration', 'database-setup'],
  },
];

/**
 * Get suggestion by ID
 */
export function getSuggestionById(id: string): Suggestion | undefined {
  return SUGGESTIONS.find(suggestion => suggestion.id === id);
}

/**
 * Get all suggestions
 */
export function getAllSuggestions(): Suggestion[] {
  return SUGGESTIONS;
}

