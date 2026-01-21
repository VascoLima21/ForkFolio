import { View, ScrollView, Text, Switch, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useLocalSearchParams, router } from 'expo-router';

import reviewQuestionsJson from '@/data/reviewQuestions.json';
import { getEventById } from '@/src/utils/events';
import { getItem, setItem } from '@/src/utils/storage';
import { getUserLogged } from '@/src/utils/users';

import { Question } from '@/src/components/reviews/Question';
import { ProgressBar } from '@/src/components/reviews/ProgressBar';
import { NavigationButtons } from '@/src/components/reviews/NavigationButtons';
import { createReview } from '@/src/utils/reviews';
import { Question as QuestionType } from '@/src/types/questionTypes';

export default function CreateReviewScreen() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();

  const [step, setStep] = useState(0);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [event, setEvent] = useState<any>(null);

  const reviewQuestions: { questions: QuestionType[] } = {
    questions: reviewQuestionsJson.questions as QuestionType[],
  };

  useEffect(() => {
    const fetchEvent = async () => {
      const eventData = await getEventById(Number(eventId));
      setEvent(eventData);
    };
    fetchEvent();
  }, [eventId]);

  /** * Initial State Setup
   * Sets initial values to null for rating, slider, and choice 
   * to strictly track if the user has interacted with the question.
   */
  const initialReview: Record<number, any> = {};
  reviewQuestions.questions.forEach((q) => {
    if (q.type === 'text') {
      initialReview[q.id] = '';
    } else {
      initialReview[q.id] = null;
    }
  });

  const [review, setReview] = useState(initialReview);

  const handleChange = (id: number, value: any) => {
    setReview({ ...review, [id]: value });
  };

  /**
   * Cancel Logic
   * Displays a confirmation alert before exiting the screen.
   */
  const handleCancel = () => {
    Alert.alert(
      "Cancelar Avaliação",
      "Tens a certeza que pretendes sair? Todo o progresso atual será perdido.",
      [
        { text: "Continuar a responder", style: "cancel" },
        {
          text: "Sair e Perder Dados",
          style: "destructive",
          onPress: () => router.back()
        }
      ]
    );
  };

  /**
   * Validation Logic
   * Validates only the questions present on the current page.
   * Question with ID 6 is optional. All other questions are mandatory.
   */
  const isStepValid = () => {
    const startIndex = step * 2;
    const pageQuestions = reviewQuestions.questions.slice(startIndex, startIndex + 2);

    return pageQuestions.every((q) => {
      const val = review[q.id];

      // If it's question 6, it's always valid (optional).
      if (q.id === 6) {
        return true;
      }

      // For any other text questions, they must not be empty.
      if (q.type === 'text') {
        return val && val.trim().length > 0;
      }

      // Rating, slider, and choice must not be null.
      return val !== null;
    });
  };

  const handleNext = () => {
    if (isStepValid()) {
      setStep(step + 1);
    } else {
      Alert.alert(
        "Perguntas Obrigatórias",
        "Por favor, responde a todas as perguntas obrigatórias antes de continuares."
      );
    }
  };

  const handleSubmit = async () => {
    if (!isStepValid()) {
      Alert.alert(
        "Último Passo",
        "Por favor, preenche as perguntas obrigatórias antes de submeteres."
      );
      return;
    }

    try {
      const loggedUserString = await getUserLogged();
      const userId = Number(loggedUserString);

      if (!userId) {
        Alert.alert(
          "Erro de Sessão",
          "Não foi possível encontrar a tua sessão. Por favor, faz login novamente."
        );
        return;
      }

      const numericEventId = Number(eventId);
      const currentEvent = await getEventById(numericEventId);

      if (!currentEvent) throw new Error("Event not found");
      const recipeId = currentEvent.recipeId;

      /** * Save Review
       * Calls utility to save formatted answers to localStorage.
       */
      await createReview(review, userId, recipeId, isAnonymous);

      /** * Upate User Recipes
       * Adds the recipe to the user's collection upon successful review.
       */
      const storedData = await getItem('user_recipes');
      const currentList = Array.isArray(storedData) ? storedData : (storedData?.user_recipes || []);

      const newUserRecipe = {
        id: currentList.length + 1,
        userId,
        recipeId,
        assignedAt: new Date().toISOString(),
      };

      await setItem('user_recipes', [...currentList, newUserRecipe]);

      // Reste and navigate to reviewComplete screen
      setStep(0);
      setReview(initialReview);
      setIsAnonymous(false);
      router.push('/reviews/reviewComplete');
    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert(
        "Erro",
        "Não foi possível guardar a tua review. Por favor, tenta novamente."
      );
    }
  };

  // Pagination Logic
  const questionsPerPage = 2;
  const totalPages = Math.ceil(reviewQuestions.questions.length / questionsPerPage);
  const startIndex = step * questionsPerPage;
  const pageQuestions = reviewQuestions.questions.slice(startIndex, startIndex + 2);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 32 }}>
        <ProgressBar step={step} />

        <View style={styles.headerContainer}>
          <Text style={styles.eventTitle}>{event?.title || 'A carregar...'}</Text>
          {event?.date && (
            <Text style={styles.eventDate}>{event.date}</Text>
          )}
        </View>

        {pageQuestions.map((q) => (
          <View key={q.id} style={{ marginBottom: 32 }}>
            <Question question={q} value={review[q.id]} onChange={handleChange} />
          </View>
        ))}

        {step === totalPages - 1 && (
          <View style={styles.anonymousCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.anonymousLabel}>Submeter como anónimo?</Text>
              <Text style={styles.anonymousSub}>O teu nome será ocultado.</Text>
            </View>
            <Switch
              value={isAnonymous}
              onValueChange={setIsAnonymous}
              trackColor={{ false: '#ddd', true: '#2f95dc' }}
              thumbColor={isAnonymous ? '#fff' : '#f4f3f4'}
            />
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <NavigationButtons
          step={step}
          totalSteps={totalPages - 1}
          onPrev={() => setStep(step - 1)}
          onNext={handleNext}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: { marginBottom: 24, alignItems: 'center' },
  eventTitle: { fontFamily: 'georamaSemiBold', fontSize: 20, marginBottom: 2 },
  eventDate: { fontFamily: 'georamaRegular', fontSize: 14, color: '#666', marginBottom: 6 },
  anonymousCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    marginTop: 10
  },
  anonymousLabel: { fontFamily: 'georamaSemiBold', fontSize: 16, color: '#333' },
  anonymousSub: { fontFamily: 'livvicRegular', fontSize: 12, color: '#777', marginTop: 2 },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: '#eee' }
});