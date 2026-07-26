import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  initializeAuth: () => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ success: boolean; message?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: true,
  error: null,

  initializeAuth: async () => {
    set({ isLoading: true });

    if (!isSupabaseConfigured) {
      set({ isLoading: false });
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      set({
        session,
        user: session?.user ?? null,
        isLoading: false,
      });

      // Listen to auth changes
      supabase.auth.onAuthStateChange((_event, session) => {
        set({
          session,
          user: session?.user ?? null,
          isLoading: false,
        });
      });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  signUp: async (email, password, fullName) => {
    set({ error: null, isLoading: true });

    if (!isSupabaseConfigured) {
      set({ isLoading: false });
      return { success: false, message: 'Supabase não está configurado. Verifique o ficheiro .env.' };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        set({ error: error.message, isLoading: false });
        return { success: false, message: error.message };
      }

      set({
        user: data.user,
        session: data.session,
        isLoading: false,
      });

      return {
        success: true,
        message: data.session
          ? 'Conta criada e autenticada com sucesso!'
          : 'Conta criada! Verifique o seu e-mail para confirmar o registo.',
      };
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      return { success: false, message: err.message };
    }
  },

  signIn: async (email, password) => {
    set({ error: null, isLoading: true });

    if (!isSupabaseConfigured) {
      set({ isLoading: false });
      return { success: false, message: 'Supabase não está configurado. Verifique o ficheiro .env.' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        set({ error: error.message, isLoading: false });
        return { success: false, message: error.message };
      }

      set({
        user: data.user,
        session: data.session,
        isLoading: false,
      });

      return { success: true, message: 'Autenticado com sucesso!' };
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      return { success: false, message: err.message };
    }
  },

  signOut: async () => {
    set({ isLoading: true });

    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }

    set({ user: null, session: null, isLoading: false });
  },

  clearError: () => set({ error: null }),
}));
