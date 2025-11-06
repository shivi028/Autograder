// export const ROUTES = {
//   // Auth Routes
//   LOGIN: '/login',
//   SIGNUP: '/signup',
//   FORGOT_PASSWORD: '/forgot-password',
//   RESET_PASSWORD: '/reset-password',
//   UNAUTHORIZED: '/unauthorized',
  
//   // Dashboard Routes
//   DASHBOARD: '/dashboard',
//   STUDENT_DASHBOARD: '/dashboard/student',
//   TEACHER_DASHBOARD: '/dashboard/teacher',
  
//   // Feature Routes
//   EXAMS: '/exams',
//   RESULTS: '/results',
//   PROFILE: '/profile',
//   SETTINGS: '/settings'
// }

// export const PUBLIC_ROUTES = [
//   ROUTES.LOGIN,
//   ROUTES.SIGNUP,
//   ROUTES.FORGOT_PASSWORD,
//   ROUTES.RESET_PASSWORD,
//   ROUTES.UNAUTHORIZED
// ]

// export const PROTECTED_ROUTES = [
//   ROUTES.DASHBOARD,
//   ROUTES.STUDENT_DASHBOARD,
//   ROUTES.TEACHER_DASHBOARD,
//   ROUTES.EXAMS,
//   ROUTES.RESULTS,
//   ROUTES.PROFILE,
//   ROUTES.SETTINGS
// ]


export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  
  // Student routes
  STUDENT_DASHBOARD: '/student/dashboard',
  STUDENT_EXAMS: '/student/exams',
  STUDENT_UPLOAD: '/student/upload',
  STUDENT_RESULTS: '/student/results',
  
  // Teacher routes
  TEACHER_DASHBOARD: '/teacher/dashboard',
  TEACHER_SUBJECTS: '/teacher/subjects',
  TEACHER_EXAMS: '/teacher/exams',
  TEACHER_CREATE_EXAM: '/teacher/exams/create',
  TEACHER_EXAM_DETAIL: '/teacher/exams/:id',
};
// User types
export const USER_TYPES = {
  STUDENT: 'student',
  TEACHER: 'teacher'
};

// Exam types
export const EXAM_TYPES = {
  MIDTERM: 'midterm',
  FINAL: 'final',
  QUIZ: 'quiz',
  ASSIGNMENT: 'assignment'
};

// Processing statuses
export const PROCESSING_STATUS = {
  UPLOADED: 'uploaded',
  PROCESSING: 'processing',
  PROCESSED: 'processed',
  FAILED: 'failed'
};

// Exam statuses
export const EXAM_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  COMPLETED: 'completed',
  ARCHIVED: 'archived'
};

// Grades
export const GRADES = {
  A_PLUS: 'A+',
  A: 'A',
  B_PLUS: 'B+',
  B: 'B',
  C: 'C',
  F: 'F'
};

// Grade thresholds
export const GRADE_THRESHOLDS = {
  A_PLUS: 85,
  A: 75,
  B_PLUS: 65,
  B: 55,
  C: 45
};

// File upload constants
export const FILE_UPLOAD = {
  MAX_SIZE: 10485760, // 10MB in bytes
  ALLOWED_TYPES: ['pdf', 'jpg', 'jpeg', 'png'],
  ALLOWED_MIME_TYPES: [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png'
  ]
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50]
};

// API endpoints (relative to base URL)
export const API_ENDPOINTS = {
  // Auth
  AUTH_REGISTER: '/auth/register',
  AUTH_LOGIN: '/auth/login',
  AUTH_LOGOUT: '/auth/logout',
  AUTH_ME: '/auth/me',
  AUTH_REFRESH: '/auth/refresh',
  
  // Teacher
  TEACHER_SUBJECTS: '/subjects',
  TEACHER_EXAMS: '/exams',
  TEACHER_MY_EXAMS: '/exams/teacher',
  TEACHER_ADD_QUESTIONS: (examId) => `/exams/${examId}/questions`,
  TEACHER_EXAM_SUMMARY: (examId) => `/results/exam/${examId}/summary`,
  
  // Student
  STUDENT_EXAMS: '/exams/student',
  STUDENT_UPLOAD: (examId) => `/upload/${examId}`,
  STUDENT_UPLOAD_STATUS: (uploadId) => `/upload/status/${uploadId}`,
  STUDENT_RESULTS: '/results/student',
  STUDENT_UPLOADS: '/uploads/student',
  
  // Common
  VALIDATE_FILE: '/validate-file'
};

// Toast messages
export const TOAST_MESSAGES = {
  // Success
  LOGIN_SUCCESS: 'Successfully logged in!',
  REGISTER_SUCCESS: 'Account created successfully!',
  LOGOUT_SUCCESS: 'Successfully logged out',
  UPLOAD_SUCCESS: 'File uploaded successfully!',
  SUBJECT_CREATED: 'Subject created successfully!',
  EXAM_CREATED: 'Exam created successfully!',
  QUESTIONS_ADDED: 'Questions added successfully!',
  
  // Error
  LOGIN_ERROR: 'Login failed. Please check your credentials.',
  REGISTER_ERROR: 'Registration failed. Please try again.',
  UPLOAD_ERROR: 'Upload failed. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  INVALID_FILE_TYPE: 'Invalid file type. Please upload PDF, JPG, or PNG.',
  FILE_TOO_LARGE: 'File is too large. Maximum size is 10MB.',
  REQUIRED_FIELD: 'This field is required',
  
  // Info
  PROCESSING: 'Processing your request...',
  LOADING: 'Loading...'
};

// Local storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  THEME: 'theme'
};

// Date formats
export const DATE_FORMATS = {
  FULL: 'MMMM d, yyyy',
  SHORT: 'MMM d, yyyy',
  TIME: 'h:mm a',
  DATE_TIME: 'MMM d, yyyy h:mm a',
  INPUT: 'yyyy-MM-dd'
};

// Question types
export const QUESTION_TYPES = {
  DESCRIPTIVE: 'descriptive',
  MCQ: 'mcq',
  TRUE_FALSE: 'true_false',
  SHORT_ANSWER: 'short_answer'
};

// Confidence levels
export const CONFIDENCE_LEVELS = {
  HIGH: 0.8,
  MEDIUM: 0.6,
  LOW: 0.4
};

// Status colors
export const STATUS_COLORS = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  pending: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-blue-100 text-blue-800',
  uploaded: 'bg-blue-100 text-blue-800',
  processing: 'bg-yellow-100 text-yellow-800',
  processed: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  grading: 'bg-purple-100 text-purple-800'
};

// Grade colors
export const GRADE_COLORS = {
  'A+': 'text-green-600 bg-green-100',
  'A': 'text-green-500 bg-green-50',
  'B+': 'text-blue-600 bg-blue-100',
  'B': 'text-blue-500 bg-blue-50',
  'C': 'text-yellow-600 bg-yellow-100',
  'F': 'text-red-600 bg-red-100'
};

// Exam type colors
export const EXAM_TYPE_COLORS = {
  midterm: 'bg-blue-100 text-blue-800',
  final: 'bg-purple-100 text-purple-800',
  quiz: 'bg-green-100 text-green-800',
  assignment: 'bg-yellow-100 text-yellow-800'
};

// Validation patterns
export const VALIDATION = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
  PASSWORD_MIN_LENGTH: 8,
  STUDENT_ID_PATTERN: /^[A-Z]{3}[0-9]{3,6}$/,
  TEACHER_ID_PATTERN: /^[A-Z]{3}[0-9]{3,6}$/,
  SUBJECT_CODE_PATTERN: /^[A-Z]{2,4}[0-9]{3}$/,
  EXAM_CODE_PATTERN: /^[A-Z0-9]{4,10}$/
};

// Animation durations (ms)
export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  TOAST: 4000
};

// Polling intervals (ms)
export const POLLING = {
  UPLOAD_STATUS: 3000,
  GRADING_STATUS: 5000
};

// Feature flags
export const FEATURES = {
  DARK_MODE: false,
  EMAIL_NOTIFICATIONS: false,
  EXPORT_RESULTS: false,
  BULK_UPLOAD: false,
  REAL_TIME_UPDATES: false
};

// Default values
export const DEFAULTS = {
  EXAM_DURATION: 180, // minutes
  TOTAL_MARKS: 100,
  PASSING_MARKS: 40,
  CREDITS: 3,
  START_TIME: '10:00'
};

// Error codes
export const ERROR_CODES = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  VALIDATION_ERROR: 422,
  SERVER_ERROR: 500
};

// HTTP methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE'
};

// Content types
export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
  URL_ENCODED: 'application/x-www-form-urlencoded'
};

export default {
  ROUTES,
  USER_TYPES,
  EXAM_TYPES,
  PROCESSING_STATUS,
  EXAM_STATUS,
  GRADES,
  GRADE_THRESHOLDS,
  FILE_UPLOAD,
  PAGINATION,
  API_ENDPOINTS,
  TOAST_MESSAGES,
  STORAGE_KEYS,
  DATE_FORMATS,
  QUESTION_TYPES,
  CONFIDENCE_LEVELS,
  STATUS_COLORS,
  GRADE_COLORS,
  EXAM_TYPE_COLORS,
  VALIDATION,
  ANIMATION,
  POLLING,
  FEATURES,
  DEFAULTS,
  ERROR_CODES,
  HTTP_METHODS,
  CONTENT_TYPES
};
