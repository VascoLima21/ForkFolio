// src/screens/Home/AdminHome.tsx
import { Text, StyleSheet, Dimensions, ScrollView, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import usersData from '../../../data/users.json';
import eventsData from '../../../data/eventos.json';
import reviewsData from '../../../data/reviews.json';

const screenWidth = Dimensions.get('window').width;

export default function AdminHome() {
  const months = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ];

  // Contagem de registos por mês
  const counts: Record<string, number> = {};
  months.forEach(m => counts[m] = 0);
  usersData.users.forEach(user => {
    const d = new Date(user.createdAt);
    const label = months[d.getMonth()];
    counts[label] = (counts[label] || 0) + 1;
  });
  const userData = months.map(m => counts[m]);

  // Últimos 5 eventos e reviews
  const lastFiveEvents = eventsData.events
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  const eventReviewsCount = lastFiveEvents.map(
    e => reviewsData.reviews.filter(r => r.reviewId === e.eventId).length
  );
  const eventLabels = lastFiveEvents.map(e =>
    e.title.length > 8 ? e.title.slice(0, 8) + '…' : e.title
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Título e mini-texto */}
      <Text style={styles.sectionTitle}>Registos de Utilizadores por Mês</Text>
      <Text style={styles.sectionSubtitle}>
        Visualiza quantos utilizadores se registaram em cada mês do ano.
      </Text>

      {/* Container com borda e sombra */}
      <View style={styles.card}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <BarChart
            data={{
              labels: months,
              datasets: [{ data: userData }],
            }}
            width={Math.max(screenWidth - 40, months.length * 70)} // permite scroll
            height={220}
            fromZero
            yAxisLabel=""
            yAxisSuffix=""
            showValuesOnTopOfBars
            chartConfig={chartConfigUsers}
            style={styles.chart}
          />
        </ScrollView>
      </View>

      <Text style={styles.sectionTitle}>Últimos 5 Eventos & Reviews</Text>
      <Text style={styles.sectionSubtitle}>
        Número de reviews submetidas nos últimos 5 eventos.
      </Text>

      <View style={styles.card}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <BarChart
            data={{ labels: eventLabels, datasets: [{ data: eventReviewsCount }] }}
            width={Math.max(screenWidth - 40, eventLabels.length * 90)}
            height={260}
            fromZero
            yAxisLabel=""
            yAxisSuffix=""
            showValuesOnTopOfBars
            chartConfig={chartConfigEvents}
            style={styles.chart}
          />
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const chartConfigUsers = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(46,196,198, ${opacity})`, // cor única para todas as barras
  labelColor: () => '#333',
};

const chartConfigEvents = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(30, 58, 138, ${opacity})`,
  labelColor: () => '#333',
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#003366',
    marginBottom: 4,
    marginTop: 16,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: '#BBCDB7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  chart: {
    borderRadius: 8,
  },
});
