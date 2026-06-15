// Generate login URL — now points to internal signin page
export const COOKIE_NAME = "app_session_id";
export const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365;

export const getLoginUrl = () => "/signin";
