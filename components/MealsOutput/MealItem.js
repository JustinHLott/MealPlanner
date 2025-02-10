import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { GlobalStyles } from '../../constants/styles';
import { getFormattedDate } from '../../util/date';

function MealItem({ id, description, date, groceries }) {
  const navigation = useNavigation();

  function mealPressHandler() {
    navigation.navigate('ManageMeal', {
      mealId: id
    });
  }

  //This function creates the day of week name.
  const getDayOfWeek = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: "short" }; // 'long' for full name (e.g., Monday)
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  return (
    <Pressable
      onPress={mealPressHandler}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <View style={styles.mealItem}>
        <View style={styles.dateStyle}>
          <Text style={[styles.textBase,styles.dateText]}>{getDayOfWeek(date)}</Text>
          <Text style={styles.textBase}>({getFormattedDate(date)})</Text>
        </View>  
        <Text style={[styles.textBase, styles.description]}>{description}</Text>
        
        {/* <View style={styles.amountContainer}>
          <Text style={styles.amount}>{amount.toFixed(2)}</Text>
        </View> */}
      </View>
    </Pressable>
  );
}

export default MealItem;

const styles = StyleSheet.create({
  dateStyle:{
    flexDirection: 'row',
    
  },
  dateText:{
    marginRight: 15,
  },
  pressed: {
    opacity: 0.75,
  },
  mealItem: {
    padding: 12,
    marginVertical: 8,
    backgroundColor: GlobalStyles.colors.primary500,
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderRadius: 6,
    elevation: 3,
    shadowColor: GlobalStyles.colors.gray500,
    shadowRadius: 4,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
  },
  textBase: {
    color: GlobalStyles.colors.primary50,
  },
  description: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  amountContainer: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    minWidth: 80,
  },
  amount: {
    color: GlobalStyles.colors.primary500,
    fontWeight: 'bold',
  },
});
