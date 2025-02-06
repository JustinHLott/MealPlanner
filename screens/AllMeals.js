import { useContext } from 'react';

import MealsOutput from '../components/MealsOutput/MealsOutput';
import { MealsContext } from '../store/meals-context';

function AllMeals() {
  const mealsCtx = useContext(MealsContext);
  const mealsSorted = [...mealsCtx.meals,].sort((a, b) => b.date - a.date);

  return (
    <MealsOutput
      meals={mealsSorted}
      fallbackText="No registered meals found!"
    />
  );
}

export default AllMeals;
