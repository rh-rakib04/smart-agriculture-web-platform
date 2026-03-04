'use client';

import { Check, Wheat, MapPin, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

const STEP_ICONS = {
  1: <Wheat className="w-4 h-4" />,
  2: <MapPin className="w-4 h-4" />,
  3: <Layers className="w-4 h-4" />,
};

export default function StepIndicator({ currentStep, steps }) {
  return (
    <div className="w-full py-4 px-2">
      <div className="flex items-center justify-center gap-0 relative">
        {steps.map((label, index) => {
          const stepNum   = index + 1;
          const isDone    = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;
          const isPending = stepNum > currentStep;

          return (
            <div key={stepNum} className="flex items-center">
              {/* Step circle + label */}
              <div className="flex flex-col items-center gap-1.5 relative z-10">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-sm
                    ${isDone    ? 'bg-primary border-primary text-primary-foreground shadow-primary/30 shadow-md' : ''}
                    ${isCurrent ? 'bg-primary border-primary text-primary-foreground shadow-primary/40 shadow-lg ring-4 ring-primary/20' : ''}
                    ${isPending ? 'bg-card border-border text-muted-foreground' : ''}
                  `}
                >
                  {isDone
                    ? <Check className="w-4 h-4 stroke-[2.5]" />
                    : STEP_ICONS[stepNum]
                  }
                </motion.div>
                <motion.span
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.1 }}
                  className={`
                    text-xs font-medium whitespace-nowrap hidden sm:block
                    ${isCurrent ? 'text-primary' : isDone ? 'text-primary/70' : 'text-muted-foreground'}
                  `}
                >
                  {label}
                </motion.span>
              </div>

              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div className="relative mx-1 sm:mx-2 flex-1 w-12 sm:w-20 h-0.5 bg-border overflow-hidden rounded-full">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isDone ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    style={{ originX: 0 }}
                    className="absolute inset-0 bg-primary rounded-full"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile label */}
      <motion.p
        key={currentStep}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-xs text-muted-foreground mt-3 sm:hidden"
      >
        Step <span className="font-semibold text-primary">{currentStep}</span> of {steps.length} — <span className="font-medium text-foreground">{steps[currentStep - 1]}</span>
      </motion.p>

      {/* Desktop step counter */}
      <p className="text-center text-xs text-muted-foreground mt-1 hidden sm:block">
        Step <span className="font-semibold text-primary">{currentStep}</span> of {steps.length}
      </p>
    </div>
  );
}