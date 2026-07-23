import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { auth } from '../firebase';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  getIdToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapFirebaseUser(fu: NonNullable<ReturnType<typeof auth.onAuthStateChanged extends (cb: infer C) => any ? never : never>>): User {
  return {
    id: fu.uid,
    name: fu.displayName || fu.email?.split('@')[0] || 'User',
    email: fu.email || '',
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setIsLoading(false);
      return;
    }
    const unsub = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          email: firebaseUser.email || '',
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });
    return unsub;
  }, []);

  const login = async (email: string, password: string) => {
    if (!auth) throw new Error('Auth not available');
    await auth.signInWithEmailAndPassword(email, password);
  };

  const register = async (name: string, email: string, password: string) => {
    if (!auth) throw new Error('Auth not available');
    const u = await auth.createUserWithEmailAndPassword(email, password);
    if (u.updateProfile) {
      await u.updateProfile({ displayName: name });
    }
  };

  const logout = async () => {
    if (!auth) return;
    await auth.signOut();
  };

  const getIdToken = async (): Promise<string | null> => {
    if (!auth?.currentUser) return null;
    return auth.currentUser.getIdToken();
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout, getIdToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
