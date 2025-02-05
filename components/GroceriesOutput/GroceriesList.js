import { FlatList } from 'react-native';

import MealItem from './GroceryItem';

function renderMealItem(itemData) {
  return <MealItem {...itemData.item} />;
}

function MealsList({ meals }) {
  return (
    <FlatList
      data={meals}
      renderItem={renderMealItem}
      keyExtractor={(item) => item.id}
    />
  );
}

export default MealsList;
