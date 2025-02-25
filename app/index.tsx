import { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import { supabase } from '../src/lib/supabase';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace('/(app)/subscriptions/');
      } else {
        router.replace('/(auth)/sign-in');
      }
    });
  }, [router]);

  return <View />;
}
