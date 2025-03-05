import { useContext, useLayoutEffect, useState, useCallback, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-virtualized-view'
import axios from 'axios';
const BACKEND_URL =
  'https://justinhlottcapstone-default-rtdb.firebaseio.com';

//import MealForm from '../components/ManageMeal/MealForm';
import MealForm2 from '../components/ManageMeal/MealForm2';
import ErrorOverlay from '../components/UI/ErrorOverlay';
import IconButton from '../components/UI/IconButton';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import { GlobalStyles } from '../constants/styles';
import { MealsContext } from '../store/meals-context';
import { ListsContext } from '../store/lists-context';
import { storeMeal, updateMeal, deleteMeal } from '../util/http';
import { storeList, deleteList, updateList } from '../util/http-list';
//import MealGroceries from '../components/MealsOutput/MealGroceries';
import { getDateMinusDays } from "../util/date";

let theID ="";

function ManageMeal({ route, navigation }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState();
  //const [newGroceryItem,setNewGroceryItem] = useState({});
  const [theMeal,setTheMeal] = useState({});
  //const [newGroceryList1,setNewGroceryList1] = useState([]);

  const mealsCtx = useContext(MealsContext);
  const listsCtx = useContext(ListsContext);

  const editedMealId = route.params?.mealId;
  const isEditing = !!editedMealId;

  //let newGroceryList = [];
  useEffect(()=>{
    if(editedMealId){
      setTheMeal(mealsCtx.meals.find(
      (meal) => meal.id === editedMealId
    ));
    }
  },[]);

  useEffect(()=>{
    if(editedMealId){
      setTheMeal(mealsCtx.meals.find(
      (meal) => meal.id === editedMealId
    ));
    }
  },[mealsCtx.meals,deleteMealHandler])
  

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Edit Meal' : 'Add Meal',
    });
  }, [navigation, isEditing]);

  async function deleteMealHandler() {
    setIsSubmitting(true);
    //delete the grocery items associated with the meal
    try {
      const currentMeal = mealsCtx.meals.find((meal) => meal.id === editedMealId);
      currentMeal.groceryItems.forEach((item)=>{
        //console.log("Grocery items delete:",item);
        //deletes from context
        deleteFromGroceryCtx(item.thisId);
        //deletes from firebase
        deleteList(item.thisId);
      })
      if(listsCtx.lists.length === 0){
        listsCtx.setLists([]);
      }
      //navigation.goBack();
    } catch (error) {
      setError('Could not delete grocery item - please try again later!');
      setIsSubmitting(false);
    }
    //delete the meal
    try {
      await deleteMeal(editedMealId);
      mealsCtx.deleteMeal(editedMealId);
      navigation.goBack();
    } catch (error) {
      setError('Could not delete meal - please try again later!');
      setIsSubmitting(false);
    }
  }

  function deleteFromGroceryCtx(thisId){
    // console.log("MealForm2 before delete",listsCtx.lists)
    // console.log("MealForm2 thisId",thisId)
    if(listsCtx.lists.find(
      (theList) => thisId === theList.id?theList.id:theList.thisId
    )){
      const updatedGroceries1 = listsCtx.lists.filter(grocery => grocery.thisId !== thisId);
      const updatedGroceries = updatedGroceries1.filter(grocery => grocery.id !== thisId);
      listsCtx.setLists(updatedGroceries);
    }else{
      console.log("ManageMeal, no selectedMeal")
    }
    // console.log("MealForm2 after delete",updatedGroceries);
  }
  // function first(updatedGrocery){
  //   setNewItemId(storeList(updatedGrocery));
  //   console.log("ManageMeals newItemId: ", newItemId)
  //   console.log("first");
  // }
  // function second(updatedGrocery){
  //   setNewGroceryItem({
  //     ...updatedGrocery,id: newItemId, thisId: newItemId
  //   });
  //   console.log("second");
  //   console.log("ManageMeal add groceryItem: ",newGroceryItem)
  // }
  // function third(newGroceryItem){
  //   console.log("ManageMeal add groceryItem: ",newGroceryItem)
  //   listsCtx.addList(newGroceryItem);
  //   console.log("third");
  // }

  // const runFunctionsInOrder = useCallback((updatedGrocery)=>{
  //   first(updatedGrocery);
  //   second(updatedGrocery);
  //   third(newGroceryItem);
  // },[]);

function updateCtxList(updatedGrocery,id){
  console.log("ManageMeal updateCtxlist:",updatedGrocery,id);
  listsCtx.updateList(id,updatedGrocery);
}

// function addGroceriesToMeal(newMeal){
//   const newMeal2={
//     ...newMeal, groceryItems: newGroceryItem
//   }
//   if(newMeal2){
//     return newMeal2;
//   }
// }

  async function addCtxList(updatedGrocery,id){
    try{
      console.log("ManageMeal addCtxlist")
      //setNewItemId(responseGrocery.data.name);
      //console.log("ManageMeals newItemId: ", newItemId)
      console.log("ManageMeals newItemId2: ", id)
      const groceryItem={
        thisId: id,
        checkedOff: updatedGrocery.checkedOff,
        mealDesc: updatedGrocery.mealDesc,
        mealId: updatedGrocery.mealId,
        description: updatedGrocery.description,
        qty: updatedGrocery.qty
      };

      //this adds the grocery item to the groceryItems for the meal
      //setNewGroceryItem([...newGroceryItem,groceryItem]);
      listsCtx.addList(groceryItem);
    }catch(error){
      console.error("ManageMeal addCtxList Error:", error);
    }
  }

  async function updateCtxMeal(updatedGrocery,id,mealId,mealData){
    try{
      console.log("ManageMeal updateCtxMeal")
      //setNewItemId(responseGrocery.data.name);
      //console.log("ManageMeals newItemId: ", newItemId);
      console.log("ManageMeals newItemId3: ", id)
      const groceryItem={
        thisId: id,
        checkedOff: updatedGrocery.checkedOff,
        mealDesc: updatedGrocery.mealDesc,
        mealId: updatedGrocery.mealId,
        description: updatedGrocery.description,
        qty: updatedGrocery.qty
      };
      //get currrent meal from ctx with all the updates so far.
      const currentMeal = mealsCtx.meals.find((meal) => meal.id === mealId)
      //loop through grocery items and add all but the current grocery item.
      const newGroceryList = currentMeal.groceryItems;
      let newGroceryList2=[];
      newGroceryList.forEach((item)=>{
        if(item.thisId!==id && typeof item.id!=="undefined"){
          console.log("ManageMeal updateCtxMeal found undefined", item)
          newGroceryList2.push(item);
        }
      });
      console.log("ManageMeal newGroceryList2",newGroceryList2)
      //this adds the new updated grocery item to the other items on the grocery list.
      let newGroceryList3=[...newGroceryList2,groceryItem];
      console.log("ManageMeal newGroceryList3",newGroceryList3)
      let currentMeal2
      
      //creates the current meal with the newly updated grocery item.
      currentMeal2 = {
        id: mealData.id,
        date: mealData.date,
        description: mealData.description,
        groceryItems: newGroceryList3
      };
      //updates the context for meals with the updated meal info
      mealsCtx.updateMeal(mealId,mealData);
      //updates state for current sheet
      setTheMeal(mealData);
      //updates the meal in firebase
      axios.put(BACKEND_URL + `/meals3/${mealId}.json`, currentMeal2);
      console.log("ManageMeal updateCtxMeal2:",currentMeal2);
      //}
    }catch(error){
      console.error("ManageMeal addCtxList Error:", error);
    }
  }

  function deleteCtxList(groceryItem){
    console.log("ManageMeal delete groceryItem: ",groceryItem)
    const currentMeal = mealsCtx.meals.find((meal) => meal.id === editedMealId)
    if(currentMeal){
      const updatedGroceries1 = currentMeal.groceryitems.filter(grocery => grocery.thisId !== groceryItem.thisId);
      const updatedGroceries = updatedGroceries1.filter(grocery => grocery.id !== groceryItem.id);

      console.log("ManageMeals delete groceryItem meal:",
        {
          id: currentMeal.id,
          date: currentMeal.date,
          groceryItems: updatedGroceries
        });
      //update the state for the page.
      setTheMeal({
        id: currentMeal.id,
        date: currentMeal.date,
        description: currentMeal.description,
        groceryItems: updatedGroceries
      })
    }
    //update the groceries ctx list
    listsCtx.deleteList(groceryItem);
  }

  function addCtxMeal(updatedMeal,mealId){
    console.log("ManageMeal addCtxMeal: ",updatedMeal)
    //updates state for current sheet
    setTheMeal(updatedMeal);
    mealsCtx.addMeal({ ...updatedMeal, id: mealId });//This adds the meal to the Context in the app
  }

  async function confirmHandler(mealData, noGroceries) {
    //let noGroceries = true;
    console.log("Makes it to confirmHandler in ManageMeals")
    //console.log(mealData);
    setIsSubmitting(true);
    try {
      if (isEditing) {
        console.log("ManageMeal updatinging.  noGroceries:",noGroceries)
        //array.length = 0;//This resets the grocery array.
        //setNewGroceryItem([]);
        updateMeal(mealData.id, mealData, theMeal, addCtxList, updateCtxMeal, deleteCtxList,updateCtxList,noGroceries);
        //mealsCtx.updateMeal(mealData.id, mealData);
        //maybe delete then add again instead of updating the meal?
        //also must add meal to ctx and add groceries to ctx.
        navigation.goBack();
      } else {
        console.log("ManageMeal adding")
        const id = await storeMeal(mealData,addCtxList,addCtxMeal);//This adds the meal to firebase
        console.log("ManageMeal finishes adding")
        theID = id;
        mealsCtx.dates.push(mealData.date);
        console.log("Made it to savePromises")
        //await Promise.all(savePromises);
        navigation.goBack();
      }
      
    } catch (error) {
      console.log("ManageMeal save error:",error)
      //setError('Could not save data - please try again later!',error);
      setIsSubmitting(false);
    }
  }

  

  function getLatestDate(){
    let mostRecentMealDate=getDateMinusDays(new Date(),1);
    if(mealsCtx.meals.length>0){
      mostRecentMealDate = mealsCtx.meals.reduce((meal, latest) => new Date(meal.date) > new Date(latest.date) ? meal : latest).date;
    }else{
      mostRecentMealDate =  new Date();
    }
    //Add one day to the most recent date
    //const date = new Date();
    const date = new Date(mostRecentMealDate);
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
      {/* {console.log("managemeal")}
      {console.log(selectedMeal)} */}
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
          //id={theID}
          initialMeal={theMeal}
          defaultDate={getLatestDate()}
          //defaultDate={new Date()}
          //onCancel={cancelHandler}
          onSubmit={confirmHandler}
          submitButtonLabel={isEditing ? 'Update' : 'Add'}
        />
        {/*This delete the meal*/}
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
