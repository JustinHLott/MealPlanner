import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet } from "react-native";
import { DataTable } from "react-native-paper";
import { GlobalStyles } from '../../constants/styles';
import Button from '../UI/Button';

const MealGroceries = ({addRows}) => {
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [qty, setQty] = useState();

const  addRow = () => {
    if (name) {

      setData([...data, { id: Date.now().toString(), name, qty:(!qty? 1:qty)}]);
      setName("");
      setQty("");
      
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
  top:{flex: 3},
  dataTable:{flex:2.5},
  bottomButton:{flex:.5},
  inputGrocery: {
    width: '73%',
    //marginRight: 8,
  },
  inputQty: {
    width: '25%',
    marginRight: 8,
  },
  inputContainer:{
    flexDirection: 'row'
  }
});

export default MealGroceries;
