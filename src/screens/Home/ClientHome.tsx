import { View, Text, StyleSheet, Image, Linking, TouchableOpacity } from 'react-native';

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
    <>
      {/* Boas-vindas */}
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeTitle}>Bem-vindo ao ForkFolio</Text>
        <Text style={styles.welcomeSubtitle}>
          Plataforma de reviews em parceria com a ESTH
        </Text>
      </View>

      {/* Objetivo */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Objetivo da Aplicação</Text>
        <Text style={styles.cardText}>
          Esta aplicação foi desenvolvida em parceria com a ESTH com o objetivo
          de permitir aos utilizadores avaliarem o restaurante da instituição.
        </Text>
      </View>

      {/* O que pode fazer */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>O que podes fazer</Text>
        <Text style={styles.cardText}>
          • Submeter reviews{'\n'}
          • Consultar avaliações{'\n'}
          • Contribuir para a melhoria do serviço
        </Text>
      </View>

      {/* Rewards */}
      <View style={styles.highlightCard}>
        <Text style={styles.highlightTitle}>Sistema de Recompensas</Text>
        <Text style={styles.highlightText}>
          Ao submeteres reviews ganhas acesso a receitas exclusivas da ESTH.
        </Text>
      </View>

      {/* Equipa */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Equipa de Desenvolvimento</Text>

        <View style={styles.teamGrid}>
          {team.map((member) => (
            <TouchableOpacity
              key={member.github}
              style={styles.teamMember}
              onPress={() => Linking.openURL(member.github)}
            >
              <Image source={{ uri: member.imageUrl }} style={styles.avatar} />
              <Text style={styles.teamName}>{member.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#003366',
  },
  welcomeSubtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#555',
    marginTop: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardText: {
    color: '#444',
    lineHeight: 20,
  },
  highlightCard: {
    backgroundColor: '#E6F0FF',
    padding: 18,
    borderRadius: 10,
    marginBottom: 25,
  },
  highlightTitle: {
    fontWeight: 'bold',
    color: '#003366',
  },
  highlightText: {
    color: '#003366',
  },
  teamGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
    marginTop: 20,
  },
  teamMember: {
    alignItems: 'center',
    width: 90,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 8,
  },
  teamName: {
    color: '#0066CC',
    textAlign: 'center',
  },
});