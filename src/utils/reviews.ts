import { getItem, setItem } from './storage';
import { getEventById } from './events';

/**
 * FETCH REVIEWS
 * Retrieves reviews, handling both direct array format 
 * and the object wrapper format found in your JSON file.
 */
export const getReviews = async () => {
  const data = await getItem('reviews');
  // Checks if data is wrapped in { reviews: [...] } or is already an array
  const reviewsArray = data?.reviews ? data.reviews : data;
  return Array.isArray(reviewsArray) ? reviewsArray : [];
};

export const getReviewById = async (reviewId: number) => {
  const reviews = await getReviews();
  return reviews.find((r: any) => r.id === reviewId) || null;
};

/**
 * CREATE REVIEW
 * Transforms the input answer object (e.g., { 6: "Text" }) 
 * into the flat JSON format (e.g., { "question6": "Text" }).
 */
export const createReview = async (
  answers: Record<number, any>,
  userId: number,
  recipeId: number,
  isAnonymous: boolean
) => {
  const reviewsData = await getReviews();

  // TRANSFORMER logic:
  const formattedAnswers: Record<string, any> = {};
  
  // Iterate over keys (1, 2, ... 6) and create "question1", "question2"...
  Object.keys(answers).forEach((key) => {
    formattedAnswers[`question${key}`] = answers[Number(key)];
  });

  const newReview = {
    id: reviewsData.length + 1,
    // Just for consistency with your JSON sample which has both id and reviewId
    reviewId: reviewsData.length + 1, 
    userId,
    recipeId, // Maps to the event/recipe
    ...formattedAnswers, // Spreads question1, question6, etc. to the root
    isAnonymous,
    createdAt: new Date().toISOString(),
  };

  const updatedReviews = [...reviewsData, newReview];
  
  // Saves directly as an array (or wrap in { reviews: updatedReviews } if you prefer strict JSON match)
  await setItem('reviews', updatedReviews); 

  console.log("Saved Review Structure:", newReview);
  return newReview;
};

export const hasUserReviewedEvent = async (userId: number, eventId: number) => {
  const reviews = await getReviews();
  const event = await getEventById(eventId);

  if (!event) return false;

  // Verifies if the review has that user and recipe
  return reviews.some((r: any) => 
    Number(r.userId) === userId && Number(r.recipeId) === event.recipeId
  );
};