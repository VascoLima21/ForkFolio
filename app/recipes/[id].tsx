import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import recipesData from '../../data/recipes.json';
import ingredientsData from '../../data/ingredientes.json';

interface IngredientType {
  ingredientId: number;
  name: string;
  imageUrl: string;
  quantity?: string;
}

interface RecipeType {
  recipeId: number;
  name: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  steps?: string[];
}

export default function RecipeDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const recipeId = Number(id);

  const recipe: RecipeType | undefined = recipesData.recipes.find(
    (r) => r.recipeId === recipeId
  );

  if (!recipe) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>Receita não encontrada!</Text>
      </View>
    );
  }

  // Mostrar todos os ingredientes (porque não temos recipeId em ingredients.json)
  const recipeIngredients: IngredientType[] = ingredientsData.ingredients;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.title}>{recipe.name}</Text>
      <Image source={{ uri: recipe.imageUrl }} style={styles.image} resizeMode="cover" />

      <Text style={styles.subtitle}>Ingredientes</Text>
      {recipeIngredients.map((ing: IngredientType) => (
        <View key={ing.ingredientId} style={styles.ingredientRow}>
          <Image source={{ uri: ing.imageUrl }} style={styles.ingredientImage} />
          <Text style={styles.ingredientText}>
            {ing.name} {ing.quantity ? `- ${ing.quantity}` : ''}
          </Text>
        </View>
      ))}

      <Text style={styles.subtitle}>Passo a Passo</Text>
      {recipe.steps?.map((step: string, index: number) => (
        <Text key={index} style={styles.step}>
          {index + 1}. {step}
        </Text>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BBCDB7',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 16,
    color: 'black',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: 'black',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    color: 'black',
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ingredientImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  ingredientText: {
    fontSize: 16,
    color: 'black',
  },
  step: {
    fontSize: 16,
    marginBottom: 8,
    color: 'black',
  },
});
