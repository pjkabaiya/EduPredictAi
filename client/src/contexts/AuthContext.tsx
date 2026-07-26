import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { auth, onFirebaseReady } from '../firebase';

interface AppUser {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: AppUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  getIdToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let unsub: (() => void) | null = null;

    const setupAuth = () => {
      const a = auth;
      if (!a) {
        setIsLoading(false);
        return;
      }
      unsub = a.onAuthStateChanged((firebaseUser: any) => {
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
    };

    setupAuth();
    if (!auth) {
      onFirebaseReady(setupAuth);
    }

    return () => {
      if (unsub) unsub();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const a = auth;
    if (!a) throw new Error('Auth not available');
    await a.signInWithEmailAndPassword(email, password);
  };

  const register = async (name: string, email: string, password: string) => {
    const a = auth;
    if (!a) throw new Error('Auth not available');
    try {
      const u = await a.createUserWithEmailAndPassword(email, password);
      const userAny = u as any;
      if (userAny.updateProfile) {
        await userAny.updateProfile({ displayName: name });
      }
    } catch (e: any) {
      console.error('Registration error:', e?.code || e?.message || e);
      throw e;
    }
  };

  const logout = async () => {
    const a = auth;
    if (!a) return;
    await a.signOut();
  };

  const getIdToken = async (): Promise<string | null> => {
    const a = auth;
    if (!a?.currentUser) return null;
    return a.currentUser.getIdToken();
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
