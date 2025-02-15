import { useContext, useEffect, useState } from 'react';

import GroceriesOutput from '../components/GroceriesOutput/GroceriesOutput';
import ErrorOverlay from '../components/UI/ErrorOverlay';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import { ListsContext } from '../store/lists-context';
import { getDateMinusDays } from '../util/date';
import { fetchLists } from '../util/http-list';

function GroceryList() {
  console.log("makes it to grocerylist")
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState();

  const listsCtx = useContext(ListsContext);

  useEffect(() => {
    async function getList() {
      setIsFetching(true);
      try {
        console.log("Makes it to useEffect");
        const items = await fetchLists();
        console.log("Grocery items list in GroceryList: ")
        console.log(items)
        listsCtx.setLists(items);
      } catch (error) {
        console.log(error);
        setError('Could not fetch lists!');
      }
      setIsFetching(false);
    }

    getList();
  }, []);

  if (error && !isFetching) {
    return <ErrorOverlay message={error} />;
  }

  if (isFetching) {
    return <LoadingOverlay />;
  }

  const recentLists = listsCtx.lists
  // const recentLists = listsCtx.lists.filter((groceryItem) => {
  //   console.log("Get's to GroceryList filter by date: "+groceryItem)
  //   const today = getDateMinusDays(new Date(),1);
  //   const datePlus7 = getDateMinusDays(today, -7);

  //   return groceryItem.date >= today && groceryItem.date <= datePlus7;
  // });

  return (
    <GroceriesOutput
      groceries={recentLists}
      //groceries={listsCtx.lists}
      fallbackText="No grocery items registered..."
    />
  );
}

export default GroceryList;
