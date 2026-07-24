import {
  createContext,
  useContext,
  useState,
} from "react";

import {
  normalizeRole,
  parseJWT,
} from "../utils/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Recupera la sesión cuando se recarga la página.
  const [currentUserRole, setCurrentUserRole] =
    useState(() => {
      const token = sessionStorage.getItem("token");
      const payload = parseJWT(token);

      return normalizeRole(payload);
    });

  function login(token) {
    sessionStorage.setItem("token", token);

    const payload = parseJWT(token);

    setCurrentUserRole(normalizeRole(payload));
  }

  function logout() {
    sessionStorage.removeItem("token");
    setCurrentUserRole(null);
  }

  return (
    <AuthContext.Provider
      value={{
        currentUserRole,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}