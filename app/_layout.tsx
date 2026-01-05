// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      {/* Auth screens */}
      <Stack.Screen name="auth/login" options={{ headerShown: false }} />
      <Stack.Screen name="auth/register" options={{ headerShown: false }} />

      {/* Tabs */}
      <Stack.Screen name="(tabs)/home" options={{ headerShown: false }} />
    </Stack>
  );
}