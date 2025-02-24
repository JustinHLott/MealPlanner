import React, { useState, useContext, useEffect } from "react";
import { View, TextInput, FlatList, Text, Pressable, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { GlobalStyles } from '../../constants/styles';
import Input from './Input';
import Button from '../UI/Button';
import IconButtonNoText from "../UI/IconButtonNoText";
import { MealsContext } from '../../store/meals-context';
import { ListsContext } from '../../store/lists-context';
import { isValidDate, getDateMinusDays } from "../../util/date";
import { storeList,deleteList } from "../../util/http-list";
import { updateMeal } from "../../util/http";

const defaultMeal = {
  date: "",
  description: "",
  groceryItems: [], // Start as an empty array
};

//defaultGroceryItem needs to keep name and quantity as is.
const defaultGroceryItem = { name: "", quantity: "", checkedOff: "", id: "" };

export default function MealForm2({ initialMeal = {}, defaultDate, onSubmit, submitButtonLabel }) {
  // Merge `initialMeal` with `defaultMeal` to avoid undefined values
  const [meal, setMeal] = useState({ ...defaultMeal, ...initialMeal });
  const [maxDate, setMaxDate] = useState("");
  const [description, setDescription] = useState(initialMeal.description?initialMeal.description:"");
  const [date, setDate] = useState(initialMeal.date?initialMeal.date:"");
  const [pencilColor, setPencilColor] = useState(GlobalStyles.colors.primary100);
  const [errorMessage, setErrorMessage] = useState("filled");
  const [editableOr, setEditableOr] = useState(false);
  const [checked,setChecked] = useState(false);
  const [newGroceryList,setNewGroceryList] = useState();
  // const [showPicker, setShowPicker] = useState(false);
  // const [datePickerDate,setDatePickerDate] = useState(initialMeal.date?initialMeal.date:"");

  //const [firstDate, setFirstDate] = useState(getDateMinusDays(new Date(),1));
  const mealsCtx = useContext(MealsContext);
  const listsCtx = useContext(ListsContext);

  //This only runs once when the screen starts up.
  useEffect(() => {
    if(typeof initialMeal.description!=="undefined"){
      //do nothing
      //console.log("initialMealDescription");
      //console.log(typeof(initialMeal.description.toString));
      let date = new Date(initialMeal.date);

      let updatedMeal3 = {
        date: "",
        description: "",
        groceryItems: [], // Empty grocery items array
        id: "",
      };

      if(isValidDate(initialMeal.date)){
        //console.log("valid date");
        // console.log(startDate);
        // console.log(startDate.toISOString().slice(0, 10));
        //convert date to text string
        date = date.toISOString().slice(0, 10);
        updatedMeal3 = {
          date: date,
          description: initialMeal.description,
          groceryItems: initialMeal.groceryItems, // Empty grocery items array
          id: initialMeal.id,
        };
        //And update the meal with the new date
        setMeal(updatedMeal3);
      }else{
        console.log("Invalid date");
        // console.log(startDate);
        //return startDate;
      }
    }else if(typeof initialMeal.description==="undefined"){
      const mostRecentMealDate = mealsCtx.meals.reduce((meal, latest) => new Date(meal.date) > new Date(latest.date) ? meal : latest);
      console.log("Mostrecentmealdate");
      console.log(mostRecentMealDate);
      
      //Add one day to the most recent date to get the date for the next new meal
      let date = new Date(mostRecentMealDate.date);
      date = getDateMinusDays(date, -2);
      
      const date2 = date
        .toISOString()
        .split("T")[0];
      setDate(date2);
      setMaxDate(date2);
      console.log(date2);
      // Create a new updated meal object
      //const updatedMeal3={mealsCtx.addMeal()}
      const updatedMeal2 = {
        date: date2,
        description: "",
        groceryItems: [], // Empty grocery items array
      };
      //And update the meal with the new date
      setMeal(updatedMeal2);
      console.log(meal);
    }
  }, []);

  // useEffect(() => {
  //   if (!description.trim()) {
  //     setErrorMessage("Both description and date are required!");
  //   } else {
  //     setErrorMessage(""); // Clear error when inputs are valid
  //   }
  // }, [description]);

  useEffect(() => {
    if (description === "" || date === "") {
      setErrorMessage("Both description and date are required!");
    } else {
      setErrorMessage(""); // Clear error when inputs are valid
    }
  }, [description]);

  // Function to update the meal's date or description
  const handleInputChange = (key, value) => {
    if(key==="date"){
      const newDate = new Date(value);
      // console.log("newDate")
      // console.log(newDate)
      //setDate(newDate);
      setMeal((prevMeal) => ({
        ...prevMeal,
        [key]: newDate,
      }));
    }else{
      setMeal((prevMeal) => ({
        ...prevMeal,
        [key]: value,
      }));
      setDescription(value);
    }
  };

  // Function to update grocery items
  const handleGroceryChange = (index, key, value) => {
    const updatedGroceryItems = [...meal.groceryItems];
    updatedGroceryItems[index][key] = value;
    //console.log("groceryitem before: ",updatedGroceryItems[index])
    updatedGroceryItems[index]["mealDesc"] = meal.description;
    //console.log("groceryitem after: ",updatedGroceryItems[index])
    setMeal((prevMeal) => ({
      ...prevMeal,
      groceryItems: updatedGroceryItems,
    }));
    //console.log("new meal: ",meal.groceryItems)
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
    if(meal.groceryItems){
      setMeal((prevMeal) => ({
        ...prevMeal,
        groceryItems: [...prevMeal.groceryItems, { ...defaultGroceryItem }],
      }));
    }else{
      setMeal((prevMeal) => ({
        ...prevMeal,
        groceryItems: [{ ...defaultGroceryItem }],
      }));
    }
    
  };

  function saveMeal(meal2){
    console.log("Makes it to saveMeal in MealForm2",meal2);
    if(!meal2.date||!meal2.description.trim()){
      Alert.alert("Both description and date are required!")
    }else{
      const newDate = new Date(meal2.date);
      // console.log("newDate");
      // console.log(newDate);
      const updatedMeal = {
        ...meal2,
        date: newDate,
      };
      console.log("MealForm2 updatedMeal: ",updatedMeal);

      onSubmit(updatedMeal);//this adds or updates the meal in state to firebase
    }
  }

  function deleteFromGroceryCtx(thisId){
    // console.log("MealForm2 before delete",listsCtx.lists)
    // console.log("MealForm2 thisId",thisId)
    const updatedGroceries1 = listsCtx.lists.filter(grocery => grocery.thisId !== thisId);
    const updatedGroceries = updatedGroceries1.filter(grocery => grocery.id !== thisId);
    listsCtx.setLists(updatedGroceries);
    //listsCtx.setLists(updatedGroceries);
    // console.log("MealForm2 after delete",updatedGroceries);
  }

  // Function to delete grocery item
  const deleteGroceryItem = (index,mealId,thisId) => {

    //remove grocery item from state
    setMeal((prevMeal) => ({
      ...prevMeal,
      groceryItems: prevMeal.groceryItems.filter((_, i) => i !== index),
    }));

    //remove grocery item from firebase
    deleteList(thisId);
    //remove grocery item from mealsCtx
    deleteFromGroceryCtx(thisId)
    //console.log("MealForm2 @ updateCTX")
    const selectedMeal = mealsCtx.meals.find(
      (meal) => meal.id === mealId
    );
    if(selectedMeal){
      //console.log("MealForm2 selectedMeal",selectedMeal)
      createMealWithoutGroceryItem(selectedMeal,thisId)
    }else{
      console.log("MealForm2 no selectedMeal")
    }
  };

  function createMealWithoutGroceryItem(selectedMeal,thisId){
    let noGroceries = true;
    let newGroceryList = []
    meal.groceryItems.map((item, index) => {
      const groceryItem = { description: item.description, qty: item.qty, checkedOff: item.checkedOff, mealId: item.mealId,thisId: item.thisId, id:item.id?item.id:item.thisId };
      if(item.thisId !== thisId){
        noGroceries = false;
        newGroceryList.push(groceryItem);
      }
    });

    const updatedMeal={
      date: selectedMeal.date,
      description: selectedMeal.description,
      id: selectedMeal.id,
      groceryItems: newGroceryList,
    }
    //update meal in firebase
    updateMeal(selectedMeal.id,updatedMeal, selectedMeal, addCtxList, deleteCtxList, noGroceries)
    //update meal in ctx
    mealsCtx.updateMeal(selectedMeal.id,updatedMeal)
  }

  function addCtxList(updatedGrocery,responseGrocery){
    try{
      console.log("ManageMeal addCtxlist")
      //setNewItemId(responseGrocery.data.name);
      //console.log("ManageMeals newItemId: ", newItemId)
      console.log("ManageMeals newItemId2: ", responseGrocery.data.name)
      const groceryItem={
        ...updatedGrocery, thisId: responseGrocery.data.name
      };
      //const groceryId = responseGrocery.data.name;
      updateList(responseGrocery.data.name,groceryItem);
      listsCtx.addList(groceryItem);
    }catch(error){
      console.error("ManageMeal addCtxList Error:", error);
    }
  }
  
  function deleteCtxList(groceryItem){
    console.log("ManageMeal delete groceryItem: ",groceryItem)
    listsCtx.deleteList(groceryItem);
  }

  function validateDate(startDate){
    const startDate1 = new Date(startDate);
    if(isValidDate(startDate)){
      const today=getDateMinusDays(startDate,1);
       console.log("valid date");
      //  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      //  console.log("dayOfWeek",dayOfWeek);
      //  const diff = today.getDate() - dayOfWeek; // Calculate the difference to Sunday
      //  console.log("Diff",diff);
       return new Date(today.setDate(0));
      //return startDate2//.toISOString().slice(0, 10);
    }else{
      console.log("Invalid date",startDate);
      if(startDate.length>0){
        console.log("startDate length:",startDate.length)
        //Add one day to the most recent date to get the date for the next new meal
      let startDate2 = new Date(startDate);
      startDate2 = getDateMinusDays(startDate2, 0);
       console.log("Invalid date2",startDate2);
       return startDate2.toISOString().slice(0, 10);
      }else{
        //const startDate2=getDateMinusDays(startDate,0);
       
      //  const today = new Date(date);
      //  const startDate2=getDateMinusDays(today,0);
      const mostRecentMealDate = mealsCtx.meals.reduce((meal, latest) => new Date(meal.date) > new Date(latest.date) ? meal : latest);
      console.log("Mostrecentmealdate");
      console.log(mostRecentMealDate);
      
      //Add one day to the most recent date to get the date for the next new meal
      let startDate2 = new Date(mostRecentMealDate.date);
      startDate2 = getDateMinusDays(startDate2, -1);
       console.log("Invalid date2",startDate2);
       return startDate2.toISOString().slice(0, 10);
      // console.log(startDate);
      //return startDate;
      }
      
    }
  }

  function makeDateEditable(){
    if(pencilColor==="green"){
      setEditableOr(false);
      setPencilColor(GlobalStyles.colors.primary100);
    }else{
      setEditableOr(true);
      setPencilColor("green");
    }
    
  }

  return (
    <View style={{ padding: 20, flex: 1 }}>
      {/* Date Input */}
        <Text style={styles.label}>Date</Text>
        <View style={styles.inputContainer}>
          
          <TextInput style={[styles.inputDate,styles.inputAll]}
            keyboardType='decimal-pad'
            placeholder='yyyy-mm-dd'
            editable={editableOr}
            onChangeText={(text) => handleInputChange("date", text)}
            //if it's a valid date, "validateDate" changes it to a text string.
            value={(meal.date? validateDate(meal.date):validateDate(maxDate))}
          />
          <IconButtonNoText style={{width: '20%'}}icon="pencil" size={20} color={pencilColor} onPress={() => makeDateEditable()}/>
          {/* <IconButtonNoText style={{width: '20%'}}icon="pencil" size={20} color={pencilColor} onPress={() => setShowPicker(true)}/> */}
        </View>
        {/* Show Date Picker if button is pressed */}
          {/* {showPicker && (
            <DateTimePicker
              value={datePickerDate}
              mode="date"
              display="default"
              onChange={onChange}
            />
          )} */}
      {/* Description Input */}
      <Input
        label="Description"
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
        //keyboardShouldPersistTaps="handled"//I ended up using this on ScrollView a module up.
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.inputContainer}>
            <View style={styles.checkboxContainer}>
              {/* <Pressable onPress={() => handleGroceryCheckbox(index)} style={styles.checkbox}> */}
                <MaterialIcons  
                  size={24} 
                  color={GlobalStyles.colors.primary100}
                  //name={() =>handleGroceryCheckbox(index) ? "check-box" : "check-box-outline-blank"}
                  name={checked ? 'check-box' : 'check-box-outline-blank'}
                  onPress={() => setChecked(!checked)} // Toggle checkbox
                  />
              {/* </Pressable> */}
            </View>
            <TextInput style={[styles.inputQty,styles.inputAll]}
              keyboardType='numeric'
              placeholder="Qty"
              maxLength={3}
              onChangeText={(text) => handleGroceryChange(index, "quantity", text)}
              value={item.qty?item.qty:item.quantity}
            />
            <TextInput style={[styles.inputGrocery,styles.inputAll]}
              keyboardType='default'
              placeholder="Enter Grocery Item"
              maxLength={50}
              onChangeText={(text) => handleGroceryChange(index, "name", text)}
              value={item.description?item.description:item.name}
            />
            <IconButtonNoText icon="trash" size={20} color={GlobalStyles.colors.error500} onPress={() => deleteGroceryItem(index,item.mealId,item.thisId)} />
          </View>
        )}
      />
      {errorMessage?<Text style={styles.errorText}>{errorMessage}</Text>:null}
      
      <View style={styles.buttons}>
        {/* Add Grocery Item Button */}
        <Button onPress={addGroceryItem}>Add Grocery Item</Button>
        {/* Save/Update Button */}
        <Button style={{marginLeft:8}} onPress={() => saveMeal(meal)}>{submitButtonLabel}</Button>
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
    width: '60%',
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
