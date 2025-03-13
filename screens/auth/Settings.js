import {View, Text, StyleSheet, Pressable, FlatList, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import RadioGroup from 'react-native-radio-buttons-group';
import axios from 'axios';

import Footer from "../../components/Footer";
import { GlobalStyles } from '../../constants/styles';
import Button from '../../components/UI/Button';
import { useEmail } from '../../store/email-context';
import storeValue, { getValue} from '../../util/useAsyncStorage';

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
        //console.log("Settings fetch groups1:",groups);
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
        //onPress={() => setSelectedOption(label)}
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

export default function Settings({ route, navigation }){
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [creatingNewGroup, setCreatingNewGroup] = useState(false);
    const [newGroupName, setNewGroupName] = useState(null);
    const [selectedOption, setSelectedOption] = useState("personal");
    const { emailAddress, setEmailAddress } = useEmail();
    const [ groupOrGroups, setGroupOrGroups ] = useState(true);
    const { groupUsing, setGroupUsing} = useEmail();
    const [accounts, setAccounts] = useState([
        { id: 'personal', label: 'Personal Account' },
        { id: 'shared', label: 'Shared Account' },
    ]);
    const [groups, setGroups] = useState([
        { id: 'his', label: 'his group' },
        { id: 'her', label: 'her group' },
    ]);

    const [group, setGroup] = useState(null);

    //const retrievedValue=getValue("accountTypeChosen");
    // if(retrievedValue==="personal"){
    //     retrievedValue=getValue("accountTypeChosen");
    //     setSelectedOption(retrievedValue);
    // }

    useEffect(()=>{
        fetchGroup();//pulls all of the groups associated with the login email
        //retrievedValue=getValue("accountTypeChosen");
        setSelectedOption(pullAcountTypeChosen());
        //setSelectedOption(getValue("accountTypeChosen"));
        //setSelectedOption(retrievedValue);
    },[]);

    async function pullAcountTypeChosen(){
        const accountTypeChosen = await getValue("accountTypeChosen");
        return accountTypeChosen;
    }
    // // Set default selection based on retrievedValue
    // useEffect(() => {
    //     if(selectedOption){
    //         setSelectedOption(retrievedValue);
    //     }
        
    // }, [retrievedValue]);

    async function fetchGroup(){//pulls all of the groups associated with the login email
        const theGroups = await fetchGroupsByEmail(emailAddress);

        //when true only the personal group is shown.
        setGroupOrGroups(true);
        //filter out all but personal group (group === email)
        setGroup(theGroups.filter((item) => item.group === emailAddress));
        await storeValue("groupChosen",emailAddress);
        //console.log("Settings fetched group:",group);
    }

    async function fetchGroups(){//pulls all of the groups associated with the login email
        try{
            const theGroups = await fetchGroupsByEmail(emailAddress);

            //filters groups to only see those that have your email & excludes your personal group.
            const allGroups = Object.keys(theGroups)
            .map((key) => ({ id: key, ...theGroups[key] }))
            .filter((group) => group.email === emailAddress && group.group !== group.email);
            //when false, all groups are shown.
            setGroupOrGroups(false);
            //set groups as all groups with my email.
            setGroups(allGroups);
            
        }catch(error){
            console.log("Settings fetchGroups error:",error)
        }
        
    }

    function chooseAccount(id){//this runs when you select one of option buttons; shared or personal.
        if(id==="shared"){
            fetchGroups();//this is used to filter for your groups meals
            storeValue("accountTypeChosen","shared")
        }else{
            fetchGroup();//this is used to filter for your personal meals
            storeValue("accountTypeChosen","personal")
        }
        setSelectedAccount(id);
        setSelectedOption(id);
    }

    function createNewGroup(){//this runs after pressing 'create new group' button.
        setCreatingNewGroup(true);
        //storeValue("accountTypeChosen","personal")
    }

    async function showNewGroup(){//this runs after pressing 'create new group' button because cretingNewGroup===true.
        
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
        setCreatingNewGroup(false);
    }

    // Function to delete a group option
    const deleteGroup = (id) => {
        setGroups((prev) => prev.filter((item) => item.id !== id));
        if (selectedGroup === id) setSelectedGroup(null); // Reset if deleted option was selected
        //also delete group from firebase



    };

    //select the group that will be used.
    async function selectGroup(id){
        //set group in state
        setSelectedGroup(id);
        //set group in email context
        setGroupUsing(id)
        console.log("Settings group using:",groupUsing);
        await storeValue("groupChosen",id)
        
    }

    function  groupSelection(){
    return(
        <View>
            <Text style={[styles.textHeader,{marginTop: 20, marginBottom: 10 }]}>Select Group:</Text>
            <FlatList
                data={groupOrGroups?group:groups}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                <RadioButtonWithDelete
                    label={item.group}
                    selected={selectedGroup === item.id}
                    onPress={() => selectGroup(item.id)}
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
                            //selected={selectedAccount === item.optionChosen}
                            selected={item.id === selectedOption}
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
                <Button 
                    style={{justifyContent:"center",alignItems:'center',flexDirection: 'row'}}
                    onPress={()=>navigation.goBack()}
                    >Save Settings</Button>
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