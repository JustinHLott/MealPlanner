import {useContext} from 'react';
import { FlatList } from 'react-native';

import GroceryItem from './GroceryItem';
// import { ListsContext } from '../../store/lists-context';
// import { MealsContext } from '../../store/meals-context';





function GroceriesList({ groceries }) {

    // const groceriesCtx = useContext(ListsContext);
    // const mealsCtx = useContext(MealsContext);

    
//console.log("GroceriesList")

  function renderGroceryItem(itemData) {

    // const selectedList = groceriesCtx.lists.find(
    //   (list) => list.id === itemData.item.id
    // );
    // //

    // let selectedMeal = mealsCtx.meals.find(
    //   (meal) => meal.id === selectedList?.mealId
    // );

    // if(selectedMeal){
    //   console.log("foundselectedMeal",selectedMeal.description);
    //   selectedMeal = selectedMeal.description;
    // }else{
    //   selectedMeal="No Meal";
    // }
    // console.log("groceryItem: ",selectedList);
    //return <GroceryItem itemData={itemData} selectedList={selectedList} />;
    return <GroceryItem itemData={itemData} />;
  }
  return (
    <FlatList
      data={groceries}
      renderItem={renderGroceryItem}
      keyExtractor={(item) => item.id}
    />
  );
}

export default GroceriesList;
