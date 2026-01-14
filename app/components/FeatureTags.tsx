'use client';

import React from 'react';
import { 
  Shield,
  CreditCard,
  Database,
  Moon,
  Smartphone,
  MessageSquare,
  Bell,
  LayoutDashboard,
  Search,
} from 'lucide-react';
import { CORE_FEATURES } from '@/lib/features';
import type { Feature } from '@/lib/types';

// Map icon names to Lucide components
const iconMap: Record<string, React.ElementType> = {
  Shield,
  CreditCard,
  Database,
  Moon,
  Smartphone,
  MessageSquare,
  Bell,
  LayoutDashboard,
  Search,
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
      <div className="mb-2">
        <h3 className="text-sm sm:text-base font-semibold text-black">
          Quick Features
        </h3>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {CORE_FEATURES.map((feature) => {
          const isSelected = selectedFeatures.includes(feature.id);
          const IconComponent = iconMap[feature.icon];
          
          return (
            <button
              key={feature.id}
              onClick={() => onToggleFeature(feature.id)}
              className={`
                py-2 px-2 sm:px-3 rounded border-2 text-center min-h-[44px]
                ${
                  isSelected
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-gray-300 hover:border-black'
                }
              `}
              title={feature.description}
            >
              <div className="flex items-center justify-center gap-1.5">
                <div className={`
                  shrink-0 p-1 rounded
                  ${isSelected ? 'bg-white/20' : 'bg-gray-100'}
                `}>
                  {IconComponent && (
                    <IconComponent 
                      size={14} 
                      className={`sm:w-4 sm:h-4 ${isSelected ? 'text-white' : 'text-black'}`}
                    />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-[11px] sm:text-xs leading-tight">
                    {feature.name}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Helper text */}
      <p className="text-[10px] sm:text-xs text-gray-500 mt-1.5 text-center">
        Select features to automatically add them to your prompt
      </p>
    </div>
  );
}
