import {Text, Image, StyleSheet, Dimensions, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

interface RecipeCardProps {
  recipe: {
    recipeId: number;
    name: string;
    imageUrl: string;
  };
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const router = useRouter();
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = (screenWidth - 16 * 3) / 2; // paddingHorizontal 16 + gap 16

  const handlePress = () => {
    router.push(`/recipes/${recipe.recipeId}`);
  };

  return (
    <Pressable onPress={handlePress} style={[styles.card, { width: cardWidth }]}>
      <Image
        source={{ uri: recipe.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
        {recipe.name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 140, 
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  title: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    flexShrink: 1,
    color: 'black',
  },
});
