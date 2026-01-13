import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import usersData from '../../../data/users.json';
import eventsData from '../../../data/eventos.json';
import reviewsData from '../../../data/reviews.json';
import ConfirmModal from '../../components/ConfirmModal';

type ReviewType = {
  id: number;
  userId: number;
  reviewId: number;
  question1: number;
  question2: number; 
  question3: string;
  question4: string;
  question5: boolean;
  createdAt: string;
};

const STORAGE_KEY = 'REVIEWS_DATA';

export default function ManageReviews() {
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [users] = useState(usersData.users);
  const [events] = useState(eventsData.events);

  const [selectedReview, setSelectedReview] = useState<ReviewType | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    const data = await AsyncStorage.getItem(STORAGE_KEY);

    if (data) {
      setReviews(JSON.parse(data));
    } else {
      setReviews(reviewsData.reviews);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(reviewsData.reviews));
    }
  };

  const saveReviews = async (updatedReviews: ReviewType[]) => {
    setReviews(updatedReviews);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReviews));
  };

  const getUserName = (userId: number) =>
    users.find(u => u.id === userId)?.name ?? 'Desconhecido';

  const getEventTitle = (reviewId: number) =>
    events.find(e => e.eventId === reviewId)?.title ?? 'Desconhecido';

  const deleteReview = async () => {
    if (!selectedReview) return;

    const updated = reviews.filter(r => r.id !== selectedReview.id);
    await saveReviews(updated);

    setModalVisible(false);
    setSelectedReview(null);
  };

  const renderRatingCircles = (rating: number) => {
    const circles = [];
    for (let i = 1; i <= 5; i++) {
      circles.push(
        <View
          key={i}
          style={[
            styles.circle,
            i <= rating ? styles.circleFilled : styles.circleEmpty,
          ]}
        />
      );
    }
    return <View style={styles.circleContainer}>{circles}</View>;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerir Reviews</Text>
      <Text style={styles.subtitle}>Reviews</Text>

      <View style={styles.box}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {reviews.map(review => (
            <Pressable
              key={review.id}
              style={styles.reviewCard}
              onPress={() => {
                setSelectedReview(review);
                setModalVisible(true);
              }}
            >
              <Text style={styles.cardTitle}>{getEventTitle(review.reviewId)}</Text>
              <Text style={styles.date}>{new Date(review.createdAt).toLocaleDateString()}</Text>
              <Text style={styles.userName}>{getUserName(review.userId)}</Text>

              <View style={styles.commentBox}>
                <Text style={styles.comment}>{review.question3}</Text>
              </View>
              <View style={styles.commentBox}>
                <Text style={styles.comment}>{review.question4}</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Modal principal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedReview && (
                <>
                  <Text style={styles.modalTitle}>{getEventTitle(selectedReview.reviewId)}</Text>
                  <Text style={styles.modalDate}>
                    {new Date(selectedReview.createdAt).toLocaleDateString()}
                  </Text>
                  <Text style={styles.modalAuthor}>{getUserName(selectedReview.userId)}</Text>

                  <Text style={styles.modalLabel}>Avaliação</Text>

                  <Text style={[styles.question, styles.questionWithMargin]}>
                    1. Como avalias a organização do evento?
                  </Text>
                  {renderRatingCircles(selectedReview.question1)}

                  <Text style={[styles.question, styles.questionWithMargin]}>
                    2. Como avalias o ambiente do evento?
                  </Text>
                  {renderRatingCircles(selectedReview.question2)}

                  <Text style={styles.question}>3. O que mais gostaste no evento?</Text>
                  <View style={styles.answerBox}><Text>{selectedReview.question3}</Text></View>

                  <Text style={styles.question}>4. O que achas que pode ser melhorado?</Text>
                  <View style={styles.answerBox}><Text>{selectedReview.question4}</Text></View>

                  <Text style={styles.question}>5. Recomendarias este evento a um amigo?</Text>
                  <View style={styles.answerBox}>
                    <Text>{selectedReview.question5 ? 'Sim' : 'Não'}</Text>
                  </View>

                  <Pressable style={styles.deleteButton} onPress={() => setConfirmVisible(true)}>
                    <Text style={styles.buttonText}>Eliminar Review</Text>
                  </Pressable>

                  <Pressable
                    style={styles.closeButton}
                    onPress={() => {
                      setModalVisible(false);
                      setSelectedReview(null);
                    }}
                  >
                    <Text style={styles.buttonText}>Fechar</Text>
                  </Pressable>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <ConfirmModal
        visible={confirmVisible}
        title="Tens a certeza?"
        message="Esta ação não pode ser desfeita."
        onCancel={() => setConfirmVisible(false)}
        onConfirm={() => {
          deleteReview();
          setConfirmVisible(false);
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#BBCDB7' },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 40 },
  subtitle: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
  box: { width: '100%', height: 440, backgroundColor: '#fff', borderRadius: 20, padding: 14 },

  reviewCard: {
    backgroundColor: '#E0F7FA',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },

  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 6 },
  date: { fontSize: 12, color: '#666', marginBottom: 10 },
  userName: { alignSelf: 'flex-start', fontWeight: '600', fontSize: 15, marginBottom: 10 },

  commentBox: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },

  comment: { fontSize: 14 },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalBox: { width: '85%', height: 520, backgroundColor: '#fff', borderRadius: 20, padding: 20 },

  modalTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  modalDate: { textAlign: 'center', color: '#666', marginBottom: 10 },
  modalAuthor: { fontWeight: '600', marginBottom: 10 },

  modalLabel: { marginTop: 10, fontWeight: 'bold' },

  question: { fontWeight: '600', marginTop: 12, marginBottom: 4 },
  questionWithMargin: { marginBottom: 8 },

  answerBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 10,
    marginVertical: 6,
    backgroundColor: '#F5F7F4',
  },

  closeButton: {
    backgroundColor: '#2EC4C6',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },

  deleteButton: {
    backgroundColor: '#FF4C4C',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },

  buttonText: { color: '#fff', fontWeight: '600' },

  circleContainer: { flexDirection: 'row', marginTop: 4, marginBottom: 10 },

  circle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginHorizontal: 3,
    borderWidth: 1,
    borderColor: '#ccc',
  },

  circleFilled: { backgroundColor: '#2EC4C6', borderColor: '#2EC4C6' },
  circleEmpty: { backgroundColor: '#fff', borderColor: '#ccc' },
});
