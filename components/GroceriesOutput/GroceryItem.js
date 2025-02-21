import { useState, useContext,useEffect } from 'react';
import { Pressable, StyleSheet, Text, View, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { GlobalStyles } from '../../constants/styles';
import IconButtonNoText from '../UI/IconButtonNoText';
import ErrorOverlay from '../UI/ErrorOverlay'
import LoadingOverlay from '../UI/LoadingOverlay'
import { ListsContext } from '../../store/lists-context';
import { MealsContext } from '../../store/meals-context';
import { deleteList } from '../../util/http-list';
import { updateMeal } from '../../util/http';
//import { getFormattedDate } from '../../util/date';

// const defaultMeal={
//   id:"",
//   date:"",
//   description:"",
//   groceryItems:[]
// }
function GroceryItem({ itemData }) {
  const navigation = useNavigation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState();
  const [meal2, setMeal2] = useState();
  //const [meal, setMeal] = useState(...defaultMeal);
  //const isEditing = !!id;

  const groceriesCtx = useContext(ListsContext);
  const mealsCtx = useContext(MealsContext);

  useEffect(()=>{
    let selectedMeal;
    let selectedList;
    if(itemData.item.id){
      selectedList = groceriesCtx.lists.find(
        //(list) => list.id?list.id:list.thisId === itemData.item.id?itemData.item.id:itemData.item.thisId
        (list) => list.id === itemData.item.id
      );
      //console.log("GroceryItem id: ",selectedList);
    
      selectedMeal = mealsCtx.meals.find(
        (meal) => meal.id === selectedList?.mealId
      );
    }else{
      selectedList = groceriesCtx.lists.find(
        //(list) => list.id?list.id:list.thisId === itemData.item.id?itemData.item.id:itemData.item.thisId
        (list) => list.thisId === itemData.item.thisId
      );
      //console.log("GroceryItem thisId: ",selectedList);
    }

    selectedMeal = mealsCtx.meals.find(
      (meal) => meal.id === selectedList?.mealId
    );
    //console.log("meal1: ", meal);
  
    if(selectedMeal){
      //console.log("GroceryItem foundselectedMeal",selectedMeal.description);
      setMeal2(selectedMeal);
      //console.log("meal2: ", meal);
      selectedMeal = selectedMeal?.description;
    }else{
      selectedMeal={
          id: itemData.item.mealId,
          date:"",
          description:"",
          groceryItems:[]
        };
        setMeal2(selectedMeal);
    }
  },[])

  const selectedList = groceriesCtx.lists.find(
    (list) => list.id === itemData.item.id
  );
  //console.log("groceryItem: ",selectedList);

  let selectedMeal = mealsCtx.meals.find(
    (meal) => meal.id === selectedList?.mealId
  );
  //console.log("meal1: ", meal);

  if(selectedMeal){
    //console.log("foundselectedMeal",selectedMeal.description);
    //setMeal2(selectedMeal);
    //console.log("meal2: ", meal);
    selectedMeal = selectedMeal?.description;
  }else{
    selectedMeal="No Meal";
  }

  function groceryPressHandler() {
    // console.log("GroceryItem id/thisId: ",itemData.item.id?itemData.item.id:itemData.item.thisId);
    // console.log("GroceryItem id: ",itemData.item.id);
    // console.log("GroceryItem thisId: ",itemData.item.thisId);
    navigation.navigate('ManageGroceryItem', {
      groceryId: itemData.item.id?itemData.item.id:itemData.item.thisId,
      item: itemData.item,
      meal: meal2,
    });
  }

  // // Function to delete grocery item
  // const deleteGroceryItem = (id) => {
  //   //console.log("index",id)
  //   console.log("GroceryItem before deleted", id,meal2)
  //   setMeal2((prevMeal) => ({
  //     ...prevMeal,
  //     groceryItems: prevMeal.groceryItems.filter((_, i) => i !== id),
  //   }));
  //   console.log("GroceryItem after deleted", meal2)
  // };

    /////////////////////////////////////////////////////
    function deleteFromGroceryCtx(thisId){
      //console.log("GroceryIte before delete",groceriesCtx.lists)
      // console.log("MealForm2 thisId",thisId)
      const updatedGroceries1 = groceriesCtx.lists.filter(grocery => grocery.thisId !== thisId);
      const updatedGroceries = updatedGroceries1.filter(grocery => grocery.id !== thisId);
      groceriesCtx.setLists(updatedGroceries);
      //console.log("GroceryItem after delete",updatedGroceries);
    }
    /////////////////////////////////////////////////////

  async function deleteGroceryHandler() {
    setIsSubmitting(true);
    try {
      //console.log("Made it to deleteGroceryHandler")
      if(itemData.item.id){
        //console.log("GroceryItem id: ",itemData.item.id)
        //delete grocery item from firebase http
        await deleteList(itemData.item.id);

        //delete grocery item from grocery ctx
        deleteFromGroceryCtx(itemData.item.id)
        //groceriesCtx.deleteList(itemData.item.id);

        // //update meal state
        // deleteGroceryItem(itemData.item.id)
        //console.log("GroceryItem meals: ",mealsCtx.meals)
        //update mealsCtx
        if(itemData.item.mealId){
          const selectedMeal = mealsCtx.meals.find(
            (meal) => meal.id === itemData.item.mealId
          );
          if(selectedMeal){
            //console.log("MealForm2 selectedMeal",selectedMeal)
            createMealWithoutGroceryItem(selectedMeal,itemData.item.id);
          }else{
            console.log("GroceryItem no id");
          }
        }else{
          console.log("GroceryItem no mealId");
        }
      }else{
        console.log("GroceryItem thisId: ",itemData.item.thisId)
        //delete grocery item from firebase http
        await deleteList(itemData.item.thisId);

        //delete grocery item from grocery ctx
        deleteFromGroceryCtx(itemData.item.thisId)
        //groceriesCtx.deleteList(itemData.item.id);

        // //update meal state
        // deleteGroceryItem(itemData.item.id)

        //console.log("GroceryItem meals: ",mealsCtx.meals)
        //update mealsCtx
        if(itemData.item.mealId){
          const selectedMeal = mealsCtx.meals.find(
            (meal) => meal.id === itemData.item.mealId
          );
          if(selectedMeal){
            //console.log("MealForm2 selectedMeal",selectedMeal)
            createMealWithoutGroceryItem(selectedMeal,itemData.item.thisId);
          }else{
            console.log("GroceryItem no thisId");
          }
        }else{
          console.log("GroceryItem no mealId");
        }
      }
    } catch (error) {
      console.log(error)
      setError('Could not delete grocery list item - please try again later!');
      setIsSubmitting(false);
    }
  }

  /////////////////////////////////////////////////////

    function createMealWithoutGroceryItem(selectedMeal,thisId){
  
      let newGroceryList = []
      selectedMeal.groceryItems.map((item, index) => {
        const groceryItem = { description: item.description, qty: item.qty, checkedOff: item.checkedOff, mealId: item.mealId,thisId: item.thisId, id:item.id?item.id:item.thisId };
        if(item.thisId !== thisId){
          newGroceryList.push(groceryItem);
        }
      });
  
      const updatedMeal={
        date: selectedMeal.date,
        description: selectedMeal.description,
        id: selectedMeal.id,
        groceryItems: newGroceryList,
      }
      //update meal in firebase
      updateMeal(selectedMeal.id,updatedMeal)
      //update meal in ctx
      mealsCtx.updateMeal(selectedMeal.id,updatedMeal)
    }
  /////////////////////////////////////////////////////

  if (error && !isSubmitting) {
    return <ErrorOverlay message={error} />
  }

  if (isSubmitting) {
    return <LoadingOverlay />;
  }

  // function thaiCurry2(){
  //   return thaiCurry;
  // }
  return (
    <Pressable
      onPress={groceryPressHandler}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <View style={styles.groceryItem}>
        <Text style={[styles.textBase, styles.qty]}>
          {itemData.item.qty}
        </Text>
        <Text style={[styles.textBase, styles.description]}>
          {itemData.item.description}
        </Text>
        <Text style={[styles.textBase, styles.description]}>
          {itemData.item.mealDesc?itemData.item.mealDesc:selectedMeal}
          {/* {itemData.item.mealDesc?itemData.item.mealDesc:selectedMeal} */}
        </Text>
        { (
        <View style={styles.deleteContainer}>
          <IconButtonNoText
            icon="trash"
            color={GlobalStyles.colors.error500}
            size={20}
            onPress={deleteGroceryHandler}
            forLongPress={()=>{Alert.alert("Function of Button","Trash button deletes grocery item")}}
          />
        </View>
      )}
      </View>
    </Pressable>
  );
}

export default GroceryItem;

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.75,
  },
  groceryItem: {
    padding: 6,
    marginVertical: 4,
    backgroundColor: GlobalStyles.colors.primary500,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 6,
    elevation: 3,
    shadowColor: GlobalStyles.colors.gray500,
    shadowRadius: 4,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
  },
  textBase: {
    color: GlobalStyles.colors.primary50,
  },
  qty: {
    fontSize: 16,
    //marginBottom: 4,
    fontWeight: 'bold',
    width:'8%',
  },
  description: {
    fontSize: 16,
    //marginBottom: 4,
    fontWeight: 'bold',
    width:'40%',
  },

  amountContainer: {
    paddingHorizontal: 12,
    paddingVertical: 0
    ,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    minWidth: 80,
  },
  amount: {
    color: GlobalStyles.colors.primary500,
    fontWeight: 'bold',
  },
  deleteContainer: {
    marginBottom: 0,
    paddingBottom: 0,
    //marginTop: 16,
    //paddingTop: 8,
    //borderTopWidth: 2,
    //borderTopColor: GlobalStyles.colors.primary200,
    //alignItems: 'center',
  },
});
