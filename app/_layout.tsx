import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* AUTH */}
      <Stack.Screen name="auth/login" />
      <Stack.Screen name="auth/register" />

      {/* APP */}
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}