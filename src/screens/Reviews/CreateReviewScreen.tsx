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

  /**
   * STATE INITIALIZATION:
   * Dynamically creates the initial state object based on JSON IDs and types.
   */
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

      /** * PERSISTENCE: 
       * Saves the review answers and the privacy preference (isAnonymous).
       */
      const newReview = await createReview(review, userId, recipeId, isAnonymous);
      console.log(newReview);
      
      
      /** * LOCAL SYNC: 
       * Updates local user history to mark this recipe as reviewed/completed.
       */
      const storedUserRecipes = (await getItem('user_recipes')) || [];
      const newUserRecipe = {
        id: storedUserRecipes.length + 1,
        userId,
        recipeId,
        assignedAt: new Date().toISOString(),
      };
      await setItem('user_recipes', [...storedUserRecipes, newUserRecipe]);

      // Reset state and redirect to success screen
      setStep(0);
      setReview(initialReview);
      setIsAnonymous(false);
      router.push('/reviews/reviewComplete');
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  /**
   * PAGINATION LOGIC:
   * Splits the questions array into chunks (2 per page).
   */
  const questionsPerPage = 2;
  const totalPages = Math.ceil(reviewQuestions.questions.length / questionsPerPage);
  const startIndex = step * questionsPerPage;
  const pageQuestions: QuestionType[] = reviewQuestions.questions.slice(
    startIndex,
    startIndex + questionsPerPage
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 32 }}>
        <ProgressBar step={step} />

        <View style={styles.headerContainer}>
          <Text style={styles.eventTitle}>Confraria da Abóbora</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.eventSubtitle}>Dinner - </Text>
            <Text style={styles.eventSubtitle}>24/10/2026</Text>
          </View>
        </View>

        {/* Render current page questions */}
        {pageQuestions.map((q) => (
          <View key={q.id} style={{ marginBottom: 32 }}>
            <Question 
               question={q} 
               value={review[q.id]} 
               onChange={handleChange} 
            />
          </View>
        ))}

        {/* PRIVACY TOGGLE: Only visible on the final step of the form */}
        {step === totalPages - 1 && (
          <View style={styles.anonymousCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.anonymousLabel}>Submeter como anónimo?</Text>
              <Text style={styles.anonymousSub}>O teu nome não será visível para os outros alunos.</Text>
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
  headerContainer: { 
    marginBottom: 24, 
    alignItems: 'center' 
  },
  eventTitle: { 
    fontFamily: 'georamaSemiBold', 
    fontSize: 20, 
    marginBottom: 6 
  },
  eventSubtitle: { 
    fontFamily: 'livvicRegular', 
    fontSize: 14, 
    color: '#666' 
  },
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
  anonymousLabel: { 
    fontFamily: 'georamaSemiBold', 
    fontSize: 16, 
    color: '#333' 
  },
  anonymousSub: { 
    fontFamily: 'livvicRegular', 
    fontSize: 12, 
    color: '#777',
    marginTop: 2
  },
  footer: { 
    padding: 20, 
    borderTopWidth: 1, 
    borderTopColor: '#eee' 
  }
});