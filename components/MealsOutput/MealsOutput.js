import {useContext} from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { GlobalStyles } from '../../constants/styles';
import MealsList from './MealsList';
import { MealsContext } from '../../store/meals-context';


function MealsOutput({ meals, fallbackText }) {
  console.log("Made it to MealsOutput");
  console.log(meals);
  const mealsCtx = useContext(MealsContext);
  // const mostRecentMeal = meals.reduce((latest, meal) => new Date(meal.date) > new Date(latest.date) ? meal : latest);
  // if(!mealsCtx.dates.length){
  //     mealsCtx.dates.push(mostRecentMeal.date);
  // }
  
  let content = <Text style={styles.infoText}>{fallbackText}</Text>;

  if (meals.length > 0) {
    console.log(meals)
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
    paddingTop: 0
    
    ,
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
