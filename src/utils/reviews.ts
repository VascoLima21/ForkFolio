import { getItem, setItem } from './storage';

export const getReviews = async () => {
  const data = await getItem('reviews');
  return Array.isArray(data) ? data : [];
};

export const getReviewById = async (reviewId: number) => {
  const reviews = await getReviews();
  return reviews.find((r: any) => r.id === reviewId) || null;
};

export const createReview = async (
  review: Record<number, any>,
  userId: number,
  recipeId: number
) => {
  // Always guarantee an array
  const storedReviews = await getItem('reviews');
  const reviewsData = Array.isArray(storedReviews) ? storedReviews : [];

  const newReview = {
    id: reviewsData.length + 1,
    userId,
    recipeId,
    question1: review[1],
    question2: review[2],
    question3: review[3],
    question4: review[4],
    question5: review[5],
    createdAt: new Date().toISOString(),
  };

  const updatedReviews = [...reviewsData, newReview];

  await setItem('reviews', updatedReviews);

  return newReview;
};
