import { View, ScrollView, Text } from 'react-native';
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
  const { eventId } = useLocalSearchParams<{ eventId: string}>();

  const [step, setStep] = useState(0);

  // Cast JSON questions to typed Question[]
  const reviewQuestions: { questions: QuestionType[] } = {
    questions: reviewQuestionsJson.questions as QuestionType[],
  };

  // Initialize review state dynamically based on question type
  const initialReview: Record<string, any> = {};
  reviewQuestions.questions.forEach((q) => {
    if (q.type === 'rating' || q.type === 'slider') initialReview[q.id] = 0;
    else if (q.type === 'text') initialReview[q.id] = '';
    else if (q.type === 'choice') initialReview[q.id] = null;
  });

  const [review, setReview] = useState(initialReview);

  // Handle value changes for each question
  const handleChange = (id: number, value: any) => {
    setReview({ ...review, [id]: value });
  };

  // Submit review
  const handleSubmit = async () => {
    try {
      const userId = 1; // replace with user logged when ready
      const numericEventId = Number(eventId)      
          
      const event = await getEventById(numericEventId)
      
      const recipeId = event.recipeId;

      // Creates the review and stores in AsyncStorage            
      const newReview = await createReview(review, userId, recipeId);
      console.log('New Review Created:', newReview);

      // Updates the userRecipes, adding the new userRecipe
      const storedUserRecipes = (await getItem('user_recipes')) || [];
      
      const userRecipes = Array(storedUserRecipes)
      
      const newUserRecipe = {
        id: userRecipes.length + 1,
        userId,
        recipeId,
        assignedAt: new Date().toISOString(),
      };
      await setItem('user_recipes', [...userRecipes, newUserRecipe]);

      // Resets form
      setStep(0);
      setReview(initialReview);

      // Goes to the review complete screen
      router.push('/reviews/reviewComplete');
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  // Group questions per page: two per page, last page has only one because there are five questions in the data
  const questionsPerPage = 2;
  const totalPages = Math.ceil(reviewQuestions.questions.length / questionsPerPage);
  const startIndex = step * questionsPerPage;
  const pageQuestions: QuestionType[] = reviewQuestions.questions.slice(
    startIndex,
    startIndex + questionsPerPage
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Progress Bar */}
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 32 }}>
        <ProgressBar step={step} />

        {/* Event Header */}
        <View style={{ marginBottom: 24, alignItems: 'center' }}>
          <Text
            style={{
              fontFamily: 'georamaSemiBold',
              fontSize: 20,
              marginBottom: 6,
            }}
          >
            Confraria da Abóbora
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              style={{
                fontFamily: 'livvicRegular',
                fontSize: 14,
                color: '#666',
                marginRight: 12,
              }}
            >
              Dinner -
            </Text>
            <Text
              style={{
                fontFamily: 'livvicRegular',
                fontSize: 14,
                color: '#666',
              }}
            >
              24/10/2026
            </Text>
          </View>
        </View>

        {/* Render all questions in this page */}
        {pageQuestions.map((q, index) => (
          <View key={q.id} style={{ marginBottom: 32 }}>
            <Question question={q} value={review[q.id]} onChange={handleChange} />
          </View>
        ))}
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: '#eee' }}>
        <NavigationButtons
          step={step}
          totalSteps={totalPages - 1} // Controls when to show Submit button
          onPrev={() => setStep(step - 1)}
          onNext={() => setStep(step + 1)}
          onSubmit={handleSubmit}
        />
      </View>
    </SafeAreaView>
  );
}
