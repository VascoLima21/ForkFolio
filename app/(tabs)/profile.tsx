import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
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

        if (user?.role === 'admin') {
          setMode('admin');
        } else {
          setMode('profile');
        }
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
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#2EC4C6" />
        <Text>Carregando perfil...</Text>
      </View>
    );
  }

  return (
    <View style={[
      styles.container,
      { backgroundColor: mode === 'admin' ? '#BBCDB7' : '#BBCDB7' } // sempre verde
    ]}>
      {mode === 'admin' && <AdminCarousel events={events} setEvents={setEvents} />}
      {mode === 'profile' && <ProfileUserScreen />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});
