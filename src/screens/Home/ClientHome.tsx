import { View, Text, StyleSheet, Image, Linking, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type TeamMember = {
  name: string;
  github: string;
  imageUrl: string;
};

const team: TeamMember[] = [
  {
    name: 'Gustavo Silva',
    github: 'https://github.com/ptnoob',
    imageUrl: 'https://avatars.githubusercontent.com/ptnoob',
  },
  {
    name: 'Vasco Lima',
    github: 'https://github.com/VascoLima21',
    imageUrl: 'https://avatars.githubusercontent.com/VascoLima21',
  },
  {
    name: 'Tiago Teixeira',
    github: 'https://github.com/tiagojpt',
    imageUrl: 'https://avatars.githubusercontent.com/tiagojpt',
  },
  {
    name: 'Bruno Silva',
    github: 'https://github.com/BMFASilva',
    imageUrl: 'https://avatars.githubusercontent.com/BMFASilva',
  },
];

export default function ClientHome() {
  return (
    <View style={styles.page}>

      {/* HERO */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>ForkFolio</Text>
        <Text style={styles.heroSubtitle}>
          Reviews reais. Feedback que conta.
        </Text>
      </View>

      {/* OBJETIVO */}
      <View style={styles.whiteCard}>
        <View style={styles.cardIcon}>
          <Ionicons name="restaurant-outline" size={30} color="#2EC4C6" />
        </View>
        <Text style={styles.cardTitle}>O nosso objetivo</Text>
        <Text style={styles.cardText}>
          Dar voz aos utilizadores através de reviews honestas,
          ajudando a melhorar o restaurante da ESTH.
        </Text>
      </View>

      {/* EXPLORA */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Explora a aplicação</Text>

        <View style={styles.featuresRow}>
          <View style={styles.feature}>
            <View style={[styles.iconCircle, { backgroundColor: '#E6F4F1' }]}>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={26}
                color="#2EC4C6"
              />
            </View>
            <Text style={styles.featureText}>Criar reviews</Text>
          </View>

          <View style={styles.feature}>
            <View style={[styles.iconCircle, { backgroundColor: '#F3F0E6' }]}>
              <Ionicons name="star-outline" size={26} color="#B89B2E" />
            </View>
            <Text style={styles.featureText}>Ver avaliações</Text>
          </View>

          <View style={styles.feature}>
            <View style={[styles.iconCircle, { backgroundColor: '#EFE7F5' }]}>
              <Ionicons name="gift-outline" size={26} color="#7A4EB2" />
            </View>
            <Text style={styles.featureText}>Ganhar receitas</Text>
          </View>
        </View>
      </View>

      {/* RECOMPENSAS */}
      <View style={styles.whiteCard}>
        <View style={styles.cardIcon}>
          <Ionicons name="trophy-outline" size={30} color="#7A4EB2" />
        </View>
        <Text style={styles.cardTitle}>Sistema de Recompensas</Text>
        <Text style={styles.cardText}>
          Quanto mais participas, mais receitas exclusivas desbloqueias
          diretamente da ESTH.
        </Text>
      </View>

      {/* EQUIPA */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Equipa de Desenvolvimento</Text>

        <View style={styles.teamGrid}>
          {team.map(member => (
            <Pressable
              key={member.github}
              style={styles.teamCard}
              onPress={() => Linking.openURL(member.github)}
            >
              <Image source={{ uri: member.imageUrl }} style={styles.avatar} />
              <Text style={styles.teamName}>{member.name}</Text>
            </Pressable>
          ))}
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingBottom: 40, // 👈 padding extra em baixo
  },

  hero: {
    alignItems: 'center',
    marginBottom: 32,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '700',
  },
  heroSubtitle: {
    fontSize: 16,
    marginTop: 6,
    opacity: 0.7,
  },

  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },

  whiteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 22,
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  cardIcon: {
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  cardText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    color: '#555',
  },

  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  feature: {
    width: '30%',
    alignItems: 'center',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    textAlign: 'center',
  },

  teamGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  teamCard: {
    width: '47%',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginBottom: 8,
  },
  teamName: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});
