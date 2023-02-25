// Providers
export const MODEL_APPLICATION: string = 'application';
export const MODEL_CODE: string = 'code';
export const MODEL_USUARIOS: string = 'usuarios';
export const MODEL_TERRITORIES: string = 'territories';
export const MODEL_ASSOCIATED: string = 'associated';
export const MODEL_DOCUMENTS: string = 'documents';
export const MODEL_DOCUMENTSTYPES: string = 'documents_types';
export const BANK_ACCOUNT: string = 'bank_account';
export const COURSES: string = 'courses';
export const PARTNERS: string = 'partners';
export const PARTNER_FILES: string = 'partner_files';
export const COURSE_TO_PARTNER: string = 'course_to_partner';
export const MODEL_CMS_SETTINGS: string = 'cms_settings';
export const SESSIONS: string = 'sessions';
export const ROLES: string = 'roles';
export const MOVEMENTS: string = 'movements';
export const MOVEMENT_TYPES: string = 'movement_types';
export const MODEL_REFERRED: string = 'referred';
export const REPORTS: string = 'reports';
export const REPORT_HAS_MOVEMENTS: string = 'report_has_movements';
export const MODEL_SEQUENTIAL: string = 'sequential';
export const MODEL_STATEMENTS: string = 'statements';
export const RANKING_INDIVIDUAL: string = 'ranking_individual_cms';
export const RANKING_LEADERSHIP: string = 'ranking_leadership_cms';
export const COMMISSIONS: string = 'commissions';
export const CONCEPTS: string = 'concepts';
export const COMMISSION_TYPES: string = 'type_commission';
export const LEVELS: string = 'level';
export const MEASUREMENT_UNITS: string = 'measurment_units';
export const PAYMENT_CHRONOLOGY: string = 'payment_chronology';
export const LOAD_MOVEMENTS: string = 'loads_movements';
export const LOAD_COURSE_TO_PARTNER: string = 'loads_courses';
export const RANKING_PARTNERS_LEADERSHIP: string = 'ranking_partners_leadership';
export const RANKING_PARTNER_INDIVIDUAL: string = 'ranking_partners_individual';
export const INDIVIDUAL_COMMISSIONS: string = 'individual_commissions';
export const LEADERSHIP_COMMISSIONS: string = 'leadership_commissions';
export const MONTHLY_BONUS: string = 'monthly_bonus';
export const MONTHLY_GOAL: string = 'monthly_goal';
export const GRAL_REPORTS_ASSOC: string = 'gral_reports_assoc';
export const GRAL_REPORTS_ACTIVITY: string = 'gral_reports_activity';
export const GRAL_REPORTS_SCORE: string = 'gral_reports_score';
export const GRAL_REPORTS_COMMISS: string = 'gral_reports_commiss';
export const PARTNER_CHANGED: string = 'partner_changed';
export const RANKING: string = 'ranking';

// Roles
export const B2C_APP: string = 'B2C_APP'; // Application type users.
export const B2B_APP: string = 'B2B_APP'; // Application type users.
export const ADMIN: string = 'ADMIN'; // Have access to CMS|
export const B2C_CLIENT: string = 'B2C_CLIENT'; // Client
export const B2B: string = 'B2B'; // Have access to your business
export const B2B_PARTNER: string = 'B2B_PARTNER'; // Has access to all your businesses

// Validators DTO
export const DIGITS_PHONE_NUMBER: number = 10;
export const MIN_PASSWORD: number = 8;
export const MAX_PASSWORD: number = 15;
export const MIN_DIGITS_CARD: number = 15;
export const MAX_DIGITS_CARD: number = 16;
export const MIN_DIGITS_CVV: number = 3;
export const ZIP_CODE: number = 5;
export const MAX_ADDRESS: number = 50;
export const MAX_DIGITS_CVV: number = 3;

// Formats
export const BIRTH_DATE: string = 'YYYY-MM-DD';

// Regex
export const REGEX_1_7: RegExp = /^[1-7]$/;
export const REGEX_24_HOURS: RegExp = /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$/;
export const REGEX_CELL_PHONE_NUMBER: RegExp = /^\d{10}\d{0,2}$/;
export const REGEX_EMAIL: RegExp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
export const REGEX_TYPE_USER: RegExp = new RegExp(`^(${ADMIN}|${B2C_CLIENT}|${B2B}|${B2B_PARTNER})$`);
export const REGEX_RFC = /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01]))([A-Z\d]{2})([A\d])$/;
export const REGEX_CURP = /^[a-zA-Z]{4}[0-9]{6}[a-zA-Z]{6}[a-zA-Z0-9]{1}[0-9]{1}$/;

export enum EnumGender {
  HOMBRE = 'H',
  MUJER = 'M',
}

export enum EnumFilesStatusType {
  PENDING = '0',
  REVIEW = '1',
  REJECT = '2',
  ACCEPTED = '3',
}

export enum EnumFilesStatusPatch {
  REJECT = '2',
  ACCEPTED = '3',
}

export enum EnumSecuentialTypes {
  FOLIO_PROFILE = 'folio_profile',
}

export enum EnumcontractsTypes {
  affiliationContract = 'mediacion_mercantil',
  privacyNotice = 'aviso_de_privacidad',
  confidentialityNotice = 'convenio_de_confidencialidad',
}

export enum EnumApplicationsType {
  PARTNER = 'PARTNER',
  ASSOCIATED = 'ASSOCIATED',
  PAYER = 'PAYER',
  COORDINATION = 'COORDINATION',
  INFORMATION = 'INFORMATION',
  SUPERADMIN = 'SUPERADMIN',
}

export enum AsociadoStatus {
  CREATED = 0,
  USER_VALIDATED = 1,
  ONBOARDING = 2,
  ONBOARDING_FILES = 3,
  TRAINING_PENDING = 4,
  TRAINING_COMPLETED = 5,
  ACTIVE = 6,
  REJECTED = 7,
  DISABLED = 8,
  REMOVED = 9,
}

export enum AsociadoStatusReports {
  CREATED = '0',
  USER_VALIDATED = '1',
  ONBOARDING = '2',
  ONBOARDING_FILES = '3',
  TRAINING_PENDING = '4',
  TRAINING_COMPLETED = '5',
  ACTIVE = '6',
  REJECTED = '7',
  DISABLED = '8',
  REMOVED = '9',
}

export enum EnumDocumentsTypes {
  LINK = 'Enlace',
  PDF = 'PDF',
  VIDEO = 'Video',
}

export enum EnumStatus {
  ACTIVE = 'Activo',
  DISABLE = 'Inactivo',
}

export enum EnumSettingsTypes {
  RELEASES = 'releases',
  LEVEL = 'nivel',
  POINTS = 'puntos',
}

export enum EnumReportTypeAssociates {
  STATUS_ASSOCCIATE = 'EstatusDeAsociado',
  CHANGE_DATA = 'CambioDeDatos',
  UNFINISHED_AFFILIATIONS = 'AfiliacionesNoTerminadas',
  STATUS_COURSE = 'EstatusDeCursos',
}

export enum EnumReportTypeActivity {
  DISBURSEMENTS = 'Desembolsos',
  BUYBACKS = 'Recompras',
  QUERIES = 'Consultas',
  CURRENT_CASES = 'CasoAlCorriente',
}

export enum EnumReportTypeScore {
  ASSOCIATE_LEVEL = 'NivelDeAsociado',
  LEADERSHIP_LEVEL = 'NivelDeLiderazgo',
}

export enum EnumReportTypeCommissions {
  WEEKLY_INDIVIDUAL = 'SemanalesIndividual',
  MONTHLY_INDIVIDUAL = 'MensualesIndividual',
  WEEKLY_LEADERSHIP = 'SemanalesLiderazgo',
  MONTHLY_LEADERSHIP = 'MensualesLiderazgo',
}

export enum EnumCoursesStatus {
  PENDING = 0,
  APPROVED = 1,
  REJECTED = 2,
}

export enum EnumMovementsStatus {
  PENDING = 'PENDING',
  APPLIED = 'APPLIED',
}

export enum EnumStatusTypes {
  ACTIVE = 'Vigente',
  FINISHED = 'Terminada',
}

export enum EnumMovementTypes {
  CONSULTAS = 'CONSULTAS',
  CASO_AL_CORRIENTE = 'CASO AL CORRIENTE',
  RECOMPRA = 'RECOMPRA',
  DESEMBOLSO = 'DESEMBOLSO',
}

export enum EnumMovementTypesNumbers {
  CONSULTAS = '1',
  CASO_AL_CORRIENTE = '2',
  RECOMPRA = '3',
  DESEMBOLSO = '4',
}

export enum EnumCourseTypes {
  OPTIONAL = 'Opcional',
  REQUIRED = 'Obligatorio',
}

export enum EnumPeriodRanking {
  ENE_FEB = 1,
  MAR_ABR = 2,
  MAY_JUN = 3,
  JUL_AGO = 4,
  SEP_OCT = 5,
  NOV_DIC = 6,
}

export enum EnumCuatrimRanking {
  ENE_FEB_MAR_ABR = 1,
  MAY_JUN_JUL_AGO = 2,
  SEP_OCT_NOV_DIC = 3,
}

export enum EnumLeaderRank {
  NO_RANK = 'No posee ranking',
  FUTURO_LIDER = 'Futuro Líder',
  LIDER_BRONCE = 'Líder Bronce',
  LIDER_PLATA = 'Líder Plata',
}

export enum EnumRankPartnerIndividual {
  ASOCIADO = 'Asociado',
  PLATA = 'Plata',
  ORO = 'Oro',
}

export enum EnumRankType {
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  BIMONTHLY = 'bimonthly',
}

// https://convertlive.com/u/convert/bytes/to/megabytes
// 20971520 bytes = 20mb -> 5242880 bytes = 5mb -> 1048576 bytes = 1 mb
export const FILE_SIZE: number = 20971520;
export const ACCEPTED_IMAGES: string[] = ['image/jpg', 'image/jpeg', 'image/png'];
export const ACCEPTED_FILES: string[] = ['application/pdf'];
export const ACCEPTED_VIDEOS: string[] = ['video/mp4', 'video/mpeg'];
