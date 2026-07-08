import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const LS_KEY = 'otantik_auth_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = (phone, name) => {
    const u = { phone, name: name || 'Müşteri' };
    setUser(u);
    localStorage.setItem(LS_KEY, JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(LS_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
