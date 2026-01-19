import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import RecipeCard from './RecipeShow';
import { getItem } from '@/src/utils/storage';
import { getUserRecipes } from '@/src/utils/userRecipes';
import recipesData from '@/data/recipes.json';

export default function RecipesScreen() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // 1. Vai buscar o ID do user logado
      const loggedId = await getItem('@loggedUserId');
      
      if (loggedId) {
        // 2. Vai buscar os mapeamentos (user -> recipe) na storage
        const userMappings = await getUserRecipes(Number(loggedId));
        const recipeIds = userMappings.map((m: any) => m.recipeId);

        // 3. Filtra os detalhes das receitas do JSON principal
        const details = recipesData.recipes.filter((r) => 
          recipeIds.includes(r.recipeId)
        );
        
        setRecipes(details);
      }
    } catch (error) {
      console.error("Erro ao carregar receitas:", error);
    } finally {
      setLoading(false);
    }
  };

  const chunkArray = (arr: any[], size: number) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  if (loading) {
    return (
      <View style={[styles.center, { flex: 1, backgroundColor: '#BBCDB7' }]}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <Text style={styles.title}>As Minhas Receitas</Text>

      {recipes.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.message}>
            Precisas primeiro de completar uma review para receberes receitas!
          </Text>
        </View>
      ) : (
        chunkArray(recipes, 2).map((row, rowIndex) => (
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#BBCDB7' },
  scrollContent: { paddingTop: 40, paddingHorizontal: 16, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  center: { justifyContent: 'center', alignItems: 'center', marginTop: 40 },
  message: { fontSize: 16, textAlign: 'center', paddingHorizontal: 20 },
});