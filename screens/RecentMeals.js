import { useContext, useEffect, useState } from 'react';
import {StyleSheet, View, Alert} from 'react-native'

import MealsOutput from '../components/MealsOutput/MealsOutput';
import ErrorOverlay from '../components/UI/ErrorOverlay';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import { GlobalStyles } from '../constants/styles';
import { MealsContext } from '../store/meals-context';
import { getDateMinusDays } from '../util/date';
import { fetchMeals } from '../util/http';
import IconButtonNoText from '../components/UI/IconButtonNoText';
import Button from '../components/UI/Button';

function RecentMeals() {
  //console.log("Makes it to RecentMeals");
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState();
  const [firstDate, setFirstDate] = useState(getSundayOfThisWeek());

  const mealsCtx = useContext(MealsContext);

  useEffect(() => {
    async function getMeals() {
      setIsFetching(true);
      try {
        const meals = await fetchMeals();
        mealsCtx.setMeals(meals);
        //mealsCtx.setDates(meals);
        // console.log("At setDates")
        // console.log(mealsCtx.dates)
      } catch (error) {
        console.log(error)
        setError('Could not fetch meals!');
      }
      setIsFetching(false);
    }

    getMeals();
  }, []);

  if (error && !isFetching) {
    return <ErrorOverlay message={error} />;
  }

  if (isFetching) {
    return <LoadingOverlay />;
  }

  if(!firstDate){
    //setFirstDate(new Date());
    const today = getSundayOfThisWeek();
    console.log("today",today)
    setFirstDate(today);
  }
  
  function getSundayOfThisWeek(){
    const today = getDateMinusDays(new Date(),4);
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    console.log("dayOfWeek",dayOfWeek);
    const diff = today.getDate() - dayOfWeek; // Calculate the difference to Sunday
    console.log("Diff",diff);
    return new Date(today.setDate(diff));
  };

  function previous(){
    const mealsSorted = [...mealsCtx.meals,].sort((a, b) => a.date - b.date);
    const thisGroupOfMeals = mealsSorted.filter((meal) => {
      let firstDay = getDateMinusDays(firstDate, 7);
      let datePlus7 = getDateMinusDays(firstDay, -7);
      let theMeals = (meal.date >= firstDay && meal.date <= datePlus7)
   
      console.log("RecentMeals 1st:",firstDay,"End:",datePlus7)
      return theMeals;
    });
    console.log("RecentMeals Meals this week",thisGroupOfMeals.length)
    if(thisGroupOfMeals.length>0){
      const today = getDateMinusDays(firstDate,7);
      // const today = getSundayOfThisWeek();
      setFirstDate(today);
    }
  }

  function currentWeek(){
    //console.log(mealsCtx.dates)
    //const today = getDateMinusDays(new Date(),1);
    const today = getSundayOfThisWeek();
    console.log("today",today)
    setFirstDate(today);
  }
  function next(){
    const mealsSorted = [...mealsCtx.meals,].sort((a, b) => a.date - b.date);
    const thisGroupOfMeals = mealsSorted.filter((meal) => {
      let firstDay = getDateMinusDays(firstDate, -7);
      let datePlus7 = getDateMinusDays(firstDay, -7);
      let theMeals = (meal.date >= firstDay && meal.date <= datePlus7)
   
      return theMeals;
    });
    //console.log(thisGroupOfMeals)
    if(thisGroupOfMeals.length>0){
      const today = getDateMinusDays(firstDate,-7);
      setFirstDate(today);
    }
  }


  const mealsSorted = [...mealsCtx.meals,].sort((a, b) => a.date - b.date);
  const recentMeals = mealsSorted.filter((meal) => {
    let firstDay = new Date(firstDate)
    let datePlus7 = getDateMinusDays(firstDay, -7);
    let theMeals = (meal.date >= firstDay && meal.date <= datePlus7)
  
    return theMeals;
  });

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <IconButtonNoText
            icon="arrow-back-circle-outline"
            color="white"
            size={50}
            onPress={previous}
            forLongPress={()=>{Alert.alert("Function of Button","View previous week's meals")}}
          />
          <Button onPress={currentWeek}>Current Week</Button>
          <IconButtonNoText
            icon="arrow-forward-circle-outline"
            color="white"
            size={50}
            onPress={next}
            forLongPress={()=>{Alert.alert("Function of Button","View previous week's meals")}}
          />
      </View>
      <MealsOutput
        meals={recentMeals}
        fallbackText="No meals registered for the last 7 days..."
      />
    </View>
    
  );
}

export default RecentMeals;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.primary700,
  },
  buttonContainer:{
    flexDirection: 'row',
    alignItems: 'center',//vertical alignment
    justifyContent: 'center',
  }

});
