import { ScrollView, StyleSheet, ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AdminHome from '../../src/screens/Home/AdminHome';
import ClientHome from '../../src/screens/Home/ClientHome';

import usersData from '../../data/users.json';

export default function HomeScreen() {
  const [mode, setMode] = useState<'admin' | 'client'>('client');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('@loggedUserId');

        if (!storedUserId) {
          setMode('client');
          return;
        }

        const userId = parseInt(storedUserId, 10);
        const user = usersData.users.find(u => u.id === userId);

        if (user?.role === 'admin') {
          setMode('admin');
        } else {
          setMode('client');
        }
      } catch {
        setMode('client');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: '#BBCDB7' }}
        edges={['top']}  
      >
        <View style={styles.loading}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
        style={{ flex: 1, backgroundColor: '#BBCDB7' }}
        edges={['top']}  
      >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {mode === 'admin' ? <AdminHome /> : <ClientHome />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#BBCDB7',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 24,
    paddingBottom: 24,
  },
});
