import axios from 'axios';

const BACKEND_URL =
  'https://justinhlottcapstone-default-rtdb.firebaseio.com';

export async function storeMeal(mealData) {
  const response = await axios.post(BACKEND_URL + '/expenses2.json', mealData);
  const id = response.data.name;
  return id;
}

export async function fetchMeals() {
  const response = await axios.get(BACKEND_URL + '/expenses2.json');

  const mealsUnsorted = [];

  for (const key in response.data) {
    const mealObj = {
      id: key,
      date: new Date(response.data[key].date),
      description: response.data[key].description
    };
    mealsUnsorted.push(mealObj);
    console.log(mealsUnsorted);
  }

  //This sorts the meals by the date field.
  const meals = [...mealsUnsorted,].sort((a, b) => a.date - b.date);
  console.log("this is the sorted meals list")
  console.log(meals);
  return meals;
}

export function updateMeal(id, mealData) {
  return axios.put(BACKEND_URL + `/expenses2/${id}.json`, mealData);
}

export function deleteMeal(id) {
  return axios.delete(BACKEND_URL + `/expenses2/${id}.json`);
}
