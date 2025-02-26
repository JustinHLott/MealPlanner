import { useState, useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { GlobalStyles } from '../../constants/styles';
import GroceriesList from './GroceriesList';
import { ListsContext } from '../../store/lists-context';

function GroceriesOutput({ groceries, fallbackText }) {

  const [theArray, setTheArray] = useState(groceries);
  const listsCtx = useContext(ListsContext);

  function handleSorting(sortType){
    console.log("GroceriesOutput")
    let sortedGroceries = [];
    if(sortType==="default"){
      sortedGroceries = [...groceries].reverse();
      setTheArray(sortedGroceries);
      listsCtx.sortList(sortedGroceries,sortType);
    }else if(sortType==="item"){
      sortedGroceries = [...groceries].sort((a, b) => {
        const nameA = a.description ? a.description.toLowerCase() : ''; // Convert to lowercase, handle undefined
        const nameB = b.description ? b.description.toLowerCase() : '';
        return nameA.localeCompare(nameB); // Compare alphabetically
      });
      setTheArray(sortedGroceries);
      listsCtx.sortList(sortedGroceries,sortType);
    }else if(sortType==="meal"){
      sortedGroceries = [...groceries].sort((a, b) => {
        const nameA = a.mealDesc ? a.mealDesc.toLowerCase() : ''; // Convert to lowercase, handle undefined
        const nameB = b.mealDesc ? b.mealDesc.toLowerCase() : '';
        return nameA.localeCompare(nameB); // Compare alphabetically
      });
      setTheArray(sortedGroceries);
      listsCtx.sortList(sortedGroceries,sortType);
    }
  }


  let content = <Text style={styles.infoText}>{fallbackText}</Text>;

  if (groceries.length > 0) {
    content = <GroceriesList groceries={listsCtx.lists} handleSorting={handleSorting} />;
  }

  return (
    <View style={styles.container}>
      {content}
    </View>
  );
}

export default GroceriesOutput;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 0,
    backgroundColor: GlobalStyles.colors.primary700,
  },
  infoText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 32,
  },
});
