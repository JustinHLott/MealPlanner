import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet } from "react-native";
import { DataTable } from "react-native-paper";
import { GlobalStyles } from '../../constants/styles';
import Button from '../UI/Button';

const MealGroceries = ({addRows}) => {
  const [data, setData] = useState([]);
  const [description, setDescription] = useState("");
  const [qty, setQty] = useState();

const  addRow = () => {
    if (description) {

      setData([...data, { id: Date.now().toString(), description, qty:(!qty? 1:qty)}]);
      setDescription("");
      setQty("");
      
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        {/* Input Fields */}
        <View style={styles.inputContainer}>
          <TextInput style={[styles.inputQty,styles.inputAll]}
            keyboardType='numeric'
            placeholder="Enter Qty"
            maxLength={3}
            onChangeText={setQty}
            value={qty}
          />
          <TextInput style={[styles.inputGrocery,styles.inputAll]}
            keyboardType='default'
            placeholder="Enter Grocery Item"
            maxLength={50}
            onChangeText={setDescription}
            value={description}
          />
        </View>
        
        <Button style={styles.button} onPress={addRow} >Move Grocery Item To List</Button>
      </View>
      <View style={styles.dataTable}>
        {/* Data Table */}
        <DataTable>
          <DataTable.Header>
            <DataTable.Title><Text style={styles.headerText}>Qty</Text></DataTable.Title>
            <DataTable.Title><Text style={styles.headerText}>Grocery Item</Text></DataTable.Title>
          </DataTable.Header>
        
        
          <ScrollView>
            {data.map((item) => (
              <DataTable.Row key={item.id}>
                <DataTable.Cell><Text style={styles.text}>{item.qty}</Text></DataTable.Cell>
                <DataTable.Cell><Text style={styles.text}>{item.description}</Text></DataTable.Cell>
              </DataTable.Row>
            ))}
          </ScrollView>
        </DataTable>
      </View>
      

      <Button style={styles.button} onPress={addRow} >Save Items To Grocery List</Button>

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
    flexDirection: 'row',
    marginBottom: 8,
  },
  inputAll: {
    backgroundColor: GlobalStyles.colors.primary100,
    color: GlobalStyles.colors.primary700,
    padding: 6,
    borderRadius: 6,
    fontSize: 18,
    marginTop: 20,
  },
  headerText:{
    color: 'white',
    fontSize: 20,
  },
  text:{
    color: 'white'
  },
  button: {
    width: '100%',
    marginHorizontal: 0,
  },
});

export default MealGroceries;