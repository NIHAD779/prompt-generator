import { Check } from 'lucide-react';

type Screen = 'selection' | 'form' | 'result';

interface WizardHeaderProps {
  currentScreen: Screen;
  hasGeneratedPrompt: boolean;
  hasPromptBeenCopied: boolean;
  onStepClick: (screen: Screen) => void;
}

export default function WizardHeader({ currentScreen, hasGeneratedPrompt, hasPromptBeenCopied, onStepClick }: WizardHeaderProps) {
  // Don't show header on the first screen
  if (currentScreen === 'selection') {
    return null;
  }

  const steps = [
    { id: 'selection' as Screen, label: 'What do you want to build', order: 1 },
    { id: 'form' as Screen, label: 'Describe your project', order: 2 },
    { id: 'result' as Screen, label: 'Generated prompt', order: 3 },
  ];

  const getStepStatus = (stepId: Screen) => {
    if (stepId === 'selection') {
      return currentScreen === 'form' || currentScreen === 'result' ? 'completed' : 'current';
    }
    if (stepId === 'form') {
      if (currentScreen === 'result') return 'completed';
      if (currentScreen === 'form') return 'current';
      return 'future';
    }
    if (stepId === 'result') {
      if (hasPromptBeenCopied) return 'completed';
      if (currentScreen === 'result') return 'current';
      return 'future';
    }
    return 'future';
  };

  const isStepClickable = (stepId: Screen) => {
    const status = getStepStatus(stepId);
    if (status === 'current') return false;
    if (status === 'completed') return true;
    // Can't navigate to result screen unless prompt has been generated
    if (stepId === 'result' && !hasGeneratedPrompt) return false;
    return false;
  };

  const getVisibleSteps = () => {
    if (currentScreen === 'form' || currentScreen === 'result') {
      return steps; // Show all 3 steps on form and result screens
    }
    return [];
  };

  const visibleSteps = getVisibleSteps();

  if (visibleSteps.length === 0) {
    return null;
  }

  return (
    <div className="wizard-header">
      <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          {visibleSteps.map((step, index) => {
            const status = getStepStatus(step.id);
            const isClickable = isStepClickable(step.id);
            const isCompleted = status === 'completed';
            const isCurrent = status === 'current';

            return (
              <div key={step.id} className="flex items-center gap-2 sm:gap-4">
                <button
                  onClick={() => isClickable && onStepClick(step.id)}
                  disabled={!isClickable}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg transition-all
                    ${isCurrent ? 'bg-black text-white font-semibold' : ''}
                    ${isCompleted ? 'text-black hover:bg-gray-100 cursor-pointer font-medium' : ''}
                    ${!isClickable && !isCurrent ? 'cursor-not-allowed opacity-50' : ''}
                  `}
                  aria-label={`${step.label}${isCompleted ? ' - completed' : ''}${isCurrent ? ' - current step' : ''}`}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isCompleted && (
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-black text-white">
                      <Check size={14} strokeWidth={3} />
                    </span>
                  )}
                  <span className="text-sm sm:text-base whitespace-nowrap">
                    {step.label}
                  </span>
                </button>
                
                {index < visibleSteps.length - 1 && (
                  <span className="text-gray-400 text-lg hidden sm:inline" aria-hidden="true">
                    →
                  </span>
                )}
              </div>
            );
          })}
        </div>
    </div>
  );
}

