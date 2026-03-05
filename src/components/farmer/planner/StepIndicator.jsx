'use client';

import { Check, Wheat, MapPin, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STEPS_META = [
  { icon: Wheat,  label: 'Crop & Date',  desc: 'Choose crop & season' },
  { icon: MapPin, label: 'Location',     desc: 'Division & district'  },
  { icon: Layers, label: 'Land Details', desc: 'Soil & size'          },
];

export default function StepIndicator({ currentStep }) {
  return (
    <div className="w-full px-4 sm:px-8 py-6">
      <div className="flex items-center justify-center">
        {STEPS_META.map((step, index) => {
          const stepNum   = index + 1;
          const isDone    = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;
          const Icon      = step.icon;

          return (
            <div key={stepNum} className="flex items-center">

              {/* Step node */}
              <div className="flex flex-col items-center gap-2 relative z-10">

                {/* Circle */}
                <div className="relative">
                  {/* Pulse ring on active */}
                  {isCurrent && (
                    <motion.div
                      animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute inset-0 rounded-full bg-highlight/40"
                    />
                  )}

                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      delay: index * 0.12,
                      duration: 0.6,
                      type: 'spring',
                      stiffness: 200,
                    }}
                    className={`relative w-12 h-12 rounded-2xl flex items-center justify-center
                      border-2 transition-all duration-500 font-bold
                      ${isDone
                        ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30'
                        : isCurrent
                          ? 'bg-highlight border-highlight text-gray-900 shadow-xl shadow-highlight/40'
                          : 'bg-card border-border text-muted-foreground'
                      }`}
                  >
                    <AnimatePresence mode="wait">
                      {isDone ? (
                        <motion.div
                          key="check"
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <Check size={18} strokeWidth={2.5} />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="icon"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <Icon size={18} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>

                {/* Label */}
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.12 + 0.1 }}
                  className="text-center hidden sm:block"
                >
                  <p className={`text-xs font-bold leading-tight transition-colors duration-300
                    ${isCurrent ? 'text-foreground' : isDone ? 'text-primary' : 'text-muted-foreground'}`}>
                    {step.label}
                  </p>
                  <p className={`text-[10px] leading-tight mt-0.5 transition-colors duration-300
                    ${isCurrent ? 'text-muted-foreground' : 'text-muted-foreground/50'}`}>
                    {step.desc}
                  </p>
                </motion.div>
              </div>

              {/* Connector */}
              {index < STEPS_META.length - 1 && (
                <div className="relative mx-3 sm:mx-4 w-14 sm:w-20 h-0.5
                  bg-border rounded-full overflow-hidden mb-5 sm:mb-6">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isDone ? 1 : 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    style={{ originX: 0 }}
                    className="absolute inset-0 bg-primary rounded-full"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile current step label */}
      <AnimatePresence mode="wait">
        <motion.p
          key={currentStep}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.3 }}
          className="text-center text-xs text-muted-foreground mt-2 sm:hidden"
        >
          Step <span className="font-bold text-primary">{currentStep}</span> of 3
          {' — '}
          <span className="font-semibold text-foreground">{STEPS_META[currentStep - 1].label}</span>
        </motion.p>
      </AnimatePresence>
    </div>
  );
}