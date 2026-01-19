import { getItem } from './storage';

export const getEvents = async () => {
  return (await getItem('events')) || [];
};

export const getEventById = async (eventId: number) => {
  const events = await getEvents();  
  
  return events.events.find((e: any) => e.eventId === eventId) || null;
};