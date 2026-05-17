import React, { createContext, useContext, useState } from 'react';
import { User, UserRole } from '@/types';
import { users, currentUser as defaultUser } from '@/lib/dummyData';

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  switchRole: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(defaultUser);

  const switchRole = (role: UserRole) => {
    const newUser = users.find(u => u.role === role);
    if (newUser) {
      setUser(newUser);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, switchRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
