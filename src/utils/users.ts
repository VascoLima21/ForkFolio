import { getItem, setItem } from './storage';

export const getUsers = async () => {
  return (await getItem('users')).users || [];
};

export const getUserById = async (userId: number) => {
  const users = await getUsers();  
  return users.find((u: any) => u.id === userId) || null;
};

export const addUser = async (user: { id: number; name: string }) => {
  const users = await getUsers();
  const updated = [...users, user];
  await setItem('users', updated);
  return user;
};
