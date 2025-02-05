import { createContext, useReducer } from 'react';

export const ListsContext = createContext({
  lists: [],
  addList: ({ description }) => {},
  setLists: (lists) => {},
  deleteList: (id) => {},
  updateList: (id, { description }) => {},
});

function listsReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return [action.payload, ...state];
    case 'SET':
      const inverted = action.payload.reverse();
      return inverted;
    case 'UPDATE':
      const updatableListIndex = state.findIndex(
        (list) => list.id === action.payload.id
      );
      const updatableList = state[updatableListIndex];
      const updatedItem = { ...updatableList, ...action.payload.data };
      const updatedLists = [...state];
      updatedLists[updatableListIndex] = updatedItem;
      return updatedLists;
    case 'DELETE':
      return state.filter((list) => list.id !== action.payload);
    default:
      return state;
  }
}

function ListsContextProvider({ children }) {
  const [listsState, dispatch] = useReducer(listsReducer, []);

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

  const value = {
    lists: listsState,
    setLists: setLists,
    addList: addList,
    deleteList: deleteList,
    updateList: updateList,
  };

  return (
    <ListsContext.Provider value={value}>
      {children}
    </ListsContext.Provider>
  );
}

export default ListsContextProvider;
