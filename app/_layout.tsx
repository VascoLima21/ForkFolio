import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { View, ActivityIndicator } from 'react-native';
import { fonts } from '@/src/fonts';

export default function RootLayout() {
  const [fontsLoaded] = useFonts(fonts);

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* To show the page loading */}
        <ActivityIndicator size="large" />
      </View>
    );
  }

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