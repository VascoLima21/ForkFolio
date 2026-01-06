// app/(tabs)/home.tsx
import { Text, View, Button } from 'react-native';
import { router } from 'expo-router';

export default function LoginScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Login</Text>
            <Button
                title="Login"
                onPress={() => router.replace('/(tabs)/home')}
            />
        </View>
    );
}
