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

// Core 9 generic UI/UX features (3 rows × 3 columns)
export const CORE_FEATURES: Feature[] = [
  {
    id: 'theme-toggle',
    name: 'Theme Toggle',
    description: 'Dark/light mode switching',
    icon: 'Moon',
    promptText: 'Implement dark mode and light mode toggle with smooth theme transitions, persistent user preference storage, and automatic system theme detection.',
  },
  {
    id: 'glass-aesthetic',
    name: 'Glass Aesthetic',
    description: 'Frosted glass UI effects',
    icon: 'Sparkles',
    promptText: 'Add glassmorphism design with frosted glass effects, backdrop blur, transparency, and subtle borders. Support both clear and tinted glass variations.',
  },
  {
    id: 'toast-alerts',
    name: 'Toast Alerts',
    description: 'Non-intrusive notifications',
    icon: 'Bell',
    promptText: 'Implement toast notification system for user feedback with success, error, warning, and info states. Include auto-dismiss, positioning options, and smooth animations.',
  },
  {
    id: 'navigation-style',
    name: 'Navigation Style',
    description: 'Top navbar or bottom tabs',
    icon: 'Menu',
    promptText: 'Create flexible navigation system supporting both top navigation bar and bottom tab navigation patterns. Include responsive behavior and active state indicators.',
  },
  {
    id: 'contact-signup',
    name: 'Contact & Signup',
    description: 'Registration and contact forms',
    icon: 'UserPlus',
    promptText: 'Build user registration forms and contact sections with proper validation, error handling, success states, and email integration capabilities.',
  },
  {
    id: 'multi-language',
    name: 'Multi-Language',
    description: 'i18n support',
    icon: 'Globe',
    promptText: 'Implement internationalization (i18n) with language switcher, translation management, RTL support, and locale-based formatting for dates and numbers.',
  },
  {
    id: 'search-filter',
    name: 'Search & Filter',
    description: 'Content search and filtering',
    icon: 'Search',
    promptText: 'Add comprehensive search functionality with real-time filtering, multiple filter criteria, sorting options, and clear visual feedback for active filters.',
  },
  {
    id: 'responsive-layout',
    name: 'Responsive Layout',
    description: 'Mobile-first adaptive design',
    icon: 'Smartphone',
    promptText: 'Ensure fully responsive design with mobile-first approach, fluid layouts, breakpoint optimization, and touch-friendly interactions for all screen sizes.',
  },
  {
    id: 'loading-states',
    name: 'Loading States',
    description: 'Skeleton loaders & spinners',
    icon: 'Loader',
    promptText: 'Implement loading states with skeleton screens, progress indicators, spinners, and shimmer effects for better perceived performance during data fetching.',
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

