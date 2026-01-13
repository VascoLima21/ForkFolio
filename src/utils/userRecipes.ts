import { getItem, setItem } from './storage';

export const getUserRecipes = async (userId: number) => {
  const data = (await getItem('user_recipes')) || [];
  return data.filter((r: any) => r.userId === userId);
};

export const addUserRecipe = async (userId: number, recipeId: number) => {
  const data = (await getItem('user_recipes')) || [];
  const newEntry = {
    id: data.length + 1,
    userId,
    recipeId,
    assignedAt: new Date().toISOString(),
  };
  const updated = [...data, newEntry];
  await setItem('user_recipes', updated);
  return newEntry;
};
