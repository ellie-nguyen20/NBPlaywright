/**
 * Selectors for UI elements
 */

export const SELECTORS = {
  // Common elements
  LOADING_SPINNER: '[data-testid="loading-spinner"]',
  ERROR_MESSAGE: '[data-testid="error-message"]',
  SUCCESS_MESSAGE: '[data-testid="success-message"]',
  
  // Login page
  LOGIN_FORM: '[data-testid="login-form"]',
  EMAIL_INPUT: 'input[placeholder="Your email address"]',
  PASSWORD_INPUT: 'input[type="password"]',
  SIGN_IN_BUTTON: 'button:has-text("Sign in")',
  REMEMBER_ME: 'text=Remember me',
  SIGN_UP_LINK: 'text=Sign up',
  FORGOT_PASSWORD_LINK: 'text=Forgot password ?',
  
  // Dashboard
  DASHBOARD_CONTAINER: '[data-testid="dashboard-container"]',
  WELCOME_MESSAGE: '[data-testid="welcome-message"]',
  QUICK_ACTIONS: '[data-testid="quick-actions"]',
  STATS_CARDS: '[data-testid="stats-cards"]',
  
  // Navigation
  NAVIGATION_MENU: '[data-testid="navigation-menu"]',
  ACCOUNT_LINK: 'text=Account',
  LOGOUT_LINK: 'text=Logout',
  
  // Forms
  FORM_SUBMIT_BUTTON: 'button[type="submit"]',
  FORM_CANCEL_BUTTON: 'button:has-text("Cancel")',
  
  // Tables
  TABLE_ROW: '[data-testid="table-row"]',
  TABLE_HEADER: '[data-testid="table-header"]',
  
  // Modals
  MODAL_CONTAINER: '[data-testid="modal-container"]',
  MODAL_CLOSE_BUTTON: 'button[aria-label="Close"]',
  OVERLAY_CLOSE_BUTTON: 'button.el-dialog__headerbtn',
}; 