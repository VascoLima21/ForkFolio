import { View, Text, Image, StyleSheet, Dimensions} from 'react-native';

interface RecipeCardProps {
  recipe: {
    recipeId: number;
    name: string;
    imageUrl: string;
  };
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = (screenWidth - 16 * 3) / 2; // paddingHorizontal 16 + gap 16

  return (
    <View style={[styles.card, { width: cardWidth }]}>
      <Image
        source={{ uri: recipe.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
        {recipe.name}
      </Text>
    </View>
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
