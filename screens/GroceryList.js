import { useContext, useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from "@react-navigation/native";

import GroceriesOutput from '../components/GroceriesOutput/GroceriesOutput';
import ErrorOverlay from '../components/UI/ErrorOverlay';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import { ListsContext } from '../store/lists-context';
import { getDateMinusDays } from '../util/date';
import { fetchLists } from '../util/http-list';

function GroceryList() {
  //console.log("makes it to grocerylist")
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState();
  const [recentLists, setRecentLists] = useState();

  const listsCtx = useContext(ListsContext);

  useEffect(() => {
    async function getList() {
      setIsFetching(true);
      try {
        console.log("Makes it to useEffect");
        const items = await fetchLists();
        console.log("Grocery items list in GroceryList: ")
        //console.log(items)
        listsCtx.setLists(items);
        setRecentLists(items);
      } catch (error) {
        console.log(error);
        setError('Could not fetch lists!');
      }
      setIsFetching(false);
    }

    getList();
  }, []);

  useEffect(() => {
    setRecentLists(listsCtx.lists)
  }, [listsCtx.lists]);

    // Trigger update every time the screen is focused
    useFocusEffect(
      
      useCallback(() => {
        //console.log("useFocusEffect")
        fetchGroceryList();
      }, [listsCtx.lists]) // Dependencies ensure it runs when meals change
    );

    function fetchGroceryList(){
      setRecentLists(listsCtx.lists)
      //console.log(recentLists);
    }

  if (error && !isFetching) {
    return <ErrorOverlay message={error} />;
  }

  if (isFetching) {
    return <LoadingOverlay />;
  }

  return (
    <GroceriesOutput
      groceries={recentLists}
      //groceries={listsCtx.lists}
      fallbackText="No grocery items registered..."
    />
  );
}

export default GroceryList;
