import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import { DataTable } from "react-native-paper";
import InputNoLabel from "../ManageMeal/InputNoLabel";

const MealGroceries = () => {
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  const addRow = () => {
    if (name && age) {
      setData([...data, { id: Date.now().toString(), name, age }]);
      setName("");
      setAge("");
    }
  };

  return (
    <View style={styles.container}>
      {/* Input Fields */}
      <View style={styles.inputContainer}>
        <InputNoLabel
            style={styles.input}
            textInputConfig={{
                keyboardType: 'default',
                placeholder: 'Enter Name',
                maxLength: 50,
                onChangeText: {setName},
                value: {name},
            }}
            />
        <InputNoLabel
            textInputConfig={{
                keyboardType: 'numeric',
                placeholder: 'Enter Age',
                maxLength: 3,
                onChangeText: {setAge},
                value: {age},
            }}
        />
      </View>
      
      <Button title="Add Row" onPress={addRow} />

      {/* Data Table */}
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Name</DataTable.Title>
          <DataTable.Title>Age</DataTable.Title>
        </DataTable.Header>

        {data.map((item) => (
          <DataTable.Row key={item.id}>
            <DataTable.Cell>{item.name}</DataTable.Cell>
            <DataTable.Cell>{item.age}</DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 10 },
  input: {
width: '70%'
  },
  inputContainer:{
    flexDirection: 'row'
  }
});

export default MealGroceries;
