import React, { useState } from "react";
import { View, TextInput, Button, FlatList, Text, StyleSheet, Alert } from "react-native";
//import { database, ref, push } from "./firebaseConfig"; // Import Firebase
import { storeMeal2, updateMeal, deleteMeal } from '../util/http';

const AddMealAndGrocery = () => {
  const [meal, setMeal] = useState("");
  const [date, setDate] = useState("");
  const [groceryItem, setGroceryItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [meals, setMeals] = useState([]);

  // Add meal and grocery items to array
  const addMeal = () => {
    if (meal && date && groceryItem && quantity) {
      const newMeal = {
        meal,
        date,
        groceryItems: [{ description: groceryItem, qty: quantity }],
      };

      setMeals([...meals, newMeal]); // Add to array
      setMeal(""); setDate(""); setGroceryItem(""); setQuantity(""); // Clear fields
    } else {
      Alert.alert("Please fill all fields.");
    }
  };

  // Send meals to Firebase
  const sendToFirebase = async () => {
    if (meals.length === 0) {
      Alert.alert("No meals to send.");
      return;
    }

    try {
      await storeMeal2(meals);
      Alert.alert("Meals successfully sent to Firebase!");
      setMeals([]); // Clear after sending
    } catch (error) {
      console.error("Firebase Error:", error);
      Alert.alert("Error sending meals.");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Meal Name" value={meal} onChangeText={setMeal} />
      <TextInput style={styles.input} placeholder="Date (YYYY-MM-DD)" value={date} onChangeText={setDate} />
      <View style={styles.inputContainer}>
        <TextInput style={[styles.input,styles.inputQty]} placeholder="Quantity" value={quantity} onChangeText={setQuantity} keyboardType="numeric" />
        <TextInput style={[styles.input,styles.inputGrocery]} placeholder="Grocery Item" value={groceryItem} onChangeText={setGroceryItem} />
      </View>
      
      
      
      <Button title="Add Meal" onPress={addMeal} />
      
      {/* Display meals */}
      <FlatList
        data={meals}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text>🍽 {item.meal} - 📅 {item.date}</Text>
            {item.groceryItems.map((g, i) => (
              <Text key={i}>🛒 {g.description} - {g.qty}</Text>
            ))}
          </View>
        )}
      />

      <Button title="Send to Firebase" onPress={sendToFirebase} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, borderColor: "gray", padding: 10, marginBottom: 10, borderRadius: 5 },
  listItem: { padding: 10, marginVertical: 5, backgroundColor: "#f9f9f9", borderRadius: 5 },
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

export default AddMealAndGrocery;
