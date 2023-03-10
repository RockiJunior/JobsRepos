const PREFIX: string = 'WII';
const PREFIX_SERVER: string = 'SRV';
const PREFIX_PIPES: string = 'PIP';
const PREFIX_AUTH: string = 'ATH';
const PREFIX_AMAZON: string = 'AWS';
const PREFIX_USER: string = 'USR';
const PREFIX_CMS_SETTINGS: string = 'CMS';
const PREFIX_STATEMENTS: string = 'STA';
const PREFIX_REFERRED: string = 'REF';

export const EXCEPTION_CODES = {
  SERVER: {
    GENERAL: `${PREFIX}-${PREFIX_SERVER}-000`,
  },
  PIPES: {
    GENERAL: `${PREFIX}-${PREFIX_PIPES}-000`,
    JOI: `${PREFIX}-${PREFIX_PIPES}-001`,
    OBJECTID: `${PREFIX}-${PREFIX_PIPES}-002`,
  },
  AUTH: {
    GENERAL: `${PREFIX}-${PREFIX_AUTH}-000`,
  },
  AWS: {
    GENERAL: `${PREFIX}-${PREFIX_AMAZON}-000`,
  },
  USER: {
    GENERAL: `${PREFIX}-${PREFIX_USER}-000`,
    NOT_FOUND_USER: `${PREFIX}-${PREFIX_USER}-001`,
  },
  CMS_SETTINGS: {
    GENERAL: `${PREFIX}-${PREFIX_CMS_SETTINGS}-000`,
    NOT_FOUND_CMS_SETTINGS: `${PREFIX}-${PREFIX_CMS_SETTINGS}-001`,
  },
  STATEMENTS: {
    GENERAL: `${PREFIX}-${PREFIX_STATEMENTS}-000`,
    NOT_FOUND_STATEMENTS: `${PREFIX}-${PREFIX_STATEMENTS}-001`,
  },
  REFERRED: {
    GENERAL: `${PREFIX}-${PREFIX_REFERRED}-000`,
    NOT_FOUND_REFERRED: `${PREFIX}-${PREFIX_REFERRED}-001`,
  },
};
