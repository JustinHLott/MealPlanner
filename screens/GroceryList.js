import { useContext, useEffect, useState } from 'react';

import GroceriesOutput from '../components/GroceriesOutput/GroceriesOutput';
import ErrorOverlay from '../components/UI/ErrorOverlay';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import { ListsContext } from '../store/lists-context';
import { getDateMinusDays } from '../util/date';
import { fetchLists } from '../util/http';

function GroceryList() {
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState();

  const listsCtx = useContext(ListsContext);

  useEffect(() => {
    async function getList() {
      setIsFetching(true);
      try {
        const items = await fetchLists();
        listsCtx.setLists(items);
      } catch (error) {
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

  const recentLists = listsCtx.lists.filter((groceryItem) => {
    const today = getDateMinusDays(new Date(),1);
    const datePlus7 = getDateMinusDays(today, -7);

    return groceryItem.date >= today && groceryItem.date <= datePlus7;
  });

  return (
    <GroceriesOutput
      lists={recentLists}
      fallbackText="No grocery itemss registered for the last 7 days..."
    />
  );
}

export default GroceryList;
