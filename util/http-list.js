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
  const response = await axios.get(BACKEND_URL + '/grocery.json');

  const listsUnsorted = [];

  for (const key in response.data) {
    const listObj = {
      id: key,
      date: new Date(response.data[key].date),
      description: response.data[key].description
    };
    listsUnsorted.push(listObj);
  }

  //This sorts the lists by the date field.
  const lists = [...listsUnsorted,].sort((a, b) => a.date - b.date);

  return lists;
}

export function updateList(id, listData) {
  return axios.put(BACKEND_URL + `/grocery/${id}.json`, listData);
}

export function deleteList(id) {
  return axios.delete(BACKEND_URL + `/grocery/${id}.json`);
}
