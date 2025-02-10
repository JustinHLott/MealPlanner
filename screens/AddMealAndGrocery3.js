import React, { useState } from "react";
import { View, TextInput, Button, FlatList, Text, StyleSheet, Alert } from "react-native";
//import { database, ref, push } from "./firebaseConfig"; // Import Firebase
import { storeMeal3, updateMeal, deleteMeal } from '../util/http';
import { useNavigation } from '@react-navigation/native';

const AddMealAndGrocery3 = () => {
  // State for meal name and date
  const [description, setMeal] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // Default to today's date
  const [groceryItems, setGroceryItems] = useState([]); // List of grocery items
  const Navigation = useNavigation();

  // Function to add a new grocery item input
  const addGroceryItem = () => {
    setGroceryItems([...groceryItems, { name: "", quantity: "" }]);
  };

  // Function to update a specific grocery item
  const updateGroceryItem = (index, key, value) => {
    const updatedItems = [...groceryItems];
    updatedItems[index][key] = value;
    setGroceryItems(updatedItems);
  };

  // Function to send data to Firebase
  const saveMealToFirebase = async() => {
    if (!description.trim()) {
      alert("Please enter a meal name.");
      return;
    }

    const mealData = {
      description,
      date,
      groceryItems: groceryItems.filter(item => item.name.trim() && item.quantity.trim()), // Remove empty entries
    };

    // Save to Firebase under "meals" node
    await storeMeal3(mealData)
      .then(() => {
        alert("Meal saved!");
        setMeal(""); // Reset meal name
        setGroceryItems([]); // Clear grocery items
      })
      .catch(error => alert("Error saving meal: " + error.message));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Meal Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter meal name"
        value={description}
        onChangeText={setMeal}
      />

      <Text style={styles.label}>Grocery Items:</Text>
      <FlatList
        data={groceryItems}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.groceryRow}>
            <TextInput
              style={styles.groceryInput}
              placeholder="Item Name"
              value={item.name}
              onChangeText={(text) => updateGroceryItem(index, "name", text)}
            />
            <TextInput
              style={styles.groceryInput}
              placeholder="Quantity"
              value={item.quantity}
              keyboardType="numeric"
              onChangeText={(text) => updateGroceryItem(index, "quantity", text)}
            />
          </View>
        )}
      />

      <Button title="Add Grocery Item" onPress={addGroceryItem} />
      <Button title="Save Meal" onPress={saveMealToFirebase} color="green" />
      <Button title="View Meals" onPress={()=> Navigation.navigate('AllMeals3')} color="brown" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  groceryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  groceryInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginRight: 5,
    borderRadius: 5,
  },
  inputGrocery: {
    width: '73%',
    //marginRight: 8,
  },
  inputQty: {
    width: '25%',
    marginRight: 8,
  },
  inputContainer:{
    flexDirection: 'row',
    marginBottom: 8,
  },
});

export default AddMealAndGrocery3;
