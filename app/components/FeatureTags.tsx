'use client';

import React from 'react';
import { 
  Moon,
  Sparkles,
  Bell,
  Menu,
  UserPlus,
  Globe,
  Search,
  Smartphone,
  Loader,
} from 'lucide-react';
import { CORE_FEATURES } from '@/lib/features';
import type { Feature } from '@/lib/types';

// Map icon names to Lucide components
const iconMap: Record<string, React.ElementType> = {
  Moon,
  Sparkles,
  Bell,
  Menu,
  UserPlus,
  Globe,
  Search,
  Smartphone,
  Loader,
};

interface FeatureTagsProps {
  selectedFeatures: string[];
  onToggleFeature: (featureId: string) => void;
}

export default function FeatureTags({
  selectedFeatures,
  onToggleFeature,
}: FeatureTagsProps) {
  return (
    <div className="mt-3 sm:mt-4">
      <div className="mb-2 sm:mb-3">
        <h3 className="text-base sm:text-lg font-semibold text-black">
          Quick Features
        </h3>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
        {CORE_FEATURES.map((feature) => {
          const isSelected = selectedFeatures.includes(feature.id);
          const IconComponent = iconMap[feature.icon];
          
          return (
            <button
              key={feature.id}
              onClick={() => onToggleFeature(feature.id)}
              className={`
                py-2.5 px-2 sm:px-3 rounded border-2 text-center min-h-[44px]
                ${
                  isSelected
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-gray-300 hover:border-black'
                }
              `}
              title={feature.description}
            >
              <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                <div className={`
                  shrink-0 p-1 sm:p-1.5 rounded
                  ${isSelected ? 'bg-white/20' : 'bg-gray-100'}
                `}>
                  {IconComponent && (
                    <IconComponent 
                      size={16} 
                      className={`sm:w-[18px] sm:h-[18px] ${isSelected ? 'text-white' : 'text-black'}`}
                    />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-xs sm:text-sm leading-tight">
                    {feature.name}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Helper text */}
      <p className="text-xs text-gray-500 mt-2 text-center">
        Select features to automatically add them to your prompt
      </p>
    </div>
  );
}
