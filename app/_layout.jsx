import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "@/components/SafeScreen";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { checkAuth, user, token } = useAuthStore();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    async function authenticate() {
      await checkAuth();
      setIsAuthChecked(true);
    }
    authenticate();
  }, [checkAuth]);

  
  useEffect(() => {
    if (!isAuthChecked) return; // Wait until auth is checked

    const inAuthGroup = segments[0] === "(auth)";
    const isSignedIn = user && token;

    if (!inAuthGroup && !isSignedIn) {
      router.replace("/(auth)/index");
    } else if (inAuthGroup && isSignedIn) {
      router.replace("/(tabs)");
    }
  }, [segments, user, token]);

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
        </Stack>
      </SafeScreen>
    </SafeAreaProvider>
  );
}
