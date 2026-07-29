const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

const API_URL =  "http://localhost:8480/api";
export const AUTH_API = API_URL;
export const HOME_ROUTE = "/inicio";
//export const LOGIN_ROUTE = "http://localhost:8480/auth/login";
export const LOGIN_ROUTE = isLocal
  ? "http://localhost:8480/auth/login"
  : "http://186.19.137.9:8480/auth/login";

export const STORAGE_KEY = "auth";
export const PORTAL_URL = window.location.origin; 
