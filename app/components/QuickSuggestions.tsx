'use client';

import React from 'react';
import { Sparkles, BarChart3, ShoppingCart, PenLine } from 'lucide-react';
import { SUGGESTIONS } from '@/lib/suggestions';
import type { Suggestion } from '@/lib/types';

// Map suggestion IDs to icons
const iconMap: Record<string, React.ElementType> = {
  'landing-page': Sparkles,
  'admin-dashboard': BarChart3,
  'ecommerce-store': ShoppingCart,
};

interface QuickSuggestionsProps {
  onSelectSuggestion: (suggestion: Suggestion) => void;
  onSelectCustom: () => void;
}

export default function QuickSuggestions({ onSelectSuggestion, onSelectCustom }: QuickSuggestionsProps) {
  return (
    <section className="w-full max-w-4xl mx-auto px-4" aria-labelledby="suggestions-heading">
      {/* Main Header */}
      <div className="text-center mb-4 sm:mb-6">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-black mb-3 font-sans">
          Heal My Prompt
        </h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto mb-8">
          Turn your ideas into optimized prompts for Lovable, Bolt, and Replit
        </p>
        
        {/* Section Label */}
        <h2 id="suggestions-heading" className="text-sm sm:text-base font-medium text-black tracking-wider mb-4">
          What do you want to build?
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Custom Tile */}
        <button
          onClick={onSelectCustom}
          className="group border-2 border-black rounded-lg p-4 sm:p-5 text-left hover:bg-black hover:shadow-lg transition-all duration-200 bg-white min-h-[120px] flex flex-col"
          aria-label="Create custom prompt from scratch"
        >
          <div className="flex items-start gap-3 mb-2">
            <div className="shrink-0 p-2 rounded-lg bg-black group-hover:bg-white transition-colors duration-200">
              <PenLine 
                size={20} 
                className="text-white group-hover:text-black transition-colors duration-200"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base sm:text-lg text-black group-hover:text-white mb-1 transition-colors duration-200">
                Custom Prompt
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 group-hover:text-gray-200 line-clamp-2 transition-colors duration-200">
                Start from scratch and describe your own project
              </p>
            </div>
          </div>

          <div className="mt-auto pt-3 flex items-center justify-between border-t border-gray-300 group-hover:border-gray-600">
            <span className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors duration-200">
              Build anything you want
            </span>
            <span className="text-xs font-medium text-black group-hover:text-white group-hover:underline transition-colors duration-200">
              Start Fresh →
            </span>
          </div>
        </button>
        
        {SUGGESTIONS.map((suggestion) => {
          const IconComponent = iconMap[suggestion.id];
          
          return (
            <button
              key={suggestion.id}
              onClick={() => onSelectSuggestion(suggestion)}
              className="group border-2 border-gray-300 rounded-lg p-4 sm:p-5 text-left hover:border-black hover:shadow-lg transition-all duration-200 bg-white min-h-[120px] flex flex-col"
              aria-label={`Use ${suggestion.title} example`}
            >
              <div className="flex items-start gap-3 mb-2">
                <div className="shrink-0 p-2 rounded-lg bg-gray-100 group-hover:bg-black transition-colors duration-200">
                  {IconComponent && (
                    <IconComponent 
                      size={20} 
                      className="text-black group-hover:text-white transition-colors duration-200"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base sm:text-lg text-black mb-1">
                    {suggestion.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                    {suggestion.description}
                  </p>
                </div>
              </div>

              <div className="mt-auto pt-3 flex items-center justify-between border-t border-gray-200 group-hover:border-gray-300">
                <span className="text-xs text-gray-500">
                  {suggestion.selectedFeatures.length} features included
                </span>
                <span className="text-xs font-medium text-black group-hover:underline">
                  Use This →
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

