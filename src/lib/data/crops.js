// ─── Bangladesh Crop Dataset ──────────────────────────────────────────────────
// All quantities are PER BIGHA unless stated otherwise.
// Sources: BRRI, BARI, DAE Bangladesh agricultural guidelines.
//
// land_condition_multiplier affects:
//   • yield estimate
//   • fertilizer dose (poor land needs more)
//   • irrigation frequency

// ─── Seasons ─────────────────────────────────────────────────────────────────
export const SEASONS = {
  RABI:     { id: 'rabi',     label: 'রবি (Rabi)',         months: 'November – March' },
  KHARIF_1: { id: 'kharif_1', label: 'খরিফ-১ (Kharif-1)', months: 'March – July' },
  KHARIF_2: { id: 'kharif_2', label: 'খরিফ-২ (Kharif-2)', months: 'July – November' },
};

// ─── Land Conditions ─────────────────────────────────────────────────────────
export const LAND_CONDITIONS = {
  FERTILE: { id: 'fertile', label: 'উর্বর (Fertile)',      yieldMul: 1.2, fertMul: 0.9 },
  AVERAGE: { id: 'average', label: 'মাঝারি (Average)',     yieldMul: 1.0, fertMul: 1.0 },
  POOR:    { id: 'poor',    label: 'অনুর্বর (Poor)',        yieldMul: 0.75, fertMul: 1.2 },
};

// ─── Soil Types ───────────────────────────────────────────────────────────────
export const SOIL_TYPES = {
  LOAMY:  { id: 'loamy',  label: 'দোআঁশ (Loamy)' },
  CLAY:   { id: 'clay',   label: 'এঁটেল (Clay)' },
  SANDY:  { id: 'sandy',  label: 'বেলে (Sandy)' },
  SILT:   { id: 'silt',   label: 'পলি (Silt)' },
};

// ─── Crop Database ────────────────────────────────────────────────────────────
export const CROPS = {

  // ── Boro Rice ───────────────────────────────────────────────────────────────
  boro_rice: {
    id:       'boro_rice',
    name:     'Boro Rice',
    nameBn:   'বোরো ধান',
    season:   SEASONS.RABI,
    variety:  'BRRI dhan28 / BRRI dhan29 / BRRI dhan58',
    duration: 145,          // days from sowing to harvest

    perBigha: {
      seed:          5,     // kg
      yieldMaund:    20,    // maunds (average)
      yieldKg:       750,   // kg equivalent
      fertilizer: {
        urea:        32,    // kg — split into 3 doses
        tsp:         14,    // kg — apply at land prep
        mop:         10,    // kg — split into 2 doses
        gypsum:       5,    // kg — apply at land prep
        zinc_sulfate: 1.5,  // kg — if deficiency
      },
      irrigation_count: 18, // times per season
      pesticide_cost:   400, // BDT approx
    },

    tasks: [
      { week: 0,  category: 'land',        task: 'Land preparation — deep plowing and leveling' },
      { week: 0,  category: 'sowing',      task: 'Seed bed preparation and seed sowing' },
      { week: 1,  category: 'fertilizer',  task: 'Apply TSP, MOP and Gypsum as basal dose during final land prep' },
      { week: 3,  category: 'transplant',  task: 'Transplant seedlings (25–30 days old) to main field' },
      { week: 4,  category: 'irrigation',  task: 'Maintain 2–3 cm water depth in field' },
      { week: 5,  category: 'fertilizer',  task: 'Apply 1st dose of Urea (⅓ of total)' },
      { week: 6,  category: 'weeding',     task: '1st weeding — remove weeds from field' },
      { week: 8,  category: 'fertilizer',  task: 'Apply 2nd dose of Urea (⅓ of total)' },
      { week: 8,  category: 'irrigation',  task: 'Irrigate — tillering stage requires consistent water' },
      { week: 10, category: 'pest',        task: 'Inspect for Brown Plant Hopper (BPH) and Stem Borer' },
      { week: 11, category: 'fertilizer',  task: 'Apply 3rd and final dose of Urea (⅓ of total)' },
      { week: 12, category: 'weeding',     task: '2nd weeding if needed' },
      { week: 14, category: 'irrigation',  task: 'Irrigate — grain filling stage, maintain water level' },
      { week: 16, category: 'pest',        task: 'Inspect for blast disease and sheath blight' },
      { week: 18, category: 'irrigation',  task: 'Stop irrigation 10 days before harvest' },
      { week: 20, category: 'harvest',     task: 'Harvest when 80% of grains are golden yellow' },
    ],

    advisory: [
      'Use certified seeds from BADC for best yield',
      'Drain field 10 days before harvest for easier cutting',
      'Watch for BPH in weeks 8–12 — use Imidacloprid if needed',
      'Zinc deficiency shows as yellowing — apply Zinc Sulfate early',
    ],
  },


  // ── Aman Rice ───────────────────────────────────────────────────────────────
  aman_rice: {
    id:       'aman_rice',
    name:     'Aman Rice',
    nameBn:   'আমন ধান',
    season:   SEASONS.KHARIF_2,
    variety:  'BRRI dhan49 / BRRI dhan52 / BR11',
    duration: 135,

    perBigha: {
      seed:         5,
      yieldMaund:   16,
      yieldKg:      600,
      fertilizer: {
        urea:       25,
        tsp:        11,
        mop:         8,
        gypsum:      4,
      },
      irrigation_count: 6,  // rain-fed, less irrigation needed
      pesticide_cost:   300,
    },

    tasks: [
      { week: 0,  category: 'land',       task: 'Land preparation — plow and puddle the field' },
      { week: 0,  category: 'sowing',     task: 'Raise seedlings in seedbed (June–July)' },
      { week: 1,  category: 'fertilizer', task: 'Apply TSP and MOP as basal dose' },
      { week: 3,  category: 'transplant', task: 'Transplant 20–25 day old seedlings' },
      { week: 4,  category: 'fertilizer', task: 'Apply 1st dose of Urea' },
      { week: 5,  category: 'weeding',    task: '1st weeding' },
      { week: 7,  category: 'fertilizer', task: 'Apply 2nd dose of Urea' },
      { week: 9,  category: 'pest',       task: 'Check for leaf folder and neck blast' },
      { week: 10, category: 'fertilizer', task: 'Apply 3rd dose of Urea at panicle initiation' },
      { week: 13, category: 'irrigation', task: 'Supplemental irrigation if dry spell occurs' },
      { week: 17, category: 'pest',       task: 'Watch for hispa and whorl maggot' },
      { week: 19, category: 'harvest',    task: 'Harvest when grains are fully mature' },
    ],

    advisory: [
      'Aman is mostly rain-fed — monitor rainfall carefully',
      'Transplant before July 31 for best yield',
      'Flash flooding risk — choose flood-tolerant varieties like BRRI dhan52',
      'Avoid late transplanting — reduces yield significantly',
    ],
  },


  // ── Aus Rice ────────────────────────────────────────────────────────────────
  aus_rice: {
    id:       'aus_rice',
    name:     'Aus Rice',
    nameBn:   'আউশ ধান',
    season:   SEASONS.KHARIF_1,
    variety:  'BRRI dhan48 / BRRI dhan55 / Binadhan-19',
    duration: 100,

    perBigha: {
      seed:         6,
      yieldMaund:   12,
      yieldKg:      450,
      fertilizer: {
        urea:       22,
        tsp:        10,
        mop:         7,
      },
      irrigation_count: 8,
      pesticide_cost:   250,
    },

    tasks: [
      { week: 0,  category: 'land',       task: 'Dry land preparation — plow 2–3 times' },
      { week: 0,  category: 'sowing',     task: 'Direct seed sowing (broadcast or line sowing)' },
      { week: 1,  category: 'fertilizer', task: 'Apply TSP and half of MOP as basal dose' },
      { week: 3,  category: 'weeding',    task: '1st weeding — critical at this stage' },
      { week: 4,  category: 'fertilizer', task: 'Apply 1st dose of Urea' },
      { week: 5,  category: 'irrigation', task: 'Irrigate if no rainfall for 7+ days' },
      { week: 6,  category: 'fertilizer', task: 'Apply 2nd dose of Urea' },
      { week: 7,  category: 'weeding',    task: '2nd weeding' },
      { week: 8,  category: 'pest',       task: 'Inspect for gall midge and stem borer' },
      { week: 10, category: 'fertilizer', task: 'Apply remaining MOP and final Urea dose' },
      { week: 14, category: 'harvest',    task: 'Harvest — Aus matures faster than other rice' },
    ],

    advisory: [
      'Aus is drought-tolerant — suitable for areas with irregular water supply',
      'Line sowing gives better yield than broadcasting',
      'Harvest early to avoid pre-harvest losses from rain',
    ],
  },


  // ── Wheat ───────────────────────────────────────────────────────────────────
  wheat: {
    id:       'wheat',
    name:     'Wheat',
    nameBn:   'গম',
    season:   SEASONS.RABI,
    variety:  'BARI Gom-26 / BARI Gom-28 / BARI Gom-33',
    duration: 110,

    perBigha: {
      seed:         12,
      yieldMaund:   10,
      yieldKg:      375,
      fertilizer: {
        urea:       27,
        tsp:        14,
        mop:         9,
        gypsum:      5,
      },
      irrigation_count: 4,
      pesticide_cost:   200,
    },

    tasks: [
      { week: 0,  category: 'land',       task: 'Deep plowing and fine seedbed preparation' },
      { week: 0,  category: 'sowing',     task: 'Sow seeds in lines 20 cm apart (mid-November)' },
      { week: 0,  category: 'fertilizer', task: 'Apply TSP, MOP and Gypsum as basal dose' },
      { week: 2,  category: 'fertilizer', task: 'Apply 1st dose of Urea' },
      { week: 3,  category: 'irrigation', task: '1st irrigation — Crown Root Initiation (CRI) stage' },
      { week: 4,  category: 'weeding',    task: 'Weeding — wheat is sensitive to weed competition' },
      { week: 5,  category: 'fertilizer', task: 'Apply 2nd dose of Urea after 1st irrigation' },
      { week: 6,  category: 'irrigation', task: '2nd irrigation — tillering stage' },
      { week: 8,  category: 'pest',       task: 'Watch for wheat blast — most critical disease in Bangladesh' },
      { week: 9,  category: 'irrigation', task: '3rd irrigation — booting stage' },
      { week: 11, category: 'irrigation', task: '4th irrigation — grain filling' },
      { week: 15, category: 'harvest',    task: 'Harvest when golden yellow — avoid delayed harvest' },
    ],

    advisory: [
      'Sow between Nov 15–30 for best yield — late sowing reduces yield sharply',
      'Wheat blast is a major threat — use BARI Gom-33 (blast-resistant)',
      'Do not overwater — waterlogging kills wheat',
      'Timely harvest critical — delayed harvest causes grain shattering',
    ],
  },


  // ── Mustard ─────────────────────────────────────────────────────────────────
  mustard: {
    id:       'mustard',
    name:     'Mustard',
    nameBn:   'সরিষা',
    season:   SEASONS.RABI,
    variety:  'BARI Sarisha-14 / BARI Sarisha-17 / Binasarisha-4',
    duration: 85,

    perBigha: {
      seed:         0.5,    // kg — small seeds
      yieldMaund:   5,
      yieldKg:      188,
      fertilizer: {
        urea:       18,
        tsp:        12,
        mop:         8,
        gypsum:      6,
        boron:       1,     // kg — mustard needs boron
      },
      irrigation_count: 3,
      pesticide_cost:   150,
    },

    tasks: [
      { week: 0,  category: 'land',       task: 'Fine seedbed preparation — mustard needs firm, fine tilth' },
      { week: 0,  category: 'sowing',     task: 'Broadcast seeds thinly and mix into soil (Oct 15 – Nov 15)' },
      { week: 0,  category: 'fertilizer', task: 'Apply TSP, MOP, Gypsum and Boron as basal dose' },
      { week: 2,  category: 'thinning',   task: 'Thin seedlings — keep 10 cm spacing' },
      { week: 2,  category: 'fertilizer', task: 'Apply 1st dose of Urea' },
      { week: 3,  category: 'irrigation', task: '1st irrigation at rosette stage' },
      { week: 4,  category: 'weeding',    task: 'Weeding — mustard competes poorly with weeds' },
      { week: 4,  category: 'fertilizer', task: 'Apply 2nd dose of Urea' },
      { week: 5,  category: 'irrigation', task: '2nd irrigation at flowering stage — critical' },
      { week: 6,  category: 'pest',       task: 'Watch for aphids — most damaging pest of mustard' },
      { week: 7,  category: 'irrigation', task: '3rd irrigation at pod filling stage' },
      { week: 11, category: 'harvest',    task: 'Harvest when 75% of pods turn yellow' },
    ],

    advisory: [
      'Boron deficiency causes hollow stem — always apply Boron',
      'Aphid attack at flowering can destroy entire crop — monitor closely',
      'Do not harvest too late — pods shatter and seeds fall',
      'Ideal sowing window is Oct 15 – Nov 15 in Bangladesh',
    ],
  },


  // ── Jute ────────────────────────────────────────────────────────────────────
  jute: {
    id:       'jute',
    name:     'Jute',
    nameBn:   'পাট',
    season:   SEASONS.KHARIF_1,
    variety:  'BJC-7370 / OM-1 / Tossa Jute (CVE-3)',
    duration: 120,

    perBigha: {
      seed:         0.75,
      yieldMaund:   8,      // maunds of dry fiber
      yieldKg:      300,
      fertilizer: {
        urea:       20,
        tsp:        10,
        mop:         8,
      },
      irrigation_count: 3,
      pesticide_cost:   180,
    },

    tasks: [
      { week: 0,  category: 'land',       task: 'Deep plowing — jute needs well-drained loose soil' },
      { week: 0,  category: 'sowing',     task: 'Line sowing in March–April, 30 cm row spacing' },
      { week: 0,  category: 'fertilizer', task: 'Apply TSP and MOP as basal dose' },
      { week: 2,  category: 'thinning',   task: 'Thin seedlings to 7–8 cm plant spacing' },
      { week: 3,  category: 'weeding',    task: '1st weeding — jute is highly sensitive to weed competition early on' },
      { week: 3,  category: 'fertilizer', task: 'Apply 1st dose of Urea' },
      { week: 5,  category: 'weeding',    task: '2nd weeding' },
      { week: 5,  category: 'fertilizer', task: 'Apply 2nd dose of Urea' },
      { week: 7,  category: 'pest',       task: 'Inspect for jute semilooper caterpillar' },
      { week: 8,  category: 'fertilizer', task: 'Apply final dose of Urea' },
      { week: 10, category: 'pest',       task: 'Watch for stem rot and root rot in waterlogged areas' },
      { week: 14, category: 'harvest',    task: 'Cut at early pod stage for best fiber quality' },
      { week: 14, category: 'retting',    task: 'Bundle and ret in water for 10–15 days to extract fiber' },
    ],

    advisory: [
      'Retting quality depends on water — use slow-moving clean water',
      'Harvest before full flowering for soft, strong fiber',
      'Waterlogging causes stem rot — ensure drainage in early weeks',
      'Line sowing gives 15–20% more yield than broadcasting',
    ],
  },


  // ── Potato ──────────────────────────────────────────────────────────────────
  potato: {
    id:       'potato',
    name:     'Potato',
    nameBn:   'আলু',
    season:   SEASONS.RABI,
    variety:  'Diamant / Cardinal / BARI Alu-7 / Asterix',
    duration: 90,

    perBigha: {
      seed:         120,    // kg of seed tubers
      yieldMaund:   100,    // high-yield crop
      yieldKg:      3750,
      fertilizer: {
        urea:       35,
        tsp:        22,
        mop:        28,     // potatoes are heavy potassium feeders
        gypsum:      8,
        zinc_sulfate: 2,
      },
      irrigation_count: 6,
      pesticide_cost:   600, // late blight management is costly
    },

    tasks: [
      { week: 0,  category: 'land',       task: 'Deep tillage 30–35 cm — potato needs loose soil' },
      { week: 0,  category: 'sowing',     task: 'Plant seed tubers 20–25 cm apart in rows (Oct 15 – Nov 15)' },
      { week: 0,  category: 'fertilizer', task: 'Apply TSP, half of MOP, Gypsum and Zinc as basal' },
      { week: 2,  category: 'irrigation', task: '1st irrigation — light, just after planting' },
      { week: 3,  category: 'earthing',   task: 'Earthing up — mound soil around base of plants' },
      { week: 3,  category: 'fertilizer', task: 'Apply Urea and remaining MOP at earthing up' },
      { week: 4,  category: 'irrigation', task: '2nd irrigation' },
      { week: 5,  category: 'pest',       task: 'CRITICAL — inspect for Late Blight (Phytophthora)' },
      { week: 5,  category: 'weeding',    task: 'Weeding between rows' },
      { week: 6,  category: 'irrigation', task: '3rd irrigation — tuber bulking stage' },
      { week: 7,  category: 'pest',       task: 'Apply fungicide if Late Blight symptoms appear' },
      { week: 8,  category: 'irrigation', task: '4th irrigation' },
      { week: 10, category: 'irrigation', task: 'Stop irrigation 2 weeks before harvest' },
      { week: 12, category: 'harvest',    task: 'Harvest when foliage turns yellow — dig carefully' },
    ],

    advisory: [
      'Late Blight is the #1 threat — spray Mancozeb preventively every 7 days in cool humid weather',
      'Use certified disease-free seed tubers only',
      'Earthing up is critical — prevents greening of tubers',
      'Cold storage immediately after harvest to extend shelf life',
      'Heavy potassium feeder — never skip MOP application',
    ],
  },


  // ── Onion ───────────────────────────────────────────────────────────────────
  onion: {
    id:       'onion',
    name:     'Onion',
    nameBn:   'পেঁয়াজ',
    season:   SEASONS.RABI,
    variety:  'BARI Piaj-1 / BARI Piaj-2 / Taherpuri / Faridpuri',
    duration: 120,

    perBigha: {
      seed:         1.5,    // kg for transplant method
      yieldMaund:   45,
      yieldKg:      1688,
      fertilizer: {
        urea:       25,
        tsp:        18,
        mop:        20,
        gypsum:      6,
        boron:       1,
      },
      irrigation_count: 8,
      pesticide_cost:   350,
    },

    tasks: [
      { week: 0,  category: 'land',       task: 'Fine seedbed — raise nursery beds for transplanting' },
      { week: 0,  category: 'sowing',     task: 'Sow seeds in nursery bed (Oct–Nov)' },
      { week: 2,  category: 'fertilizer', task: 'Apply TSP, MOP, Gypsum and Boron as basal in main field' },
      { week: 5,  category: 'transplant', task: 'Transplant 40–45 day old seedlings to main field' },
      { week: 5,  category: 'irrigation', task: '1st irrigation immediately after transplanting' },
      { week: 6,  category: 'fertilizer', task: 'Apply 1st dose of Urea' },
      { week: 7,  category: 'weeding',    task: '1st weeding — onion cannot compete with weeds' },
      { week: 8,  category: 'irrigation', task: '2nd irrigation' },
      { week: 8,  category: 'fertilizer', task: 'Apply 2nd dose of Urea' },
      { week: 9,  category: 'pest',       task: 'Inspect for thrips — most damaging pest of onion' },
      { week: 10, category: 'irrigation', task: '3rd and 4th irrigation — bulb formation stage' },
      { week: 11, category: 'fertilizer', task: 'Apply final dose of Urea and remaining MOP' },
      { week: 12, category: 'weeding',    task: '2nd weeding' },
      { week: 14, category: 'irrigation', task: 'Stop irrigation 15 days before harvest' },
      { week: 16, category: 'harvest',    task: 'Harvest when tops fall over naturally — 70% of tops down' },
    ],

    advisory: [
      'Thrips are the most damaging pest — use Spinosad or Imidacloprid',
      'Purple blotch fungal disease — spray Iprodione if spotted',
      'Stop irrigation before harvest to improve storage quality',
      'Cure harvested onions in shade for 7–10 days before storage',
      'Never harvest in rain — causes rotting during storage',
    ],
  },
};

// ─── Helper functions ─────────────────────────────────────────────────────────

/**
 * Get all crops as an array (for dropdowns)
 */
export function getAllCrops() {
  return Object.values(CROPS);
}

/**
 * Get crops filtered by season
 * @param {string} seasonId - e.g. 'rabi', 'kharif_1', 'kharif_2'
 */
export function getCropsBySeason(seasonId) {
  return Object.values(CROPS).filter(c => c.season.id === seasonId);
}

/**
 * Get a single crop by id
 * @param {string} cropId - e.g. 'boro_rice'
 */
export function getCropById(cropId) {
  return CROPS[cropId] || null;
}