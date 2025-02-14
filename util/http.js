import {useContext} from 'react';

import axios from 'axios';
//import { MealsContext } from '../store/meals-context';


const BACKEND_URL =
  'https://justinhlottcapstone-default-rtdb.firebaseio.com';

export async function storeMeal(mealData) {
  console.log("storMeal")
  const response = await axios.post(BACKEND_URL + '/meals3.json', mealData);
  const id = response.data.name;
  console.log("mealID: ",id)
  try {
    for (const item of mealData.groceryItems) {
      const groceryData = {
        
        description: item.name,
        qty: item.quantity,
        checkedOff: item.checkedOff,
        id: id,
      };

      // Save each item to Firebase using Axios
      const response = await axios.post(BACKEND_URL + '/grocery.json', groceryData);

      console.log("Saved:", response.data);
    }

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
export async function storeMeal3(mealData) {
  console.log("storMeal3")
  const response = await axios.post(BACKEND_URL + '/meals3.json', mealData);
  const id = response.data.name;
  console.log("mealID: ",id)
  try {
    for (const item of mealData.groceryItems) {
      const groceryData = {
        
        description: item.name,
        qty: item.quantity,
        checkedOff: item.checkedOff,
        id: id,
      };

      // Save each item to Firebase using Axios
      const response = await axios.post(BACKEND_URL + '/grocery.json', groceryData);

      console.log("Saved:", response.data);
    }

    console.log("All grocery items saved successfully!");
  } catch (error) {
    console.error("Error saving grocery items:", error);
  }
  return id;
}

export async function fetchMeals() {
  const response = await axios.get(BACKEND_URL + '/meals3.json');

  //create an array to use in the app
  const mealsUnsorted = [];
  //create an array to use in the app
  const groceriesUnsorted = [];

  function addGroceries(groceryItems){
    // console.log("Makes it to addGroceries in http.js")
    // console.log(groceryItems);
    // for (const groceryItem in groceryItems) {
    //   console.log(groceryItem)
    //     // const groceryObj = {
    //     //   name: groceryItem.name,
    //     //   qty: groceryItem.quantity
    //     // }
    //     //add individual grocery items to array
    //     groceriesUnsorted.push({name: groceryItem.name,quantity: groceryItem.quantity});
    //   }
    //   console.log(groceriesUnsorted);
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
    console.log(mealObj);
    //add individual meals to array
    mealsUnsorted.push(mealObj);
  }

  //This sorts the meals by the date field.
  const meals = [...mealsUnsorted,].sort((a, b) => a.date - b.date);
  console.log("this is the sorted meals list")
  console.log(meals);

  //this gets the date of the most recent meal
  //const mostRecentMeal = meals.reduce((latest, meal) => new Date(meal.date) > new Date(latest.date) ? meal : latest);

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
  console.log("this is the sorted meals list")
  console.log(meals);

  //this gets the date of the most recent meal
  //const mostRecentMeal = meals.reduce((latest, meal) => new Date(meal.date) > new Date(latest.date) ? meal : latest);

  return meals;
}

export function updateMeal(id, mealData) {
  return axios.put(BACKEND_URL + `/meals3/${id}.json`, mealData);
}

export function deleteMeal(id) {
  return axios.delete(BACKEND_URL + `/meals3/${id}.json`);
}
