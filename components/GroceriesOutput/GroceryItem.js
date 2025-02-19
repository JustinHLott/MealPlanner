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
    const selectedList = groceriesCtx.lists.find(
      (list) => list.id === itemData.item.id
    );
    console.log("groceryItem: ",selectedList);
  
    let selectedMeal = mealsCtx.meals.find(
      (meal) => meal.id === selectedList?.mealId
    );
    //console.log("meal1: ", meal);
  
    if(selectedMeal){
      console.log("foundselectedMeal",selectedMeal.description);
      setMeal2(selectedMeal);
      //console.log("meal2: ", meal);
      selectedMeal = selectedMeal?.description;
    }else{
      selectedMeal={
          id:"",
          date:"",
          description:"",
          groceryItems:[]
        };
    }
  },[])

  const selectedList = groceriesCtx.lists.find(
    (list) => list.id === itemData.item.id
  );
  console.log("groceryItem: ",selectedList);

  let selectedMeal = mealsCtx.meals.find(
    (meal) => meal.id === selectedList?.mealId
  );
  //console.log("meal1: ", meal);

  if(selectedMeal){
    console.log("foundselectedMeal",selectedMeal.description);
    //setMeal2(selectedMeal);
    //console.log("meal2: ", meal);
    selectedMeal = selectedMeal?.description;
  }else{
    selectedMeal="No Meal";
  }

  function groceryPressHandler() {
    navigation.navigate('ManageGroceryItem', {
      groceryId: itemData.item.id?itemData.item.id:itemData.item.thisId
    });
  }

  // Function to delete grocery item
  const deleteGroceryItem = (id) => {
    console.log("index",id)
    console.log("before deleted", id,meal2)
    setMeal2((prevMeal) => ({
      ...prevMeal,
      groceryItems: prevMeal.groceryItems.filter((_, i) => i !== id),
    }));
    console.log("after deleted", meal2)
  };

  async function deleteGroceryHandler() {
    setIsSubmitting(true);
    try {
      console.log("Made it to deleteGroceryHandler")
      //delete grocery item from firebase http
      await deleteList(itemData.item.id);

      //delete grocery item from grocery ctx
      groceriesCtx.deleteList(itemData.item.id);

      //update meal state
      deleteGroceryItem(itemData.item.id)

      //update mealsCtx
      console.log("before ctx meal update",meal2.id,meal2)
      //add find statement to get id based on date.
      // let selectedMeal = mealsCtx.meals.find(
      //   (meal) => meal.date === itemData.date
      // );
      mealsCtx.updateMeal(meal2.id, meal2)
      console.log("after ctx meal update",mealsCtx.meals)

      //update meal in https
      updateMeal(meal2.id, mealsCtx.meals)

    } catch (error) {
      console.log(error)
      setError('Could not delete grocery list item - please try again later!');
      setIsSubmitting(false);
    }
  }

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
