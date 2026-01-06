// app/(tabs)/profile.tsx
import { Text, View, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Profile Screen</Text>

      <Button
        title="Ir para Admin"
        onPress={() => router.push('/admin')}
      />
    </View>
  );
}