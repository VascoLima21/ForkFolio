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
  answers: Record<number, any>,
  userId: number,
  recipeId: number,
  isAnonymous: boolean
) => {
  const reviewsData = await getReviews();

  const newReview = {
    id: reviewsData.length + 1,
    userId,
    recipeId,
    // Storing the entire answers object
    answers: answers, 
    isAnonymous,
    createdAt: new Date().toISOString(),
  };

  const updatedReviews = [...reviewsData, newReview];
  await setItem('reviews', updatedReviews);

  return newReview;
};
