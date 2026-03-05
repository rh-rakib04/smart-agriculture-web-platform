'use client';

import { useState } from 'react';
import { Sprout, Leaf, Mountain, Droplets, Waves, Wind, Layers, ChevronLeft, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UNITS, UNIT_LABELS, toBigha } from '@/lib/data/units';
import { LAND_CONDITIONS, SOIL_TYPES } from '@/lib/data/crops';

const CONDITION_META = {
  fertile: { icon: Sprout,   color: 'border-emerald-400 bg-emerald-400/10 text-emerald-700', ring: 'ring-emerald-400/20', desc: 'Rich soil, good water retention, high organic matter. Expect above-average yield.' },
  average: { icon: Leaf,     color: 'border-blue-400 bg-blue-400/10 text-blue-700',         ring: 'ring-blue-400/20',    desc: 'Normal soil conditions. Standard yield expected.' },
  poor:    { icon: Mountain, color: 'border-amber-400 bg-amber-400/10 text-amber-700',       ring: 'ring-amber-400/20',   desc: 'Low fertility, sandy or degraded soil. Requires more fertilizer, lower yield expected.' },
};

const SOIL_META = {
  loamy: { icon: Layers,   desc: 'Best for most crops — retains moisture and nutrients well.' },
  clay:  { icon: Droplets, desc: 'Heavy soil, retains water — good for rice, needs drainage management.' },
  sandy: { icon: Wind,     desc: 'Drains quickly — needs more irrigation and organic matter.' },
  silt:  { icon: Waves,    desc: 'Fine particles, fertile and moisture-retentive — excellent for most crops.' },
};

export default function StepThree({ data, onChange, onSubmit, onBack, loading }) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!data.landSize || isNaN(data.landSize) || parseFloat(data.landSize) <= 0)
      e.landSize = 'Please enter a valid land size greater than 0';
    if (!data.landCondition) e.landCondition = 'Please select land condition';
    if (!data.soilType)      e.soilType      = 'Please select soil type';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const bighaEquivalent = data.landSize && data.landUnit && !isNaN(data.landSize)
    ? toBigha(parseFloat(data.landSize), data.landUnit).toFixed(2)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-7"
    >

      {/* Land size */}
      <div className="space-y-2.5">
        <label className="block text-sm font-bold text-foreground">
          Land Size <span className="text-destructive">*</span>
        </label>
        <div className="flex gap-2">
          <input
            type="number" min="0" step="0.01" placeholder="e.g. 2.5"
            value={data.landSize}
            onChange={e => onChange({ ...data, landSize: e.target.value })}
            className="flex-1 border-2 border-input bg-card text-card-foreground
              rounded-2xl px-4 py-3 text-sm font-medium
              focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10
              transition-all duration-200"
          />
          <div className="relative w-36">
            <select
              value={data.landUnit}
              onChange={e => onChange({ ...data, landUnit: e.target.value })}
              className="w-full border-2 border-input bg-card text-card-foreground
                rounded-2xl px-4 py-3 text-sm font-medium
                focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10
                transition-all duration-200 appearance-none cursor-pointer"
            >
              {Object.values(UNITS).map(unit => (
                <option key={unit} value={unit}>{UNIT_LABELS[unit]}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">▾</div>
          </div>
        </div>
        <AnimatePresence>
          {bighaEquivalent && data.landUnit !== UNITS.BIGHA && (
            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="text-xs font-semibold text-primary px-1">
              ≈ {bighaEquivalent} বিঘা (Bigha)
            </motion.p>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {errors.landSize && (
            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="text-xs text-destructive flex items-center gap-1.5">
              ⚠ {errors.landSize}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Land condition */}
      <div className="space-y-3">
        <label className="block text-sm font-bold text-foreground">
          Land Condition <span className="text-destructive">*</span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          {Object.values(LAND_CONDITIONS).map((condition, i) => {
            const meta       = CONDITION_META[condition.id];
            const Icon       = meta.icon;
            const isSelected = data.landCondition === condition.id;
            return (
              <motion.button
                key={condition.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => onChange({ ...data, landCondition: condition.id })}
                className={`p-4 rounded-2xl border-2 text-left transition-all duration-300
                  ${isSelected
                    ? `${meta.color} shadow-md ring-4 ${meta.ring}`
                    : 'border-border bg-card hover:border-primary/30 hover:bg-muted/30'
                  }`}
              >
                <div className={`mb-2 ${isSelected ? '' : 'text-muted-foreground'}`}>
                  <Icon size={20} />
                </div>
                <p className={`text-xs font-bold ${isSelected ? '' : 'text-foreground'}`}>
                  {condition.label.split(' ')[0]}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5 hidden sm:block">
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
              className="text-xs text-muted-foreground bg-muted/50 rounded-xl px-3 py-2 border border-border"
            >
              {CONDITION_META[data.landCondition].desc}
            </motion.p>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {errors.landCondition && (
            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="text-xs text-destructive flex items-center gap-1.5">
              ⚠ {errors.landCondition}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Soil type */}
      <div className="space-y-3">
        <label className="block text-sm font-bold text-foreground">
          Soil Type <span className="text-destructive">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {Object.values(SOIL_TYPES).map((soil, i) => {
            const meta       = SOIL_META[soil.id];
            const Icon       = meta.icon;
            const isSelected = data.soilType === soil.id;
            return (
              <motion.button
                key={soil.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => onChange({ ...data, soilType: soil.id })}
                className={`p-3 sm:p-4 rounded-2xl border-2 text-left transition-all duration-200
                  ${isSelected
                    ? 'border-primary bg-primary/10 shadow-md shadow-primary/15 ring-4 ring-primary/10'
                    : 'border-border bg-card hover:border-primary/30 hover:bg-muted/30'
                  }`}
              >
                <div className={`mb-2 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
                  <Icon size={18} />
                </div>
                <p className={`text-xs font-bold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                  {soil.label.split(' ')[0]}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5 hidden sm:block">
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
              className="text-xs text-muted-foreground bg-muted/50 rounded-xl px-3 py-2 border border-border"
            >
              {SOIL_META[data.soilType].desc}
            </motion.p>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {errors.soilType && (
            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="text-xs text-destructive flex items-center gap-1.5">
              ⚠ {errors.soilType}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
          type="button" onClick={onBack} disabled={loading}
          className="flex items-center justify-center gap-2 border-2 border-border bg-card
            text-muted-foreground font-bold py-3.5 px-5 rounded-2xl
            hover:border-primary/30 hover:text-foreground hover:bg-muted/30
            transition-all duration-200 text-sm disabled:opacity-50"
        >
          <ChevronLeft size={16} /> Back
        </motion.button>

        <motion.button
          whileHover={{ scale: loading ? 1 : 1.01, y: loading ? 0 : -1 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          type="button"
          onClick={() => { if (validate()) onSubmit(); }}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2.5
            bg-highlight text-gray-900 font-bold py-3.5 px-6
            rounded-2xl shadow-lg shadow-highlight/30
            hover:brightness-110 transition-all duration-200 text-sm
            disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Generating Plan...
            </>
          ) : (
            <>🌾 Generate My Farm Plan</>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}