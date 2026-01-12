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
    <div className="mt-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Quick Features
        </h3>
        <span className="text-xs text-purple-600/70">
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
                relative group p-4 rounded-xl transition-all duration-300 text-left
                ${
                  isSelected
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                    : 'glass border-2 border-purple-300/40 text-purple-900 hover:border-purple-400/60'
                }
                hover:scale-105 active:scale-95
              `}
              title={feature.description}
            >
              <div className="flex items-start gap-3">
                <div className={`
                  flex-shrink-0 p-2 rounded-lg transition-colors
                  ${isSelected ? 'bg-white/20' : 'bg-purple-100/50'}
                `}>
                  {IconComponent && (
                    <IconComponent 
                      size={20} 
                      className={isSelected ? 'text-white' : 'text-purple-600'}
                    />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm leading-tight">
                    {feature.name}
                  </div>
                  {/* Show description on hover for unselected items */}
                  {!isSelected && (
                    <div className="text-xs text-purple-600/70 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {feature.description}
                    </div>
                  )}
                </div>
                
                {/* Checkmark for selected items */}
                {isSelected && (
                  <div className="flex-shrink-0">
                    <Check size={16} className="text-white" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Helper text */}
      <p className="text-xs text-purple-600/60 mt-3 text-center">
        Select features to automatically add them to your prompt
      </p>
    </div>
  );
}

