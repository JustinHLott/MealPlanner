import { FlatList } from 'react-native';

import GroceryItem from './GroceryItem';

function renderGroceryItem(itemData) {
  return <GroceryItem {...itemData.item} />;
}

function GroceriesList({ groceries }) {
  return (
    <FlatList
      data={groceries}
      renderItem={renderGroceryItem}
      keyExtractor={(item) => item.id}
    />
  );
}

export default GroceriesList;
