import { createContext, useReducer } from 'react';

export const MealsContext = createContext({
  meals: [],
  addMeal: ({ description, date }) => {},
  setMeals: (meals) => {},
  deleteMeal: (id) => {},
  updateMeal: (id, { description, date }) => {},
});

function mealsReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return [action.payload, ...state];
    case 'SET':
      const inverted = action.payload.reverse();
      return inverted;
    case 'UPDATE':
      const updatableMealIndex = state.findIndex(
        (meal) => meal.id === action.payload.id
      );
      const updatableMeal = state[updatableMealIndex];
      const updatedItem = { ...updatableMeal, ...action.payload.data };
      const updatedMeals = [...state];
      updatedMeals[updatableMealIndex] = updatedItem;
      return updatedMeals;
    case 'DELETE':
      return state.filter((meal) => meal.id !== action.payload);
    default:
      return state;
  }
}

function MealsContextProvider({ children }) {
  const [mealsState, dispatch] = useReducer(mealsReducer, []);

  function addMeal(mealData) {
    dispatch({ type: 'ADD', payload: mealData });
  }

  function setMeals(meals) {
    dispatch({ type: 'SET', payload: meals });
  }

  function deleteMeal(id) {
    dispatch({ type: 'DELETE', payload: id });
  }

  function updateMeal(id, mealData) {
    dispatch({ type: 'UPDATE', payload: { id: id, data: mealData } });
  }

  const value = {
    meals: mealsState,
    setMeals: setMeals,
    addMeal: addMeal,
    deleteMeal: deleteMeal,
    updateMeal: updateMeal,
  };

  return (
    <MealsContext.Provider value={value}>
      {children}
    </MealsContext.Provider>
  );
}

export default MealsContextProvider;
