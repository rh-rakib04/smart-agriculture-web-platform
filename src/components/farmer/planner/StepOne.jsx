'use client';

import { useState } from 'react';
import { Wheat, Sprout, Sun, ChevronRight, Calendar, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllCrops, getCropsBySeason, SEASONS } from '@/lib/data/crops';

const SEASON_ICONS = {
  rabi:     <Wheat className="w-5 h-5" />,
  kharif_1: <Sprout className="w-5 h-5" />,
  kharif_2: <Sun className="w-5 h-5" />,
};

export default function StepOne({ data, onChange, onNext }) {
  const [selectedSeason, setSelectedSeason] = useState(data.season || '');
  const [errors, setErrors]                 = useState({});

  const filteredCrops = selectedSeason ? getCropsBySeason(selectedSeason) : getAllCrops();

  const validate = () => {
    const e = {};
    if (!data.cropId)       e.cropId       = 'Please select a crop';
    if (!data.plantingDate) e.plantingDate = 'Please select a planting date';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => { if (validate()) onNext(); };
  const selectedCrop = filteredCrops.find(c => c.id === data.cropId);

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
          <Wheat className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-foreground">Crop & Planting Date</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Select the crop you want to grow and when you plan to start.</p>
        </div>
      </div>

      {/* Season selector */}
      <div className="space-y-2.5">
        <label className="block text-sm font-semibold text-foreground">
          Season <span className="text-muted-foreground font-normal">(optional — filters crops)</span>
        </label>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {Object.values(SEASONS).map(season => {
            const isSelected = selectedSeason === season.id;
            return (
              <motion.button
                key={season.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => {
                  const newSeason = isSelected ? '' : season.id;
                  setSelectedSeason(newSeason);
                  onChange({ ...data, season: newSeason, cropId: '' });
                }}
                className={`
                  p-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 text-center
                  ${isSelected
                    ? 'border-primary bg-primary/10 text-primary shadow-sm shadow-primary/20'
                    : 'border-border bg-card text-card-foreground hover:border-primary/40 hover:bg-muted/50'}
                `}
              >
                <div className={`flex justify-center mb-1.5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
                  {SEASON_ICONS[season.id]}
                </div>
                <p className="text-xs font-semibold leading-tight">{season.label.split(' ')[0]}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 hidden sm:block">{season.months}</p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Crop selector */}
      <div className="space-y-2.5">
        <label className="block text-sm font-semibold text-foreground">
          Crop <span className="text-destructive">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {filteredCrops.map((crop, i) => {
            const isSelected = data.cropId === crop.id;
            return (
              <motion.button
                key={crop.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => onChange({ ...data, cropId: crop.id })}
                className={`
                  p-3 rounded-xl border-2 text-left transition-all duration-200
                  ${isSelected
                    ? 'border-primary bg-primary/10 shadow-sm shadow-primary/20'
                    : 'border-border bg-card hover:border-primary/40 hover:bg-muted/40'}
                `}
              >
                <p className={`text-base font-bold leading-none ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                  {crop.nameBn}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{crop.name}</p>
                <span className={`
                  inline-block text-[10px] font-medium px-1.5 py-0.5 rounded-full mt-1.5
                  ${isSelected ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}
                `}>
                  {crop.season.label.split(' ')[0]}
                </span>
              </motion.button>
            );
          })}
        </div>
        <AnimatePresence>
          {errors.cropId && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-xs text-destructive flex items-center gap-1 mt-1"
            >
              <span>⚠</span> {errors.cropId}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Selected crop preview */}
      <AnimatePresence>
        {selectedCrop && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-2"
          >
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-primary shrink-0" />
              <p className="text-sm font-semibold text-foreground">{selectedCrop.name} — {selectedCrop.nameBn}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="text-primary">🌱</span> Variety: <span className="font-medium text-foreground">{selectedCrop.variety}</span></span>
              <span className="flex items-center gap-1.5"><span className="text-primary">📅</span> Duration: <span className="font-medium text-foreground">~{selectedCrop.duration} days</span></span>
              <span className="flex items-center gap-1.5"><span className="text-primary">🗓</span> Season: <span className="font-medium text-foreground">{selectedCrop.season.label}</span></span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Planting date */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-foreground">
          Planting Date <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="date"
            value={data.plantingDate}
            onChange={e => onChange({ ...data, plantingDate: e.target.value })}
            className="w-full border border-input bg-card text-card-foreground
                       rounded-xl pl-10 pr-4 py-2.5 text-sm
                       focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary
                       transition-all duration-200"
          />
        </div>
        <AnimatePresence>
          {selectedCrop && data.plantingDate && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-xs text-primary font-medium flex items-center gap-1.5 mt-1 px-1"
            >
              <span>🌾</span>
              Estimated harvest:{' '}
              <span className="font-semibold">
                {new Date(
                  new Date(data.plantingDate).getTime() +
                  selectedCrop.duration * 24 * 60 * 60 * 1000
                ).toLocaleDateString('en-BD', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </motion.p>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {errors.plantingDate && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-xs text-destructive flex items-center gap-1"
            >
              <span>⚠</span> {errors.plantingDate}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Next button */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        type="button"
        onClick={handleNext}
        className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground
                   font-semibold py-3 px-6 rounded-xl shadow-sm shadow-primary/30
                   hover:bg-primary/90 transition-all duration-200 text-sm sm:text-base"
      >
        Next → Location
        <ChevronRight className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
}