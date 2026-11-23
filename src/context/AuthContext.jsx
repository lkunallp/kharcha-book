import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getActiveSession,
  setActiveSession,
  clearActiveSession,
  findUser,
  registerUser,
  getUsers,
  initializeStorage
} from '../services/storage';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing persistent session
    initializeStorage();
    const session = getActiveSession();
    if (session && session.id) {
      // Validate that user still exists in registry
      const allUsers = getUsers();
      const existing = allUsers.find((u) => u.id === session.id);
      if (existing) {
        setCurrentUser({
          id: existing.id,
          username: existing.username,
          name: existing.name,
          avatar: existing.avatar
        });
      } else {
        clearActiveSession();
      }
    }
    setLoading(false);
  }, []);

  const login = (username, password, remember = true) => {
    const user = findUser(username, password);
    if (!user) {
      throw new Error('INVALID_CREDENTIALS');
    }
    const safeUser = {
      id: user.id,
      username: user.username,
      name: user.name,
      avatar: user.avatar
    };
    setCurrentUser(safeUser);
    setActiveSession(safeUser, remember);
    return safeUser;
  };

  const signup = ({ username, password, name, avatar }) => {
    const newUser = registerUser({ username, password, name, avatar });
    const safeUser = {
      id: newUser.id,
      username: newUser.username,
      name: newUser.name,
      avatar: newUser.avatar
    };
    setCurrentUser(safeUser);
    setActiveSession(safeUser, true);
    return safeUser;
  };

  const logout = () => {
    clearActiveSession();
    setCurrentUser(null);
  };

  const loginWithDemo = (demoUsername) => {
    if (demoUsername === 'kunal') {
      return login('kunal', 'kunal123', true);
    } else if (demoUsername === 'riya') {
      return login('riya', 'riya123', true);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        login,
        signup,
        logout,
        loginWithDemo
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
