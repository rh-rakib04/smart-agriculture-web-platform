// ─── Land Unit System ─────────────────────────────────────────────────────────
// All internal calculations use BIGHA as the base unit.
// Whatever unit the farmer enters, we convert to bigha first,
// then apply all crop formulas, then display results back in their unit.
//
// Bangladesh standard conversions:
//   1 acre    = 3 bigha
//   1 bigha   = 20 katha
//   1 katha   = 16 shotok
//   1 bigha   = 320 shotok

export const UNITS = {
  BIGHA:  'bigha',
  ACRE:   'acre',
  KATHA:  'katha',
  SHOTOK: 'shotok',
};

export const UNIT_LABELS = {
  [UNITS.BIGHA]:  'বিঘা (Bigha)',
  [UNITS.ACRE]:   'একর (Acre)',
  [UNITS.KATHA]:  'কাঠা (Katha)',
  [UNITS.SHOTOK]: 'শতক (Shotok)',
};

// ─── Conversion factors TO bigha ─────────────────────────────────────────────
const TO_BIGHA = {
  [UNITS.BIGHA]:  1,
  [UNITS.ACRE]:   3,        // 1 acre = 3 bigha
  [UNITS.KATHA]:  1 / 20,   // 20 katha = 1 bigha
  [UNITS.SHOTOK]: 1 / 320,  // 320 shotok = 1 bigha
};

// ─── Conversion factors FROM bigha ───────────────────────────────────────────
const FROM_BIGHA = {
  [UNITS.BIGHA]:  1,
  [UNITS.ACRE]:   1 / 3,
  [UNITS.KATHA]:  20,
  [UNITS.SHOTOK]: 320,
};

/**
 * Convert any land unit to bigha
 * @param {number} value - The land size value
 * @param {string} fromUnit - The unit to convert from (use UNITS constants)
 * @returns {number} Land size in bigha
 */
export function toBigha(value, fromUnit) {
  const factor = TO_BIGHA[fromUnit];
  if (!factor) throw new Error(`Unknown unit: ${fromUnit}`);
  return value * factor;
}

/**
 * Convert bigha to any unit
 * @param {number} bigha - The land size in bigha
 * @param {string} toUnit - The unit to convert to (use UNITS constants)
 * @returns {number} Converted land size
 */
export function fromBigha(bigha, toUnit) {
  const factor = FROM_BIGHA[toUnit];
  if (!factor) throw new Error(`Unknown unit: ${toUnit}`);
  return bigha * factor;
}

/**
 * Format a land size value for display
 * e.g. formatLand(2.5, 'bigha') → "2.5 বিঘা (Bigha)"
 */
export function formatLand(value, unit) {
  return `${parseFloat(value.toFixed(2))} ${UNIT_LABELS[unit]}`;
}