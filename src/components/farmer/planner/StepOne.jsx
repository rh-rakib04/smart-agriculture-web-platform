'use client';

import { useState } from 'react';
import { Wheat, Sprout, Sun, Calendar, Leaf, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllCrops, getCropsBySeason, SEASONS } from '@/lib/data/crops';

const SEASON_META = {
  rabi:     { icon: Wheat,  color: 'border-amber-400 bg-amber-400/10 text-amber-700', activeRing: 'ring-amber-400/30' },
  kharif_1: { icon: Sprout, color: 'border-emerald-500 bg-emerald-500/10 text-emerald-700', activeRing: 'ring-emerald-400/30' },
  kharif_2: { icon: Sun,    color: 'border-orange-400 bg-orange-400/10 text-orange-700', activeRing: 'ring-orange-400/30' },
};

const wrapVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.95 },
  show:   { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

export default function StepOne({ data, onChange, onNext }) {
  const [selectedSeason, setSelectedSeason] = useState(data.season || '');
  const [errors, setErrors]                 = useState({});

  const filteredCrops = selectedSeason ? getCropsBySeason(selectedSeason) : getAllCrops();
  const selectedCrop  = filteredCrops.find(c => c.id === data.cropId);

  const validate = () => {
    const e = {};
    if (!data.cropId)       e.cropId       = 'Please select a crop';
    if (!data.plantingDate) e.plantingDate = 'Please select a planting date';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-7"
    >

      {/* Season selector */}
      <div className="space-y-3">
        <label className="block text-sm font-bold text-foreground">
          Season
          <span className="ml-2 text-xs font-normal text-muted-foreground">
            (optional — filters crops)
          </span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          {Object.values(SEASONS).map((season, i) => {
            const meta       = SEASON_META[season.id];
            const Icon       = meta.icon;
            const isSelected = selectedSeason === season.id;
            return (
              <motion.button
                key={season.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => {
                  const s = isSelected ? '' : season.id;
                  setSelectedSeason(s);
                  onChange({ ...data, season: s, cropId: '' });
                }}
                className={`relative p-4 rounded-2xl border-2 text-center
                  transition-all duration-300 overflow-hidden
                  ${isSelected
                    ? `${meta.color} shadow-lg ring-4 ${meta.activeRing}`
                    : 'border-border bg-card hover:border-primary/30 hover:bg-muted/30'
                  }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="seasonGlow"
                    className="absolute inset-0  opacity-5"
                  />
                )}
                <div className={`flex justify-center mb-2 ${isSelected ? '' : 'text-muted-foreground'}`}>
                  <Icon size={22} />
                </div>
                <p className="text-xs font-bold leading-tight">{season.label.split(' ')[0]}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 hidden sm:block">{season.months}</p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Crop grid */}
      <div className="space-y-3">
        <label className="block text-sm font-bold text-foreground">
          Crop <span className="text-destructive">*</span>
          <span className="ml-2 text-xs font-normal text-muted-foreground">
            ({filteredCrops.length} available)
          </span>
        </label>

        <motion.div
          variants={wrapVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-52 overflow-y-auto
            pr-1 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
        >
          {filteredCrops.map((crop) => {
            const isSelected = data.cropId === crop.id;
            return (
              <motion.button
                key={crop.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => onChange({ ...data, cropId: crop.id })}
                className={`p-3 rounded-xl border-2 text-left transition-all duration-200 group
                  ${isSelected
                    ? 'border-primary bg-primary/10 shadow-md shadow-primary/15'
                    : 'border-border bg-card hover:border-primary/30 hover:bg-muted/30'
                  }`}
              >
                <p className={`text-base font-extrabold leading-none
                  ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                  {crop.nameBn}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{crop.name}</p>
                <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1.5
                  ${isSelected ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                  {crop.season.label.split(' ')[0]}
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        <AnimatePresence>
          {errors.cropId && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-xs text-destructive flex items-center gap-1.5"
            >
              ⚠ {errors.cropId}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Selected crop preview */}
      <AnimatePresence>
        {selectedCrop && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center">
                <Leaf size={14} className="text-primary" />
              </div>
              <p className="text-sm font-bold text-foreground">
                {selectedCrop.name} — {selectedCrop.nameBn}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { emoji: '🌱', label: 'Variety',  value: selectedCrop.variety },
                { emoji: '📅', label: 'Duration', value: `~${selectedCrop.duration} days` },
                { emoji: '🗓', label: 'Season',   value: selectedCrop.season.label.split(' ')[0] },
              ].map(item => (
                <div key={item.label} className="bg-background/60 rounded-xl p-2.5 text-center">
                  <span className="text-base">{item.emoji}</span>
                  <p className="text-[10px] text-muted-foreground mt-1">{item.label}</p>
                  <p className="text-xs font-bold text-foreground leading-tight">{item.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Planting date */}
      <div className="space-y-2">
        <label className="block text-sm font-bold text-foreground">
          Planting Date <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2
            text-muted-foreground pointer-events-none" />
          <input
            type="date"
            value={data.plantingDate}
            onChange={e => onChange({ ...data, plantingDate: e.target.value })}
            className="w-full border-2 border-input bg-card text-card-foreground
              rounded-xl pl-10 pr-4 py-3 text-sm font-medium
              focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10
              transition-all duration-200"
          />
        </div>

        <AnimatePresence>
          {selectedCrop && data.plantingDate && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl
                bg-secondary/10 border border-secondary/20"
            >
              <span className="text-sm">🌾</span>
              <p className="text-xs font-medium text-foreground">
                Estimated harvest:{' '}
                <span className="font-bold text-primary">
                  {new Date(
                    new Date(data.plantingDate).getTime() +
                    selectedCrop.duration * 24 * 60 * 60 * 1000
                  ).toLocaleDateString('en-BD', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {errors.plantingDate && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-xs text-destructive flex items-center gap-1.5"
            >
              ⚠ {errors.plantingDate}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Next button */}
      <motion.button
        whileHover={{ scale: 1.01, y: -1 }}
        whileTap={{ scale: 0.98 }}
        type="button"
        onClick={() => { if (validate()) onNext(); }}
        className="w-full flex items-center justify-center gap-2.5
          bg-primary text-primary-foreground font-bold py-3.5 px-6
          rounded-2xl shadow-lg shadow-primary/25
          hover:bg-primary/90 transition-all duration-200 text-sm"
      >
        Next — Location
        <ChevronRight size={16} />
      </motion.button>
    </motion.div>
  );
}