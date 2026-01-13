import usersData from '@/data/users.json';
import reviewsData from '@/data/reviews.json';
import eventsData from '@/data/eventos.json';
import userRecipesData from '@/data/user_recipes.json';
import { setItem, getItem } from './storage';

export const initStorage = async () => {
  const keysAndDefaults = [
    { key: 'users', defaultValue: usersData },
    { key: 'reviews', defaultValue: reviewsData },
    { key: 'events', defaultValue: eventsData },
    { key: 'user_recipes', defaultValue: userRecipesData },
  ];

  for (const { key, defaultValue } of keysAndDefaults) {
    const existing = await getItem(key);
    if (existing === null) {
      await setItem(key, defaultValue);
      console.log(`Initialized ${key} in AsyncStorage`);
    }
  }
};
