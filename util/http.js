import {useContext} from 'react';

import axios from 'axios';
//import { MealsContext } from '../store/meals-context';


const BACKEND_URL =
  'https://justinhlottcapstone-default-rtdb.firebaseio.com';

export async function storeMeal(mealData) {
  const response = await axios.post(BACKEND_URL + '/expenses2.json', mealData);
  const id = response.data.name;
  return id;
}

export async function fetchMeals() {
  const response = await axios.get(BACKEND_URL + '/expenses2.json');

  //create an array to use in the app
  const mealsUnsorted = [];

  //loop through the response to add data to array
  for (const key in response.data) {
    const mealObj = {
      id: key,
      date: new Date(response.data[key].date),
      description: response.data[key].description
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
  return axios.put(BACKEND_URL + `/expenses2/${id}.json`, mealData);
}

export function deleteMeal(id) {
  return axios.delete(BACKEND_URL + `/expenses2/${id}.json`);
}
