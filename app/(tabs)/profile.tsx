// app/(tabs)/profile.tsx
import { Text, View, Pressable, StyleSheet } from 'react-native';
import { useState } from 'react';
import AdminCarousel from '../../src/screens/Admin/AdminCarousel';
import eventsData from '../../data/eventos.json';

export default function ProfileScreen() {
  const [mode, setMode] = useState<'profile' | 'admin'>('profile');
  const [events, setEvents] = useState(eventsData.events);

  return (
    <View style={[styles.container, { backgroundColor: mode === 'admin' ? '#BBCDB7' : '#fff' }]}>
      {mode === 'profile' && (
        <>
          <Text>Profile Screen</Text>
          <Pressable style={styles.simpleButton} onPress={() => setMode('admin')}>
            <Text>Ir para Admin</Text>
          </Pressable>
        </>
      )}

      {mode === 'admin' && (
  <>
    <AdminCarousel events={events} setEvents={setEvents} />
    <Pressable style={styles.backButton} onPress={() => setMode('profile')}>
      <Text>Voltar ao Perfil</Text>
    </Pressable>
  </>
)}

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: 70 },
  simpleButton: { padding: 10 },
  backButton: { paddingVertical: 8 },
});
