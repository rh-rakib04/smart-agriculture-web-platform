// ─── Bangladesh Crop Dataset ──────────────────────────────────────────────────
// All quantities are PER BIGHA unless stated otherwise.
// Sources: BRRI, BARI, DAE Bangladesh, BAMIS agricultural guidelines.
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
    variety:  'BRRI dhan28 / BRRI dhan29 / BRRI dhan58 / BRRI dhan74 / Binadhan-14',
    duration: 145,

    perBigha: {
      seed:          5,
      yieldMaund:    20,
      yieldKg:       750,
      fertilizer: {
        urea:        32,
        tsp:         14,
        mop:         10,
        gypsum:       5,
        zinc_sulfate: 1.5,
      },
      irrigation_count: 18,
      pesticide_cost:   400,
    },

    tasks: [
      { week: 0,  category: 'land',       task: 'Deep plowing (25–30 cm) using power tiller or tractor. Break all large clods, remove previous crop residues and weeds. Level the field with a land leveler to ensure uniform water distribution. Flood the field with 5–7 cm water and puddle thoroughly before final leveling.' },
      { week: 0,  category: 'sowing',     task: 'Prepare raised seedbeds (1 m wide, 10–15 cm high). Soak certified seeds (BRRI dhan28/29/58) in water for 24 hours, then incubate in gunny bags for 48 hours until radicle emerges. Broadcast pre-germinated seeds at 40 g/sq.m on the seedbed. Cover lightly with decomposed compost. Maintain thin water layer after 3 days.' },
      { week: 1,  category: 'fertilizer', task: 'Apply full dose of TSP (14 kg/bigha), MOP (5 kg — first half), Gypsum (5 kg), and Zinc Sulfate (1.5 kg) uniformly across the puddled field during final land preparation. Incorporate into the top 5–10 cm soil layer by light raking before transplanting. These are basal doses and should not be skipped.' },
      { week: 3,  category: 'transplant', task: 'Transplant 25–30 day old seedlings when they reach 20–25 cm height. Use 2–3 seedlings per hill, planted at 20 cm × 15 cm spacing in straight rows. Transplant to a depth of 3–5 cm in puddled soil. Maintain 2–3 cm standing water in the field. Complete transplanting within 5 days for uniform crop establishment. Replant missing hills within 7 days of transplanting.' },
      { week: 4,  category: 'irrigation', task: 'Maintain continuous 3–5 cm water depth in the field during the early establishment phase (first 2 weeks after transplanting). Check field bunds daily for leaks. Use AWD (Alternate Wetting and Drying) method after establishment to save water — allow soil to dry until 15 cm below ground before re-irrigating. Do not allow field to crack during tillering.' },
      { week: 5,  category: 'fertilizer', task: 'Apply 1st dose of Urea (10–11 kg/bigha — one-third of total 32 kg). Broadcast uniformly when there is 2–3 cm standing water in the field so granules dissolve and spread evenly. Do not apply urea if rain is forecast within 24 hours as it will leach. Close field drain openings before application and keep water standing for at least 3 days afterward.' },
      { week: 6,  category: 'weeding',    task: '1st weeding — remove all weeds by hand or using a cono-weeder between rows. Weeds at this stage compete intensely for nutrients. Alternatively, apply pre-emergence herbicide (Butachlor 50EC at 1.7 liters/bigha) if weed pressure is very high, 3–5 days after transplanting when field has a thin water layer. Remove sedges and broadleaf weeds by hand even after herbicide use.' },
      { week: 8,  category: 'fertilizer', task: 'Apply 2nd dose of Urea (10–11 kg/bigha — second third of total). This coincides with the active tillering stage (25–35 days after transplanting). Timing is critical — apply when most tillers have appeared. Broadcast on standing 3–5 cm water. This dose directly boosts tiller number and increases the number of productive panicles per plant.' },
      { week: 8,  category: 'irrigation', task: 'Tillering stage — maintain consistent 3–5 cm water depth. This is the most water-critical vegetative stage. Irrigate every 5–7 days if rainfall is insufficient. Drain the field for 5–7 days mid-tillering to suppress unproductive tillers, then re-irrigate. Install a simple pipe or PVC tube to monitor soil water level using the AWD technique.' },
      { week: 10, category: 'pest',       task: 'Conduct thorough field inspection for Brown Plant Hopper (BPH) — check the base of tillers. BPH threshold: 10 or more per hill requires immediate action. Also check for Stem Borer egg masses and dead hearts (tubular, dry central tillers that pull out easily). For BPH: apply Imidacloprid 20SL (0.5 ml/liter) directed at the base. For Stem Borer: apply Cartap Hydrochloride or Chlorpyrifos. Avoid broad-spectrum insecticides that kill natural enemies.' },
      { week: 11, category: 'fertilizer', task: 'Apply 3rd and final dose of Urea (10–11 kg/bigha — final third) at panicle initiation stage (PI), approximately 45–50 days after transplanting. PI can be identified by the slight swelling at the base of the main tiller. This final Urea dose is the most critical for grain filling, protein content, and maximum yield. Apply on a calm, cloudy day. Do not apply if flowering has begun as it will cause unfilled grains.' },
      { week: 12, category: 'weeding',    task: '2nd weeding if weed pressure remains. By this stage crop canopy usually suppresses weeds, but check inter-row spaces. Focus on removing sedges and tall broadleaf weeds that can still compete at this stage. Avoid disturbing roots by hoeing too deep. Use weed hooks or hand-pull. Apply MOP 2nd dose (remaining 5 kg/bigha) if not previously applied.' },
      { week: 14, category: 'irrigation', task: 'Grain filling and heading stage — maintain 5–7 cm water depth continuously. This is the second most water-critical stage after tillering. Drought stress during heading causes empty grains (chaff) and reduces yield by 20–40%. Irrigate every 3–4 days. If using AWD, stop the practice during this stage and keep the field flooded until grain dough stage.' },
      { week: 16, category: 'pest',       task: 'Inspect for Rice Blast (Magnaporthe oryzae) on leaves and neck (neck blast is devastating at this stage). Symptoms: diamond-shaped lesions with gray centers on leaves; brown-black constriction at the neck just below the panicle. Also check for Sheath Blight (brown water-soaked patches on leaf sheaths). For blast: apply Tricyclazole 75WP (0.6 g/liter) immediately. For Sheath Blight: apply Hexaconazole or Propiconazole. Spray in the evening for better absorption.' },
      { week: 18, category: 'irrigation', task: 'Stop all irrigation 10–12 days before the expected harvest date to allow the field to dry and facilitate harvest operations. A dry field prevents lodging, reduces grain moisture content faster, and allows mechanized harvesting. Draining too early (>15 days) can reduce grain weight. Check that all field drains are fully open. Monitor weather — if unexpected rain floods the field, drain promptly.' },
      { week: 20, category: 'harvest',    task: 'Harvest when 80–85% of grains in each panicle have turned golden yellow (approximately 30 days after full heading). Moisture content should be 20–25% for safe threshing. Harvest in the morning to avoid heat stress on laborers and grain shattering. Use sickles for hand harvesting or a power reaper for mechanized cutting. Thresh within 24 hours of cutting. Sun-dry threshed grain to 12–14% moisture before storage or milling. Store in moisture-proof bags in a cool, dry place.' },
    ],

    advisory: [
      'Use only certified, disease-free seeds from BADC or recognized seed dealers — farm-saved seed should be soaked in salt water (1 kg salt in 10 liters) to remove inferior seeds that float',
      'AWD (Alternate Wetting and Drying) can save 25–30% irrigation water without yield loss — consult DAE for the simple field water tube installation',
      'BPH outbreak is most likely in weeks 8–12 — inspect every 5 days and use selective insecticides (Imidacloprid, Thiamethoxam) to protect natural enemies like spiders',
      'Zinc deficiency (orange-brown patches on young leaves in the first 3 weeks) — apply Zinc Sulfate foliar spray at 0.5% solution if basal dose was missed',
      'Neck blast at heading can destroy 50–70% of yield in a single week — apply Tricyclazole preventively if weather is cool (below 25°C) and humid during heading',
      'Never apply Urea just before or during rainfall — leaching and volatilization will waste up to 40% of the fertilizer',
    ],
  },


  // ── Aman Rice ───────────────────────────────────────────────────────────────
  aman_rice: {
    id:       'aman_rice',
    name:     'Aman Rice',
    nameBn:   'আমন ধান',
    season:   SEASONS.KHARIF_2,
    variety:  'BRRI dhan49 / BRRI dhan52 / BRRI dhan75 / BR11 / Binadhan-7 / BRRI dhan87 (saline tolerant)',
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
      irrigation_count: 6,
      pesticide_cost:   300,
    },

    tasks: [
      { week: 0,  category: 'land',       task: 'Plow the field 2–3 times using power tiller, allowing each plowing to weather for 3–5 days. Puddle the field with standing water to destroy weeds and create an anaerobic layer that reduces water percolation. Level the field carefully — uneven fields lead to patchy water distribution and uneven crop growth. Repair all bunds to retain monsoon rainwater.' },
      { week: 0,  category: 'sowing',     task: 'Raise seedlings in dedicated seedbed in June–July. Prepare the seedbed at 1:10 ratio (1 decimal seedbed for 10 decimal field). Treat seeds with Trichoderma or Bavistin (1 g/kg) to prevent damping-off. Broadcast pre-germinated seeds evenly at 40 g/sq.m. Apply a thin layer of decomposed cow dung on top. Protect seedlings from heavy rain with a temporary shade net if available.' },
      { week: 1,  category: 'fertilizer', task: 'Apply TSP (11 kg/bigha), MOP (4 kg — first half), and Gypsum (4 kg) as basal doses during final puddling. These nutrients are relatively immobile in soil so basal application is essential. For varieties with long duration (BR11), also apply 2 kg/bigha Zinc Sulfate if zinc deficiency history exists in the field.' },
      { week: 3,  category: 'transplant', task: 'Transplant 20–25 day old seedlings (maximum 30 days). Younger seedlings establish faster and tiller more vigorously in Aman season. Use 3–4 seedlings per hill at 20 cm × 20 cm spacing. Transplant when floodwater has receded to manageable depth (less than 30 cm). In flood-prone areas, use BRRI dhan52 (Sub1 gene) which can survive 14 days submergence. Complete transplanting before July 31 for best yield.' },
      { week: 4,  category: 'fertilizer', task: 'Apply 1st dose of Urea (8 kg/bigha — approximately one-third of total). Apply 10–14 days after transplanting when crop has established and new roots are developing. Broadcast on standing water in the morning. This first urea application drives early vegetative growth and tillering initiation. Do not apply Urea if heavy rain (>25 mm) is expected within 48 hours.' },
      { week: 5,  category: 'weeding',    task: '1st weeding at 15–20 days after transplanting. Aman weed pressure is high due to monsoon warmth and humidity. Use a cono-weeder between rows for line-planted crops. Hand-pull sedges and broadleaf weeds around plants. Alternatively, apply Ethoxysulfuron or Pyrazosulfuron herbicide. Control of barnyard grass (Echinochloa) at this stage is critical as it aggressively competes for nutrients.' },
      { week: 7,  category: 'fertilizer', task: 'Apply 2nd dose of Urea (8–9 kg/bigha) at the tillering stage (28–35 days after transplanting). Broadcast uniformly on standing water. This dose is critical for maximizing the number of productive tillers. If supplemental irrigation is not available and field is dry due to no rainfall, wait for rain before applying to avoid burning.' },
      { week: 9,  category: 'pest',       task: 'Inspect for Leaf Folder (Cnaphalocrocis medinalis) — look for folded leaves with frass inside. Economic threshold: 25% infested tillers in vegetative stage. Also watch for Neck Blast — inspect flag leaf and neck junction. Whorl Maggot damage appears as central leaf holes. For Leaf Folder: Chlorpyrifos 20EC (2 ml/liter) or Cartap. For blast symptoms: Tricyclazole 75WP immediately. Remove and destroy infected plant parts.' },
      { week: 10, category: 'fertilizer', task: 'Apply 3rd and final dose of Urea (8–9 kg/bigha) at Panicle Initiation (PI) stage — about 40–50 days after transplanting. PI can be felt by gently pressing the tiller base to detect a small hard node forming. This dose ensures maximum grain number per panicle and proper grain filling. Do not delay beyond PI stage as it will not improve yield and may cause lodging.' },
      { week: 13, category: 'irrigation', task: 'Supplemental irrigation if dry spell exceeds 7 consecutive days. Aman is primarily rain-fed but drought during heading and flowering is extremely damaging. If weather forecast shows no rain for 10+ days, irrigate at least once (5–7 cm). Monitor soil — if cracks appear, irrigate immediately. Keep field moist but not necessarily flooded during grain filling.' },
      { week: 17, category: 'pest',       task: 'Final pest inspection — watch for Hispa (leaf-mining beetle, scraped whitish patches on upper leaf surface), Whorl Maggot (central leaf holes in young tillers), and Bacterial Leaf Blight (BLB, water-soaked leaf margins turning yellow-white, starting from tips). BLB spreads rapidly in humid weather. For BLB: no chemical cure — drain field, stop nitrogen, and apply potash. For Hispa: Cypermethrin spray.' },
      { week: 19, category: 'harvest',    task: 'Harvest when 80% of grains are fully ripe — golden yellow, firm, and resistant to thumbnail pressure. Do not delay harvest as overripe grains shatter and bird damage increases significantly. Harvest in the morning. Use sickle at 15–20 cm above ground level. Tie cut stalks in bundles and dry on the field for 1–2 days before threshing. Sun-dry threshed grain to 12–14% moisture within 3–4 days.' },
    ],

    advisory: [
      'Aman is predominantly rain-fed — transplant by July 31 to maximize the growing season before the monsoon withdraws',
      'In flash-flood-prone chars and haors, always use BRRI dhan52 (Sub1) which survives 14 days submergence — this single choice can save the entire crop',
      'BLB (Bacterial Leaf Blight) spreads rapidly in the humid Aman season — avoid excess nitrogen, drain field immediately when symptoms appear',
      'Monitor rainfall daily — supplemental irrigation at heading (week 13) is high-return if water source is available nearby',
      'Harvest promptly at maturity — each day of delay after 80% grain ripeness increases bird and rodent damage significantly',
    ],
  },


  // ── Aus Rice ────────────────────────────────────────────────────────────────
  aus_rice: {
    id:       'aus_rice',
    name:     'Aus Rice',
    nameBn:   'আউশ ধান',
    season:   SEASONS.KHARIF_1,
    variety:  'BRRI dhan48 / BRRI dhan55 / BRRI dhan65 / Binadhan-19 / BRRI dhan82 (drought tolerant)',
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
      { week: 0,  category: 'land',       task: 'Dry land preparation — plow 2–3 times using power tiller. Allow first plowing to weather for 5–7 days for good weed kill. Prepare a fine, firm seedbed with even surface. Aus can be direct-seeded, so seedbed quality directly determines germination uniformity. Break all clods and level perfectly. In upland Aus areas, apply organic matter (1–2 kg compost/sq.m) during preparation.' },
      { week: 0,  category: 'sowing',     task: 'Direct seeding in lines (row spacing: 20–25 cm) or broadcast method. Line sowing with a seed drill gives 15–20% higher yield than broadcasting. Sow pre-soaked seeds (soaked 24 hours, dried to surface-dry) at 6 kg/bigha. Sowing depth: 2–3 cm. Cover seeds lightly with soil and firm down. Optimum sowing time: mid-March to mid-April. For drought-prone upland areas, choose BRRI dhan65 or Binadhan-19.' },
      { week: 1,  category: 'fertilizer', task: 'Apply TSP (10 kg/bigha) and first half of MOP (3.5 kg) as basal dose during final land preparation or mixed into seed furrows. For Aus rice on upland soils with organic matter deficiency, also apply 1–2 kg/bigha Zinc Sulfate. Incorporate fertilizers to 5–8 cm depth by raking or harrowing immediately after broadcasting.' },
      { week: 3,  category: 'weeding',    task: '1st weeding at 15–20 days after sowing — the most critical weed management operation in Aus rice. Barnyard grass (Echinochloa crus-galli) is the primary weed and can cause 40–80% yield loss if not controlled. Use a wheel hoe or hand hoe between rows. Hand-pull weeds close to crop rows. In heavily infested fields, apply Butachlor 50EC (1.5 liters/bigha) 5–7 days after seeding while soil is moist.' },
      { week: 4,  category: 'fertilizer', task: 'Apply 1st dose of Urea (7 kg/bigha — approximately one-third of total 22 kg). Apply when crop has 3–4 leaves (about 20–25 days after seeding). Broadcast in the morning on moist soil or standing water. This first nitrogen application drives early vegetative growth and tillering. Do not apply if heavy rain expected within 24 hours.' },
      { week: 5,  category: 'irrigation', task: 'Irrigate if there has been no significant rainfall (>15 mm) for 7 or more consecutive days. Aus is drought-tolerant but not drought-proof — water stress during tillering reduces yield significantly. Apply 5–7 cm of water and allow natural drainage. In areas with pump irrigation, monitor soil moisture at 5 cm depth — irrigate when soil feels dry. Maintain a simple rain gauge at the field edge.' },
      { week: 6,  category: 'fertilizer', task: 'Apply 2nd dose of Urea (7–8 kg/bigha) at active tillering stage (35–40 days after seeding). Broadcast uniformly in the morning on moist or slightly standing water. This is the yield-building dose — it determines the number of productive panicles. Apply remaining MOP (3.5 kg/bigha) together with this urea dose for potassium-boosted grain filling.' },
      { week: 7,  category: 'weeding',    task: '2nd weeding at 40–45 days after seeding. At this stage, crop canopy is forming but late-emerging weeds can still compete. Focus on removing tall sedges and broadleaf weeds that escape the first weeding. Use a sickle to cut tall weeds between rows without disturbing root zone. This weeding also improves air circulation and reduces pest and disease pressure.' },
      { week: 8,  category: 'pest',       task: 'Inspect for Gall Midge (Orseolia oryzae) — affected tillers form silver shoots (trumpet leaves) that do not unfurl. Economic threshold: 5% silver shoots. Also check for Yellow Stem Borer — look for dead hearts in vegetative stage. For Gall Midge: Carbofuran 5G (1.5 kg/bigha) applied at the base of plants in standing water. For Stem Borer: Cartap Hydrochloride 50SP at 0.5 kg/bigha. Remove and destroy all affected silver shoots immediately.' },
      { week: 10, category: 'fertilizer', task: 'Apply final (3rd) dose of Urea (7 kg/bigha) at Panicle Initiation stage (about 55–60 days after seeding) combined with remaining MOP if not previously applied. This dose is critical for ensuring large panicles with many filled grains. Identify PI by feeling the swollen internode at the base of the flag leaf tiller. Apply on standing water and maintain for 3 days.' },
      { week: 14, category: 'harvest',    task: 'Harvest when 80–85% of grains turn golden yellow and are hard (resist thumbnail). Aus matures faster than Aman or Boro (90–105 days). Harvest promptly — delayed harvest in pre-monsoon conditions causes lodging, grain shattering, and bird damage. Use sickles and harvest in the morning to avoid heat. Thresh within 24 hours. Dry to 12–14% moisture before storage. Store in cool, dry, rodent-proof structures.' },
    ],

    advisory: [
      'Aus is the most drought-tolerant rice season — ideal for areas with uncertain or delayed irrigation access',
      'Line sowing (20–25 cm rows) rather than broadcasting gives 15–20% higher yield and makes weeding much easier',
      'Harvest before the monsoon arrives fully — delayed harvest risks losses from sudden flooding and lodging',
      'Gall Midge is unique to Aus season — inspect every week from week 4 and act immediately at 5% silver shoot incidence',
      'Aus on upland rainfed fields benefits greatly from conserving rainwater with proper field bunding — even one extra irrigation at tillering can add 2–3 maunds yield',
    ],
  },


  // ── Wheat ───────────────────────────────────────────────────────────────────
  wheat: {
    id:       'wheat',
    name:     'Wheat',
    nameBn:   'গম',
    season:   SEASONS.RABI,
    variety:  'BARI Gom-26 / BARI Gom-28 / BARI Gom-33 (blast-resistant) / BARI Gom-30 / WB Surjomukhi',
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
      { week: 0,  category: 'land',       task: 'Deep plowing (20–25 cm) followed by 2–3 cross harrowings to achieve a fine, crumbly seedbed. Wheat requires a well-structured, clod-free seedbed for uniform germination. Plow 10–15 days before sowing to allow the soil to settle and dry to optimal moisture. Incorporate 1–2 tons/bigha of well-decomposed farmyard manure or compost. Level the field perfectly — uneven fields cause waterlogging in low spots which kills wheat seedlings rapidly.' },
      { week: 0,  category: 'sowing',     task: 'Sow seeds in straight rows 20 cm apart using a seed drill or furrow-and-cover method at 2–3 cm depth. Seed rate: 12 kg/bigha for line sowing. Sowing window: November 15–30 is optimal in Bangladesh. Each day of delay after December 1 reduces yield by about 1% per day due to shortening of growing season and increased temperature stress during grain filling. Treat seeds with Vitavax 200 (2 g/kg) before sowing to prevent seed-borne diseases.' },
      { week: 0,  category: 'fertilizer', task: 'Apply full doses of TSP (14 kg/bigha), MOP (9 kg), and Gypsum (5 kg) as basal during final seedbed preparation. Incorporate into the top 10–15 cm using a harrow or rotavator. Phosphorus from TSP is essential for root development and cannot be applied later effectively. Also apply half the total Urea (13–14 kg) as basal on soils with low organic matter.' },
      { week: 2,  category: 'fertilizer', task: 'Apply remaining Urea (13–14 kg/bigha) if full basal was not applied, or apply the first top-dressing dose. Broadcast Urea uniformly by hand in the morning. Urea top-dressing is most effective when soil is moist after irrigation. For maximum nitrogen use efficiency, use USG (Urea Super Granule) deep placement at 5–7 cm depth near rows instead of surface broadcasting.' },
      { week: 3,  category: 'irrigation', task: '1st irrigation at Crown Root Initiation (CRI) stage — 20–25 days after sowing. CRI stage is the single most critical irrigation for wheat in Bangladesh. Missing this irrigation can reduce yield by 25–35%. Apply a controlled light irrigation (4–5 cm only) to avoid waterlogging. A "gentle" irrigation avoids washing soil off exposed seedling crowns. Irrigate in the morning or evening, not midday.' },
      { week: 4,  category: 'weeding',    task: 'Weeding at 25–30 days after sowing. Wheat is highly sensitive to weed competition especially in the first 30 days. Phalaris minor (Kanunga grass) and wild oats are most damaging. Hand-weed carefully between rows using khurpi. For chemical control: apply Isoproturon 75WP (200 g/bigha) 30–35 days after sowing for broadleaf and grass weeds, mixed with a little water. Avoid disturbing roots while weeding.' },
      { week: 5,  category: 'fertilizer', task: 'Apply top-dressing Urea (if not fully applied at week 2) after CRI irrigation. Urea applied on moist soil after CRI irrigation has the best absorption rate. Broadcast 13–14 kg/bigha uniformly. Avoid Urea application during windy conditions to prevent volatilization. In sandy soils, split Urea into 3 smaller doses to reduce leaching losses.' },
      { week: 6,  category: 'irrigation', task: '2nd irrigation at late tillering stage (40–50 days after sowing). This irrigation supports continued tiller development and sets the maximum number of ears per plant. Apply 5–6 cm water. Monitor next 7 days for temperature — if it drops below 15°C at night (cold spell), delay this irrigation by 3–5 days as cold+waterlogging is extremely damaging to wheat roots.' },
      { week: 8,  category: 'pest',       task: 'CRITICAL: Inspect for Wheat Blast (Magnaporthe triticum) — the most devastating disease in Bangladesh wheat. Symptoms: bleached spikelets with black/gray fungal sporulation, grain shriveling. Inspect at heading. Also check for Aphids (small green/yellow insects clustering on stems and ears) which cause direct damage and transmit BYD virus. For Blast: apply Tilt (Propiconazole) or Nativo immediately. For Aphids: Imidacloprid spray at threshold of 10 aphids/tiller. Use BARI Gom-33 in blast-prone zones.' },
      { week: 9,  category: 'irrigation', task: '3rd irrigation at booting stage (50–60 days after sowing) when the flag leaf is fully emerged and the head is enclosed in the flag leaf sheath. This stage coincides with meiosis (pollen and egg cell formation) — water stress here causes pollen sterility and unfilled grains. Apply 5–6 cm water gently. Avoid waterlogging. Check field for proper drainage within 24 hours after irrigation.' },
      { week: 11, category: 'irrigation', task: '4th and final irrigation at early grain filling (milk to dough stage, about 70–80 days after sowing). This irrigation ensures plump, heavy grains. Apply a light 4–5 cm irrigation. Do not irrigate after the dough stage as it softens the grain and promotes disease. If the season has been unusually dry and hot, this irrigation is especially critical. After this irrigation, let the field dry naturally for harvest.' },
      { week: 15, category: 'harvest',    task: 'Harvest when grain is hard, golden yellow, and moisture is below 20% (typically 100–115 days after sowing). Test ripeness by pressing a grain between thumbnail and forefinger — no indent should remain. Harvest with sickle cutting near the base of the straw, or use a reaper-binder for mechanized harvesting. Avoid late harvest — yield loss from shattering can be 1–2% per day after full maturity. Thresh promptly and dry grain to 12% moisture before storage in airtight bags.' },
    ],

    advisory: [
      'Sow only between November 15–30 — each day of delay beyond December 1 reduces yield by 1%; late-sown wheat suffers terminal heat stress during grain filling in March',
      'Wheat Blast (Magnaporthe triticum) has spread rapidly across Bangladesh since 2016 — use BARI Gom-33 (blast-resistant) in affected districts of Meherpur, Chuadanga, Jessore, Rajshahi',
      'Never allow waterlogging even briefly — wheat roots die within 24 hours under waterlogged conditions; check field drainage after every irrigation',
      'The CRI irrigation (week 3) is the single most yield-critical operation in wheat — do not miss it under any circumstances',
      'USG (Urea Super Granule) deep placement reduces nitrogen loss by 30% compared to surface urea broadcasting and significantly improves yield',
    ],
  },


  // ── Maize ───────────────────────────────────────────────────────────────────
  maize: {
    id:       'maize',
    name:     'Maize',
    nameBn:   'ভুট্টা',
    season:   SEASONS.RABI,
    variety:  'BARI Hybrid Mais-9 / BARI Hybrid Mais-13 / Pacific-984 / NK-40 / Heera-272',
    duration: 120,

    perBigha: {
      seed:         1.5,
      yieldMaund:   35,
      yieldKg:      1312,
      fertilizer: {
        urea:       45,
        tsp:        22,
        mop:        18,
        gypsum:      8,
        zinc_sulfate: 2,
        boron:       1,
      },
      irrigation_count: 6,
      pesticide_cost:   350,
    },

    tasks: [
      { week: 0,  category: 'land',       task: 'Deep tillage to 30–35 cm — maize has a deep taproot system and requires loose, well-aerated soil. Plow at least twice with reversal of direction. Apply and incorporate well-decomposed cow dung (500–600 kg/bigha) or poultry manure (200–250 kg/bigha) as organic amendment before sowing. This is especially important in soils used for continuous rice cultivation that have become compacted.' },
      { week: 0,  category: 'sowing',     task: 'Sow seeds in furrows at 60 cm × 25 cm spacing (row-to-row 60 cm, plant-to-plant 25 cm) or 75 cm × 20 cm for larger varieties. Seed depth: 4–5 cm. Use 1–2 seeds per hill. Sowing time: October 15 – November 30 for Rabi maize. Treat seeds with fungicide (Thiram or Mancozeb at 2 g/kg) before sowing. For Kharif-1 maize: sow March–April. Mechanized seed drills improve uniformity significantly.' },
      { week: 0,  category: 'fertilizer', task: 'Apply full basal dose at land preparation: TSP (22 kg/bigha), MOP — first half (9 kg), Gypsum (8 kg), Zinc Sulfate (2 kg), Boron (1 kg). Apply half the Urea (22 kg) in the furrow as basal, mixed with soil 5–10 cm below seed level to prevent seedling burn. Mix all non-urea fertilizers thoroughly into soil before forming planting ridges.' },
      { week: 2,  category: 'thinning',   task: 'Thin seedlings to 1 plant per hill at 2–3 leaf stage (14–18 days after sowing). Leave only the strongest, most vigorous seedling per position. Remove weak or spindly seedlings by cutting at ground level — do not pull as it disturbs neighbor roots. Thinning is non-negotiable in maize — competition between 2 plants in one hill reduces yield of both significantly. Gap-fill any missing spots using seedlings from densely-populated hills.' },
      { week: 3,  category: 'weeding',    task: '1st weeding at 20–25 days after sowing when maize is 25–35 cm tall. Maize is highly sensitive to weed competition in the first 40 days. Use inter-row hoeing (khurpi or wheel hoe) to control weeds and break surface crust for better water infiltration. For chemical control: apply Atrazine 50WP (250 g/bigha) 3–5 days after sowing as pre-emergence herbicide on moist soil. Avoid root damage while weeding — maize brace roots at soil surface are critical.' },
      { week: 3,  category: 'fertilizer', task: 'Apply 2nd dose of Urea (15 kg/bigha) at 5–6 leaf stage (20–25 days). Place Urea in 5 cm deep furrows alongside plant rows (banded application) rather than surface broadcasting to reduce volatilization losses by 30–40%. Cover furrow with soil after application. This timing coincides with rapid early vegetative growth.' },
      { week: 5,  category: 'irrigation', task: '1st major irrigation — maize requires uniform moisture throughout. If no rain in 10 days during vegetative stage, apply 5–8 cm furrow irrigation. Run water along furrows between rows to avoid wetting foliage. Install soil moisture tubes at 30 cm depth if available. In light sandy soils, irrigate every 7–8 days; in clay-loam soils, every 10–12 days if dry.' },
      { week: 6,  category: 'weeding',    task: '2nd weeding and earthing-up at 40–45 days after sowing. This is the final effective weeding — maize canopy will close and suppress further weeds. Use a ridger or spade to mound soil 10–15 cm around the base of each plant. Earthing-up (mitti chadano) is critical in maize — it anchors the brace roots, prevents lodging in wind, and creates proper furrows for irrigation.' },
      { week: 6,  category: 'fertilizer', task: 'Apply 3rd and final dose of Urea (8 kg/bigha) at tasseling/silking stage combined with remaining MOP (9 kg/bigha). This is the most yield-critical fertilizer timing in maize — it directly determines grain number and filling. Apply Urea in side-dress furrows and irrigate immediately afterward to move fertilizer into the root zone. Never surface-broadcast Urea without incorporating if no irrigation follows.' },
      { week: 7,  category: 'pest',       task: 'Inspect for Fall Armyworm (Spodoptera frugiperda) — the most serious new pest of maize in Bangladesh. Symptoms: window-pane feeding on leaves, sawdust-like frass in whorl, ragged holes. FAW can destroy an entire crop in days. Control at early instar: Emamectin benzoate 1.9EC (3.5 ml/liter) or Chlorantraniliprole (Coragen). Also watch for Stem Borer eggs under leaves. Spray in the whorl, not on leaf surface.' },
      { week: 8,  category: 'irrigation', task: 'CRITICAL irrigation at silking/tasseling (65–75 days) — this is the most water-sensitive stage in maize. Water stress during pollination causes barren cobs (empty ears) and can reduce yield by 50% or more. Ensure the field has adequate moisture for 10 days surrounding tasseling and silking. If no rain, irrigate 5–8 cm every 5–6 days during this window.' },
      { week: 10, category: 'irrigation', task: 'Irrigation during grain filling (dough stage) — maintain soil moisture for proper starch deposition in kernels. If no rain in 10 days, apply 5–7 cm irrigation. Reduce irrigation frequency as grain approaches black layer (physiological maturity). Stop all irrigation 15 days before harvest to allow field drying and faster grain moisture reduction.' },
      { week: 17, category: 'harvest',    task: 'Harvest at physiological maturity — when husk turns dry and brown, kernel black layer has formed, and grain moisture is 25–30%. Delay field harvest slightly if drying facilities are available, or harvest promptly and use mechanical dryers. Husk-peel each ear and sun-dry on raised platforms for 7–10 days. Shell with a maize sheller when moisture is below 15%. Store in cool, dry, ventilated stores. Aflatoxin contamination in improperly dried maize is a serious health hazard — dry promptly.' },
    ],

    advisory: [
      'Maize yields 2–3 times more per bigha than wheat on similar inputs — invest in quality hybrid seed from certified dealers for maximum return',
      'Fall Armyworm (FAW) has devastated maize crops across Bangladesh since 2018 — monitor whorls every 3 days from week 4 and act at first sign of window-pane feeding',
      'Banded Urea placement (in furrows alongside rows) is 30% more efficient than surface broadcasting — reduces costs and improves yield',
      'Never skip irrigation at tasseling/silking (week 8–9) — a single week of drought here can cut yield in half through barren cobs',
      'Aflatoxin contamination in poorly dried maize is a serious health risk — always dry to below 13% moisture before storage',
    ],
  },


  // ── Mustard ─────────────────────────────────────────────────────────────────
  mustard: {
    id:       'mustard',
    name:     'Mustard',
    nameBn:   'সরিষা',
    season:   SEASONS.RABI,
    variety:  'BARI Sarisha-14 / BARI Sarisha-17 / BARI Sarisha-18 / Binasarisha-4 / Tori-7',
    duration: 85,

    perBigha: {
      seed:         0.5,
      yieldMaund:   5,
      yieldKg:      188,
      fertilizer: {
        urea:       18,
        tsp:        12,
        mop:         8,
        gypsum:      6,
        boron:       1,
      },
      irrigation_count: 3,
      pesticide_cost:   150,
    },

    tasks: [
      { week: 0,  category: 'land',       task: 'Prepare a fine, firm, clod-free seedbed — mustard seeds are very small and need excellent soil-seed contact. Plow 2–3 times crosswise. Optimal seedbed has soil tilth similar to fine crumbs. Apply and incorporate 200–300 kg/bigha of well-decomposed organic matter. Last plowing should be shallow (10–12 cm) to leave adequate moisture in the seedbed. Level carefully — mustard is sensitive to waterlogging in low spots.' },
      { week: 0,  category: 'sowing',     task: 'Mix small seeds with dry sand (1:5 ratio) for uniform broadcasting. Broadcast thinly at 500 g/bigha. Cover seeds very lightly (1–2 cm) by light raking — deep burial of small seeds prevents emergence. Sowing window: October 15 – November 15. Alternatively, sow in lines 30 cm apart at 2 seeds/cm depth for better management. Water gently after sowing if soil is dry. Germination begins in 5–7 days.' },
      { week: 0,  category: 'fertilizer', task: 'Apply full basal doses at final land preparation: TSP (12 kg/bigha), MOP (8 kg), Gypsum (6 kg), and Boron (1 kg). Boron is non-negotiable for mustard — deficiency causes hollow stem disease. Mix all fertilizers thoroughly into the top 10 cm of soil. Apply half the Urea (9 kg) as basal. Gypsum provides sulfur essential for fatty acid synthesis in mustard oil.' },
      { week: 2,  category: 'thinning',   task: 'Thin seedlings to 10 cm plant-to-plant spacing when they have 2–3 true leaves (12–15 days after emergence). Remove weakest seedlings leaving one vigorous plant per 10 cm. Proper thinning significantly improves pod number per plant and oil content. Crowded plants are spindly and produce fewer pods. Remove thinned seedlings and use as animal fodder — they are nutritious greens.' },
      { week: 2,  category: 'fertilizer', task: 'Apply 1st top-dressing dose of Urea (9 kg/bigha — half of total) at thinning stage (15–20 days). Broadcast uniformly on moist soil in the morning. Water lightly if no rain. Urea at this stage drives rosette development and branching which determines pod-bearing capacity. This timing is critical — early enough to build plant structure before flowering.' },
      { week: 3,  category: 'irrigation', task: '1st irrigation at rosette stage (20–25 days after sowing). Apply 4–5 cm water by gentle flooding or furrow irrigation between rows. Mustard roots extend to only 30–40 cm depth, so deep irrigation is wasteful and promotes root disease. Monitor soil moisture at 20 cm — irrigate when this layer feels dry. In clay-loam soils, this single irrigation may carry the crop to flowering if winter rains are expected.' },
      { week: 4,  category: 'weeding',    task: 'Weed at 25–30 days after sowing — mustard\'s low canopy makes it highly vulnerable to weed competition until flowering when it closes. Hand-weed carefully close to plants; use khurpi between rows. Primary weeds: wild radish, chickweed, Phalaris. For chemical control: Quizalofop-p-ethyl (Targa Super 5EC at 20 ml/bigha + 10 liters water) for grass weeds 25 days after sowing. Never apply broadleaf herbicides — they damage mustard.' },
      { week: 5,  category: 'irrigation', task: '2nd irrigation at 50% flowering (35–40 days) — the single most critical irrigation in mustard. Water stress during flowering causes severe pod abortion and oil content reduction. Apply 4–5 cm water very gently to avoid lodging the already-tall plants. If flowering stage coincides with a dry, windy period (as often happens in north Bangladesh in January), this irrigation is absolutely essential.' },
      { week: 6,  category: 'pest',       task: 'CRITICAL: Inspect daily for Aphids (Lipaphis erysimi — mustard aphid) from bud initiation to pod filling. This is the most damaging pest of mustard in Bangladesh. Colonies of thousands of tiny yellow-green aphids cluster on young shoots, buds, flowers and pods. Economic threshold: 30 aphids/plant. Spray Dimethoate 40EC (1.5 ml/liter) or Imidacloprid 70WG. Spray in the morning on a calm day. Repeat after 7–10 days if infestation persists. Protect flowering plants from spray drift.' },
      { week: 7,  category: 'irrigation', task: '3rd irrigation at pod filling stage (50–55 days) — necessary in dry years to plump the seeds fully. Apply only 3–4 cm of water. Too much water at this stage can cause root rot and flatten the standing crop. If weather forecast shows rain within 5 days, skip this irrigation. Stop all irrigation once pods start turning yellow-green.' },
      { week: 11, category: 'harvest',    task: 'Harvest when 75–80% of pods have turned yellow (the crop will appear golden from a distance). Do not wait for all pods to turn yellow — overripe pods shatter violently in even mild wind, causing significant seed loss. Harvest in the early morning when pods are less likely to shatter. Cut stalks near the base and lay in windrows to dry in the field for 2–3 days. Then thresh by beating bundles on a hard surface or with a thresher. Winnow and sun-dry seeds to 8–10% moisture before storage.' },
    ],

    advisory: [
      'Boron deficiency is endemic in many Bangladesh soils — hollow stem (no seeds in pods) is the symptom; always apply 1 kg/bigha Boron at sowing, even if no deficiency was previously observed',
      'Aphid attack at flowering (weeks 6–7) can destroy 50–100% of the crop in 7–10 days — daily monitoring and early intervention with Dimethoate is essential',
      'Harvest timing is critical — pods shatter and seeds fall at the slightest disturbance once fully ripe; harvest at 75% yellowing',
      'Mustard intercropped with lentil (1:1 row alternation) controls weeds, uses nitrogen fixed by lentil, and gives combined income — a proven system in Rajshahi and Dinajpur',
      'BARI Sarisha-17 and Sarisha-18 are high-oil-content varieties (42–43% oil) — prioritize these for oil extraction; Tori-7 matures in 75 days and is ideal for short-season cropping',
    ],
  },


  // ── Lentil ──────────────────────────────────────────────────────────────────
  lentil: {
    id:       'lentil',
    name:     'Lentil',
    nameBn:   'মসুর',
    season:   SEASONS.RABI,
    variety:  'BARI Masur-3 / BARI Masur-6 / BARI Masur-8 / Binamasur-4 / Binamasur-8',
    duration: 110,

    perBigha: {
      seed:         8,
      yieldMaund:   5,
      yieldKg:      188,
      fertilizer: {
        urea:        8,   // low N — legume fixes its own nitrogen
        tsp:        12,
        mop:         6,
        gypsum:      5,
        zinc_sulfate: 1,
      },
      irrigation_count: 2,
      pesticide_cost:   120,
    },

    tasks: [
      { week: 0,  category: 'land',       task: 'Prepare a well-drained, fine-tilth seedbed. Lentil is extremely sensitive to waterlogging — raised beds or ridge-furrow planting is recommended in heavy clay soils. Plow 2–3 times to 20 cm depth and harrow to break clods. Avoid deep tillage that brings infertile subsoil to surface. On Aman paddy fallows (typical in Bangladesh), a single shallow tillage with a rotavator may be sufficient if Aman was harvested timely.' },
      { week: 0,  category: 'sowing',     task: 'Inoculate seeds with Rhizobium lentis inoculant (10 g/kg seed) to ensure maximum biological nitrogen fixation — this can replace 5–6 kg/bigha of Urea. Allow inoculated seeds to dry in shade for 1 hour before sowing. Sow in lines 25–30 cm apart at 3–4 cm depth, seed-to-seed distance 5–7 cm. Sowing time: October 25 – November 25. Broadcast sowing is also common but line sowing enables mechanical weeding.' },
      { week: 0,  category: 'fertilizer', task: 'Apply all fertilizers as basal at sowing: TSP (12 kg/bigha), MOP (6 kg), Gypsum (5 kg), Zinc Sulfate (1 kg), and Urea (8 kg — lower than other crops because lentil fixes 40–60 kg N/ha from the air via rhizobia). Do not over-apply nitrogen — excess N suppresses nodule formation and biological nitrogen fixation. Phosphorus (TSP) is the most yield-limiting nutrient for lentil in Bangladesh.' },
      { week: 2,  category: 'weeding',    task: '1st weeding at 15–20 days after sowing. Lentil\'s slow early growth makes it highly susceptible to weed smothering in the first 30 days. Hand-weed between rows using a khurpi. Be very careful not to disturb shallow lentil roots (only 15–20 cm deep). For chemical control: Imazethapyr 10SL (30 ml/bigha + 10 liters water) applied 15–20 days after sowing controls a broad spectrum of weeds.' },
      { week: 3,  category: 'irrigation', task: '1st irrigation at branching/vegetative stage (25–30 days after sowing) if soil feels dry at 10 cm depth. Lentil requires only 2 irrigations in the entire season in most Bangladesh conditions. Apply a very light, gentle 3–4 cm irrigation — never flood the field. Standing water for even 24 hours at any growth stage can cause complete crop failure from root rot.' },
      { week: 5,  category: 'pest',       task: 'Monitor for Aphids (Aphis craccivora) from 35 days after sowing — they cluster on growing tips and cause curling and yellowing. Also watch for Lentil Rust (Uromyces fabae) — orange-brown pustules on leaves and stems. For aphids: Imidacloprid 70WG (0.5 g/liter) spray. For rust: Propiconazole (Tilt 250EC at 0.5 ml/liter) spray. Also check for stem rot (Sclerotinia) in humid conditions — remove affected plants.' },
      { week: 7,  category: 'irrigation', task: '2nd and final irrigation at flowering and pod formation stage (50–60 days after sowing). This is the most critical growth stage for lentil yield — water stress here causes flower drop and pod abortion. Apply only 3–4 cm water very gently. After this irrigation, no more water is needed. Lentil uses residual soil moisture for grain filling if seedbed moisture was conserved properly.' },
      { week: 9,  category: 'pest',       task: 'Inspect for Pod Borer (Helicoverpa armigera) — larvae bore into developing pods and eat seeds. Spray Indoxacarb 14.5SC (1 ml/liter) or Spinosad 45SC (0.5 ml/liter) if 3 or more larvae are found per 10 plants. Also watch for Thrips damaging flowers — small, slender insects in flower heads. Keep accurate records of pest incidence for future season planning.' },
      { week: 14, category: 'weeding',    task: '2nd weeding at 90–100 days after sowing if weeds are still present. At this late stage, inter-row weeds can interfere with harvest by tangling around the low-growing lentil plants. Light hand-weeding to clear harvest paths is sufficient. Do not hoe deep at this stage.' },
      { week: 15, category: 'harvest',    task: 'Harvest when 70–75% of pods have turned yellow-brown and seeds rattle inside. Lentil is a day-neutral, determinate crop — maturity is fairly uniform. Harvest in early morning when pods are slightly damp to reduce shattering. Use a sickle at ground level. Bundle and dry in the field for 3–5 days. Thresh by beating bundles on a hard floor or using a thresher. Winnow and sun-dry seeds to 10% moisture. Store in sealed bags or bins.' },
    ],

    advisory: [
      'Rhizobium inoculation is the single most cost-effective input for lentil — it costs almost nothing and can replace 5–8 kg Urea/bigha through biological nitrogen fixation',
      'Waterlogging is fatal to lentil even for 24–48 hours — always sow on well-drained raised beds and never apply excess irrigation',
      'Lentil is an excellent crop after Aman rice — it requires very little input, fixes nitrogen that benefits the next Boro rice crop, and provides cheap protein for farm families',
      'BARI Masur-8 is a short-duration (95–100 day) variety ideal for late-harvested Aman areas and allows timely planting of the next Boro crop',
      'Harvest promptly at 70% pod yellowing — fully ripe lentil pods shatter at the slightest wind or mechanical disturbance',
    ],
  },


  // ── Jute ────────────────────────────────────────────────────────────────────
  jute: {
    id:       'jute',
    name:     'Jute',
    nameBn:   'পাট',
    season:   SEASONS.KHARIF_1,
    variety:  'BJC-7370 (White Jute) / OM-1 (Tossa Jute) / CVE-3 / BJRI Tossa Pat-7 / BJRI Deshi Pat-8',
    duration: 120,

    perBigha: {
      seed:         0.75,
      yieldMaund:   8,
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
      { week: 0,  category: 'land',       task: 'Deep plowing (25–30 cm) using a power tiller or country plow. Jute performs best in loose, well-drained loamy or sandy-loam soils. For heavy clay soils, add sand or incorporate large amounts of organic matter to improve drainage. Cross-plow to achieve fine, friable tilth. Apply 200 kg/bigha of well-decomposed compost during final land preparation. Level the field perfectly — jute does not tolerate waterlogging in the early weeks.' },
      { week: 0,  category: 'sowing',     task: 'Sow seeds in lines 30 cm apart at 1–2 cm depth. Seed rate: 750 g/bigha for line sowing (versus 1.0–1.2 kg for broadcasting). Optimum sowing: March 15 – April 30. Treat seeds with Bavistin (1 g/kg) or soak in warm water (55°C) for 5 minutes to break dormancy and improve germination uniformity. Do not sow too deep — jute seeds are small and deep sowing reduces emergence.' },
      { week: 0,  category: 'fertilizer', task: 'Apply TSP (10 kg/bigha) and MOP (4 kg — first half) as basal dose, incorporated into the top 10–15 cm during final tillage. These fertilizers are relatively immobile and must be placed in the root zone before sowing. Basal Urea (7 kg — first dose) can be applied at sowing on poor soils.' },
      { week: 2,  category: 'thinning',   task: 'Thin plants when 10–15 cm tall (15–20 days after sowing) to maintain 7–8 cm plant-to-plant spacing in rows. Leave only the straightest, most vigorous stems. Thinning is critical for fiber quality — overcrowded plants produce thin, weak fibers while properly spaced plants produce strong, thick, high-value fibers. Remove thinned plants entirely from the field.' },
      { week: 3,  category: 'weeding',    task: '1st weeding at 20–25 days after sowing. Jute is highly sensitive to weed competition in the first 4 weeks — weeds can cause 30–60% yield loss if not controlled promptly. Hand-weed between rows with khurpi. Focus on broadleaf weeds and grass weeds. For chemical control: MCPA sodium salt (35 g/bigha in 10 liters water) or Quizalofop for grass weeds. Do not use herbicides after 25 days in young jute as they cause damage.' },
      { week: 3,  category: 'fertilizer', task: 'Apply 1st top-dressing Urea (7 kg/bigha) at first weeding (20–25 days after sowing). Broadcast between rows after weeding and mix lightly into soil. This nitrogen dose drives the rapid early stem elongation that determines final plant height and fiber yield. Apply on moist soil after light irrigation or rain.' },
      { week: 5,  category: 'weeding',    task: '2nd weeding at 35–40 days after sowing. By this stage jute plants are 60–80 cm tall and beginning to shade out weeds, but thorough cleaning of inter-row spaces is still important. After this weeding the crop canopy closes and further weeding is rarely needed. Hand-pull tall weeds that escape the hoe. Remove all weeds from field completely — do not let them set seed.' },
      { week: 5,  category: 'fertilizer', task: 'Apply 2nd dose of Urea (7 kg/bigha) and remaining MOP (4 kg) at 35–40 days after sowing. Broadcast Urea in the afternoon on a calm day. The combination of Urea + MOP at this stage promotes rapid stem elongation and phloem (fiber) development. This is the key yield-building fertilization window for jute.' },
      { week: 7,  category: 'pest',       task: 'Inspect for Jute Semilooper Caterpillar (Anomis sabulifera) — large, greenish caterpillars that loop when walking, eating leaves from edges leaving a "shot-hole" or skeletonized appearance. Economic threshold: 5 caterpillars per 10 plants. Spray Cypermethrin 10EC (1 ml/liter) or Malathion 57EC (2 ml/liter). Also watch for Hairy Caterpillar — spray Trichloorfon. Remove egg masses found on leaf undersides.' },
      { week: 8,  category: 'fertilizer', task: 'Apply 3rd and final dose of Urea (6 kg/bigha) at peak vegetative growth (50–60 days) if plant height is less than 2.5 meters and color is pale green, indicating nitrogen deficiency. If plants are dark green and tall, skip this dose. Over-application of nitrogen late in the season produces soft, coarse fiber. Use judgment based on plant appearance.' },
      { week: 10, category: 'pest',       task: 'Monitor for stem rot (Macrophomina phaseolina) and root rot (Sclerotium rolfsii) — dark brown patches at stem base, sudden wilting and collapse of plants. Waterlogged areas are most susceptible. Immediate action: drain the field thoroughly, remove and destroy collapsed plants. No effective chemical cure — prevention through drainage management is the only reliable approach. Apply wood ash or lime around affected areas.' },
      { week: 14, category: 'harvest',    task: 'Cut jute at the early pod stage (when 50% flowers have formed small green pods, before pods mature). At this point fiber is strongest and finest. Cutting too early gives weak fiber; cutting too late gives coarse, low-grade fiber. Cut at ground level with sharp sickles or jute harvesting knives. Bundle cut stalks in manageable bundles (10–15 kg) immediately after cutting.' },
      { week: 14, category: 'retting',    task: 'Submerge bundles in slow-moving or standing clean water (pond, canal, or river) to ret. Water temperature 28–32°C and slightly turbid (not stagnant or polluted) water gives best retting. Ret for 10–15 days for Tossa jute, 15–20 days for White jute. Check by stripping a test stalk — fiber should separate cleanly from the woody core. Extract fibers immediately when retting is complete. Wash, dry, and grade by color and strength. Keep in shade during drying.' },
    ],

    advisory: [
      'Fiber quality is determined by the harvesting time — harvesting before full pod formation (early pod stage) gives the highest-grade, softest, most valuable fiber',
      'Retting water quality directly determines fiber quality and color — use slow-moving, clean, slightly warm water; stagnant or polluted water produces dark, brittle, low-value fiber',
      'Line sowing (30 cm rows) gives 15–20% more yield than broadcasting and makes thinning, weeding, and fertilizer application much more manageable',
      'Jute returns significant organic matter to the soil through leaf drop and jute sticks (after fiber extraction) — incorporate jute sticks as mulch or green manure to benefit the next crop',
      'BJRI Tossa Pat-7 is the highest-yielding modern Tossa variety — it produces 15–20% more fiber than traditional CVE-3 with better disease resistance',
    ],
  },


  // ── Potato ──────────────────────────────────────────────────────────────────
  potato: {
    id:       'potato',
    name:     'Potato',
    nameBn:   'আলু',
    season:   SEASONS.RABI,
    variety:  'Diamant / Cardinal / BARI Alu-7 / BARI Alu-25 / Asterix / Lady Rosetta / Granola',
    duration: 90,

    perBigha: {
      seed:         120,
      yieldMaund:   100,
      yieldKg:      3750,
      fertilizer: {
        urea:       35,
        tsp:        22,
        mop:        28,
        gypsum:      8,
        zinc_sulfate: 2,
      },
      irrigation_count: 6,
      pesticide_cost:   600,
    },

    tasks: [
      { week: 0,  category: 'land',       task: 'Deep tillage to 30–35 cm — potato tubers grow underground and require loose, well-aerated soil with no compaction layers. Plow twice crosswise. Incorporate 800–1000 kg/bigha well-decomposed cow dung or 300 kg/bigha poultry manure during land preparation. Form raised ridges (15–20 cm high, 60–65 cm center-to-center) using a ridger attachment. Soil in ridges must be very fine and loose for proper tuber development.' },
      { week: 0,  category: 'sowing',     task: 'Cut certified seed tubers into pieces of 40–50 g each, ensuring each piece has at least 2–3 healthy eyes (buds). Treat cut surfaces with Mancozeb + ash paste or dip briefly in Mancozeb solution (3 g/liter) and dry in shade for 24 hours before planting to prevent seed-borne disease. Plant seed pieces 20–25 cm apart on the ridge tops at 8–10 cm depth. Row spacing: 60–65 cm. Planting time: October 15 – November 15. Earlier is better — each day of delay after November 15 reduces yield.' },
      { week: 0,  category: 'fertilizer', task: 'Apply as basal in the planting furrow (below and beside seed): TSP (22 kg/bigha), first half of MOP (14 kg), Gypsum (8 kg), and Zinc Sulfate (2 kg). Place fertilizers 5 cm below and 5 cm to the side of the seed tuber — direct contact with seed piece causes fertilizer burn. Apply Urea (35 kg) — first third (12 kg) as basal mixed with soil in the furrow, remaining two-thirds at earthing-up.' },
      { week: 2,  category: 'irrigation', task: '1st irrigation — light, 3–4 cm, applied 10–15 days after planting to trigger sprouting and emergence. Soil must be moist but not waterlogged. This early irrigation is critical in dry October-November conditions. If planting was done on moist soil after rain, this irrigation may be delayed to 20 days. Monitor soil at 10 cm — irrigate when it feels barely damp.' },
      { week: 3,  category: 'earthing',   task: 'Earthing-up (mitti chadano) when plants are 15–20 cm tall (20–25 days after planting). This is the most important management operation in potato. Mound soil 15–20 cm high around the base of each plant from both sides using a spade or earthing-up attachment. Earthing-up prevents greening of developing tubers (exposed tubers produce toxic solanine), encourages formation of more tubers, anchors plants against wind, and creates proper furrows for irrigation. Apply remaining 2/3 Urea (23 kg) and second MOP (14 kg) during earthing-up, incorporating into soil mound.' },
      { week: 4,  category: 'irrigation', task: '2nd irrigation — 5–6 cm at 28–35 days. Run water in furrows between ridges. Never allow standing water on top of ridges — tubers will rot. After irrigation, check that furrows drain within 2–3 hours. Maintain a consistent soil moisture — sudden wet-dry cycles cause common scab disease on tuber skin and cracking of tubers. Keep a schedule: irrigate every 8–10 days in cool weather, every 6–7 days in warmer weather.' },
      { week: 5,  category: 'pest',       task: 'CRITICAL: Inspect for Late Blight (Phytophthora infestans) — the most destructive potato disease. First symptoms: water-soaked, dark brown patches on leaf margins and tips, white powdery mold on the underside of patches in humid mornings. Late Blight can destroy an entire field in 7–10 days in cool, humid conditions. Begin PREVENTIVE fungicide sprays before symptoms appear: Mancozeb 80WP (2 g/liter) every 7 days. Once symptoms appear: switch to Metalaxyl+Mancozeb (Ridomil Gold) or Ametoctradin+Dimethomorph (Zampro).' },
      { week: 5,  category: 'weeding',    task: 'Weeding between rows (in furrows) using a khurpi at 30–35 days. Do not disturb the earthed-up ridges — all weeding should be confined to the furrows. Remove all weeds completely, including grasses and sedges. After this weeding, the closed potato canopy will usually prevent further weed growth. For chemical pre-emergence weed control: apply Metribuzin 70WP (100 g/bigha) 5–7 days after planting before emergence.' },
      { week: 6,  category: 'irrigation', task: '3rd irrigation at tuber initiation and bulking stage (40–50 days). This is the highest water demand stage in potato — maintain consistently moist (but not waterlogged) soil. Irrigation every 7–8 days. Monitor furrow water drainage after each irrigation. In clay soils, reduce frequency; in sandy soils, increase slightly. Mulching with straw in the furrows can significantly reduce irrigation frequency and water use.' },
      { week: 7,  category: 'pest',       task: 'Continue Late Blight monitoring and fungicide program. Also watch for Aphids (Myzus persicae) which transmit PVY and PLRV viruses to seed tubers, reducing the viability of farm-saved seed. Spray Imidacloprid or Thiamethoxam for aphids. Check for Early Blight (Alternaria solani) — brown concentric ring lesions on lower leaves. Apply Iprodione + Carbendazim for early blight. Identify and remove any Bacterial Wilt infected plants (sudden total wilt without yellowing) immediately.' },
      { week: 10, category: 'irrigation', task: 'Stop all irrigation 15–20 days before planned harvest date. This is critical for: (1) hardening the tuber skin for better storage, (2) reducing tuber damage during harvesting, (3) allowing field to dry for mechanized or hand digging. Premature stopping of irrigation (>20 days before harvest) shrinks tubers and reduces yield. Continue monitoring for Late Blight even after irrigation stops.' },
      { week: 12, category: 'harvest',    task: 'Harvest when foliage turns fully yellow and begins to collapse naturally (about 85–90 days after planting). Confirm by digging a test plant — skin should not peel off when rubbed firmly with thumb. Harvest in the morning to avoid heat buildup in excavated tubers. Use a potato-lifting fork or mechanical digger (do not use sharp spades that cut tubers). Immediately shade harvested tubers — exposure to sunlight causes greening. Sort and grade immediately: remove cut, diseased, and misshapen tubers. Store in well-ventilated cold stores (2–4°C) or temporary field stores (shaded, ventilated).' },
    ],

    advisory: [
      'Late Blight is a "race against time" disease — preventive fungicide application on a 7-day schedule beginning BEFORE symptoms appear is the only reliable control strategy in Bangladesh\'s climate',
      'Always use certified, virus-tested seed tubers from reliable sources — planting farm-saved tubers infected with PVY or PLRV virus can reduce yield by 30–60% over seasons',
      'Earthing-up is not optional — it is the single most important cultural practice; skip it and you will have green, toxic, unsaleable tubers regardless of how well everything else was managed',
      'Potato requires the highest potassium (MOP) dose of all field crops — MOP deficiency causes internal browning, hollow heart, and poor storage quality; never reduce the MOP dose',
      'Cold storage immediately after harvest is essential — unrefrigerated potato in Bangladesh conditions loses 2–5% weight per day and quality collapses within 3–4 weeks',
    ],
  },


  // ── Onion ───────────────────────────────────────────────────────────────────
  onion: {
    id:       'onion',
    name:     'Onion',
    nameBn:   'পেঁয়াজ',
    season:   SEASONS.RABI,
    variety:  'BARI Piaj-1 / BARI Piaj-2 / BARI Piaj-5 / Taherpuri / Faridpuri / Sukhsagar',
    duration: 120,

    perBigha: {
      seed:         1.5,
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
      { week: 0,  category: 'land',       task: 'Prepare a fine, well-drained raised seedbed for nursery. Mix equal parts topsoil and decomposed compost. Raise seedbed 15–20 cm above surrounding ground level. Apply Carbofuran 5G (0.5 kg/100 sq.m) to seedbed for soil pest control. For the main field: plow to 20–25 cm, incorporate 500 kg/bigha organic compost, level perfectly, and create proper drainage channels.' },
      { week: 0,  category: 'sowing',     task: 'Sow onion seeds in nursery bed at 10–12 g/sq.m in lines 10 cm apart at 1–2 cm depth. Germination takes 10–15 days. Cover bed with thin dry grass mulch to retain moisture and prevent crusting. Water daily with a fine spray — never flood the seedbed. Nursery sowing time: September 25 – October 25. For main field: apply TSP (18 kg/bigha), MOP — half (10 kg), Gypsum (6 kg), and Boron (1 kg) as basal before transplanting.' },
      { week: 2,  category: 'fertilizer', task: 'Apply TSP (18 kg/bigha), first half of MOP (10 kg), Gypsum (6 kg), and Boron (1 kg) as basal doses in the main field, incorporated to 10–15 cm depth. Boron is essential for bulb development in onion — deficiency causes hollow, distorted bulbs and neck rots. Apply first Urea dose (8 kg) as basal on poor soils.' },
      { week: 5,  category: 'transplant', task: 'Transplant when seedlings are 15–20 cm tall with pencil-thick stems (40–45 days old). Pull seedlings gently from nursery bed after light irrigation, trim roots to 5 cm and tops to 15 cm to reduce transplant shock. Plant in the main field at 15 cm × 10 cm spacing (row-to-row 15 cm, plant-to-plant 10 cm) at 3–4 cm depth. Plant in the evening to avoid midday heat stress. Plant firmly to ensure root contact with moist soil.' },
      { week: 5,  category: 'irrigation', task: '1st irrigation immediately after transplanting — apply 3–4 cm to settle soil around roots and eliminate air pockets. Maintain soil moisture for the first 7 days until transplants are established. Onion has a very shallow root system (20–30 cm) and requires frequent light irrigations throughout the season. Flood irrigation is acceptable but furrow or drip irrigation gives much better results.' },
      { week: 6,  category: 'fertilizer', task: 'Apply 1st top-dressing Urea (8–9 kg/bigha) at 10–15 days after transplanting, when new leaf growth indicates successful establishment. Broadcast between rows in the morning. Water lightly after application. This nitrogen dose drives the critical early leaf development — onion bulb size is directly determined by the number and size of leaves formed in the first 5–6 weeks after transplanting.' },
      { week: 7,  category: 'weeding',    task: '1st weeding at 15–20 days after transplanting. Onion is one of the worst competitors against weeds — its upright, thin leaves cast no shade and it cannot suppress weeds at all. Hand-weed very carefully between and within rows — onion roots are very shallow and easily damaged by careless hoeing. Use a V-shaped weeder or small hand fork. Never use rotary weeders near onion rows. Repeat weeding every 15–20 days.' },
      { week: 8,  category: 'irrigation', task: '2nd and 3rd irrigations — maintain consistent soil moisture. Irrigate every 7–8 days in cool weather (November–January) and every 5–6 days in warmer conditions (February onward). Onion cannot tolerate drought — even 3–4 days of water stress during bulb formation causes flower stalk emergence (bolting) which terminates bulb development. Never allow soil to feel dry at 10 cm depth during active growth.' },
      { week: 8,  category: 'fertilizer', task: 'Apply 2nd dose of Urea (8–9 kg/bigha) at 25–30 days after transplanting. Broadcast uniformly between rows after 2nd irrigation. Combined with remaining MOP (10 kg) applied now, this fertilization is critical for bulb initiation and cell expansion. MOP (potassium) is particularly important for sugar and dry matter accumulation in the bulb, which determines flavor, storage quality, and market value.' },
      { week: 9,  category: 'pest',       task: 'Daily inspection for Thrips (Thrips tabaci) — the most serious pest of onion in Bangladesh. Thrips are tiny (1 mm) silver-yellow insects that rasp leaf tissue causing silver streaks and distortion. Economic threshold: 30–50 thrips per plant. Spray Spinosad 45SC (0.5 ml/liter) or Imidacloprid 70WG (0.5 g/liter). Spray in the evening for better contact. Add a spreader-sticker. Repeat every 7 days. Thrips thrive in dry, warm conditions — monitor closely in February–March.' },
      { week: 10, category: 'irrigation', task: 'Continue irrigation every 6–8 days during rapid bulb filling stage. Observe leaves — outer leaves turning yellow indicates bulb maturity beginning; do not increase irrigation at this stage. Begin monitoring for neck softness — if neck (pseudostem) softens easily when squeezed, bulbs are approaching maturity. Fourth and fifth irrigations in this window maintain proper bulb sizing.' },
      { week: 11, category: 'fertilizer', task: 'Apply final top-dressing of Urea (8 kg/bigha — remaining balance) at bulb swelling stage (50–60 days after transplanting). Stop nitrogen application by 70 days after transplanting — late N causes soft, poorly colored, poorly stored bulbs. This is the last nitrogen application for the season.' },
      { week: 12, category: 'weeding',    task: '2nd or 3rd weeding as needed — very light, careful hand-weeding only. Avoid any soil disturbance close to plant base as bulbs are swelling just below soil surface. Pulling weeds by hand is preferred over hoeing at this stage.' },
      { week: 14, category: 'irrigation', task: 'Stop all irrigation 15–20 days before planned harvest when leaves have started to naturally droop and yellow (about 90 days after transplanting). Premature stopping causes small bulbs; late stopping causes soft, rot-prone bulbs. In a well-managed crop, 70% of tops naturally fall over at maturity — use this as the harvest timing indicator.' },
      { week: 16, category: 'harvest',    task: 'Harvest when 70% of tops have naturally fallen over and outer skin is dry, papery, and firmly attached. If 70% tops-down is not achieved by 110–115 days, bend over remaining tops by hand to force maturity. Harvest in the morning by carefully loosening soil with a fork (avoid piercing bulbs) and pulling by hand. Do not harvest during or after rain. Leave bulbs in the field for 1–2 days for initial field drying if weather permits. Then move to shade for curing.' },
    ],

    advisory: [
      'Thrips are the primary yield-robbing pest — daily monitoring from week 7–8 onward and spraying at the 30 thrips-per-plant threshold prevents the huge losses that can occur when populations explode',
      'Purple blotch (Alternaria porri) — purple lesions with yellow halos on leaves — is a serious fungal disease in humid conditions; spray Iprodione 50SC (Rovral) at first symptoms',
      'Stop all irrigation 15–20 days before harvest — bulbs harvested from wet soil have significantly higher post-harvest rot and very short storage life',
      'Curing is critical: spread harvested bulbs in single layers under shade (never direct sun) on raised platforms for 10–14 days, ensuring good airflow around every bulb before storage',
      'BARI Piaj-5 is a summer onion variety (Kharif-1) for growing March–June — this fills the Bangladesh onion supply gap when Rabi onion stocks run out',
    ],
  },


  // ── Garlic ──────────────────────────────────────────────────────────────────
  garlic: {
    id:       'garlic',
    name:     'Garlic',
    nameBn:   'রসুন',
    season:   SEASONS.RABI,
    variety:  'BARI Rasun-1 / BARI Rasun-2 / BARI Rasun-3 / Local White / Faridpuri Rasun',
    duration: 130,

    perBigha: {
      seed:         80,   // kg of cloves
      yieldMaund:   25,
      yieldKg:      938,
      fertilizer: {
        urea:       22,
        tsp:        15,
        mop:        18,
        gypsum:      6,
        boron:       1,
        zinc_sulfate: 1,
      },
      irrigation_count: 7,
      pesticide_cost:   200,
    },

    tasks: [
      { week: 0,  category: 'land',       task: 'Prepare a deep (25–30 cm), fine, well-drained seedbed. Garlic bulbs need loose, friable soil to develop properly. Plow 2–3 times and harrow thoroughly. Incorporate 600–800 kg/bigha of well-decomposed organic matter — this significantly improves bulb size. Raised beds (15–20 cm high) are recommended in heavy clay soils to prevent waterlogging. Garlic is grown on the same raised bed system as onion in Bangladesh.' },
      { week: 0,  category: 'sowing',     task: 'Break fresh garlic bulbs into individual cloves carefully, without damaging the clove base (basal plate). Treat cloves by dipping in Carbendazim solution (1 g/liter) for 30 minutes to prevent seed-borne diseases. Plant cloves with pointed end up at 5–7 cm depth, 10 cm × 10 cm spacing (row-to-row 10 cm, clove-to-clove 10 cm). Press soil firmly around each clove. Planting time: October 15 – November 15. Use largest cloves as seed — clove size directly determines bulb size at harvest.' },
      { week: 0,  category: 'fertilizer', task: 'Apply basal fertilizers incorporated into beds: TSP (15 kg/bigha), MOP — half (9 kg), Gypsum (6 kg), Boron (1 kg), Zinc Sulfate (1 kg). Apply first Urea dose (7 kg/bigha) 15 days after planting when shoots emerge. Garlic is a heavy feeder of potassium and sulfur — Gypsum provides sulfur that is essential for the characteristic pungent allicin compounds that give garlic its quality and storage ability.' },
      { week: 2,  category: 'irrigation', task: '1st irrigation 5–7 days after planting to ensure good soil-clove contact for rooting. Apply a gentle 3–4 cm of water using a watering can or very slow flood in furrows. Garlic roots are shallow (20–25 cm) and require consistent moisture throughout the season. Over-watering causes basal rot; under-watering causes small, loose bulbs with poor clove fill. Maintain a strict schedule of irrigation every 7–10 days.' },
      { week: 3,  category: 'fertilizer', task: 'Apply 1st top-dressing Urea (7 kg/bigha) at 20–25 days after planting when shoots are 15–20 cm tall. Broadcast between rows and water lightly. This nitrogen application drives early vegetative growth — the number and size of leaves formed by day 40 directly determines the number of cloves and final bulb size. Garlic forms one clove for each leaf it produces.' },
      { week: 4,  category: 'weeding',    task: '1st weeding at 25–30 days after planting. Garlic is a poor weed competitor due to its upright, thin leaves. Use a small V-weeder or hand fork carefully between rows and plants. Avoid disturbing soil close to plant base. For chemical pre-emergence control: Oxyfluorfen (Goal 2E at 40 ml/bigha in 10 liters water) applied 3–5 days after planting on moist soil before emergence gives good early weed control.' },
      { week: 5,  category: 'irrigation', task: '2nd and 3rd irrigations — continue 7–10 day schedule. Garlic during leaf development needs consistent moisture. Check soil at 10–15 cm depth — irrigate when it feels barely moist. In January–February (dry season peak), irrigation frequency may need to increase to every 6–7 days. Apply water in furrows between rows, not by overhead sprinkling which spreads fungal disease on leaves.' },
      { week: 6,  category: 'fertilizer', task: 'Apply 2nd dose of Urea (8 kg/bigha) and remaining MOP (9 kg/bigha) at 40–45 days after planting at bulb initiation stage. This is the most critical fertilization timing for garlic — potassium at this stage directly determines the number and fill of individual cloves within the bulb. Nitrogen at this stage continues to support leaf growth which is still building bulb potential.' },
      { week: 7,  category: 'pest',       task: 'Inspect for Purple Blotch (Alternaria porri) — water-soaked lesions with purplish centers on leaves and scapes. Spray Iprodione 50SC (1 ml/liter) or Mancozeb 80WP (2 g/liter) at first symptoms and repeat every 10 days. Also monitor for Thrips (Thrips tabaci) — silver streaks on leaves. Spray Spinosad or Imidacloprid. Basal Rot (Fusarium) is more common in warm/wet conditions — ensure drainage and avoid root damage.' },
      { week: 9,  category: 'fertilizer', task: 'Apply final top-dressing Urea (7 kg/bigha) at rapid bulb development phase (65–75 days after planting). This is the last nitrogen application — stop all N fertilization at least 30 days before harvest. Late nitrogen causes soft, watery bulbs with poor storage quality and reduced pungency.' },
      { week: 10, category: 'irrigation', task: 'Continue irrigation every 7–10 days through bulb development. Begin reducing irrigation frequency 3 weeks before planned harvest. Stop irrigation completely 15 days before harvest. Field should be dry and cracked slightly at harvest time for clean bulb extraction and good skin formation.' },
      { week: 17, category: 'harvest',    task: 'Harvest when 50–60% of leaves have yellowed and collapsed and outer skin has turned papery. Test by bending the neck — if it bends easily without snapping, garlic is mature. Do not harvest too early (immature bulbs do not store well) or too late (cloves burst through wrapper and quality drops). Dig carefully with a garden fork to avoid piercing bulbs. Place in single layers on raised platforms in shade for curing — 20–25 days at 30–35°C with good airflow. After curing, trim roots and tops, braid or bag, and store in cool, dry conditions.' },
    ],

    advisory: [
      'Clove size determines bulb size at harvest — always select and plant the largest, firmest cloves from the best-shaped bulbs; small cloves produce small bulbs regardless of management',
      'Sulfur (from Gypsum) is essential for allicin formation — the compound that gives garlic its pungency, flavor, medicinal value, and post-harvest keeping quality; never skip Gypsum application',
      'Garlic is extremely sensitive to waterlogging at any stage — raise beds or ridges and ensure all drainage channels are functioning before planting',
      'Curing after harvest is as important as growing — improperly cured garlic develops neck rot and mold within weeks; take the full 20–25 days of shade curing seriously',
      'BARI Rasun-1 and Rasun-2 give 25–30% higher yields than local varieties and have better clove uniformity for market presentation',
    ],
  },


  // ── Tomato ──────────────────────────────────────────────────────────────────
  tomato: {
    id:       'tomato',
    name:     'Tomato',
    nameBn:   'টমেটো',
    season:   SEASONS.RABI,
    variety:  'BARI Tomato-2 / BARI Tomato-14 / BARI Hybrid Tomato-8 / Ratan / Manik / Rojina / Binatomato-5',
    duration: 135,

    perBigha: {
      seed:         0.03,   // kg — tiny seeds
      yieldMaund:   120,
      yieldKg:      4500,
      fertilizer: {
        urea:       30,
        tsp:        20,
        mop:        25,
        gypsum:      8,
        boron:       1,
        zinc_sulfate: 1.5,
      },
      irrigation_count: 10,
      pesticide_cost:   500,
    },

    tasks: [
      { week: 0,  category: 'land',       task: 'Prepare raised beds 1 m wide and 20 cm high for tomato — drainage is absolutely critical. Work in 800–1000 kg/bigha well-decomposed organic matter (FYM or compost) thoroughly into the top 20 cm. A deep, loose, well-aerated soil with high organic matter content gives the best tomato yields. Form beds with clear irrigation furrows on both sides. Install bamboo or wooden stakes (1.5 m tall) at 60–70 cm intervals along the planting row before transplanting.' },
      { week: 0,  category: 'sowing',     task: 'Sow seeds in raised nursery beds or pro-trays at 10–12 cm × 5 cm spacing, covered with 0.5 cm of fine soil-compost mix. Germination: 5–8 days. Nursery sowing time: September–October (Rabi season). Protect seedlings from direct rain and harsh sun with a shade net (50%). Water with a fine rose-head watering can — never flood. Apply Thiram (2 g/liter) as a drench 10 days after emergence to prevent damping-off disease.' },
      { week: 0,  category: 'fertilizer', task: 'Apply basal fertilizers per bigha of main field: TSP (20 kg), first half of MOP (12 kg), Gypsum (8 kg), Boron (1 kg), Zinc Sulfate (1.5 kg). Incorporate deeply (15–20 cm) before bed formation. Tomato is a heavy feeder — inadequate fertilization at transplanting is a common cause of poor yields. Also mix 100–150 kg of bone meal or steamed bone meal if available for slow-release phosphorus.' },
      { week: 5,  category: 'transplant', task: 'Transplant 30–35 day old seedlings (with 4–5 true leaves, 15–20 cm tall) in the evening or on a cloudy day to minimize transplant shock. Water nursery bed thoroughly 2–3 hours before pulling seedlings. Plant one seedling per hill at 60 cm × 45 cm spacing (row-to-row 60 cm, plant-to-plant 45 cm). Plant at same depth as in nursery — do not bury the stem. Water immediately and apply a starter fertilizer solution (DAP dissolved in water) around the root zone.' },
      { week: 5,  category: 'irrigation', task: '1st irrigation immediately after transplanting. Maintain consistent moisture — tomato is highly sensitive to irregular watering which causes Blossom End Rot (calcium deficiency symptom) and fruit cracking. Irrigate every 4–5 days in furrows. Never allow soil to dry out completely between irrigations. Drip irrigation is ideal for tomato and significantly reduces disease by keeping foliage dry.' },
      { week: 6,  category: 'fertilizer', task: 'Apply 1st top-dressing: Urea (10 kg/bigha) at 10–15 days after transplanting. Place Urea in shallow furrows 10–15 cm from plant stems to avoid contact damage. Cover with soil and irrigate. This nitrogen application drives early vegetative establishment. Tomato requires careful N management — too much N produces vigorous plants but few fruits; too little causes pale, weak plants with small yield.' },
      { week: 7,  category: 'staking',    task: 'Stake and tie plants when 30–40 cm tall (15–20 days after transplanting). Use bamboo stakes 1.5 m tall or string trellis systems. Tie loosely with soft twine or torn cloth strips in figure-8 knots to avoid constricting the stem as it grows. Staked tomatoes yield 40–60% more than unstaked, have less disease from improved airflow, and are much easier to manage for spraying, pruning, and harvesting.' },
      { week: 7,  category: 'weeding',    task: 'Weeding at 15–20 days after transplanting. Hand-weed beds carefully. In tomato, mulching with dry straw or black polythene (25–30 micron) on beds is highly recommended — it controls weeds, conserves moisture, keeps fruit off soil, and reduces late blight pressure. Apply mulch after transplanting and first irrigation. Plastic mulch: cut X-slits at planting points and plant through them.' },
      { week: 8,  category: 'pest',       task: 'Monitor for Leaf Curl Virus (transmitted by whiteflies) — upward curling and yellowing of leaves with plant stunting. Control whitefly vectors with Yellow sticky traps and Imidacloprid 70WG (0.5 g/liter) spray. Also inspect for Early Blight (Alternaria solani) — dark brown concentric ring lesions on older leaves. Apply Mancozeb+Iprodione at first symptoms. Remove affected leaves. Pinch out suckers (axillary shoots) regularly to improve airflow and direct energy to fruit.' },
      { week: 9,  category: 'fertilizer', task: 'Apply 2nd Urea dose (10 kg/bigha) and remaining MOP (13 kg) at flowering/fruit set stage (35–45 days after transplanting). Potassium is critical at this stage — it determines fruit quality, color, sugar content, and firmness. Calcium can be applied as foliar spray (Calcium nitrate 0.5%) at flowering to prevent Blossom End Rot — dark sunken rot at the flower end of developing fruits.' },
      { week: 10, category: 'irrigation', task: 'Continue regular irrigation every 4–5 days. At fruit filling stage, consistent moisture is critical — fluctuating wet-dry cycles cause fruit cracking (radial and concentric). Never allow drought followed by heavy irrigation during fruit development. Reduce irrigation frequency slightly as first fruits begin to color (ripen) to concentrate flavor and improve shelf life.' },
      { week: 10, category: 'pest',       task: 'Inspect for Tomato Fruit Borer (Helicoverpa armigera) — larvae bore into developing fruits creating entry holes with frass. One larva can damage 4–6 fruits. Spray Spinosad 45SC (0.5 ml/liter) or Indoxacarb 14.5SC (1 ml/liter) at first fruit set. Also check for Late Blight (Phytophthora infestans) during cool, humid weather — apply Metalaxyl+Mancozeb preventively every 7 days from fruit set onward.' },
      { week: 11, category: 'fertilizer', task: 'Apply final fertilizer: Urea (10 kg/bigha) and potassium sulfate or MOP (remaining balance) at fruit development stage. Also apply foliar micronutrient spray: Boron (0.2%) + Zinc (0.5%) + Calcium (0.5%) mixture on fruit-bearing plants every 15 days from fruit set to improve fruit quality and reduce physiological disorders.' },
      { week: 16, category: 'harvest',    task: 'Harvest begins 55–75 days after transplanting (depending on variety). Harvest fruits at breaker stage (first blush of color on green fruit) for distant markets — fruits continue ripening during transport. For local markets, harvest at pink to red stage. Harvest every 2–3 days during peak fruiting. Handle fruits carefully — tomatoes bruise easily. Store in single layers. First harvest typically continues for 8–12 weeks. Remove and destroy any diseased fruits immediately.' },
    ],

    advisory: [
      'Staking is non-negotiable — unstaked tomato plants in Bangladesh conditions yield 40–60% less, have far more disease, and are nearly impossible to manage properly',
      'Blossom End Rot (dark sunken rot at fruit base) is caused by calcium deficiency due to irregular watering — maintain perfectly consistent irrigation schedule and spray Calcium Nitrate foliar spray at flowering',
      'Fruit Borer (Helicoverpa) is the most costly pest — spray Spinosad at first fruit set and install pheromone traps (1 per 4 decimals) to monitor population and reduce egg-laying',
      'Tomato Leaf Curl Virus has no cure — prevent it by controlling whitefly vectors from seedling stage onward with yellow sticky traps and systemic insecticides',
      'Hybrid varieties (BARI Hybrid Tomato-8, Ratan) yield 2–3 times more than open-pollinated varieties but hybrid seeds cannot be saved — budget for purchasing fresh hybrid seed each season',
    ],
  },


  // ── Sugarcane ───────────────────────────────────────────────────────────────
  sugarcane: {
    id:       'sugarcane',
    name:     'Sugarcane',
    nameBn:   'আখ',
    season:   SEASONS.KHARIF_1,
    variety:  'Isd-35 / Isd-36 / Isd-37 / BSRI Akh-41 / BSRI Akh-43 / Khaiya Akh (local)',
    duration: 330,   // 11 months

    perBigha: {
      seed:         300,   // kg setts (2-3 bud)
      yieldMaund:   200,
      yieldKg:      7500,
      fertilizer: {
        urea:       50,
        tsp:        25,
        mop:        30,
        gypsum:     10,
        zinc_sulfate: 2,
      },
      irrigation_count: 8,
      pesticide_cost:   400,
    },

    tasks: [
      { week: 0,  category: 'land',       task: 'Deep subsoil breaking (40–45 cm) using a deep plow or subsoiler — sugarcane has a very deep root system that penetrates 1.5–2 m and needs completely uncompacted soil profile. Plow twice crosswise and harrow to fine tilth. Form furrows (planting channels) 75–90 cm apart and 20–25 cm deep using a ridger. Apply large quantities of organic matter — 1.5–2.0 tons/bigha decomposed FYM — along the furrows before sett placement.' },
      { week: 0,  category: 'sowing',     task: 'Select 2–3 bud setts (stalk pieces with 2–3 buds) from 8–10 month old healthy stalks. Each sett should be 30–40 cm long. Treat setts by soaking in hot water (52°C) for 30 minutes (heat treatment kills ratoon stunting disease and mealybug). Immediately dip in Carbendazim (1 g/liter) solution. Plant end-to-end in the furrows at 0 cm gap (close trench). Cover with 5 cm of soil and firm down. Planting time: February–March (Kharif-1) or October–November (autumn planting).' },
      { week: 1,  category: 'fertilizer', task: 'Apply basal fertilizers in the furrow beside setts before covering: TSP (25 kg/bigha), first MOP (15 kg), Gypsum (10 kg), Zinc Sulfate (2 kg). Mix fertilizers with soil in the furrow and cover with 2–3 cm of soil before placing setts on top to avoid direct fertilizer-sett contact that causes burn.' },
      { week: 4,  category: 'irrigation', task: '1st irrigation 20–25 days after planting if no rain. Sugarcane requires supplemental irrigation during establishment in dry seasons. Apply 6–8 cm in furrows. After establishment (when tillers emerge), sugarcane is more drought-tolerant but yields decline significantly without adequate moisture at tillering (weeks 8–16) and grand growth (weeks 16–32) stages.' },
      { week: 6,  category: 'weeding',    task: '1st weeding at 40–45 days when plants are 30–40 cm tall. The first 60 days are the critical weed control period — sugarcane has slow early growth and weeds can completely suppress germination. Hoe between rows using animal-drawn cultivator or power tiller with cultivator attachment. For chemical control: Atrazine 50WP (400 g/bigha) applied 5–7 days after planting as pre-emergence herbicide on moist soil.' },
      { week: 8,  category: 'fertilizer', task: 'Apply 1st Urea top-dressing (17 kg/bigha) at 50–60 days when tillers are actively growing. Place Urea 10–15 cm from plant base in furrow and cover with soil. This timing coincides with the most active nitrogen demand period during tillering. Combine with earthing-up to mound soil around plant bases which prevents lodging and encourages adventitious roots.' },
      { week: 12, category: 'earthing',   task: 'Earthing-up (mitti chadano) at 80–90 days. Mound soil 20–25 cm high around the base of all plant stools using a ridger or spades. Earthing-up is critical in sugarcane to anchor the tall stalks against lodging in monsoon winds, encourage brace root development, promote tillering, and manage irrigation furrows. This is combined with the 2nd fertilizer top-dressing.' },
      { week: 12, category: 'fertilizer', task: 'Apply 2nd Urea dose (17 kg/bigha) and remaining MOP (15 kg) at earthing-up (80–90 days). Side-dress fertilizer in the furrow formed during earthing-up and cover with mounded soil. This is the most important fertilization timing in sugarcane — nitrogen and potassium at this stage determine stalk number, height, and ultimately total biomass and sugar yield.' },
      { week: 16, category: 'pest',       task: 'Inspect for Internode Borer (Chilo sacchariphagus) — bore holes in stalks with dried frass emerging; affected stalks have dead tops. For Termites: apply Chlorpyrifos granules in the root zone. For Mealybug: remove and destroy infested stalks, spray Profenophos. Apply Carbofuran 5G (1 kg/bigha) in the soil at base of plants for soil insects. The grand growth period (4–8 months) is when most stem borers cause maximum damage.' },
      { week: 20, category: 'fertilizer', task: 'Apply 3rd and final Urea dose (16 kg/bigha) at the grand growth stage (5–6 months after planting) if color is pale green or yellow-green indicating nitrogen deficiency. In well-managed, fertile soils with high organic matter, this 3rd Urea dose may not be necessary. Excessive late nitrogen in sugarcane reduces sugar content (sucrose) in favor of non-sugar compounds.' },
      { week: 24, category: 'irrigation', task: 'Grand growth stage (5–8 months) requires the highest water demand of any period. Irrigate every 12–15 days during dry spells. Each week without irrigation during grand growth reduces final stalk length significantly. Monitor elongation rate — healthy sugarcane grows 5–7 cm per day in peak grand growth. Poor growth rate indicates water, nitrogen, or pest stress.' },
      { week: 44, category: 'harvest',    task: 'Harvest at 10–12 months when Brix (sugar content measured with a refractometer) reaches 18–20° or when top leaves fail to easily strip (ripeness test). Cut at ground level with a sharp machete or cane knife. Remove dry leaves (trashing). Cut from base — proper base cutting is critical if ratoon crop is desired (leaving 2–3 buds below ground for ratooning). Bundle and transport to mill within 24 hours of cutting — sucrose deterioration begins immediately after cutting and cannot be reversed.' },
    ],

    advisory: [
      'Hot water treatment of setts (52°C for 30 minutes) effectively eliminates Ratoon Stunting Disease (RSD) — the most economically damaging disease of sugarcane that has no cure once established',
      'Sugarcane is a 10–12 month crop that ties up land for nearly a full year — plan crop rotation carefully so the next crop can be planted without delay after harvest',
      'Earthing-up at 80–90 days is the single most important cultural management operation — improperly earthed-up sugarcane lodges in monsoon, loses 20–30% yield, and is extremely difficult to harvest',
      'Ratoon crop management (keeping the stubble for a second crop) reduces input costs by 40% — apply half the fertilizer dose of the plant crop to ratoons and keep weeds controlled in the first 60 days',
      'Transport harvested cane to the mill within 24 hours — sucrose inversion begins at cutting and significant quality (and payment rate) is lost with each hour of delay',
    ],
  },
};

// ─── Helper functions ─────────────────────────────────────────────────────────

export function getAllCrops() {
  return Object.values(CROPS);
}

export function getCropsBySeason(seasonId) {
  return Object.values(CROPS).filter(c => c.season.id === seasonId);
}

export function getCropById(cropId) {
  return CROPS[cropId] || null;
}