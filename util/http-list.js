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
      //date: new Date(response.data[key].date),
      description: response.data[key].description
    };
    listsUnsorted.push(listObj);
    console.log(listsUnsorted);
  }

  // //This sorts the lists by the date field.
  // const lists = [...listsUnsorted,].sort((a, b) => a.date - b.date);
  // console.log("This is the grocery list: ");
  // console.log( lists);
  return listsUnsorted;
}

export function updateList(id, listData) {
  return axios.put(BACKEND_URL + `/grocery/${id}.json`, listData);
}

export function deleteList(id) {
  return axios.delete(BACKEND_URL + `/grocery/${id}.json`);
}
