/**
 * Application configuration constants
 */

export const APP_CONFIG = {
  NAME: 'Smart Agriculture Platform',
  VERSION: '1.0.0',
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB default
  UPLOAD_DIR: process.env.UPLOAD_DIR || './public/uploads',
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
  },
  CACHE: {
    TTL: 3600, // 1 hour in seconds
  },
};

export const VALIDATION_RULES = {
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL: false,
  },
  EMAIL: {
    MAX_LENGTH: 255,
  },
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 30,
  },
};

export const DATE_FORMATS = {
  DISPLAY: 'MMMM DD, YYYY',
  DISPLAY_WITH_TIME: 'MMMM DD, YYYY, h:mm A',
  API: 'YYYY-MM-DD',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
};

export const CURRENCY = {
  DEFAULT: 'USD',
  SYMBOL: '$',
};

