import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
  authSubscription: { unsubscribe: () => void } | null;
  initialize: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUpWithEmail: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  session: null,
  isLoading: true,
  error: null,
  authSubscription: null,

  initialize: async () => {
    try {
      // Clean up previous subscription if any
      const currentSub = get().authSubscription;
      if (currentSub) {
        currentSub.unsubscribe();
      }

      // Get current session
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;

      set({
        session,
        user: session?.user ?? null,
        isLoading: false,
      });

      // Listen for auth changes (login, logout, token refresh)
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        set({
          session,
          user: session?.user ?? null,
        });
      });

      set({ authSubscription: subscription });
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ isLoading: false, user: null, session: null });
    }
  },

  signInWithEmail: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        const msg = error.message === 'Invalid login credentials'
          ? 'Correo o contraseña incorrectos'
          : error.message;
        set({ isLoading: false, error: msg });
        return { success: false, error: msg };
      }

      set({ user: data.user, session: data.session, isLoading: false });
      return { success: true };
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  signUpWithEmail: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name || '' },
        },
      });

      if (error) {
        const msg = error.message.includes('already registered')
          ? 'Este correo ya está registrado. Intenta iniciar sesión.'
          : error.message;
        set({ isLoading: false, error: msg });
        return { success: false, error: msg };
      }

      // If email confirmation is required
      if (data.user && !data.session) {
        set({ isLoading: false });
        return { success: true, error: 'Revisa tu correo para confirmar tu cuenta.' };
      }

      set({ user: data.user, session: data.session, isLoading: false });
      return { success: true };
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  signInWithGoogle: async () => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) {
        set({ isLoading: false, error: error.message });
        return { success: false, error: error.message };
      }

      // OAuth redirects, so we won't reach here normally
      return { success: true };
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    await supabase.auth.signOut();
    set({ user: null, session: null, isLoading: false, error: null });
  },

  clearError: () => set({ error: null }),
}));
