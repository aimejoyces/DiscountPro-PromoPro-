/**
 * Zustand store for authentication state management
 * Simplified and fixed order of operations
 */

import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { AuthUser, AuthSession } from '../types/index';
import * as WebBrowser from 'expo-web-browser';

interface AuthState {
  user: AuthUser | null;
  session: AuthSession | null;
  loading: boolean;
  error: string | null;
  emailConfirmationPending: boolean;
  pendingEmail: string | null;

  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, displayName: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<boolean>;
  clearError: () => void;
  initializeAuth: () => Promise<void>;
  resendConfirmation: (email: string) => Promise<boolean>;
  clearEmailConfirmation: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: false,
  error: null,
  emailConfirmationPending: false,
  pendingEmail: null,

  signIn: async (email: string, password: string) => {
    set({ loading: true, error: null });

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        let msg = 'Failed to sign in';
        if (error.message.includes('Invalid login credentials')) msg = 'Wrong email or password';
        if (error.message.includes('Email not confirmed')) msg = 'Please confirm your email first';
        throw new Error(msg);
      }

      set({
        user: data.user as AuthUser,
        session: data.session as AuthSession,
        loading: false,
      });
      return true;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to sign in',
        loading: false,
      });
      return false;
    }
  },

  signUp: async (email: string, password: string, displayName: string) => {
    set({ loading: true, error: null });

    try {
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      console.log('Attempting signup with:', { email: email.trim(), displayName: displayName.trim() });

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { display_name: displayName.trim() },
        },
      });

      console.log('SignUp full response:', JSON.stringify({ data, error }, null, 2));

      if (error) {
        console.error('SignUp error details:', error);
        let msg = error.message || 'Failed to sign up';
        if (error.message?.includes('User already registered')) msg = 'Email already in use';
        if (error.message?.includes('Password should be')) msg = 'Password must be at least 6 characters';
        if (error.message?.includes('Unable to validate email')) msg = 'Invalid email address';
        if (error.message?.includes('over_email_send_rate_limit')) msg = 'Too many attempts. Please wait a few minutes or try a different email.';
        throw new Error(msg);
      }

      console.log('SignUp success - user:', data.user?.id, 'session:', !!data.session);

      // Profile is created automatically via database trigger
      // No manual insert needed

      // If email confirmation is disabled, user is signed in immediately
      if (data.session) {
        set({
          user: data.user as AuthUser,
          session: data.session as AuthSession,
          loading: false,
          emailConfirmationPending: false,
          pendingEmail: null,
        });
      } else {
        set({
          loading: false,
          emailConfirmationPending: true,
          pendingEmail: email.trim(),
          error: null,
        });
      }
      return true;
    } catch (error) {
      console.error('SignUp catch block:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to sign up',
        loading: false,
      });
      return false;
    }
  },

  signOut: async () => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, session: null, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to sign out',
        loading: false,
      });
    }
  },

  signInWithGoogle: async () => {
    set({ loading: true, error: null });
    try {
      const redirectUrl = 'discountpro://auth/callback';
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: redirectUrl },
      });
      if (error) throw error;
      set({ loading: false });
      return true;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to sign in with Google',
        loading: false,
      });
      return false;
    }
  },

  clearError: () => set({ error: null }),

  resendConfirmation: async (email: string) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim(),
      });
      if (error) throw error;
      set({ loading: false });
      return true;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to resend confirmation',
        loading: false,
      });
      return false;
    }
  },

  clearEmailConfirmation: () => set({ emailConfirmationPending: false, pendingEmail: null }),

  initializeAuth: async () => {
    set({ loading: true });
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: { user } } = await supabase.auth.getUser();
        set({ user: user as AuthUser, session: session as AuthSession, loading: false });
      } else {
        set({ loading: false });
      }
    } catch {
      set({ loading: false });
    }
  },
}));
