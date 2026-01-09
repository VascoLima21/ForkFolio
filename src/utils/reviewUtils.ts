export const createReview = (
  review: Record<number, any>,
  reviewsData: any[],
  userId = 1
) => {
    console.log(review);
    
  const newReview = {
    id: reviewsData.length + 1,
    userId,
    reviewId: reviewsData.length + 1,
    question1: review[1],
    question2: review[2],
    question3: review[3],
    question4: review[4],
    question5: review[5],
    createdAt: new Date().toISOString(),
  };

  return [...reviewsData, newReview]; // returns the new updated array
};
