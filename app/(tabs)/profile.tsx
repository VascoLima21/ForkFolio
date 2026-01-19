import {
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AdminCarousel from '../../src/screens/Admin/AdminCarousel';
import ProfileUserScreen from '../../src/screens/Tabs/ProfileScreen';

import eventsData from '../../data/eventos.json';
import usersData from '../../data/users.json';

export default function ProfileScreenWrapper() {
  const [mode, setMode] = useState<'profile' | 'admin'>('profile');
  const [events, setEvents] = useState(eventsData.events);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('@loggedUserId');

        if (!storedUserId) {
          setMode('profile');
          return;
        }

        const userId = parseInt(storedUserId, 10);
        const user = usersData.users.find(u => u.id === userId);

        setMode(user?.role === 'admin' ? 'admin' : 'profile');
      } catch {
        setMode('profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#2EC4C6" />
        <Text>Carregando perfil...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {mode === 'admin' && <AdminCarousel events={events} setEvents={setEvents} />}
      {mode === 'profile' && <ProfileUserScreen />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BBCDB7',
    paddingTop:
      Platform.OS === 'android'
        ? StatusBar.currentHeight ?? 24
        : 20,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
