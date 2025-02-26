import { useState, useContext } from 'react';
import { StyleSheet, Text, View, TextInput,Alert } from 'react-native';

import Input from './Input';
import Button from '../UI/Button';
//import { getFormattedDate } from '../../util/date';
import { GlobalStyles } from '../../constants/styles';

//defaultMealDesc={selectedMeal.description}
function GroceryForm({ submitButtonLabel, onCancel, onSubmit, defaultValues, defaultMealDesc }) {
  console.log("defaultValues in GroceryForm", defaultValues);
  const [inputs, setInputs] = useState({
    qty: {
      value: defaultValues ? defaultValues.qty : 0,
      isValid: true,
    },
    description: {
      value: defaultValues ? defaultValues.description : '',
      isValid: true,
    },
    checkedOff: {
      value: defaultValues ? defaultValues.checkedOff : '',
      isValid: true,
    },
    thisId: {
      value: defaultValues ? defaultValues.thisId : '',
      isValid: true,
    },
    id: {
      value: defaultValues ? defaultValues.id : '',
      isValid: true,
    },
    mealId: {
      value: defaultValues ? defaultValues.mealId : '',
      isValid: true,
    },
    mealDesc: {
      value: defaultValues ? defaultValues.mealDesc : '',
      isValid: true,
    },
  });

  

  function inputChangedHandler(inputIdentifier, enteredValue) {
    setInputs((curInputs) => {
      return {
        ...curInputs,
        [inputIdentifier]: { value: enteredValue, isValid: true },
      };
    });
  }

  //console.log("inputs.mealDesc",inputs.mealDesc);

  function submitHandler() {
    const groceryData = {
      qty: inputs.qty.value,
      description: inputs.description.value,
      mealId: inputs.mealId.value,
      mealDesc: inputs.mealDesc.value,
      id: inputs.id.value,
      thisId: inputs.thisId.value,
      checkedOff: inputs.checkedOff.value,
    };

    const qtyIsValid = groceryData.qty.toString() !== '';
    const descriptionIsValid = groceryData.description.trim().length > 0;

    if ( !descriptionIsValid) {
      // Alert.alert('Invalid input', 'Please check your input values');
      setInputs((curInputs) => {
        return {
          qty: { value: curInputs.qty.value, isValid: qtyIsValid },
          description: {
            value: curInputs.description.value,
            isValid: descriptionIsValid,
          },
        };
      });
      return;
    }

    onSubmit(groceryData);
  }

  const formIsInvalid =
    !inputs.qty.isValid ||
    !inputs.description.isValid;

  return (
    <View style={styles.form}>
      <Text style={styles.title}>Your Grocery Item</Text>
      <View style={styles.inputsRow}>
        {/* Date Input */}
        <Text style={styles.label}>Meal</Text>
        <View style={styles.inputContainer}>
          <TextInput style={[styles.inputDate,styles.inputAll]}
            placeholder='No meal associated'
            editable={false}
            //if it's a valid date, "validateDate" changes it to a text string.
            //value={inputs.mealId.value}
            value={inputs.mealDesc.value}
          />
        </View>
        {/* Grocery id */}
        <Text style={styles.label}>Grocery Id</Text>
        <View style={styles.inputContainer}>
          <TextInput style={[styles.inputDate,styles.inputAll]}
            placeholder='No grocery id'
            editable={false}
            //if it's a valid date, "validateDate" changes it to a text string.
            //value={inputs.mealId.value}
            value={inputs.thisId.value}
          />
        </View>
        <Input
          style={styles.rowInput}
          label="Qty"
          invalid={!inputs.qty.isValid}
          textInputConfig={{
            keyboardType: 'decimal-pad',
            placeholder: '0',
            maxLength: 2,
            onChangeText: inputChangedHandler.bind(this, 'qty'),
            value: inputs.qty.value,
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

export default GroceryForm;

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
    color: GlobalStyles.colors.primary100,
    marginBottom: 4,
    marginLeft: 4,
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
  form: {
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: GlobalStyles.colors.primary50,
    marginVertical: 24,
    textAlign: 'center',
  },
  inputsRow: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
  },
  rowInput: {
   // flex: 1,
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
