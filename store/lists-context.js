import { createContext, useReducer, useState } from 'react';

export const ListsContext = createContext({
  lists: [],
  qtys: [],
  addList: ({ item,description, qty, checkedOff, id }) => {},
  setLists: (lists) => {},
  deleteList: (id) => {},
  updateList: (id, { item,description, qty, checkedOff }) => {},
  setQty: (qtys) => {}, // Function to set multiple qtys
  addQty: (qty) => {}, // Function to add a single qty
});

function listsReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return { ...state, lists: [action.payload, ...state.lists] };
    case 'SET':
      const inverted = { ...state, lists: action.payload.reverse() };
      return inverted;
    case 'UPDATE':
      const updatableListIndex = state.lists.findIndex(
        (list) => list.id === action.payload.id
      );
      const updatableList = state.lists[updatableListIndex];
      const updatedItem = { ...updatableList, ...action.payload.data };
      const updatedLists = [...state.lists];
      updatedLists[updatableListIndex] = updatedItem;
      return { ...state, lists: updatedLists };
    case 'DELETE':
      return { ...state, lists: state.lists.filter((list) => list.id !== action.payload) };
    case 'SET_QTYS': 
      return { ...state, qtys: action.payload }; // Setting multiple dates
    case 'ADD_QTY': 
      return { ...state, qtys: [...state.qtys, action.payload] }; // Adding a single date
    default:
      return state;
  }
}

function ListsContextProvider({ children }) {
  const [listsState, dispatch] = useReducer(listsReducer, { lists: [], qtys: [] });

  function addList(listData) {
    dispatch({ type: 'ADD', payload: listData });
  }

  function setLists(lists2) {
    console.log("Got to lists-context setLists: ");
    console.log(lists2);
    dispatch({ type: 'SET', payload: lists2 });
  }

  function deleteList(id) {
    dispatch({ type: 'DELETE', payload: id });
  }

  function updateList(id, listData) {
    dispatch({ type: 'UPDATE', payload: { id: id, data: listData } });
  }

  function setQtys(qtys) {
    dispatch({ type: 'SET_QTYS', payload: qtys });
  }

  function addQty(qty) {
    dispatch({ type: 'ADD_QTY', payload: qty });
  }

  const value = {
    lists: listsState.lists,
    qtys: listsState.qtys,
    setLists: setLists,
    addList: addList,
    deleteList: deleteList,
    updateList: updateList,
    setQtys: setQtys,
    addQty: addQty,
  };

  return (
    <ListsContext.Provider value={value}>
      {children}
    </ListsContext.Provider>
  );
}

export default ListsContextProvider;
