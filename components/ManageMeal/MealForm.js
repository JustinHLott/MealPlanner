import { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TextInput } from 'react-native';

import Input from './Input';
import Button from '../UI/Button';
import { getFormattedDate } from '../../util/date';
import { GlobalStyles } from '../../constants/styles';

function MealForm({ submitButtonLabel, onCancel, onSubmit, defaultValues, defaultDate }) {
  const [groceryList, setGroceryList] = useState(defaultValues); // List of grocery items
  const [groceryItems, setGroceryItems] = useState([]); // List of grocery items
  const [inputs, setInputs] = useState({
    date: {
      value: defaultValues ? getFormattedDate(defaultValues.date) : defaultDate.toISOString().slice(0, 10),
      isValid: true,
    },
    description: {
      value: defaultValues ? defaultValues.description : '',
      isValid: true,
    },
    groceryItems: {
      value: defaultValues ? defaultValues.groceryItems: []
    }
  });

  function inputChangedHandler(inputIdentifier, enteredValue) {
    setInputs((curInputs) => {
      console.log(enteredValue)
      return {
        ...curInputs,
        [inputIdentifier]: { value: enteredValue, isValid: true },
      };
    });
  }

  function submitHandler() {
    const mealData = {
      date: new Date(inputs.date.value),//defaultDate,//
      description: inputs.description.value,
      groceryItems: inputs.groceryItems.value,
    };

    const dateIsValid = mealData.date.toString() !== 'Invalid Date';
    const descriptionIsValid = mealData.description.trim().length > 0;

    if (!dateIsValid || !descriptionIsValid) {
      // Alert.alert('Invalid input', 'Please check your input values');
      setInputs((curInputs) => {
        return {
          date: { value: curInputs.date.value, isValid: dateIsValid },
          description: {
            value: curInputs.description.value,
            isValid: descriptionIsValid,
          },
          groceryItems: { value: curInputs.groceryItems },
        };
      });
      return;
    }

    onSubmit(mealData);
  }

  // Function to update a specific grocery item
  const updateGroceryItem = (index, key, value) => {
    const updatedItems = [...groceryItems];
    updatedItems[index][key] = value;
    console.log(updatedItems);
    setGroceryItems(updatedItems);
  };

  const formIsInvalid =
    !inputs.date.isValid ||
    !inputs.description.isValid;

  if(inputs.length>0){
    console.log(inputs.length);
  }
  return (
    <View style={styles.form}>
      {console.log(inputs)}
      <FlatList
      data={inputs}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={{ padding: 10, borderBottomWidth: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.date} - {item.description}</Text>
          <FlatList
            data={item.groceryItems}
            keyExtractor={(grocery) => grocery.id}
            renderItem={({ item: grocery }) => (
              <Text style={{ marginLeft: 10 }}>• {grocery.name}: {grocery.quantity}</Text>
            )}
          />
        </View>
      )}
    />
      <Text style={styles.title}>Your Meal</Text>
      <View style={styles.inputsRow}>
        <Input
          style={styles.rowInput}
          label="Date"
          invalid={!inputs.date.isValid}
          editable={false}//this is supposed to make it disabled
          selectTextOnFocus={false}//this is supposed to make it so you can't select the text
          textInputConfig={{
            keyboardType: 'decimal-pad',
            placeholder: 'yyyy-mm-dd',//defaultDate.toISOString().slice(0, 10),
            maxLength: 10,
            onChangeText: inputChangedHandler.bind(this, 'date'),
            value: inputs.date.value,//dateToUse,//defaultDate.toISOString().slice(0, 10),//
          }}
        />
      </View>
      <Input
        label="Description"
        invalid={!inputs.description.isValid}
        textInputConfig={{
          multiline: true,
          // autoCapitalize: 'none'
          // autoCorrect: false // default is true
          onChangeText: inputChangedHandler.bind(this, 'description'),
          value: inputs.description.value,
        }}
      />
      {/* <FlatList
        data={inputs.groceryItems.value}
        keyExtractor={(grocery) => grocery.id}
        renderItem={({ item, grocery }) => (
          <View style={styles.groceryRow}>
            <TextInput
              style={styles.groceryInput}
              placeholder="Item Name"
              value={grocery.name}
              onChangeText={(text) => updateGroceryItem(index, "name", text)}
            />
            {console.log(item.quantity)}
            <TextInput
              style={styles.groceryInput}
              placeholder="Quantity"
              value={grocery.quantity}
              keyboardType="numeric"
              onChangeText={(text) => updateGroceryItem(index, "quantity", text)}
            />
          </View>
        )}
      /> */}
      {formIsInvalid && (
        <Text style={styles.errorText}>
          Invalid input values - please check your entered data!
        </Text>
      )}
      <View style={styles.buttons}>
        <Button style={styles.button} mode="flat" onPress={onCancel}>
          Cancel
        </Button>
        <Button style={styles.button} onPress={submitHandler}>
          {submitButtonLabel}
        </Button>
      </View>
    </View>
  );
}

export default MealForm;

const styles = StyleSheet.create({
  form: {
    marginTop: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 8
    ,
    textAlign: 'center',
  },
  inputsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowInput: {
    flex: 1,
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
  errorText: {
    textAlign: 'center',
    color: GlobalStyles.colors.error500,
    margin: 8,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    minWidth: 120,
    marginHorizontal: 8,
  },
});
