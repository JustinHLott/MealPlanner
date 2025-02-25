//import {useContext} from 'react';
import { deleteList } from './http-list';

import axios from 'axios';
//import { ListsContext } from '../store/lists-context';


const BACKEND_URL =
  'https://justinhlottcapstone-default-rtdb.firebaseio.com';

function addGroceryId(groceryData,groceryId){
  const updatedGrocery = {
    ...groceryData,
    thisId: groceryId,
  };
  return updatedGrocery
}
export async function storeMeal(mealData,addCtxList,addCtxMeal) {
  //console.log("storeMeal");
  //const listsCtx = useContext(ListsContext);
  const response = await axios.post(BACKEND_URL + '/meals3.json', mealData);
  if(response && response.data){
    console.log("http mealId: ", response.data.name);
  }
  const id = response.data.name;
  //console.log("mealID: ",id)
  try {
    let newGroceryList = [];
    for (const item of mealData.groceryItems) {
      const groceryData = {
        description: item.name,
        qty: item.quantity,
        checkedOff: item.checkedOff,
        mealId: id,
        mealDesc: mealData.description,
      };
      console.log("http storeMeal groceryItem: ",groceryData);
      // Save each item to Firebase using Axios
      const responseGrocery = await axios.post(BACKEND_URL + '/grocery.json', groceryData);

      if(responseGrocery&&responseGrocery.data){
        console.log("http storeMeal new grocery id: ",responseGrocery.data.name)
        const groceryId = responseGrocery.data.name;
        //console.log("returned groceryId: ",groceryId)
        //Add the new grocery id to the groceryData
        const updatedGrocery = await addGroceryId(groceryData,groceryId);
        // const updatedGrocery = {
        //   ...groceryData,
        //   thisId: groceryId,
        // };
        //update firebase with thisId
        await axios.put(BACKEND_URL + `/grocery/${groceryId}.json`, updatedGrocery);
        //Add groceryData to new array
        newGroceryList.push(updatedGrocery);
        addCtxList(updatedGrocery,responseGrocery.data.name)//this function is from ManageMeals and it adds the updated grocery list to ctx.
        
      }
    }
      //update meal with new grocery list
      //console.log("mealData http: ",mealData)
      const updatedMeal = {
        ...mealData,
        groceryItems: newGroceryList,
      };
      //console.log("updatedMeal http: ",updatedMeal)
      
      //this functions adds meal to meals ctx in ManageMeals.
      addCtxMeal(updatedMeal,id)
      //update meal in firebase
      await updateMealRaw(id, updatedMeal)
      //console.log("Saved:", updatedMeal);
      console.log("All grocery items saved successfully!");
  } catch (error) {
    console.error("Error saving grocery items:", error);
  }
  return id;
}

export async function storeMeal2(mealData) {
  const response = await axios.post(BACKEND_URL + '/meals2.json', mealData);
  const id = response.data.name;
  return id;
}

export async function fetchMeals() {
  const response = await axios.get(BACKEND_URL + '/meals3.json');

  //create an array to use in the app
  const mealsUnsorted = [];
  //create an array to use in the app
  const groceriesUnsorted = [];

  function addGroceries(groceryItems){
      return groceryItems;
  }

  //loop through the response to add data to array
  for (const key in response.data) {
    const mealObj = {
      id: key,
      date: new Date(response.data[key].date),
      description: response.data[key].description,
      groceryItems: addGroceries(response.data[key].groceryItems)
    };

    //add individual meals to array
    mealsUnsorted.push(mealObj);
  }

  //This sorts the meals by the date field.
  const meals = [...mealsUnsorted,].sort((a, b) => a.date - b.date);

  return meals;
}

export async function fetchMeals3() {
  const response = await axios.get(BACKEND_URL + '/meals3.json');

  //create an array to use in the app
  const mealsUnsorted = [];

  //loop through the response to add data to array
  for (const key in response.data) {
    const mealObj = {
      id: key,
      date: new Date(response.data[key].date),
      description: response.data[key].description,
      // groceryItems: [
      //   {name: response.data[key].groceryItems.name,
      //     qty: response.data[key].groceryItems.qty
      //   }
      // ],
    };

    //add individual meals to array
    mealsUnsorted.push(mealObj);
  }

  //This sorts the meals by the date field.
  const meals = [...mealsUnsorted,].sort((a, b) => a.date - b.date);
  //console.log("this is the sorted meals list")
  //console.log(meals);

  //this gets the date of the most recent meal
  //const mostRecentMeal = meals.reduce((latest, meal) => new Date(meal.date) > new Date(latest.date) ? meal : latest);

  return meals;
}

export async function updateMealRaw(mealId, mealData){
  const updatedMeal = await axios.put(BACKEND_URL + `/meals3/${mealId}.json`, mealData);
  return updatedMeal;
}

async function updateGroceryItem(item,addCtxList){
  console.log("http updateMeal add: ", item);

  //only add new grocery item if it doesn't exist before (no thisId).
  if(!item.thisId?item.thisId:item.id){
    //add new grocery item
    // Save each item to Firebase using Axios
    const responseGrocery = await axios.post(BACKEND_URL + '/grocery.json', item);

    if(responseGrocery&&responseGrocery.data){
      console.log("http updateGroceryItem new groceryid: ",responseGrocery.data.name)
      const groceryId = responseGrocery.data.name;
      //Add the new grocery id to the groceryData
      const updatedGrocery = addGroceryId(item,groceryId);
      //update firebase with thisId
      await axios.put(BACKEND_URL + `/grocery/${groceryId}.json`, updatedGrocery);
      // //Add groceryData to new array
      // newGroceryList.push(updatedGrocery);
      //this function is from ManageMeals and it adds the updated grocery list to ctx.
      addCtxList(updatedGrocery,responseGrocery.data.name);
      return responseGrocery.data.name;
    }
  }else{
    //update the item with its new information




    addCtxList(item,item.thisId);
    //return the id that it already has.
    return item.thisId;
  }
  
}

export async function updateMeal(mealId, mealData, currentMealData, addCtxList, deleteCtxList, updateCtxMeal, noGroceries) {
  console.log("http noGroceries",noGroceries);
  console.log("http mealData",mealData);
  console.log("http currentMealData",currentMealData);
  let newGroceryList=[];
  if(noGroceries===false){
    //add new grocery items
    mealData.groceryItems.forEach((item,index)=>{
      //console.log(item, index)
      const oldItem = currentMealData.groceryItems.find(
        (meal) => meal.thisId?meal.thisId:meal.id === item.thisId?item.thisId:item.id
      );
      console.log("http updateMeal item: ", item);
      console.log("http updateMeal oldItem: ", oldItem);
      if(item !== oldItem){
        const updatedGroceryid = updateGroceryItem(item,addCtxList);

        //Add thisId to groceryData (if it already exits it will just write over the top of it).
        const groceryItem2 = {
          ...item,thisId: updatedGroceryid.item.name
        }
        //Add groceryData to new array
        newGroceryList.push(groceryItem2);
      }
    });

    //delete old grocery items
    currentMealData.groceryItems.forEach((item,index)=>{
      //console.log(item, index)
      const newItem = mealData.groceryItems.find(
        (meal) => meal.thisId?meal.thisId:meal.id === item.thisId?item.thisId:item.id
      );
      console.log("http updateMeal newItem: ",newItem);
      console.log("http updateMeal itemUnderConsideration: ",item);
      if(!newItem){
        console.log("http updateMeal deleteId: ", item.thisId?item.thisId:item.id)
        //delete old grocery item from context
        deleteCtxList(item);
        //delete old grocery item from firebase
        deleteList(item.thisId?item.thisId:item.id)
      }
    });
    //eventurally I need to add an update for if a grocery item is updated.




  }

  //this replaces the updated grocery list for the meal.
  const newMeal = {
    ...mealData,
    groceryItems: newGroceryList,
  };
  console.log("http update-newGroceryList:",newGroceryList);
  console.log("http update-newMeal:",newMeal);

  //update firebase with new mealData
  const updatedMeal = await axios.put(BACKEND_URL + `/meals3/${mealId}.json`, newMeal);
  //update meal in context
  updateCtxMeal(mealId,newMeal);

  return updatedMeal;
}

export function deleteMeal(id) {
  return axios.delete(BACKEND_URL + `/meals3/${id}.json`);
}
