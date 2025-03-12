import {View, Text, StyleSheet, Pressable, FlatList, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import RadioGroup from 'react-native-radio-buttons-group';
import axios from 'axios';

import Footer from "../../components/Footer";
import { GlobalStyles } from '../../constants/styles';
import Button from '../../components/UI/Button';
import { useEmail } from '../../store/email-context';

const BACKEND_URL = 'https://justinhlottcapstone-default-rtdb.firebaseio.com';

//stores user info to firebase online.
export async function storeGroup(newGroup) {
  const response = await axios.post(BACKEND_URL + '/groups.json', newGroup);
  const id = response.data.name;
  return id;
}

export async function updateGroup(groupId, updatedGroup){
    //update firebase with new mealData
    const updatedMeal = await axios.put(BACKEND_URL + `/groups/${groupId}.json`, updatedGroup);
    return updatedMeal;
}

export const fetchGroupsByEmail = async (email) => {
    try {
      const response = await axios.get(BACKEND_URL + '/groups.json', email);
      const data = response.data;
  
      if (!data) return [];
  
      // Convert object to array and filter by email
      const groups = Object.keys(data)
        .map((key) => ({ id: key, ...data[key] }))
        .filter((group) => group.email === email);
  
      return groups;
    } catch (error) {
      console.error('Error fetching groups:', error);
      return [];
    }
  };

const RadioButtonWithDelete = ({ label, selected, onPress, onDelete, deleteYN }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
      {/* Radio Button */}
      <Pressable
        onPress={onPress}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          flex: 1, // Ensures text takes available space
        }}
      >
        <View
          style={{
            height: 17,
            width: 17,
            borderRadius: 8.5,
            borderWidth: 2,
            borderColor: selected ? 'blue' : 'blue',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 10,
          }}
        >
          {selected && <View style={{ height: 10, width: 10, borderRadius: 5,
            backgroundColor: 'blue' }} />}
        </View>
        <Text style={{ fontSize: 13 }}>{label}</Text>
      </Pressable>
  
      {/* Delete Button */}
      {deleteYN??
      <Pressable onPress={onDelete} style={{ marginLeft: 10 }}>
        <Text style={{ color: 'red', fontSize: 16, marginRight:100 }}>❌</Text>
      </Pressable>
      }
      
    </View>
  );

export default function Settings(){
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [creatingNewGroup, setCreatingNewGroup] = useState(false);
    const [newGroupName, setNewGroupName] = useState(null);
    const { emailAddress, setEmailAddress } = useEmail();
    const [accounts, setAccounts] = useState([
        { id: 'personal', label: 'Personal Account' },
        { id: 'shared', label: 'Shared Account' },
    ]);
    const [groups, setGroups] = useState([
        { id: 'his', label: 'his group' },
        { id: 'her', label: 'her group' },
    ]);

    const [group, setGroup] = useState(null);

    useEffect(()=>{
        fetchGroup();
    },[]);

    async function fetchGroup(){
        const theGroups = await fetchGroupsByEmail(emailAddress);
        //set groups as all groups with my email.
        setGroups(theGroups);
        //filter out all but personal group (group === email)
        setGroup(theGroups.filter((item) => item.group === emailAddress));
    }

    function chooseAccount(id){
        if(id==="shared"){
            fetchGroup();
        }
        setSelectedAccount(id);
    }

    function createNewGroup(){
        setCreatingNewGroup(true);
    }

    async function showNewGroup(){
        
        return(
            <View style={{flexDirection: 'row'}}>
                <TextInput
                    style={styles.inputBox}
                    placeholder="New Group Name"
                    value={newGroupName}
                    onChangeText={(text)=>setNewGroupName(text)}
                />
                <Button style={{justifyContent:"left",alignItems:'left',flexDirection: 'row',marginLeft: 20}}
                    onPress={createNewGroup2}>Create New Group</Button>
            </View>
        )
    }
    
    async function createNewGroup2(){
        //console.log("Settings email:",emailAddress);
        const newGroup = {
            group: newGroupName,
            email: emailAddress,
        }
        const id = await storeGroup(newGroup);
        const newGroup2={...newGroup,id: id, groupId: id};
        console.log("Settings newGroup2",newGroup2);
        updateGroup(id, newGroup2);
    }

    // Function to delete a group option
    const deleteGroup = (id) => {
        setGroups((prev) => prev.filter((item) => item.id !== id));
        if (selectedGroup === id) setSelectedGroup(null); // Reset if deleted option was selected
    };

    function  groupSelection(){
    return(
        <View>
            <Text style={[styles.textHeader,{marginTop: 20, marginBottom: 10 }]}>Select Group:</Text>
            <FlatList
                data={groups}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                <RadioButtonWithDelete
                    label={item.group}
                    selected={selectedGroup === item.id}
                    onPress={() => setSelectedGroup(item.id)}
                    onDelete={() => deleteGroup(item.id)}
                />
                )}
            />
        </View>
      
    )
  };


  function noSelection(){
    return(<View></View>)
  };

    return(
        <View style={styles.topView}>
            <View style={styles.topView}>
                <View style={{ padding: 20 }}>
                    {/* Account Type Selection */}
                    <Text style={[styles.textHeader,{ fontWeight: 'bold', marginBottom: 10 }]}>Select Account Type:</Text>
                    <FlatList
                        data={accounts}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                        <RadioButtonWithDelete
                            label={item.label}
                            selected={selectedAccount === item.id}
                            onPress={() => chooseAccount(item.id)}
                            //onDelete={() => deleteGroup(item.id)}
                            deleteYN={false}
                        />
                        )}
                    />
                    {selectedAccount==="shared"? groupSelection():noSelection()}
                    {/* Display Selected Values */}
                    <Text style={[styles.text,{ marginTop: 20 }]}>Selected Account: {selectedAccount || "None"}</Text>
                    <Text style={styles.text}>Selected Group: {selectedGroup || "None"}</Text>
                    
                </View>
            </View>
            <View>
            <Button style={{justifyContent:"left",alignItems:'left',flexDirection: 'row',margin: 20}}
                onPress={createNewGroup}>Create New Group</Button>
                {creatingNewGroup? showNewGroup():noSelection()}
            </View>
            <View style={styles.footer}>
                <Button style={{justifyContent:"center",alignItems:'center',flexDirection: 'row'}}>Save Settings</Button>
                <Footer/>
            </View>
            
        </View>
    )

};

const styles = StyleSheet.create({
    topView:{
        flex: 1,
        backgroundColor: GlobalStyles.colors.primary50,
    },
    text:{
        color: GlobalStyles.colors.primary800,
        fontSize: 13
    },
    textHeader:{
        color: GlobalStyles.colors.primary800,
        fontWeight: 'bold',
        fontSize: 15
    },
    footer:{
        backgroundColor: GlobalStyles.colors.primary800,
        paddingTop: 10,
    },
    inputBox:{
        height: 40,
        width: 200,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: 'blue',
        //justifyContent: 'left',
        //alignItems: 'left',
        marginRight: 10,
        marginLeft: 20,
        marginBottom: 10,
    }
})