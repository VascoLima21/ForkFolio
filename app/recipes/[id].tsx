import React, { useState, useRef } from 'react';
import { View, FlatList, StyleSheet, Dimensions, NativeSyntheticEvent, NativeScrollEvent, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import Ingredients from '../../src/screens/Recipes/Ingredientes';
import Steps from '../../src/screens/Recipes/Passos';

import recipesData from '../../data/recipes.json';
import ingredientsData from '../../data/ingredientes.json';
import recipeIngredientsData from '../../data/receita_ingredientes.json';
import stepsData from '../../data/passos.json'; 

const { width } = Dimensions.get('window');

export default function RecipeDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const recipeId = Number(id);
  const router = useRouter();

  const [portions, setPortions] = useState(1);
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const recipe = recipesData.recipes.find(r => r.recipeId === recipeId);

  if (!recipe) {
    return (
      <View style={styles.center}>
        <Text>Receita não encontrada!</Text>
      </View>
    );
  }

  // Ingredientes
  const recipeLinks = recipeIngredientsData.recipeIngredients.filter(
    ri => ri.recipeId === recipeId
  );

  const recipeIngredients = recipeLinks.map(link => {
    const ingredient = ingredientsData.ingredients.find(i => i.ingredientId === link.ingredientId);
    const calculatedValue = (link.quantity.value * portions).toFixed(2);
    return {
      ...ingredient!,
      displayQuantity: `${calculatedValue} ${link.quantity.unit}`,
    };
  });

  // Passos filtrados e ordenados
  const recipeSteps = stepsData.steps
    .filter(step => step.recipeId === recipeId)
    .sort((a, b) => a.order - b.order)
    .map(step => step.description);

  const slides = [
    <Ingredients
      key="ingredients"
      name={recipe.name}
      description={recipe.description}
      portions={portions}
      setPortions={setPortions}
      ingredients={recipeIngredients}
      onBack={() => router.back()}
    />,
    <Steps
      key="steps"
      steps={recipeSteps} 
      onBack={() => router.back()}
    />
  ];

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => <View style={{ width }}>{item}</View>}
      />

      {/* Indicadores de página */}
      <View style={styles.indicatorContainer}>
        {slides.map((_, i) => (
          <View key={i} style={[styles.dot, activeIndex === i ? styles.activeDot : {}]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#BBCDB7' },
  indicatorContainer: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 6,
    borderRadius: 20,
  },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#666', marginHorizontal: 6 },
  activeDot: { backgroundColor: '#2EC4C6' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
