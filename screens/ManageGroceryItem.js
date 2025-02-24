import { useContext, useLayoutEffect, useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import GroceryForm from '../components/ManageMeal/GroceryForm';
import ErrorOverlay from '../components/UI/ErrorOverlay';
import IconButton from '../components/UI/IconButton';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import { GlobalStyles } from '../constants/styles';
import { ListsContext } from '../store/lists-context';
import { MealsContext } from '../store/meals-context';
import { storeList, updateList, deleteList } from '../util/http-list';
import { updateMeal } from '../util/http';

function ManageGroceryItem({ route, navigation }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState();

  const groceriesCtx = useContext(ListsContext);
  const mealsCtx = useContext(MealsContext);
  

  const editedGroceryId = route.params?.groceryId;
  let meal = route.params?.meal;
  let groceryItem = route.params?.item;
  // console.log("ManageGroceryItem editedGroceryId: ",editedGroceryId);
  // console.log("ManageGroceryItem meal: ",meal);
  // console.log("ManageGroceryItem groceryItem: ",groceryItem);
  //const groceryItem =groceriesCtx.pullMeal(editedGroceryId,groceriesCtx);
  
  useLayoutEffect(() => {
    if(!groceryItem){
      groceryItem = "No grocery item"
    }else{
      if(!groceryItem.qty){
        groceryItem = groceriesCtx.lists.find(
          (list) => list.id?list.id:list.thisId === editedGroceryId
        );
      }
    }
    if(!meal){
      meal = "No meal"
    }else{
      if(!meal.date){
        meal = mealsCtx.meals.find(
          (meal) => meal.id === groceryItem.mealId
        );
      }
    }
    
  }, [editedGroceryId]);

  const isEditing = !!editedGroceryId;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Edit Grocery List' : 'Add Grocery List',
    });
  }, [navigation, isEditing]);

  /////////////////////////////////////////////////////
  function deleteFromGroceryCtx(thisId){
    console.log("ManageGroceryItem before delete",groceriesCtx.lists)
    // console.log("MealForm2 thisId",thisId)
    const updatedGroceries1 = groceriesCtx.lists.filter(grocery => grocery.thisId !== thisId);
    const updatedGroceries = updatedGroceries1.filter(grocery => grocery.id !== thisId);
    groceriesCtx.setLists(updatedGroceries);
    console.log("ManageGroceryItem after delete",updatedGroceries);
  }
  /////////////////////////////////////////////////////

async function deleteGroceryHandler() {
  setIsSubmitting(true);
  try {
    console.log("ManageGroceryItem deleteGroceryHandler")
    if(editedGroceryId){
      console.log("ManageGroceryItem id: ",editedGroceryId)
      //delete grocery item from firebase http
      await deleteList(editedGroceryId);

      //delete grocery item from grocery ctx
      deleteFromGroceryCtx(editedGroceryId)
      //groceriesCtx.deleteList(itemData.item.id);

      // // //update meal state
      // const selectedList2 = groceriesCtx.lists.find(
      //   (list) => list.id?list.id:list.thisId === editedGroceryId
      // );
      console.log("ManageGroceryItem groceryItem: ",groceryItem);
      //update mealsCtx
      if(groceryItem.mealId){

        const meal3 = mealsCtx.meals.find(
          (meal) => meal.id === groceryItem.mealId
        );

        if(meal3){
          console.log("ManageGroceryItem selectedMeal",meal3)
          await createMealWithoutGroceryItem(meal3,editedGroceryId);
          navigation.goBack();
        }else{
          console.log("ManageGroceryItem no id");
        }
      }else{
        console.log("ManageGroceryItem no mealId");
        navigation.goBack();
      }
    }else{
      console.log("ManageGroceryItem no editedGroceryId");
    }
  } catch (error) {
    console.log("Error:",error)
    setError('Could not delete grocery list item - please try again later!');
    setIsSubmitting(false);
  }
}

/////////////////////////////////////////////////////

  async function createMealWithoutGroceryItem(theMeal,thisId){

    let newGroceryList = []
    theMeal.groceryItems.map((item) => {
      const groceryItem = { description: item.description, qty: item.qty, checkedOff: item.checkedOff, mealId: item.mealId,thisId: item.thisId, id:item.id?item.id:item.thisId };
      //This adds back all grocery items but the one with thisId
      if(item.thisId !== thisId){
        newGroceryList.push(groceryItem);
      }
    });
    let updatedMeal;
    let noGroceries;
    if(newGroceryList.length>0){
      updatedMeal={
        date: theMeal.date,
        description: theMeal.description,
        id: theMeal.id,
        groceryItems: newGroceryList,
      }
    }else{
      noGroceries = true;
      updatedMeal={
        date: theMeal.date,
        description: theMeal.description,
        id: theMeal.id,
      }
    }
    
    const currentMealData = mealsCtx.meals.find(
      (meal) => meal.id === thisId
    );

    console.log("ManageGroceryItem updatedMeal: ",updatedMeal)
    //update meal in firebase
    //updateMeal(thisId,updatedMeal)
    await updateMeal(updatedMeal.id,updatedMeal,currentMealData, addCtxList, deleteCtxList, noGroceries)
    //mealId, mealData,currentMealData, addCtxList, deleteCtxList,noGroceries
    //update meal in ctx
    mealsCtx.updateMeal(updatedMeal.id,updatedMeal)
    //mealsCtx.updateMeal(thisId,updatedMeal)
  }
  /////////////////////////////////////////////////////

  function addCtxList(updatedGrocery,responseGrocery){
    try{
      console.log("ManageMeal addCtxlist")
      //setNewItemId(responseGrocery.data.name);
      //console.log("ManageMeals newItemId: ", newItemId)
      console.log("ManageMeals newItemId2: ", responseGrocery.data.name)
      const groceryItem={
        ...updatedGrocery, thisId: responseGrocery.data.name
      };
      //const groceryId = responseGrocery.data.name;
      updateList(responseGrocery.data.name,groceryItem);
      groceriesCtx.addList(groceryItem);
    }catch(error){
      console.error("ManageMeal addCtxList Error:", error);
    }
  }

  function deleteCtxList(groceryItem){
    console.log("ManageMeal delete groceryItem: ",groceryItem)
    groceriesCtx.deleteList(groceryItem);
  }

  function cancelHandler() {
    navigation.goBack();
  }

  async function confirmHandler(groceryData) {
    setIsSubmitting(true);
    try {
      if (isEditing) {
        groceriesCtx.updateList(editedGroceryId, groceryData);
        await updateList(editedGroceryId, groceryData);
        
      } else {
        const id = await storeList(groceryData);
        groceriesCtx.addList({ ...groceryData, id: id });
      }
      navigation.goBack();
    } catch (error) {
      setError('Could not save data - please try again later!');
      setIsSubmitting(false);
    }
  }

  //prepare the overlays if they are needed.
  if (error && !isSubmitting) {
    return <ErrorOverlay message={error} />;
  }

  if (isSubmitting) {
    return <LoadingOverlay />;
  }

  return (
    <View style={styles.container}>
      <GroceryForm
        submitButtonLabel={isEditing ? 'Update' : 'Add'}
        onSubmit={confirmHandler}
        onCancel={cancelHandler}
        defaultValues={groceryItem}
        defaultMealDesc={meal?meal:""}
      />
      {isEditing && (
        <View style={styles.deleteContainer}>
          <IconButton
            icon="trash"
            color={GlobalStyles.colors.error500}
            size={36}
            onPress={deleteGroceryHandler}
          />
        </View>
      )}
    </View>
  );
}

export default ManageGroceryItem;

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
