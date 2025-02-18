import axios from 'axios';

const BACKEND_URL =
  'https://justinhlottcapstone-default-rtdb.firebaseio.com';

export async function storeList(listData) {
  console.log(listData)
  const response = await axios.post(BACKEND_URL + '/grocery.json', listData);
  const id = response.data.name;
  return id;
}

export async function fetchLists() {
  console.log("got to fetch lists")
  const response = await axios.get(BACKEND_URL + '/grocery.json');
  console.log("fetched grocery list")
  const listsUnsorted = [];

  for (const key in response.data) {
    const listObj = {
      id: key,
      qty: response.data[key].qty,
      description: response.data[key].description,
      mealId: response.data[key].id,
      mealDesc: response.data[key].mealDesc,
      checkedOff: response.data[key].checkedOff,
    };
    listsUnsorted.push(listObj);
    //console.log(listsUnsorted);
  }

  // //This sorts the lists by the date field.
  // const lists = [...listsUnsorted,].sort((a, b) => a.date - b.date);
   //console.log("grocery list: ",listsUnsorted);
  // console.log( lists);
  return listsUnsorted;
}

export function updateList(id, listData) {
  return axios.put(BACKEND_URL + `/grocery/${id}.json`, listData);
}

export function deleteList(id) {
  console.log("deletelist: ",id)
  return axios.delete(BACKEND_URL + `/grocery/${id}.json`);
}
