'use client';

import { useState } from 'react';
import { Tractor, Sprout, Repeat2, FlaskConical, Droplets, Scissors, Bug, Wheat, Waves, ChevronDown, ChevronUp, Plus, RefreshCw, MapPin, Calendar, Leaf, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORY_STYLES = {
  land:       { icon: <Tractor className="w-3.5 h-3.5" />,       label: 'Land Prep',    color: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300'  },
  sowing:     { icon: <Sprout className="w-3.5 h-3.5" />,        label: 'Sowing',       color: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300'  },
  transplant: { icon: <Repeat2 className="w-3.5 h-3.5" />,       label: 'Transplant',   color: 'bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300'      },
  fertilizer: { icon: <FlaskConical className="w-3.5 h-3.5" />,  label: 'Fertilizer',   color: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300'      },
  irrigation: { icon: <Droplets className="w-3.5 h-3.5" />,      label: 'Irrigation',   color: 'bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-900/30 dark:text-sky-300'          },
  weeding:    { icon: <Scissors className="w-3.5 h-3.5" />,      label: 'Weeding',      color: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300' },
  pest:       { icon: <Bug className="w-3.5 h-3.5" />,           label: 'Pest Control', color: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300'          },
  harvest:    { icon: <Wheat className="w-3.5 h-3.5" />,         label: 'Harvest',      color: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300' },
  retting:    { icon: <Waves className="w-3.5 h-3.5" />,         label: 'Retting',      color: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300' },
  thinning:   { icon: <Scissors className="w-3.5 h-3.5" />,      label: 'Thinning',     color: 'bg-lime-100 text-lime-700 border-lime-200 dark:bg-lime-900/30 dark:text-lime-300'      },
  earthing:   { icon: <Tractor className="w-3.5 h-3.5" />,       label: 'Earthing',     color: 'bg-stone-100 text-stone-700 border-stone-200 dark:bg-stone-900/30 dark:text-stone-300' },
};

const FERTILIZER_LABELS = {
  urea:         'Urea (ইউরিয়া)',
  tsp:          'TSP (টিএসপি)',
  mop:          'MOP (এমওপি)',
  gypsum:       'Gypsum (জিপসাম)',
  boron:        'Boron (বোরন)',
  zinc_sulfate: 'Zinc Sulfate (জিংক সালফেট)',
};

export default function PlanResult({ plan, onReset }) {
  const [activeTab, setActiveTab]     = useState('timeline');
  const [expandedWeek, setExpandedWeek] = useState(0);

  const tasksByWeek = plan.timeline.reduce((acc, task) => {
    if (!acc[task.week]) acc[task.week] = [];
    acc[task.week].push(task);
    return acc;
  }, {});

  const weeks = Object.keys(tasksByWeek).map(Number).sort((a, b) => a - b);

  const tabs = [
    { id: 'timeline', label: 'Timeline',       icon: <Calendar className="w-3.5 h-3.5" /> },
    { id: 'inputs',   label: 'Inputs',         icon: <Leaf className="w-3.5 h-3.5" /> },
    { id: 'schedule', label: 'Fert. Schedule', icon: <FlaskConical className="w-3.5 h-3.5" /> },
    { id: 'advisory', label: 'Advisory',       icon: <TrendingUp className="w-3.5 h-3.5" /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-foreground">Your Farm Plan</h2>
          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
            <MapPin className="w-3.5 h-3.5" />
            {plan.location.district}{plan.location.upazila ? `, ${plan.location.upazila}` : ''}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs font-medium text-primary border border-primary/30 bg-primary/5 hover:bg-primary/10 px-3 py-2 rounded-xl transition-all duration-200"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          New Plan
        </motion.button>
      </div>

      {/* Summary card */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        {/* Crop banner */}
        <div className="bg-primary px-4 py-3 sm:px-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-foreground/70 text-xs font-medium uppercase tracking-wide">Crop</p>
              <p className="text-primary-foreground text-xl font-bold leading-tight">{plan.crop.nameBn}</p>
              <p className="text-primary-foreground/80 text-sm">{plan.crop.name}</p>
            </div>
            <div className="text-right">
              <p className="text-primary-foreground/70 text-xs">Season</p>
              <p className="text-primary-foreground font-semibold text-sm mt-0.5">{plan.crop.season}</p>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 divide-x divide-border border-t border-border">
          {[
            { label: 'Land', value: plan.land.displaySize, sub: `${plan.land.sizeInBigha} bigha` },
            { label: 'Planting', value: new Date(plan.dates.planting).toLocaleDateString('en-BD', { day: 'numeric', month: 'short' }), sub: new Date(plan.dates.planting).getFullYear() },
            { label: 'Harvest', value: new Date(plan.dates.harvest).toLocaleDateString('en-BD', { day: 'numeric', month: 'short' }), sub: new Date(plan.dates.harvest).getFullYear() },
          ].map(({ label, value, sub }) => (
            <div key={label} className="px-3 py-3 sm:px-4 text-center">
              <p className="text-muted-foreground text-[10px] sm:text-xs font-medium uppercase tracking-wide">{label}</p>
              <p className="text-foreground font-bold text-sm sm:text-base mt-0.5">{value}</p>
              <p className="text-muted-foreground text-[10px] sm:text-xs">{sub}</p>
            </div>
          ))}
        </div>

        {/* Yield */}
        <div className="px-4 py-3 sm:px-5 border-t border-border bg-muted/30 flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-xs font-medium">Estimated Yield</p>
            <p className="text-foreground font-bold text-lg">{plan.yield.maund} <span className="text-sm font-normal text-muted-foreground">মণ</span></p>
            <p className="text-muted-foreground text-xs">{plan.yield.kg} kg · {plan.land.condition}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Wheat className="w-5 h-5 text-primary" />
          </div>
        </div>
      </div>

      {/* Variety badge */}
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-secondary/30 bg-secondary/5">
        <Sprout className="w-4 h-4 text-secondary shrink-0" />
        <p className="text-sm text-foreground">
          <span className="text-muted-foreground">Recommended Variety: </span>
          <span className="font-semibold">{plan.crop.variety}</span>
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted/50 rounded-xl p-1 border border-border">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 flex items-center justify-center gap-1 sm:gap-1.5 px-1.5 sm:px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200
              ${activeTab === tab.id
                ? 'bg-card text-primary shadow-sm border border-border'
                : 'text-muted-foreground hover:text-foreground'}
            `}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >

          {/* Timeline */}
          {activeTab === 'timeline' && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground px-1">
                {plan.timeline.length} tasks over {plan.dates.duration} days. Tap a week to expand.
              </p>
              {weeks.map(week => {
                const tasks    = tasksByWeek[week];
                const isOpen   = expandedWeek === week;
                const firstDate = new Date(tasks[0].date).toLocaleDateString('en-BD', { day: 'numeric', month: 'short' });

                return (
                  <div key={week} className="rounded-xl border border-border bg-card overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setExpandedWeek(isOpen ? null : week)}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                          W{week}
                        </span>
                        <div className="text-left">
                          <p className="text-sm font-semibold text-foreground">
                            Week {week}{week === 0 ? ' — Start' : ''}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {firstDate} · {tasks.length} task{tasks.length > 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {tasks.slice(0, 3).map((t, i) => {
                            const s = CATEGORY_STYLES[t.category];
                            return s ? (
                              <span key={i} className={`w-5 h-5 rounded-full border flex items-center justify-center ${s.color}`}>
                                {s.icon}
                              </span>
                            ) : null;
                          })}
                        </div>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                      </div>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden border-t border-border"
                        >
                          <div className="divide-y divide-border">
                            {tasks.map((task, i) => {
                              const style = CATEGORY_STYLES[task.category] || {
                                icon: <Plus className="w-3.5 h-3.5" />,
                                label: task.category,
                                color: 'bg-muted text-muted-foreground border-border',
                              };
                              return (
                                <div key={i} className="flex items-start gap-3 px-4 py-3">
                                  <span className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${style.color}`}>
                                    {style.icon}
                                  </span>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground">{task.task}</p>
                                    <div className="flex flex-wrap items-center gap-2 mt-1">
                                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${style.color}`}>
                                        {style.label}
                                      </span>
                                      <span className="text-[10px] text-muted-foreground">
                                        {new Date(task.date).toLocaleDateString('en-BD', { day: 'numeric', month: 'long', year: 'numeric' })}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}

          {/* Inputs */}
          {activeTab === 'inputs' && (
            <div className="space-y-3">
              {[
                {
                  icon: <Sprout className="w-4 h-4 text-green-600" />,
                  title: 'Seed Required',
                  bg: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800',
                  content: (
                    <>
                      <p className="text-2xl font-bold text-foreground">{plan.requirements.seed.amount} <span className="text-sm font-normal text-muted-foreground">kg</span></p>
                      <p className="text-xs text-muted-foreground mt-1">{plan.requirements.seed.note}</p>
                    </>
                  )
                },
                {
                  icon: <FlaskConical className="w-4 h-4 text-blue-600" />,
                  title: 'Total Fertilizer Required',
                  bg: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
                  content: (
                    <div className="space-y-1.5 mt-1">
                      {Object.entries(plan.requirements.fertilizer).map(([type, amount]) => (
                        <div key={type} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{FERTILIZER_LABELS[type] || type}</span>
                          <span className="font-semibold text-foreground">{amount} kg</span>
                        </div>
                      ))}
                    </div>
                  )
                },
                {
                  icon: <Droplets className="w-4 h-4 text-sky-600" />,
                  title: 'Irrigation',
                  bg: 'bg-sky-50 border-sky-200 dark:bg-sky-900/20 dark:border-sky-800',
                  content: (
                    <>
                      <p className="text-2xl font-bold text-foreground">{plan.requirements.irrigation.count} <span className="text-sm font-normal text-muted-foreground">times</span></p>
                      <p className="text-xs text-muted-foreground mt-1">{plan.requirements.irrigation.note}</p>
                    </>
                  )
                },
                {
                  icon: <Bug className="w-4 h-4 text-red-600" />,
                  title: 'Pesticide Budget',
                  bg: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800',
                  content: (
                    <>
                      <p className="text-2xl font-bold text-foreground">৳ {plan.requirements.pesticideCost.amount}</p>
                      <p className="text-xs text-muted-foreground mt-1">Approximate cost</p>
                    </>
                  )
                },
              ].map(({ icon, title, bg, content }) => (
                <div key={title} className={`rounded-xl border p-4 ${bg}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {icon}
                    <p className="text-sm font-semibold text-foreground">{title}</p>
                  </div>
                  {content}
                </div>
              ))}
            </div>
          )}

          {/* Fertilizer schedule */}
          {activeTab === 'schedule' && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground px-1">Apply fertilizer on these dates for best results.</p>
              {plan.requirements.fertilizerSchedule.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex gap-3 items-start rounded-xl border border-border bg-card px-4 py-3"
                >
                  <div className="shrink-0 w-12 text-center">
                    <p className="text-xs font-bold text-primary leading-none">
                      {new Date(item.date).toLocaleDateString('en-BD', { month: 'short' })}
                    </p>
                    <p className="text-lg font-bold text-foreground leading-none mt-0.5">
                      {new Date(item.date).toLocaleDateString('en-BD', { day: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex-1 min-w-0 border-l border-border pl-3">
                    <p className="text-sm font-semibold text-foreground">
                      {FERTILIZER_LABELS[item.fertilizer] || item.fertilizer} — {item.amount} {item.unit}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Advisory */}
          {activeTab === 'advisory' && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground px-1">Expert tips for growing {plan.crop.name} in Bangladesh.</p>
              {plan.advisory.map((tip, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex gap-3 items-start rounded-xl border border-border bg-card px-4 py-3"
                >
                  <span className="text-base shrink-0 mt-0.5">💡</span>
                  <p className="text-sm text-foreground leading-relaxed">{tip}</p>
                </motion.div>
              ))}
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}