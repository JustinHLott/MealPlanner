import React, { useState, useContext, useEffect } from "react";
import { View, TextInput, FlatList, Text, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { GlobalStyles } from '../../constants/styles';
import Input from './Input';
import Button from '../UI/Button';
import IconButtonNoText from "../UI/IconButtonNoText";
import { MealsContext } from '../../store/meals-context';
import { isValidDate } from "../../util/date";
import { storeList } from "../../util/http-list";

const defaultMeal = {
  date: "",
  description: "",
  groceryItems: [], // Start as an empty array
};

const defaultGroceryItem = { name: "", quantity: "", checkedOff: "", id: "" };

export default function MealForm2({ initialMeal = {}, defaultDate, onSubmit }) {
  // Merge `initialMeal` with `defaultMeal` to avoid undefined values
  const [meal, setMeal] = useState({ ...defaultMeal, ...initialMeal });
  const [maxDate, setMaxDate] = useState("");

  //const [firstDate, setFirstDate] = useState(getDateMinusDays(new Date(),1));
  const mealsCtx = useContext(MealsContext);

  //This only runs once when the screen starts up.
  useEffect(() => {
    if(initialMeal.description!==""){
      //do nothing
    }else{
      const mostRecentMealDate = mealsCtx.meals.reduce((meal, latest) => new Date(meal.date) > new Date(latest.date) ? meal : latest);
      //Add one day to the most recent date to get the date for the next new meal

      let date = new Date(mostRecentMealDate.date);
      date.setDate(date.getDate() + 1);
      const date2 = date
        .toISOString()
        .split("T")[0];

      setMaxDate(date2);
      // Create a new updated meal object
      const updatedMeal2 = {
        date: date,
        description: "",
        groceryItems: [], // Empty grocery items
      };
      //And update the meal with the new date
      setMeal(updatedMeal2)
    }
    
  }, []);

  // Function to update the meal's date or description
  const handleInputChange = (key, value) => {
    if(key==="date"){
      const newDate = new Date(value);
      console.log("newDate")
      console.log(newDate)
      setMeal((prevMeal) => ({
        ...prevMeal,
        [key]: newDate,
      }));
    }else{
      setMeal((prevMeal) => ({
        ...prevMeal,
        [key]: value,
      }));
    }
  };

  // Function to update grocery items
  const handleGroceryChange = (index, key, value) => {
    const updatedGroceryItems = [...meal.groceryItems];
    updatedGroceryItems[index][key] = value;
    setMeal((prevMeal) => ({
      ...prevMeal,
      groceryItems: updatedGroceryItems,
    }));
  };

    // Function to update grocery item checkbox
    const handleGroceryCheckbox = (index) => {
      const updatedGroceryItems = [...meal.groceryItems];
      const item = updatedGroceryItems[index]["checkedOff"];
      let tf = false;

      if(item){
        if (item.value === "checked"){
          updatedGroceryItems[index]["checkedOff"] = "unChecked"
          //setChecked(true);
          tf = true;
        }else{
          updatedGroceryItems[index]["checkedOff"] = "checked"
          //setChecked(false);
          tf = false;
        }
      }

      setMeal((prevMeal) => ({
        ...prevMeal,
        groceryItems: updatedGroceryItems,
      }));

      console.log(tf);
      return tf;
    };

  // Function to add a new grocery item
  const addGroceryItem = () => {
    setMeal((prevMeal) => ({
      ...prevMeal,
      groceryItems: [...prevMeal.groceryItems, { ...defaultGroceryItem }],
    }));
  };

  function saveMeal(meal2){
    console.log("Makes it to saveMeal in MealForm2");
    //prepareDateForSaving(meal2);//this changes the date in the meal in state
    console.log("Meal2");
    console.log(meal2);
    const newDate = new Date(meal2.date);
    console.log("newDate");
    console.log(newDate);
    const updatedMeal = {
      ...meal2,
      date: newDate,
    };
    console.log("updatedMeal");
    console.log(updatedMeal);
    onSubmit(updatedMeal);//this uses the meal in state
    meal.groceryItems.map((item, index) => {
      const groceryItem = { item: index+1, description: item.name, qty: item.quantity, checkedOff: item.checkOff, id: meal.id };
      console.log("storeList");
      console.log(meal.id);
      storeList(groceryItem);
    });
  }

  // Function to delete grocery item
  const deleteGroceryItem = (index) => {
    setMeal((prevMeal) => ({
      ...prevMeal,
      groceryItems: prevMeal.groceryItems.filter((_, i) => i !== index),
    }));
  };

  function validateDate(startDate){
    if(isValidDate(startDate)){
      console.log("valid date");
      console.log(startDate);
      console.log(startDate.toISOString().slice(0, 10));
      return startDate.toISOString().slice(0, 10);
    }else{
      console.log("Invalid date");
      console.log(startDate);
      if(startDate.length===10){
        const newDate = startDate;
        return newDate
      }else{
        return startDate;
      }
        
      
      
    }
  }

  return (
    <View style={{ padding: 20, flex: 1 }}>
      {/* Date Input */}
        <Text style={styles.label}>Date</Text>
        <TextInput style={[styles.inputDate,styles.inputAll]}
          keyboardType='decimal-pad'
          placeholder='yyyy-mm-dd'
          onChangeText={(text) => handleInputChange("date", text)}
          value={(meal.date? validateDate(meal.date):validateDate(maxDate))}//.toISOString().split("T")[0]
          
          //value={maxDate}
        />
      {/* Description Input */}
      <Input
        label="Description"
        //invalid={!inputs.description.isValid}
        textInputConfig={{
            multiline: true,
            // autoCapitalize: 'none'
            // autoCorrect: false // default is true
            onChangeText:((text) => handleInputChange("description", text)),
            value:meal.description
          }}
        />

      
      {/* Grocery Items */}
      <FlatList
        data={meal.groceryItems}
        //keyboardShouldPersistTaps="handled"
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.inputContainer}>
            <View style={styles.checkboxContainer}>
              <Pressable onPress={() => handleGroceryCheckbox(index)} style={styles.checkbox}>
                <MaterialIcons  
                  size={24} 
                  color={GlobalStyles.colors.primary100} 
                  name={() =>handleGroceryCheckbox(index) ? "check-box" : "check-box-outline-blank"}
                  //name={() =>handleGroceryCheckbox(index) ? "check-box" : "check-box-outline-blank"}
                  />
              </Pressable>
            </View>
            <TextInput style={[styles.inputQty,styles.inputAll]}
              keyboardType='numeric'
              placeholder="Qty"
              maxLength={3}
              onChangeText={(text) => handleGroceryChange(index, "quantity", text)}
              value={item.quantity}
            />
            <TextInput style={[styles.inputGrocery,styles.inputAll]}
              keyboardType='default'
              placeholder="Enter Grocery Item"
              maxLength={50}
              onChangeText={(text) => handleGroceryChange(index, "name", text)}
              value={item.name}
            />
            <IconButtonNoText icon="trash" size={20} color={GlobalStyles.colors.error500} onPress={() => deleteGroceryItem(index)} />
          </View>
        )}
      />

      <Text style={styles.errorText}>
        Meal not yet saved/updated!
      </Text>
      <View style={styles.buttons}>
        {/* Add Grocery Item Button */}
        <Button onPress={addGroceryItem}>Add Grocery Item</Button>
        {/* Save/Update Button */}
        <Button style={{marginLeft:8}} onPress={() => saveMeal(meal)}>Save Meal</Button>
      </View>
      
    </View>
  );
}

const styles = {
  label: {
    fontSize: 12,
    color: GlobalStyles.colors.primary100,
    marginBottom: 4,
    marginLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  errorText: {
    textAlign: 'center',
    color: GlobalStyles.colors.error500,
    margin: 8,
  },
  rowInput: {
    flex: 1,
  },
  inputGrocery: {
    width: '69%',
    //marginRight: 8,
  },
  inputQty: {
    width: '15%',
    marginRight: 8,
  },
  inputDate:{
    width: '98%',
    marginLeft: 4,
  },
  inputContainer:{
    flexDirection: 'row',
    marginBottom: 8,
    marginLeft: 4
  },
  inputAll: {
    backgroundColor: GlobalStyles.colors.primary100,
    color: GlobalStyles.colors.primary700,
    padding: 6,
    borderRadius: 6,
    fontSize: 18,
    marginTop: 4,
  },
  buttons:{flexDirection:'row',justifyContent: 'center'},
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 2,
  },
  checkbox: {
    marginRight: 0,

  },
};
