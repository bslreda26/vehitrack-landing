import React from 'react';
import './StepProgress.css';

interface SubStep {
  label: string;
  completed?: boolean;
  error?: boolean;
}

interface Step {
  label: string;
  subSteps?: SubStep[];
}

interface StepProgressProps {
  steps: Step[];
  currentStep: number;
  orientation?: 'vertical' | 'horizontal';
  className?: string;
  indicatorPosition?: 'left' | 'right';
}

const StepProgress: React.FC<StepProgressProps> = ({
  steps,
  currentStep,
  orientation = 'horizontal',
  className = '',
  indicatorPosition = 'left'
}) => {
  return (
    <div className={`step-progress ${orientation} ${className} indicator-${indicatorPosition}`}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const allSubStepsComplete = step.subSteps?.every(sub => sub.completed) ?? true;
        const hasError = step.subSteps?.some(sub => sub.error) ?? false;
        
        return (
          <div 
            key={index} 
            className={`step-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${hasError ? 'has-error' : ''}`}
          >
            <div className="step-content">
              {indicatorPosition === 'left' ? (
                <div className="step-indicator">
                  {isCompleted && allSubStepsComplete && !hasError ? (
                    <span className="check-mark">✓</span>
                  ) : (
                    <span className={`step-number ${hasError ? 'error' : ''}`}>{index + 1}</span>
                  )}
                </div>
              ) : null}
              <div className="step-label">{step.label}</div>
              {indicatorPosition === 'right' ? (
                <div className="step-indicator">
                  {isCompleted && allSubStepsComplete && !hasError ? (
                    <span className="check-mark">✓</span>
                  ) : (
                    <span className={`step-number ${hasError ? 'error' : ''}`}>{index + 1}</span>
                  )}
                </div>
              ) : null}
            </div>
            
            {step.subSteps && (
              <div className={`sub-steps indicator-${indicatorPosition}`}>
                {step.subSteps.map((subStep, subIndex) => (
                  <div 
                    key={subIndex} 
                    className={`sub-step ${subStep.completed ? 'completed' : ''} ${subStep.error ? 'error' : ''}`}
                  >
                    {indicatorPosition === 'left' ? (
                      <div className="sub-step-indicator">
                        {subStep.completed ? (
                          <span className="check-mark">✓</span>
                        ) : subStep.error ? (
                          <span className="error-mark">✕</span>
                        ) : (
                          <span className="sub-step-dot">•</span>
                        )}
                      </div>
                    ) : null}
                    <div className="sub-step-label">{subStep.label}</div>
                    {indicatorPosition === 'right' ? (
                      <div className="sub-step-indicator">
                        {subStep.completed ? (
                          <span className="check-mark">✓</span>
                        ) : subStep.error ? (
                          <span className="error-mark">✕</span>
                        ) : (
                          <span className="sub-step-dot">•</span>
                        )}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
            
            {index < steps.length - 1 && <div className="step-connector" />}
          </div>
        );
      })}
    </div>
  );
};

export default StepProgress;
