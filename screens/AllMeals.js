import { useContext } from 'react';

import MealsOutput from '../components/MealsOutput/MealsOutput';
import { MealsContext } from '../store/meals-context';

function AllMeals() {
  const mealsCtx = useContext(MealsContext);

  return (
    <MealsOutput
      meals={mealsCtx.meals}
      fallbackText="No registered meals found!"
    />
  );
}

export default AllMeals;
