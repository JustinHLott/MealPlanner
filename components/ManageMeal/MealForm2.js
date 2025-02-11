import React, { useState } from "react";
import { View, TextInput, FlatList, Text } from "react-native";

import { GlobalStyles } from '../../constants/styles';
import Input from './Input';
import Button from '../UI/Button';
import IconButtonNoText from "../UI/IconButtonNoText";

const defaultMeal = {
  date: "",
  description: "",
  groceryItems: [], // Start as an empty array
};

const noDate="";
const defaultGroceryItem = { name: "", quantity: "" };

export default function MealForm2({ initialMeal = {}, defaultDate, onSubmit }) {
  // Merge `initialMeal` with `defaultMeal` to avoid undefined values
  const [meal, setMeal] = useState({ ...defaultMeal, ...initialMeal });
  const [theDate, setTheDate] = useState({ ...noDate, ...defaultDate });

  // Function to update the meal's date or description
  const handleInputChange = (key, value) => {
    setMeal((prevMeal) => ({
      ...prevMeal,
      [key]: value,
    }));
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

  // Function to add a new grocery item
  const addGroceryItem = () => {
    setMeal((prevMeal) => ({
      ...prevMeal,
      groceryItems: [...prevMeal.groceryItems, { ...defaultGroceryItem }],
    }));
  };

  function saveMeal(meal){
    console.log("Makes it to saveMeal in MealForm2")
    onSubmit(meal)
  }

  // Function to delete grocery item
  const deleteGroceryItem = (index) => {
    setMeal((prevMeal) => ({
      ...prevMeal,
      groceryItems: prevMeal.groceryItems.filter((_, i) => i !== index),
    }));
  };

  return (
    <View style={{ padding: 20 }}>
      {/* Date Input */}
        <Input
          style={styles.rowInput}
          label="Date"
          //invalid={!inputs.date.isValid}
          editable={false}//this is supposed to make it disabled
          selectTextOnFocus={false}//this is supposed to make it so you can't select the text
          textInputConfig={{
            keyboardType: 'decimal-pad',
            placeholder: 'yyyy-mm-dd',//defaultDate.toISOString().slice(0, 10),
            maxLength: 10,
            onChangeText:((text) => handleInputChange("date", text)),
            value:(meal.date? meal.date.toISOString().slice(0, 10): "")
          }}
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
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.inputContainer}>
            <TextInput style={[styles.inputQty,styles.inputAll]}
              keyboardType='numeric'
              placeholder="Enter Qty"
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
    width: '20%',
    marginRight: 8,
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
  buttons:{flexDirection:'row',justifyContent: 'center'}
};
