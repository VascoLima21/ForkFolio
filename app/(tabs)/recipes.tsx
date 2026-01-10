import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import RecipeCard from '../../src/screens/Recipes/RecipeShow';

import recipesData from '../../data/recipes.json';
import userRecipesData from '../../data/user_recipes.json';

export default function RecipesScreen() {
  const userId = 1; // variável local (pode ser global/context)

  // Filtrar receitas associadas ao utilizador
  const userRecipeIds = userRecipesData.userRecipes
    .filter((ur) => ur.userId === userId)
    .map((ur) => ur.recipeId);

  const userRecipeList = recipesData.recipes.filter((r) =>
    userRecipeIds.includes(r.recipeId)
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingTop: 40, paddingHorizontal: 16, paddingBottom: 40 }}
    >
      <Text style={styles.title}>As Minhas Receitas</Text>

      {userRecipeList.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.message}>
            Precisas primeiro de completar uma review para receberes receitas!
          </Text>
        </View>
      ) : (
        // Grid de 2xN
        chunkArray(userRecipeList, 2).map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((recipe) => (
              <RecipeCard key={recipe.recipeId} recipe={recipe} />
            ))}
          </View>
        ))
      )}
    </ScrollView>
  );
}

// Divide array em chunks de n elementos
function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BBCDB7', // fundo verde
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: 'black',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24, // espaçamento entre linhas
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  message: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
  },
});
