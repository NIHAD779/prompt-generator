/**
 * Feature tags for common web app functionality
 * Users can select these to quickly add features to their prompts
 */

export interface Feature {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  promptText: string; // Text to add to the prompt when selected
}

// Core features covering essential app functionality (3 rows × 3 columns)
export const CORE_FEATURES: Feature[] = [
  {
    id: 'user-authentication',
    name: 'User Auth',
    description: 'Complete authentication system',
    icon: 'Shield',
    promptText: 'Implement comprehensive user authentication with email/password, social login (Google, GitHub), JWT tokens, session management, password reset, email verification, and protected routes.',
  },
  {
    id: 'payment-integration',
    name: 'Payment System',
    description: 'Stripe/payment processing',
    icon: 'CreditCard',
    promptText: 'Integrate payment processing with Stripe including checkout flows, subscription management, one-time payments, webhook handling, invoice generation, and payment history tracking.',
  },
  {
    id: 'database-setup',
    name: 'Database',
    description: 'PostgreSQL/MongoDB integration',
    icon: 'Database',
    promptText: 'Set up database with Prisma ORM (PostgreSQL) or Mongoose (MongoDB), including schema design, migrations, CRUD operations, relationships, indexing, and connection pooling.',
  },
  {
    id: 'dark-light-mode',
    name: 'Dark/Light Mode',
    description: 'Theme toggle system',
    icon: 'Moon',
    promptText: 'Implement dark mode and light mode toggle with smooth theme transitions, persistent user preference storage, automatic system theme detection, and theme-aware components throughout the app.',
  },
  {
    id: 'responsive-design',
    name: 'Responsive Design',
    description: 'Mobile-first adaptive layout',
    icon: 'Smartphone',
    promptText: 'Ensure fully responsive design with mobile-first approach, fluid layouts, breakpoint optimization, touch-friendly interactions for all screen sizes, and adaptive navigation patterns.',
  },
  {
    id: 'ai-chatbot',
    name: 'AI Chatbot',
    description: 'Conversational AI assistant',
    icon: 'MessageSquare',
    promptText: 'Integrate AI chatbot using OpenAI, Anthropic Claude, or similar APIs. Include chat interface, conversation history, context management, streaming responses, and chat persistence.',
  },
  {
    id: 'toast-notifications',
    name: 'Toast Alerts',
    description: 'Notification system',
    icon: 'Bell',
    promptText: 'Implement toast notification system for user feedback with success, error, warning, and info states. Include auto-dismiss, positioning options, stacking, and smooth entry/exit animations.',
  },
  {
    id: 'admin-dashboard',
    name: 'Admin Panel',
    description: 'Management dashboard',
    icon: 'LayoutDashboard',
    promptText: 'Create admin dashboard with user management, analytics, data tables with CRUD operations, role-based access control, activity logs, and comprehensive reporting features.',
  },
  {
    id: 'search-engine',
    name: 'Advanced Search',
    description: 'Full-text search',
    icon: 'Search',
    promptText: 'Implement advanced search with full-text capabilities using Elasticsearch or PostgreSQL, including fuzzy matching, autocomplete, filters, faceted search, and search result highlighting.',
  },
];

// Get all features combined
export function getAllFeatures(): Feature[] {
  return CORE_FEATURES;
}

// Get feature by ID
export function getFeatureById(id: string): Feature | undefined {
  return getAllFeatures().find(feature => feature.id === id);
}

// Get prompt text for selected features
export function getPromptTextForFeatures(featureIds: string[]): string {
  const features = featureIds
    .map(id => getFeatureById(id))
    .filter((feature): feature is Feature => feature !== undefined);
  
  if (features.length === 0) {
    return '';
  }
  
  return features.map(feature => feature.promptText).join('\n\n');
}

