import { Text, StyleSheet, Dimensions, ScrollView, View } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';

import usersData from '../../../data/users.json';
import eventsData from '../../../data/eventos.json';
import reviewsData from '../../../data/reviews.json';

const screenWidth = Dimensions.get('window').width;

export default function AdminHome() {
  // ----------------------------
  // Registos de utilizadores por mês
  // ----------------------------
  const getRegistrationsPerMonth = () => {
    const counts: Record<string, number> = {};

    usersData.users.forEach(user => {
      const d = new Date(user.createdAt);
      const label = `${d.toLocaleString('pt-PT', { month: 'short' })}/${d.getFullYear()}`;
      counts[label] = (counts[label] || 0) + 1;
    });

    const labels = Object.keys(counts);
    const data = labels.map(label => counts[label]);

    return { labels, data };
  };

  const { labels: userLabels, data: userData } = getRegistrationsPerMonth();

  // ----------------------------
  // Últimos 5 eventos e reviews
  // ----------------------------
  const lastFiveEvents = eventsData.events
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const eventReviewsCount = lastFiveEvents.map(
    e => reviewsData.reviews.filter(r => r.reviewId === e.eventId).length
  );

  const eventLabels = lastFiveEvents.map(e =>
    e.title.length > 8 ? e.title.slice(0, 8) + '…' : e.title
  );

  const chartWidth = Math.max(screenWidth - 64, eventLabels.length * 90);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* CARD 1 — Line Chart */}
      <View style={styles.card}>
        <Text style={styles.title}>Registos de Utilizadores por Mês</Text>
        <LineChart
          data={{ labels: userLabels, datasets: [{ data: userData }] }}
          width={screenWidth - 64}
          height={220}
          fromZero
          segments={4}
          chartConfig={chartConfig}
          style={styles.chart}
        />
      </View>

      {/* CARD 2 — Bar Chart */}
      <View style={styles.card}>
        <Text style={styles.title}>Últimos 5 Eventos & Reviews</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <BarChart
            {...({
              data: { labels: eventLabels, datasets: [{ data: eventReviewsCount }] },
              width: chartWidth,
              height: 260,
              fromZero: true,
              showValuesOnTopOfBars: true,
              verticalLabelRotation: 25,
              barPercentage: 0.6,
              chartConfig,
            } as any)}
          />
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(30, 58, 138, ${opacity})`,
  labelColor: () => '#333',
  propsForDots: {
    r: '5',
    strokeWidth: '2',
    stroke: '#1E3A8A',
  },
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 12,
    marginBottom: 24,
    elevation: 3,
    overflow: 'hidden',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
    color: '#003366',
  },
  chart: {
    borderRadius: 8,
  },
});
