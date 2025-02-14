import { useContext, useLayoutEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-virtualized-view'
import firestore from "@react-native-firebase/firestore";

import MealForm from '../components/ManageMeal/MealForm';
import MealForm2 from '../components/ManageMeal/MealForm2';
import ErrorOverlay from '../components/UI/ErrorOverlay';
import IconButton from '../components/UI/IconButton';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import { GlobalStyles } from '../constants/styles';
import { MealsContext } from '../store/meals-context';
import { ListsContext } from '../store/lists-context';
import { storeMeal, updateMeal, deleteMeal } from '../util/http';
import MealGroceries from '../components/MealsOutput/MealGroceries';

let theID ="";

function ManageMeal({ route, navigation }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [latestDate, setLatestDate] = useState();
  const [error, setError] = useState();

  const mealsCtx = useContext(MealsContext);
  const listsCtx = useContext(ListsContext);

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
    console.log("Makes it to confirmHandler in ManageMeals")
    console.log(mealData);
    setIsSubmitting(true);
    try {
      if (isEditing) {
        console.log("Makes it to editing.  MealID:"+editedMealId)
        mealsCtx.updateMeal(editedMealId, mealData);
        await updateMeal(editedMealId, mealData);
      } else {
        console.log("Makes it to adding")
        const id = await storeMeal(mealData);//This adds the meal to firebase
        console.log("finishes adding")
        theID = id;
        mealsCtx.dates.push(mealData.date);
        //console.log(mealsCtx.dates);
        mealsCtx.addMeal({ ...mealData, id: id });//This adds the meal to the Context in the app
        //const listId = await saveGroceryItems(mealData,id);//This adds all grocery items to the grocery list
         mealData.groceryItems.map((item, index) => {
          console.log("storeList");
          const groceryItem = { item: index+1, description: item.name, qty: item.quantity, checkedOff: item.checkOff, id: id };
          
          //console.log(meal.id);

          listsCtx.addList ( groceryItem );
          console.log("ctxList item added");
          // console.log(listsCtx.lists);
          //listsCtx.addList ( index+1, item.name, item.quantity, item.checkedOff, meal.id )
          
        });
        // Wait for all items to be saved
        console.log("Made it to savePromises")
        //await Promise.all(savePromises);
      }
      navigation.goBack();
    } catch (error) {
      setError('Could not save data - please try again later!');
      setIsSubmitting(false);
    }
  }

  async function saveGroceryItems(mealData,id){
    mealData.groceryItems.map((item, index) => {
      const groceryItem = { item: index+1, description: item.name, qty: item.quantity, checkedOff: item.checkOff, id: meal.id };
      console.log("storeList");
      console.log(meal.id);
       storeList(groceryItem);
      //listsCtx.addList ( index+1, item.name, item.quantity, item.checkedOff, meal.id )
      listsCtx.addList ( groceryItem );
      console.log("ctxList");
      console.log(listsCtx.lists);
    });
  }

  function getLatestDate(){
    const mostRecentMealDate = mealsCtx.meals.reduce((meal, latest) => new Date(meal.date) > new Date(latest.date) ? meal : latest);
    //Add one day to the most recent date
    //const date = new Date();
    const date = new Date(mostRecentMealDate.date);
    date.setDate(date.getDate() + 1);
    return mostRecentMealDate;
  }

  const  addRows = (rows) => {
    if (rows) {

      //Use Context here to add the grocery item to the big list.
        //use the item of the ???not sure which item to use yet.
      // setData([...data, { id: Date.now().toString(), name, qty:(!qty? 1:qty)}]);
      // setName("");
      // setQty("");
      
    }
  };

  if (error && !isSubmitting) {
    return <ErrorOverlay message={error} />;
  }

  if (isSubmitting) {
    return <LoadingOverlay />;
  }

  return (
    <View style={styles.container}>
      {console.log("managemeal")}
      {console.log(selectedMeal)}
      <ScrollView
        keyboardShouldPersistTaps="handled"//This makes it so you can click a button while the keyboard is up
      >
        {/* <MealForm
          submitButtonLabel={isEditing ? 'Update' : 'Add'}
          onSubmit={confirmHandler}
          onCancel={cancelHandler}
          defaultValues={selectedMeal}
          defaultDate={getLatestDate()}
        /> */}
        <MealForm2
          id={theID}
          initialMeal={selectedMeal}
          defaultDate={getLatestDate()}
          //defaultDate={new Date()}
          onCancel={cancelHandler}
          onSubmit={confirmHandler}
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
      
        {/* <MealGroceries addRows={addRows}/> */}
      </ScrollView>
      
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
