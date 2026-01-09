import { View, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import reviewQuestionsJson from '@/data/reviewQuestions.json';
import reviewsData from '@/data/reviews.json';
import { Question } from '@/src/components/reviews/Question';
import { ProgressBar } from '@/src/components/reviews/ProgressBar';
import { NavigationButtons } from '@/src/components/reviews/NavigationButtons';
import { createReview } from '@/src/utils/reviewUtils';
import { Question as QuestionType } from '@/src/types/questionTypes';

export default function CreateReviewScreen() {
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
  const handleSubmit = () => {
    const updatedReviews = createReview(review, reviewsData.reviews, 3);
    console.log('New reviews array:', updatedReviews);

    // Reset form
    setStep(0);
    setReview(initialReview);
  };

  // Group questions per page: two per page, last page may have only one
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
        {/* Progress Bar */}
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
