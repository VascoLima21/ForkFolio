import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import recipesData from '../../data/recipes.json';
import ingredientsData from '../../data/ingredientes.json';
import recipeIngredientsData from '../../data/receita_ingredientes.json';

interface RecipeIngredientLink {
  recipeId: number;
  ingredientId: number;
  quantity: {
    value: number;
    unit: string;
  };
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
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const recipeId = Number(id);

  const [portions, setPortions] = useState(1);

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

  const recipeLinks = recipeIngredientsData.recipeIngredients.filter(
    (ri) => ri.recipeId === recipeId
  );

  const recipeIngredients = recipeLinks.map((link) => {
    const ingredient = ingredientsData.ingredients.find(
      (i) => i.ingredientId === link.ingredientId
    );

    const calculatedValue = (link.quantity.value * portions).toFixed(2);

    return {
      ...ingredient!,
      displayQuantity: `${calculatedValue} ${link.quantity.unit}`,
    };
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>

      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <Text style={styles.title}>{recipe.name}</Text>
      </View>

      <Text style={styles.description}>{recipe.description}</Text>

      {/* INGREDIENTES */}
      <View style={styles.ingredientsHeader}>
        <Text style={styles.subtitle}>Ingredientes</Text>

        <Text style={styles.portionsLabel}>Número de porções</Text>

        <View style={styles.portionsRow}>
          {/* Botão − */}
          <Pressable
            onPress={() => setPortions(Math.max(1, portions - 1))}
            style={styles.portionCircleButton}
          >
            <Text style={styles.portionCircleText}>−</Text>
          </Pressable>

          {/* Fake Input */}
          <View style={styles.fakeInput}>
            <Text style={styles.portionsNumber}>{portions}</Text>
          </View>

          {/* Botão + */}
          <Pressable
            onPress={() => setPortions(portions + 1)}
            style={styles.portionCircleButton}
          >
            <Text style={styles.portionCircleText}>+</Text>
          </Pressable>
        </View>
      </View>

      {/* LISTA INGREDIENTES */}
      {recipeIngredients.map((ing, index) => (
        <View key={index} style={styles.ingredientRow}>
          <View style={styles.ingredientImageWrapper}>
            <Image source={{ uri: ing.imageUrl }} style={styles.ingredientImage} />
          </View>
          <Text style={styles.ingredientText}>
            {ing.name} — {ing.displayQuantity}
          </Text>
        </View>
      ))}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BBCDB7',
  },

  header: {
    marginTop: 44,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  backButton: {
    marginRight: 10,
  },

  backArrow: {
    fontSize: 30,
    fontWeight: '600',
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flexShrink: 1,
    flexWrap: 'wrap',
  },

  description: {
    fontSize: 16,
    marginBottom: 22,
  },

  ingredientsHeader: {
    marginBottom: 18,
  },

  subtitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 6,
    textAlign: 'left',
  },

  portionsLabel: {
    fontSize: 15,
    marginBottom: 8,
    textAlign: 'center',
  },

  portionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  portionCircleButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15, // menos intenso
    shadowRadius: 2,
    elevation: 3,
    marginHorizontal: 6,
  },

  portionCircleText: {
    fontSize: 26,
    fontWeight: '600',
    color: '#fff',
  },

  fakeInput: {
    minWidth: 100, // mais largo
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12, // menos intenso
    shadowRadius: 2,
    elevation: 3,
    marginHorizontal: 10,
  },

  portionsNumber: {
    fontSize: 20,
    fontWeight: '600',
  },

  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  ingredientImageWrapper: {
    width: 52,
    height: 52,
    padding: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  ingredientImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },

  ingredientText: {
    fontSize: 17,
    flexShrink: 1,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  message: {
    fontSize: 16,
  },
});
