import { getCropById, LAND_CONDITIONS } from '@/lib/data/crops';
import { toBigha, fromBigha, formatLand } from '@/lib/data/units';

// ─── What does planGenerator do? ─────────────────────────────────────────────
// Takes the farmer's raw form inputs and produces a complete structured plan.
// It does 4 things:
//   1. Convert land size to bigha (base unit for all calculations)
//   2. Apply land condition multipliers to yield and fertilizer
//   3. Scale all per-bigha values by the farmer's actual land size
//   4. Generate a week-by-week dated task timeline from the planting date

/**
 * Generate a complete farm plan
 *
 * @param {Object} inputs
 * @param {string} inputs.cropId          - e.g. 'boro_rice'
 * @param {number} inputs.landSize        - e.g. 2.5
 * @param {string} inputs.landUnit        - e.g. 'bigha', 'acre', 'katha', 'shotok'
 * @param {string} inputs.landCondition   - e.g. 'fertile', 'average', 'poor'
 * @param {string} inputs.soilType        - e.g. 'loamy', 'clay', 'sandy'
 * @param {string} inputs.plantingDate    - ISO date string e.g. '2024-11-15'
 * @param {string} inputs.district        - e.g. 'Rajshahi'
 * @param {string} inputs.upazila         - e.g. 'Paba'
 *
 * @returns {Object} Complete plan object
 */
export function generatePlan(inputs) {
  const { cropId, landSize, landUnit, landCondition, soilType, plantingDate, district, upazila } = inputs;

  // ── Step 1: Get crop data ─────────────────────────────────────────────────
  const crop = getCropById(cropId);
  if (!crop) throw new Error(`Unknown crop: ${cropId}`);

  const condition = LAND_CONDITIONS[landCondition.toUpperCase()];
  if (!condition) throw new Error(`Unknown land condition: ${landCondition}`);

  // ── Step 2: Convert land size to bigha ────────────────────────────────────
  // All formulas use bigha internally
  const landInBigha = toBigha(landSize, landUnit);

  // ── Step 3: Calculate seed requirement ───────────────────────────────────
  // Simple: seed per bigha × total bigha
  const totalSeed = crop.perBigha.seed * landInBigha;

  // ── Step 4: Calculate fertilizer requirements ────────────────────────────
  // Apply land condition multiplier — poor land needs more fertilizer
  // Round to 1 decimal place for readability
  const fertilizer = {};
  for (const [type, amountPerBigha] of Object.entries(crop.perBigha.fertilizer)) {
    fertilizer[type] = parseFloat(
      (amountPerBigha * landInBigha * condition.fertMul).toFixed(1)
    );
  }

  // ── Step 5: Calculate yield estimate ─────────────────────────────────────
  // Apply land condition multiplier — fertile land yields more
  const yieldKg    = parseFloat((crop.perBigha.yieldKg * landInBigha * condition.yieldMul).toFixed(1));
  const yieldMaund = parseFloat((crop.perBigha.yieldMaund * landInBigha * condition.yieldMul).toFixed(1));

  // ── Step 6: Calculate irrigation count ───────────────────────────────────
  // Poor/sandy soil needs more irrigation, fertile/clay needs less
  const irrigationMultiplier = soilType === 'sandy' ? 1.3 : soilType === 'clay' ? 0.85 : 1;
  const irrigationCount = Math.round(crop.perBigha.irrigation_count * irrigationMultiplier);

  // ── Step 7: Calculate approximate pesticide cost ─────────────────────────
  const pesticideCost = Math.round(crop.perBigha.pesticide_cost * landInBigha);

  // ── Step 8: Generate dated task timeline ─────────────────────────────────
  // Each task has a week number — add (week × 7) days to planting date
  // to get the actual calendar date for each task
  const planting = new Date(plantingDate);
  const timeline = crop.tasks.map((task, index) => {
    const taskDate = new Date(planting);
    taskDate.setDate(planting.getDate() + task.week * 7);

    return {
      id:       index,
      week:     task.week,
      date:     taskDate.toISOString().split('T')[0], // 'YYYY-MM-DD'
      category: task.category,
      task:     task.task,
      done:     false, // farmer marks this later
    };
  });

  // ── Step 9: Calculate harvest date ───────────────────────────────────────
  const harvestDate = new Date(planting);
  harvestDate.setDate(planting.getDate() + crop.duration);

  // ── Step 10: Build fertilizer application schedule ────────────────────────
  // Split fertilizer into doses based on standard practice:
  //   Urea → 3 equal doses (basal, tillering, panicle)
  //   TSP  → 1 dose (basal at land preparation)
  //   MOP  → 2 doses (half basal, half at tillering)
  //   Others → 1 dose (basal)
  const fertilizerSchedule = buildFertilizerSchedule(fertilizer, planting);

  // ── Step 11: Assemble the final plan object ───────────────────────────────
  return {
    // Meta
    generatedAt: new Date().toISOString(),
    location: { district, upazila },

    // Crop info
    crop: {
      id:      crop.id,
      name:    crop.name,
      nameBn:  crop.nameBn,
      season:  crop.season.label,
      variety: crop.variety,
    },

    // Land info
    land: {
      size:          landSize,
      unit:          landUnit,
      sizeInBigha:   parseFloat(landInBigha.toFixed(3)),
      condition:     condition.label,
      soilType,
      displaySize:   formatLand(landSize, landUnit),
    },

    // Dates
    dates: {
      planting:     plantingDate,
      harvest:      harvestDate.toISOString().split('T')[0],
      duration:     crop.duration,
    },

    // Requirements
    requirements: {
      seed: {
        amount: parseFloat(totalSeed.toFixed(2)),
        unit:   'kg',
        note:   `${crop.perBigha.seed} kg per bigha × ${landInBigha.toFixed(2)} bigha`,
      },
      fertilizer,
      fertilizerSchedule,
      irrigation: {
        count: irrigationCount,
        note:  `Adjusted for ${soilType} soil`,
      },
      pesticideCost: {
        amount: pesticideCost,
        unit:   'BDT (approx)',
      },
    },

    // Yield estimate
    yield: {
      kg:       yieldKg,
      maund:    yieldMaund,
      note:     `Based on ${condition.label} land condition`,
    },

    // Week-by-week task timeline
    timeline,

    // Expert advisory notes
    advisory: crop.advisory,
  };
}


// ─── buildFertilizerSchedule() ───────────────────────────────────────────────
// Splits total fertilizer amounts into dated application doses.
// Standard Bangladesh DAE recommendation for dose splitting.
function buildFertilizerSchedule(fertilizer, plantingDate) {
  const schedule = [];

  const addDate = (weeksAfterPlanting) => {
    const d = new Date(plantingDate);
    d.setDate(d.getDate() + weeksAfterPlanting * 7);
    return d.toISOString().split('T')[0];
  };

  // TSP — 100% at land preparation (week 0)
  if (fertilizer.tsp) {
    schedule.push({
      date:        addDate(0),
      fertilizer:  'TSP',
      amount:      fertilizer.tsp,
      unit:        'kg',
      description: 'Full dose at land preparation',
    });
  }

  // Gypsum — 100% at land preparation (week 0)
  if (fertilizer.gypsum) {
    schedule.push({
      date:        addDate(0),
      fertilizer:  'Gypsum',
      amount:      fertilizer.gypsum,
      unit:        'kg',
      description: 'Full dose at land preparation',
    });
  }

  // Boron — 100% at land preparation (week 0)
  if (fertilizer.boron) {
    schedule.push({
      date:        addDate(0),
      fertilizer:  'Boron',
      amount:      fertilizer.boron,
      unit:        'kg',
      description: 'Full dose at land preparation',
    });
  }

  // Zinc Sulfate — 100% at land preparation (week 0)
  if (fertilizer.zinc_sulfate) {
    schedule.push({
      date:        addDate(0),
      fertilizer:  'Zinc Sulfate',
      amount:      fertilizer.zinc_sulfate,
      unit:        'kg',
      description: 'Full dose at land preparation',
    });
  }

  // MOP — 50% basal, 50% at tillering (week 6)
  if (fertilizer.mop) {
    const half = parseFloat((fertilizer.mop / 2).toFixed(1));
    schedule.push(
      { date: addDate(0), fertilizer: 'MOP', amount: half, unit: 'kg', description: '1st dose (50%) at land preparation' },
      { date: addDate(6), fertilizer: 'MOP', amount: half, unit: 'kg', description: '2nd dose (50%) at tillering stage' },
    );
  }

  // Urea — 3 equal doses: week 2, week 5, week 8
  if (fertilizer.urea) {
    const dose = parseFloat((fertilizer.urea / 3).toFixed(1));
    schedule.push(
      { date: addDate(2), fertilizer: 'Urea', amount: dose, unit: 'kg', description: '1st dose (⅓) — early vegetative stage' },
      { date: addDate(5), fertilizer: 'Urea', amount: dose, unit: 'kg', description: '2nd dose (⅓) — tillering / active growth' },
      { date: addDate(8), fertilizer: 'Urea', amount: dose, unit: 'kg', description: '3rd dose (⅓) — panicle initiation / flowering' },
    );
  }

  // Sort by date so the schedule reads chronologically
  return schedule.sort((a, b) => new Date(a.date) - new Date(b.date));
}