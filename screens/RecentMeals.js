import { useContext, useEffect, useState } from 'react';

import MealsOutput from '../components/MealsOutput/MealsOutput';
import ErrorOverlay from '../components/UI/ErrorOverlay';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import { MealsContext } from '../store/meals-context';
import { getDateMinusDays } from '../util/date';
import { fetchMeals } from '../util/http';

function RecentMeals() {
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState();

  const mealsCtx = useContext(MealsContext);

  useEffect(() => {
    async function getMeals() {
      setIsFetching(true);
      try {
        const meals = await fetchMeals();
        mealsCtx.setMeals(meals);
      } catch (error) {
        setError('Could not fetch meals!');
      }
      setIsFetching(false);
    }

    getMeals();
  }, []);

  if (error && !isFetching) {
    return <ErrorOverlay message={error} />;
  }

  if (isFetching) {
    return <LoadingOverlay />;
  }

  const recentMeals = mealsCtx.meals.filter((meal) => {
    const today = getDateMinusDays(new Date(),1);
    const datePlus7 = getDateMinusDays(today, -7);

    return meal.date >= today && meal.date <= datePlus7;
  });

  return (
    <MealsOutput
      meals={recentMeals}
      fallbackText="No meals registered for the last 7 days.."
    />
  );
}

export default RecentMeals;
