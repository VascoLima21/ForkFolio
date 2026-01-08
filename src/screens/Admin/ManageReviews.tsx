import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import usersData from '../../../data/users.json';
import eventsData from '../../../data/eventos.json';
import reviewsData from '../../../data/reviews.json';

type ReviewType = {
  id: number;
  userId: number;
  reviewId: number;
  question3: string;
  question4: string;
  createdAt: string;
};

export default function ManageReviews() {
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [users, setUsers] = useState(usersData.users);
  const [events, setEvents] = useState(eventsData.events);

  useEffect(() => {
    setReviews(reviewsData.reviews);
  }, []);

  const getUserName = (userId: number) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Desconhecido';
  };

  const getEventTitle = (reviewId: number) => {
    const event = events.find(e => e.eventId === reviewId);
    return event ? event.title : 'Desconhecido';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerir Reviews</Text>
      <Text style={styles.subtitle}>Reviews</Text>

      <View style={styles.box}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {reviews.map(review => (
            <View key={review.id} style={styles.reviewCard}>
              {/* Título do evento */}
              <Text style={styles.cardTitle}>{getEventTitle(review.reviewId)}</Text>

              {/* Data */}
              <Text style={styles.date}>{new Date(review.createdAt).toLocaleDateString()}</Text>

              {/* Nome da pessoa alinhado à direita */}
              <Text style={styles.userName}>{getUserName(review.userId)}</Text>

              {/* Comentários */}
              <View style={styles.commentBox}>
                <Text style={styles.comment}>{review.question3}</Text>
              </View>
              <View style={styles.commentBox}>
                <Text style={styles.comment}>{review.question4}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingTop: 50, 
    paddingHorizontal: 20,
    backgroundColor: '#BBCDB7', // fundo verde
  },
  title: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    marginBottom: 16,
    color: '#000',
    textAlign: 'center',
  },
  subtitle: { 
    fontSize: 20, 
    fontWeight: '600', 
    marginBottom: 16,
    textAlign: 'left', // alinhado à direita
    color: '#000',
  },
  box: {
    width: '100%',
    height: 440,
    backgroundColor: '#fff', // box branca para contraste
    borderRadius: 20,
    padding: 14,
  },
  reviewCard: {
    backgroundColor: '#E0F7FA',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center', // título e data centrados
  },
  cardTitle: {
    fontSize: 18, // ligeiramente maior que normal
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
  },
  date: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  userName: {
    alignSelf: 'flex-start', // agora alinhado à direita
    fontWeight: '600',
    marginBottom: 10,
  },
  commentBox: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  comment: {
    fontSize: 14,
  },
});
