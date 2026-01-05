// app/(tabs)/recipes.tsx
import { View, Button } from 'react-native';
import { router } from 'expo-router';

const recipes = [
  { id: '1', title: 'Pizza Margherita' },
  { id: '2', title: 'Spaghetti Carbonara' },
];

export default function RecipesScreen() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      {recipes.map((r) => (
        <Button
          key={r.id}
          title={r.title}
          onPress={() => router.push(`/recipes/${r.id}`)}
        />
      ))}
    </View>
  );
}
