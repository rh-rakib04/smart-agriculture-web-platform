'use client';

/**
 * PlannerPage — redesigned to match SmartAgri homepage visual language.
 *
 * Key changes from original:
 * - Full-bleed planner-bg.jpg banner (matching hero/feature sections)
 * - Glass card overlaps the banner with -mt-10
 * - New custom StepIndicator replaces the old one
 * - Animated step header label inside the card per step
 * - Loading overlay with spinner + animated dots
 * - Consistent tokens: rounded-3xl, shadow-primary/25, ease [0.22,1,0.36,1]
 * - Floating leaf decorations on the banner
 *
 * File placement:
 *   app/farmer/planner/page.jsx (replaces existing)
 *   components/farmer/planner/StepIndicator.jsx (new)
 *   components/farmer/planner/StepOne.jsx (updated)
 *   components/farmer/planner/StepTwo.jsx (updated)
 *   components/farmer/planner/StepThree.jsx (updated)
 *   components/farmer/planner/PlanResult.jsx (unchanged — keep original)
 */

import { useState } from 'react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Sprout, CalendarDays, MapPin, FileText } from 'lucide-react';
import PrivateRoute  from '@/components/auth/PrivateRoute';
import StepIndicator from '@/components/farmer/planner/StepIndicator';
import StepOne       from '@/components/farmer/planner/StepOne';
import StepTwo       from '@/components/farmer/planner/StepTwo';
import StepThree     from '@/components/farmer/planner/StepThree';
import PlanResult    from '@/components/farmer/planner/PlanResult';
import { useAuth }   from '@/hooks/useAuth';
import Header from '@/components/shared/Header';

// ─── Constants ────────────────────────────────────────────────────────────────

const INITIAL_FORM = {
  season: '', cropId: '', plantingDate: '',
  division: '', district: '', upazila: '',
  landSize: '', landUnit: 'bigha', landCondition: '', soilType: '',
};

const STEP_META = [
  { id: 1, icon: Sprout,   label: 'Crop & Date',  desc: 'Choose your crop and planting date'      },
  { id: 2, icon: MapPin,   label: 'Location',     desc: 'Set your division, district & upazila'  },
  { id: 3, icon: FileText, label: 'Land Details', desc: 'Enter land size, soil type & condition'  },
];

// ─── Floating leaves decoration ───────────────────────────────────────────────

function FloatingLeaves() {
  const leaves = ['🌿', '🌾', '🍃', '🌱'];
  return (
    <>
      {leaves.map((leaf, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl pointer-events-none select-none"
          style={{
            top:   `${15 + i * 18}%`,
            left:  i % 2 === 0 ? `${4 + i * 2}%`  : undefined,
            right: i % 2 !== 0 ? `${4 + i * 2}%`  : undefined,
          }}
          animate={{
            y:       [0, -16, 0],
            rotate:  [0, 8, -8, 0],
            opacity: [0.08, 0.16, 0.08],
          }}
          transition={{
            duration: 5 + i * 1.5,
            repeat:   Infinity,
            delay:    i * 0.7,
            ease:     'easeInOut',
          }}
        >
          {leaf}
        </motion.div>
      ))}
    </>
  );
}

// ─── Page banner ──────────────────────────────────────────────────────────────

function PageBanner({ userName }) {
  return (
    <div className="relative h-56 sm:h-64 w-full  ">
      <Image
        src="/images/planner-bg.jpg"
        alt="Smart Farm Planner"
        fill
        className="object-cover object-center"
        sizes="100vw"
        quality={90}
        priority
      />
      <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/40 to-black/75" />
      <div className="absolute inset-0 bg-primary/25 mix-blend-multiply" />

      <FloatingLeaves />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 mt-15 md:mt-5 ">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
            bg-highlight/20 border border-highlight/40
            text-highlight text-xs font-bold tracking-widest uppercase mb-4"
        >
          <CalendarDays size={13} />
          Smart Farm Planner
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-3xl sm:text-4xl font-extrabold text-white
            leading-tight tracking-tight mb-3"
        >
          {userName ? `Welcome, ${userName}.` : 'Your Season,'}{' '}
          <span className="text-highlight">Perfectly Planned.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-white/60 text-sm max-w-sm"
        >
          3 simple questions → a complete Bangladesh DAE-certified farm plan
        </motion.p>
      </div>
    </div>
  );
}

// ─── Animated step header ─────────────────────────────────────────────────────

function StepHeader({ currentStep }) {
  const step = STEP_META[currentStep - 1];
  const Icon = step.icon;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center gap-3 px-6 py-4 border-b border-border "
      >
        <motion.div
          initial={{ scale: 0.6, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 250, delay: 0.1 }}
          className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20
            flex items-center justify-center shrink-0"
        >
          <Icon size={18} className="text-primary" />
        </motion.div>
        <div>
          <p className="text-foreground font-extrabold text-base leading-tight">
            Step {currentStep} — {step.label}
          </p>
          <p className="text-muted-foreground text-xs">{step.desc}</p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Loading overlay ──────────────────────────────────────────────────────────

function LoadingOverlay() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-20 bg-card/85 backdrop-blur-sm
        flex flex-col items-center justify-center gap-4 rounded-b-3xl"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary"
      />
      <div className="text-center">
        <p className="text-foreground font-bold text-base">Generating your plan...</p>
        <p className="text-muted-foreground text-xs mt-1">Using Bangladesh DAE guidelines</p>
      </div>
      <div className="flex gap-1.5">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
            className="w-2 h-2 rounded-full bg-primary"
          />
        ))}
      </div>
    </motion.div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function PlannerPage() {
  const { user }                      = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm]               = useState(INITIAL_FORM);
  const [plan, setPlan]               = useState(null);
  const [loading, setLoading]         = useState(false);

  const handleChange = (fields) => setForm(prev => ({ ...prev, ...fields }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const res   = await fetch('/api/planner/generate', {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          cropId:        form.cropId,
          landSize:      parseFloat(form.landSize),
          landUnit:      form.landUnit,
          landCondition: form.landCondition,
          soilType:      form.soilType,
          plantingDate:  form.plantingDate,
          district:      form.district,
          upazila:       form.upazila || '',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPlan(data.plan);
        toast.success('Your farm plan has been generated!');
      } else {
        toast.error(data.error || 'Failed to generate plan. Please try again.');
      }
    } catch {
      toast.error('Something went wrong. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => { setForm(INITIAL_FORM); setPlan(null); setCurrentStep(1); };

  return (
    <PrivateRoute fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      }>
      <Header></Header>
      <div className="min-h-screen bg-background ">

        {/* ── Full-bleed banner ── */}
        <PageBanner userName={user?.name} />

        {/* ── Form card — overlaps banner ── */}
        <div className="max-w-2xl mx-auto px-4 -mt-10 pb-16 relative z-10">
          <AnimatePresence mode="wait">

            {!plan ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.97 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="bg-card border border-border rounded-3xl
                  shadow-2xl shadow-black/10 overflow-hidden"
              >
                {/* Step indicator */}
                <div className="bg-muted/20 border-b border-border">
                  <StepIndicator currentStep={currentStep} />
                </div>

                {/* Animated step header */}
                <StepHeader currentStep={currentStep} />

                {/* Step content with loading overlay */}
                <div className="p-6 relative">
                  <AnimatePresence>
                    {loading && <LoadingOverlay />}
                  </AnimatePresence>

                  <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                      <StepOne
                        key="s1"
                        data={form}
                        onChange={handleChange}
                        onNext={() => setCurrentStep(2)}
                      />
                    )}
                    {currentStep === 2 && (
                      <StepTwo
                        key="s2"
                        data={form}
                        onChange={handleChange}
                        onNext={() => setCurrentStep(3)}
                        onBack={() => setCurrentStep(1)}
                      />
                    )}
                    {currentStep === 3 && (
                      <StepThree
                        key="s3"
                        data={form}
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                        onBack={() => setCurrentStep(2)}
                        loading={loading}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="bg-card border border-border rounded-3xl
                  shadow-2xl shadow-black/10 overflow-hidden"
              >
                <div className="p-6">
                  <PlanResult plan={plan} onReset={handleReset} />
                </div>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Footer note */}
          {!plan && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center text-xs text-muted-foreground mt-5
                flex items-center justify-center gap-1.5"
            >
              <Sprout size={12} className="text-primary" />
              All recommendations follow Bangladesh DAE agricultural guidelines.
            </motion.p>
          )}
        </div>

      </div>
    </PrivateRoute>
  );
}