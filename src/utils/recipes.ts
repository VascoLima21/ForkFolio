import { getItem, setItem } from './storage';

export const getRecipes = async () => {
  return (await getItem('recipes')) || [];
};

export const getRecipeById = async (recipeId: number) => {
  const recipes = await getRecipes();
  return recipes.find((r: any) => r.id === recipeId) || null;
};

export const addRecipe = async (recipe: { id: number; title: string }) => {
  const recipes = await getRecipes();
  const updated = [...recipes, recipe];
  await setItem('recipes', updated);
  return recipe;
};