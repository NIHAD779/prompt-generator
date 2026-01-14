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
    { id: 'selection' as Screen, label: 'Home', fullLabel: 'What do you want to build', order: 1 },
    { id: 'form' as Screen, label: 'Describe', fullLabel: 'Describe your project', order: 2 },
    { id: 'result' as Screen, label: 'Result', fullLabel: 'Generated prompt', order: 3 },
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
    <div className="wizard-header md:max-w-4xl mx-auto">
      {/* Mobile: Compact step indicators */}
      <div className="flex sm:hidden items-center justify-center gap-2 w-full">
        {visibleSteps.map((step, index) => {
          const status = getStepStatus(step.id);
          const isClickable = isStepClickable(step.id);
          const isCompleted = status === 'completed';
          const isCurrent = status === 'current';

          return (
            <div key={step.id} className="flex items-center gap-2">
              <button
                onClick={() => isClickable && onStepClick(step.id)}
                disabled={!isClickable}
                className={`
                  flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full   transition-all text-xs font-medium
                  ${isCurrent ? 'bg-black text-white' : ''}
                  ${isCompleted ? 'bg-gray-100 text-black' : ''}
                  ${!isClickable && !isCurrent && !isCompleted ? 'bg-gray-50 text-gray-400' : ''}
                `}
                aria-label={`${step.fullLabel}${isCompleted ? ' - completed' : ''}${isCurrent ? ' - current step' : ''}`}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {isCompleted ? (
                  <Check size={12} strokeWidth={3} />
                ) : (
                  <span className="w-4 h-4 flex items-center justify-center rounded-full bg-current/10 text-[10px]">
                    {step.order}
                  </span>
                )}
                <span>{step.label}</span>
              </button>
              
              {index < visibleSteps.length - 1 && (
                <span className="text-gray-300 text-xs" aria-hidden="true">›</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Desktop: Full step labels */}
      <div className="hidden sm:flex items-center justify-center gap-4">
        {visibleSteps.map((step, index) => {
          const status = getStepStatus(step.id);
          const isClickable = isStepClickable(step.id);
          const isCompleted = status === 'completed';
          const isCurrent = status === 'current';

          return (
            <div key={step.id} className="flex items-center gap-4">
              <button
                onClick={() => isClickable && onStepClick(step.id)}
                disabled={!isClickable}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg transition-all
                  ${isCurrent ? 'bg-black text-white font-semibold' : ''}
                  ${isCompleted ? 'text-black hover:bg-gray-100 cursor-pointer font-medium' : ''}
                  ${!isClickable && !isCurrent ? 'cursor-not-allowed opacity-50' : ''}
                `}
                aria-label={`${step.fullLabel}${isCompleted ? ' - completed' : ''}${isCurrent ? ' - current step' : ''}`}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {isCompleted && (
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-black text-white">
                    <Check size={14} strokeWidth={3} />
                  </span>
                )}
                <span className="text-sm md:text-base whitespace-nowrap">
                  {step.fullLabel}
                </span>
              </button>
              
              {index < visibleSteps.length - 1 && (
                <span className="text-gray-400 text-lg" aria-hidden="true">→</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

