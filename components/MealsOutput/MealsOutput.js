import { StyleSheet, Text, View } from 'react-native';

import { GlobalStyles } from '../../constants/styles';
import MealsList from './MealsList';


function MealsOutput({ meals, fallbackText }) {
  let content = <Text style={styles.infoText}>{fallbackText}</Text>;

  if (meals.length > 0) {
    content = <MealsList meals={meals} />;
  }

  return (
    <View style={styles.container}>
      {content}
    </View>
  );
}

export default MealsOutput;

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
