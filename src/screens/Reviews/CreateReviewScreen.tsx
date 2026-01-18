import { View, ScrollView, Text, Switch, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';

import reviewQuestionsJson from '@/data/reviewQuestions.json';
import { getEventById } from '@/src/utils/events';
import { getItem, setItem } from '@/src/utils/storage';

import { Question } from '@/src/components/reviews/Question';
import { ProgressBar } from '@/src/components/reviews/ProgressBar';
import { NavigationButtons } from '@/src/components/reviews/NavigationButtons';
import { createReview } from '@/src/utils/reviews';
import { Question as QuestionType } from '@/src/types/questionTypes';

export default function CreateReviewScreen() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();

  const [step, setStep] = useState(0);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const reviewQuestions: { questions: QuestionType[] } = {
    questions: reviewQuestionsJson.questions as QuestionType[],
  };

  // INITIAL STATE SETUP
  const initialReview: Record<number, any> = {};
  reviewQuestions.questions.forEach((q) => {
    if (q.type === 'rating' || q.type === 'slider') initialReview[q.id] = 0;
    else if (q.type === 'text') initialReview[q.id] = '';
    else if (q.type === 'choice') initialReview[q.id] = null;
  });

  const [review, setReview] = useState(initialReview);

  const handleChange = (id: number, value: any) => {
    setReview({ ...review, [id]: value });
  };

  const handleSubmit = async () => {
    try {
      const userId = 1; 
      const numericEventId = Number(eventId);
      const event = await getEventById(numericEventId);
      const recipeId = event.recipeId;

      /** * SAVE ACTION: 
       * Calls the utility which now correctly maps answers to "questionX" keys.
       */
      await createReview(review, userId, recipeId, isAnonymous);

      // Update User History Logic (User_Recipes)
      const storedUserRecipes = (await getItem('user_recipes')) || [];
      const newUserRecipe = {
        id: storedUserRecipes.length + 1,
        userId,
        recipeId,
        assignedAt: new Date().toISOString(),
      };
      await setItem('user_recipes', [...storedUserRecipes, newUserRecipe]);

      // Reset & Navigate
      setStep(0);
      setReview(initialReview);
      setIsAnonymous(false);
      router.push('/reviews/reviewComplete');
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  // Pagination Logic
  const questionsPerPage = 2;
  const totalPages = Math.ceil(reviewQuestions.questions.length / questionsPerPage);
  const startIndex = step * questionsPerPage;
  const pageQuestions = reviewQuestions.questions.slice(startIndex, startIndex + questionsPerPage);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 32 }}>
        <ProgressBar step={step} />
        
        <View style={styles.headerContainer}>
          <Text style={styles.eventTitle}>Review do Evento</Text>
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
          onNext={() => setStep(step + 1)}
          onSubmit={handleSubmit}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: { marginBottom: 24, alignItems: 'center' },
  eventTitle: { fontFamily: 'georamaSemiBold', fontSize: 20, marginBottom: 6 },
  anonymousCard: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#f8f9fa', borderRadius: 12, borderWidth: 1, borderColor: '#eee', marginTop: 10 },
  anonymousLabel: { fontFamily: 'georamaSemiBold', fontSize: 16, color: '#333' },
  anonymousSub: { fontFamily: 'livvicRegular', fontSize: 12, color: '#777', marginTop: 2 },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: '#eee' }
});