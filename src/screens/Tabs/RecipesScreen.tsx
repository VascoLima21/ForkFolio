// src/screens/Tabs/RecipesScreen.tsx
import { router } from 'expo-router';
import { FlatList, Text, TouchableOpacity } from 'react-native';

const recipes = [
  { id: '1', title: 'Pizza Margherita' },
  { id: '2', title: 'Spaghetti Carbonara' },
];

export default function RecipesScreen() {
  return (
    <FlatList
      data={recipes}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => router.push(`/recipes/${item.id}`)}>
          <Text>{item.title}</Text>
        </TouchableOpacity>
      )}
    />
  );
}
