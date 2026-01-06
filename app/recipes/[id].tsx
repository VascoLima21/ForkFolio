// app/(tabs)/recipes/[id].tsx
import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';

export default function RecipeDetailsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Recipe Details {id}</Text>
        </View>
    );
}

export const unstable_settings = {
    tabBarStyle: { display: 'none' },
};