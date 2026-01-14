// app/(tabs)/home.tsx
import { View, Text, ScrollView, StyleSheet, Image, Linking, TouchableOpacity } from 'react-native';

import { useRouter } from 'expo-router';
import { Pressable } from 'react-native';

type TeamMember = {
  name: string;
  github: string;
  imageUrl: any;
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
    imageUrl: 'https://avatars.githubusercontent.com/VascoLima2',
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

const router = useRouter()

export default function HomeScreen() {
  return (
    
    <ScrollView
      style={styles.container}               
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >

      {/* Boas-vindas */}
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeTitle}>Bem-vindo ao ForkFolio</Text>
        <Text style={styles.welcomeSubtitle}>
          Plataforma de reviews em parceria com a ESTH
        </Text>
      </View>

      {/* Objetivo da aplicação */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Objetivo da Aplicação</Text>
        <Text style={styles.cardText}>
          Esta aplicação foi desenvolvida em parceria com a ESTH com o objetivo
          de permitir aos utilizadores avaliarem o restaurante da instituição,
          promovendo a melhoria contínua do serviço através de reviews reais.
        </Text>
      </View>

      {/* O que pode fazer */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>O que podes fazer</Text>
        <Text style={styles.cardText}>
          • Submeter reviews sobre a tua experiência no restaurante{'\n'}
          • Consultar avaliações anteriores{'\n'}
          • Contribuir para a melhoria da qualidade do serviço
        </Text>
      </View>

      {/* Rewards */}
      <View style={styles.highlightCard}>
        <Text style={styles.highlightTitle}>Sistema de Recompensas</Text>
        <Text style={styles.highlightText}>
          Ao submeteres reviews, ganhas acesso a receitas exclusivas do
          restaurante da ESTH, incentivando a participação ativa dos
          utilizadores.
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
              activeOpacity={0.7}
            >
              <Image source={{ uri: member.imageUrl }} style={styles.avatar} />
              <Text style={styles.teamName}>{member.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>  {/* ⬅️ Carta fechada aqui */}

      {/* Parte Admin */}
      <View style={styles.centerContainer}>
        <Pressable
          style={styles.profileButton}
          onPress={() => router.push('/profile')}
>
        <Text style={styles.profileButtonText}>Perfil</Text>
        </Pressable>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
   container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#BBCDB7', // <- aqui está a cor atual
  },
  welcomeContainer: {
  alignItems: 'center', // centra horizontalmente
  marginBottom: 30,     // espaço entre boas-vindas e os cards
},
welcomeTitle: {
  fontSize: 22,          // título maior
  fontWeight: 'bold',
  textAlign: 'center',
  color: '#003366',
},
welcomeSubtitle: {
  fontSize: 18,          // subtítulo maior
  textAlign: 'center',
  color: '#555',
  marginTop: 8,
  lineHeight: 24,
},
cardTitle: {
  fontSize: 16,
  fontWeight: 'bold',
  marginBottom: 8,
},
cardText: {
  fontSize: 14,
  color: '#444',
  lineHeight: 20,
},
highlightCard: {
  backgroundColor: '#E6F0FF',
  padding: 18,
  borderRadius: 10,
  marginBottom: 25, // ⬅️ MAIS ESPAÇO
},
highlightTitle: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#003366',
  marginBottom: 6,
},
highlightText: {
  fontSize: 14,
  color: '#003366',
  lineHeight: 20,
},
scrollContainer: {
  paddingBottom: 40,
  paddingTop: 40,
},
card: {
  backgroundColor: '#FFFFFF',
  padding: 16,
  borderRadius: 8,
  marginBottom: 20, // ⬅️ MAIS ESPAÇO
},
teamGrid: {
  flexDirection: 'row',
  justifyContent: 'center',
  flexWrap: 'wrap',
  gap: 20,
  marginTop: 20,
},
teamMember: {
  alignItems: 'center',
  width: 90,
   marginHorizontal: 10,
},
avatar: {
  width: 70,
  height: 70,
  borderRadius: 35,
  marginBottom: 8,
},
teamName: {
  fontSize: 14,
  fontWeight: '500',
  color: '#0066CC', // indica link
  textAlign: 'center',
},
centerContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
},

profileButton: {
  backgroundColor: '#1E3A8A',
  paddingVertical: 16,
  paddingHorizontal: 40,
  borderRadius: 10,
},

profileButtonText: {
  color: '#FFFFFF',
  fontSize: 18,
  fontWeight: 'bold',
},
});
