// app/(tabs)/profile.tsx
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AdminCarousel from '../../src/screens/Admin/AdminCarousel';
import eventsData from '../../data/eventos.json';
import usersData from '../../data/users.json';

export default function ProfileScreen() {
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

        if (!user) {
          setMode('profile');
        } else if (user.role === 'admin') {
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
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#2EC4C6" />
        <Text>Carregando perfil...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: mode === 'admin' ? '#BBCDB7' : '#fff' }]}>
      {mode === 'profile' && (
        <Text style={styles.profileText}>Bem-vindo ao teu perfil!</Text>
      )}

      {mode === 'admin' && (
        <AdminCarousel events={events} setEvents={setEvents} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: 70 },
  profileText: { fontSize: 22, fontWeight: '600', marginBottom: 20 },
});
