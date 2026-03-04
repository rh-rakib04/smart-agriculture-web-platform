'use client';

import { useState } from 'react';
import { Sprout, Leaf, Mountain, Droplets, Waves, Wind, Layers, ChevronLeft, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UNITS, UNIT_LABELS, toBigha } from '@/lib/data/units';
import { LAND_CONDITIONS, SOIL_TYPES } from '@/lib/data/crops';

const CONDITION_META = {
  fertile: {
    icon: <Sprout className="w-5 h-5" />,
    description: 'Rich soil, good water retention, high organic matter. Expect above-average yield.',
  },
  average: {
    icon: <Leaf className="w-5 h-5" />,
    description: 'Normal soil conditions. Standard yield expected.',
  },
  poor: {
    icon: <Mountain className="w-5 h-5" />,
    description: 'Low fertility, sandy or degraded soil. Requires more fertilizer, lower yield expected.',
  },
};

const SOIL_META = {
  loamy:  { icon: <Layers className="w-5 h-5" />,   description: 'Best for most crops — retains moisture and nutrients well.' },
  clay:   { icon: <Droplets className="w-5 h-5" />, description: 'Heavy soil, retains water — good for rice, needs drainage management.' },
  sandy:  { icon: <Wind className="w-5 h-5" />,     description: 'Drains quickly — needs more irrigation and organic matter.' },
  silt:   { icon: <Waves className="w-5 h-5" />,    description: 'Fine particles, fertile and moisture-retentive — excellent for most crops.' },
};

export default function StepThree({ data, onChange, onSubmit, onBack, loading }) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!data.landSize || isNaN(data.landSize) || parseFloat(data.landSize) <= 0)
      e.landSize = 'Please enter a valid land size greater than 0';
    if (!data.landUnit)      e.landUnit      = 'Please select a unit';
    if (!data.landCondition) e.landCondition = 'Please select land condition';
    if (!data.soilType)      e.soilType      = 'Please select soil type';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => { if (validate()) onSubmit(); };

  const bighaEquivalent = data.landSize && data.landUnit && !isNaN(data.landSize)
    ? toBigha(parseFloat(data.landSize), data.landUnit).toFixed(2)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
          <Layers className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-foreground">Land Details</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Tell us about your land so we can calculate the right amounts for you.</p>
        </div>
      </div>

      {/* Land size + unit */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-foreground">
          Land Size <span className="text-destructive">*</span>
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 2.5"
            value={data.landSize}
            onChange={e => onChange({ ...data, landSize: e.target.value })}
            className="flex-1 border border-input bg-card text-card-foreground
                       rounded-xl px-4 py-2.5 text-sm
                       focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary
                       transition-all duration-200"
          />
          <select
            value={data.landUnit}
            onChange={e => onChange({ ...data, landUnit: e.target.value })}
            className="w-32 sm:w-36 border border-input bg-card text-card-foreground
                       rounded-xl px-3 py-2.5 text-sm
                       focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary
                       transition-all duration-200 appearance-none cursor-pointer"
          >
            <option value="">Unit</option>
            {Object.values(UNITS).map(unit => (
              <option key={unit} value={unit}>{UNIT_LABELS[unit]}</option>
            ))}
          </select>
        </div>
        <AnimatePresence>
          {bighaEquivalent && data.landUnit !== UNITS.BIGHA && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-xs text-primary font-medium px-1"
            >
              ≈ {bighaEquivalent} বিঘা (Bigha)
            </motion.p>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {(errors.landSize || errors.landUnit) && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-xs text-destructive flex items-center gap-1"
            >
              <span>⚠</span> {errors.landSize || errors.landUnit}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Land condition */}
      <div className="space-y-2.5">
        <label className="block text-sm font-semibold text-foreground">
          Land Condition <span className="text-destructive">*</span>
        </label>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {Object.values(LAND_CONDITIONS).map((condition, i) => {
            const meta      = CONDITION_META[condition.id];
            const isSelected = data.landCondition === condition.id;
            return (
              <motion.button
                key={condition.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => onChange({ ...data, landCondition: condition.id })}
                className={`
                  p-3 sm:p-4 rounded-xl border-2 text-left transition-all duration-200
                  ${isSelected
                    ? 'border-primary bg-primary/10 shadow-sm shadow-primary/20'
                    : 'border-border bg-card text-card-foreground hover:border-primary/40 hover:bg-muted/40'}
                `}
              >
                <div className={`mb-2 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
                  {meta.icon}
                </div>
                <p className={`text-xs sm:text-sm font-semibold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                  {condition.label.split(' ')[0]}
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 hidden sm:block">
                  {condition.label.match(/\(([^)]+)\)/)?.[1] || ''}
                </p>
              </motion.button>
            );
          })}
        </div>
        <AnimatePresence>
          {data.landCondition && (
            <motion.p
              key={data.landCondition}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-xs text-muted-foreground bg-muted/60 rounded-lg px-3 py-2 border border-border"
            >
              {CONDITION_META[data.landCondition].description}
            </motion.p>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {errors.landCondition && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-xs text-destructive flex items-center gap-1"
            >
              <span>⚠</span> {errors.landCondition}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Soil type */}
      <div className="space-y-2.5">
        <label className="block text-sm font-semibold text-foreground">
          Soil Type <span className="text-destructive">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {Object.values(SOIL_TYPES).map((soil, i) => {
            const meta       = SOIL_META[soil.id];
            const isSelected = data.soilType === soil.id;
            return (
              <motion.button
                key={soil.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => onChange({ ...data, soilType: soil.id })}
                className={`
                  p-3 sm:p-4 rounded-xl border-2 text-left transition-all duration-200
                  ${isSelected
                    ? 'border-primary bg-primary/10 shadow-sm shadow-primary/20'
                    : 'border-border bg-card text-card-foreground hover:border-primary/40 hover:bg-muted/40'}
                `}
              >
                <div className={`mb-2 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
                  {meta.icon}
                </div>
                <p className={`text-xs sm:text-sm font-semibold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                  {soil.label.split(' ')[0]}
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 hidden sm:block">
                  {soil.label.match(/\(([^)]+)\)/)?.[1] || ''}
                </p>
              </motion.button>
            );
          })}
        </div>
        <AnimatePresence>
          {data.soilType && (
            <motion.p
              key={data.soilType}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-xs text-muted-foreground bg-muted/60 rounded-lg px-3 py-2 border border-border"
            >
              {SOIL_META[data.soilType].description}
            </motion.p>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {errors.soilType && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-xs text-destructive flex items-center gap-1"
            >
              <span>⚠</span> {errors.soilType}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={onBack}
          disabled={loading}
          className="flex items-center justify-center gap-2 border-2 border-border bg-card text-card-foreground
                     font-semibold py-3 px-5 rounded-xl hover:border-primary/40 hover:bg-muted/40
                     transition-all duration-200 text-sm disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </motion.button>
        <motion.button
          whileHover={{ scale: loading ? 1 : 1.01 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground
                     font-semibold py-3 px-6 rounded-xl shadow-sm shadow-primary/30
                     hover:bg-primary/90 transition-all duration-200 text-sm sm:text-base
                     disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating Plan...
            </>
          ) : (
            <>
              Generate Plan 🌾
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}