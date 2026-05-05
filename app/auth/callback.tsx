import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../../src/stores/authStore';
import { useRouter } from 'expo-router';
import { supabase } from '../../src/lib/supabase';

/**
 * Callback screen for OAuth redirects
 * Handles the redirect from Google OAuth and sets up the session
 */
export default function AuthCallback() {
  const { initializeAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // The session should be automatically set by Supabase after redirect
        // We just need to initialize auth to pick up the session
        await initializeAuth();
        
        // Check if we have a session now
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          router.replace('/(tabs)');
        } else {
          // If no session, go back to auth page
          router.replace('/auth');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        router.replace('/auth');
      }
    };

    handleCallback();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
