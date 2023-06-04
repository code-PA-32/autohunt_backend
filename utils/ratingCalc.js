export const calculateRatingStats = (ratings) => {
  const ratingCount = ratings.length;
  let totalRating = 0;

  for (const rating of ratings) {
    totalRating +=
      rating.stared.Comfort +
      rating.stared.Design +
      rating.stared.Performance +
      rating.stared.Price +
      rating.stared.Reliability;
  }

  const averageRating = +(totalRating / (ratingCount * 5)).toFixed(1);

  return {
    ratingCount,
    averageRating,
  };
};
