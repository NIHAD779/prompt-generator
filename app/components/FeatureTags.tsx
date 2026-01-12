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
  Check,
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
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-black">
          Quick Features
        </h3>
        <span className="text-xs text-gray-600">
          {selectedFeatures.length} selected
        </span>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        {CORE_FEATURES.map((feature) => {
          const isSelected = selectedFeatures.includes(feature.id);
          const IconComponent = iconMap[feature.icon];
          
          return (
            <button
              key={feature.id}
              onClick={() => onToggleFeature(feature.id)}
              className={`
                p-4 rounded border-2 text-left
                ${
                  isSelected
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-gray-300 hover:border-black'
                }
              `}
              title={feature.description}
            >
              <div className="flex items-start gap-3">
                <div className={`
                  shrink-0 p-2 rounded
                  ${isSelected ? 'bg-white/20' : 'bg-gray-100'}
                `}>
                  {IconComponent && (
                    <IconComponent 
                      size={20} 
                      className={isSelected ? 'text-white' : 'text-black'}
                    />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm leading-tight">
                    {feature.name}
                  </div>
                </div>
                
                {/* Checkmark for selected items */}
                {isSelected && (
                  <div className="shrink-0">
                    <Check size={16} className="text-white" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Helper text */}
      <p className="text-xs text-gray-500 mt-3 text-center">
        Select features to automatically add them to your prompt
      </p>
    </div>
  );
}
