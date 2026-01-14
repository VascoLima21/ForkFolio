import { ScrollView, StyleSheet } from 'react-native';
import AdminHome from '../../src/screens/Home/AdminHome';
import ClientHome from '../../src/screens/Home/ClientHome';


export default function HomeScreen() {
  const isAdmin = true; // muda para true para admin

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      {isAdmin ? <AdminHome /> : <ClientHome />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BBCDB7',
  },
  scrollContainer: {
    padding: 24,
    paddingBottom: 40,
  },
});
