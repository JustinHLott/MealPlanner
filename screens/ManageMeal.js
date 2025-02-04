import { useContext, useLayoutEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import MealForm from '../components/ManageMeal/MealForm';
import ErrorOverlay from '../components/UI/ErrorOverlay';
import IconButton from '../components/UI/IconButton';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import { GlobalStyles } from '../constants/styles';
import { MealsContext } from '../store/meals-context';
import { storeMeal, updateMeal, deleteMeal } from '../util/http';

function ManageMeal({ route, navigation }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState();

  const mealsCtx = useContext(MealsContext);

  const editedMealId = route.params?.mealId;
  const isEditing = !!editedMealId;

  const selectedMeal = mealsCtx.meals.find(
    (meal) => meal.id === editedMealId
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Edit Meal' : 'Add Meal',
    });
  }, [navigation, isEditing]);

  async function deleteMealHandler() {
    setIsSubmitting(true);
    try {
      await deleteMeal(editedMealId);
      mealsCtx.deleteMeal(editedMealId);
      navigation.goBack();
    } catch (error) {
      setError('Could not delete meal - please try again later!');
      setIsSubmitting(false);
    }
  }

  function cancelHandler() {
    navigation.goBack();
  }

  async function confirmHandler(mealData) {
    setIsSubmitting(true);
    try {
      if (isEditing) {
        mealsCtx.updateMeal(editedMealId, mealData);
        await updateMeal(editedMealId, mealData);
      } else {
        const id = await storeMeal(mealData);
        mealsCtx.addMeal({ ...mealData, id: id });
      }
      navigation.goBack();
    } catch (error) {
      setError('Could not save data - please try again later!');
      setIsSubmitting(false);
    }
  }

  if (error && !isSubmitting) {
    return <ErrorOverlay message={error} />;
  }

  if (isSubmitting) {
    return <LoadingOverlay />;
  }

  return (
    <View style={styles.container}>
      <MealForm
        submitButtonLabel={isEditing ? 'Update' : 'Add'}
        onSubmit={confirmHandler}
        onCancel={cancelHandler}
        defaultValues={selectedMeal}
      />
      {isEditing && (
        <View style={styles.deleteContainer}>
          <IconButton
            icon="trash"
            color={GlobalStyles.colors.error500}
            size={36}
            onPress={deleteMealHandler}
          />
        </View>
      )}
    </View>
  );
}

export default ManageMeal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: GlobalStyles.colors.primary800,
  },
  deleteContainer: {
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: GlobalStyles.colors.primary200,
    alignItems: 'center',
  },
});
