import { getItem, setItem } from './storage';

/**
 * GET USER RECIPES
 * Fetches recipes for a specific user. 
 * Handles cases where the storage might return null or a wrapped object.
 */
export const getUserRecipes = async (userId: number) => {
  const data = await getItem('user_recipes');
  const list = data?.user_recipes ? data.user_recipes : (Array.isArray(data) ? data : []);
  
  return list.filter((r: any) => r.userId === userId);
};

export const addUserRecipe = async (userId: number, recipeId: number) => {
  const data = await getItem('user_recipes');
  const list = data?.user_recipes ? data.user_recipes : (Array.isArray(data) ? data : []);

  const newEntry = {
    id: list.length + 1,
    userId,
    recipeId,
    assignedAt: new Date().toISOString(),
  };
  
  const updated = [...list, newEntry];
  await setItem('user_recipes', updated);
  return newEntry;
};