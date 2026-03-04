'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout } from 'lucide-react';
import PrivateRoute    from '@/components/auth/PrivateRoute';
import StepIndicator   from '@/components/farmer/planner/StepIndicator';
import StepOne         from '@/components/farmer/planner/StepOne';
import StepTwo         from '@/components/farmer/planner/StepTwo';
import StepThree       from '@/components/farmer/planner/StepThree';
import PlanResult      from '@/components/farmer/planner/PlanResult';
import { useAuth }     from '@/hooks/useAuth';

const INITIAL_FORM = {
  season:       '',
  cropId:       '',
  plantingDate: '',
  division:     '',
  district:     '',
  upazila:      '',
  landSize:     '',
  landUnit:     'bigha',
  landCondition:'',
  soilType:     '',
};

const STEPS = ['Crop & Date', 'Location', 'Land Details'];

export default function PlannerPage() {
  const { user }                      = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm]               = useState(INITIAL_FORM);
  const [plan, setPlan]               = useState(null);
  const [loading, setLoading]         = useState(false);

  const handleChange = (updatedFields) => {
    setForm(prev => ({ ...prev, ...updatedFields }));
  };

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

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setPlan(null);
    setCurrentStep(1);
  };

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-background py-6 px-4">
        <div className="max-w-2xl mx-auto ">

          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 mb-3">
              <Sprout className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground"> Smart Farm Planner</h1>
            <p className="text-sm text-muted-foreground mt-1.5 max-w-sm mx-auto">
              {user?.name ? `Welcome, ${user.name}. ` : ''}
              Enter your details to get a complete seasonal farm plan.
            </p>
          </motion.div>

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden"
          >
            {!plan ? (
              <>
                {/* Step indicator */}
                <div className="border-b border-border bg-muted/30 px-4 sm:px-6">
                  <StepIndicator currentStep={currentStep} steps={STEPS} />
                </div>

                {/* Step content */}
                <div className="p-4 sm:p-6">
                  <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                      <StepOne
                        key="step1"
                        data={form}
                        onChange={handleChange}
                        onNext={() => setCurrentStep(2)}
                      />
                    )}
                    {currentStep === 2 && (
                      <StepTwo
                        key="step2"
                        data={form}
                        onChange={handleChange}
                        onNext={() => setCurrentStep(3)}
                        onBack={() => setCurrentStep(1)}
                      />
                    )}
                    {currentStep === 3 && (
                      <StepThree
                        key="step3"
                        data={form}
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                        onBack={() => setCurrentStep(2)}
                        loading={loading}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="p-4 sm:p-6">
                <PlanResult plan={plan} onReset={handleReset} />
              </div>
            )}
          </motion.div>

          {/* Footer note */}
          {!plan && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center text-xs text-muted-foreground mt-4"
            >
              All recommendations are based on Bangladesh DAE agricultural guidelines.
            </motion.p>
          )}

        </div>
      </div>
    </PrivateRoute>
  );
}