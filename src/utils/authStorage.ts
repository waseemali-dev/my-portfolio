/**
 * SECURITY NOTE:
 * This admin login mechanism uses browser-based localStorage/sessionStorage.
 * It is designed purely to manage static content locally for this portfolio without needing
 * any backend database or CMS. It DOES NOT provide robust production-grade backend authentication,
 * cryptographically secure tokens, or server-side authorization checks.
 * For actual production-level environments where data confidentiality and security are paramount,
 * you MUST implement backend authentication (e.g., using OAuth, JWTs, a full database server, or a managed CMS).
 */

const CREDENTIALS_KEY = "admin_portfolio_credentials";
const SESSION_KEY = "admin_portfolio_session";

const DEFAULT_USERNAME = "admin";
const DEFAULT_PASSWORD = "admin123";

/**
 * Gets stored admin credentials from localStorage. Defaults to admin / admin123.
 */
export function getAdminCredentials() {
  try {
    const stored = localStorage.getItem(CREDENTIALS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading admin credentials:", error);
  }
  return { username: DEFAULT_USERNAME, password: DEFAULT_PASSWORD };
}

/**
 * Updates admin username and password.
 */
export function saveAdminCredentials(username: string, password: string) {
  try {
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify({ username, password }));
    return true;
  } catch (error) {
    console.error("Error saving admin credentials:", error);
    return false;
  }
}

/**
 * Validates a username and password attempt against stored credentials.
 */
export function validateLogin(username: string, password: string): boolean {
  const creds = getAdminCredentials();
  return creds.username.trim() === username.trim() && creds.password === password;
}

/**
 * Logs in the admin by setting a session flag.
 */
export function loginAdmin() {
  try {
    sessionStorage.setItem(SESSION_KEY, "true");
    localStorage.setItem(SESSION_KEY, "true"); // Also store in localStorage to persist across refreshes/tabs
    return true;
  } catch (error) {
    console.error("Error logging in admin:", error);
    return false;
  }
}

/**
 * Logs out the admin by clearing the session flags.
 */
export function logoutAdmin() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);
    return true;
  } catch (error) {
    console.error("Error logging out admin:", error);
    return false;
  }
}

/**
 * Checks whether the admin session is currently active.
 */
export function isAdminLoggedIn(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "true" || localStorage.getItem(SESSION_KEY) === "true";
  } catch (error) {
    return false;
  }
}
