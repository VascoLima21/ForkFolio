import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import usersData from '../../../data/users.json';
import eventsData from '../../../data/eventos.json';
import reviewsData from '../../../data/reviews.json';

export default function AdminHome() {
  // ----------------------------
  // 1️⃣ Gráfico de registos de utilizadores por mês
  // ----------------------------
  const getRegistrationsPerMonth = () => {
    const counts: Record<string, number> = {};

    usersData.users.forEach(user => {
      const d = new Date(user.createdAt);
      const month = d.toLocaleString('default', { month: 'short' });
      const year = d.getFullYear();
      const label = `${month}/${year}`;
      counts[label] = (counts[label] || 0) + 1;
    });

    const sortedMonths = Object.keys(counts).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );
    const data = sortedMonths.map(month => counts[month]);

    return { labels: sortedMonths, data };
  };

  const { labels: userLabels, data: userData } = getRegistrationsPerMonth();

  // ----------------------------
  // 2️⃣ Gráfico dos últimos 5 eventos com número de reviews
  // ----------------------------
  const lastFiveEvents = eventsData.events
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const eventReviewsCount = lastFiveEvents.map(event =>
    reviewsData.reviews.filter(r => r.reviewId === event.eventId).length
  );

  const eventLabels = lastFiveEvents.map(event =>
    event.title.length > 10 ? event.title.slice(0, 10) + '…' : event.title
  );

  const chartWidth = Math.max(Dimensions.get('window').width - 40, eventLabels.length * 60);

  // ----------------------------
  // Render
  // ----------------------------
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Gráfico 1: Registos de utilizadores */}
      <Text style={styles.title}>Registos de Utilizadores por Mês</Text>
      <LineChart
        data={{ labels: userLabels, datasets: [{ data: userData }] }}
        width={Dimensions.get('window').width - 40}
        height={220}
        yAxisLabel=""
        chartConfig={{
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(30, 58, 138, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
          style: { borderRadius: 0 },
          propsForDots: { r: '6', strokeWidth: '2', stroke: '#1E3A8A' },
        }}
        style={{ marginTop: 10, marginBottom: 30 }}
      />

      {/* Gráfico 2: Últimos 5 eventos */}
      <Text style={styles.title}>Últimos 5 Eventos e Número de Reviews</Text>
        <BarChart
        data={{ labels: eventLabels, datasets: [{ data: eventReviewsCount.map(Number) }] }}
        width={chartWidth}
        height={250}
        fromZero
        yAxisLabel=""       // CORRIGIDO: necessário
        yAxisSuffix=""      // CORRIGIDO: necessário
        chartConfig={{
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(30, 58, 138, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
            style: { borderRadius: 0 },
        }}
        style={{ marginTop: 10, marginBottom: 30 }}
        showValuesOnTopOfBars={true}
        horizontalLabelRotation={45}
        />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    fontSize: 14    ,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#003366',
  },
});
