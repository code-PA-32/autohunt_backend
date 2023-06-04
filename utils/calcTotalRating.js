export const calculateAverageRatings = (ratings) => {
  const averages = {};

  if (!ratings || ratings.length === 0) {
    return averages;
  }

  const keys = Object.keys(ratings[0].stared);

  keys.forEach((chapter) => {
    const chapterRatings = ratings.map((item) => item.stared[chapter]);
    const sum = chapterRatings.reduce((acc, rating) => acc + rating, 0);
    const average = sum / chapterRatings.length;
    averages[chapter] = average;
  });

  return averages;
};

export const avrUserRating = (arr) => {
  const ratings = Object.values(arr);
  const sum = ratings.reduce((acc, el) => acc + el, 0);
  return sum / ratings.length;
};
