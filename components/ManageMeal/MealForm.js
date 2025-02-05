import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Input from './Input';
import Button from '../UI/Button';
import { getFormattedDate } from '../../util/date';
import { GlobalStyles } from '../../constants/styles';

function MealForm({ submitButtonLabel, onCancel, onSubmit, defaultValues, defaultDate }) {
  const [inputs, setInputs] = useState({
    date: {
      value: defaultValues ? getFormattedDate(defaultValues.date) : '',
      isValid: true,
    },
    description: {
      value: defaultValues ? defaultValues.description : '',
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

  function submitHandler() {
    const mealData = {
      date: new Date(inputs.date.value),
      description: inputs.description.value,
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
        };
      });
      return;
    }

    onSubmit(mealData);
  }

  const formIsInvalid =
    !inputs.date.isValid ||
    !inputs.description.isValid;

    //console.log(defaultDate);
  return (
    <View style={styles.form}>
      <Text style={styles.title}>Your Meal</Text>
      <View style={styles.inputsRow}>
        <Input
          style={styles.rowInput}
          label="Date"
          invalid={!inputs.date.isValid}
          textInputConfig={{
            keyboardType: 'decimal-pad',
            placeholder: defaultDate.toISOString().slice(0, 10),
            maxLength: 10,
            onChangeText: inputChangedHandler.bind(this, 'date'),
            value: inputs.date.value,
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

export default MealForm;

const styles = StyleSheet.create({
  form: {
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 24,
    textAlign: 'center',
  },
  inputsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowInput: {
    flex: 1,
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
