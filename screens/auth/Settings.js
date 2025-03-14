import {View, Text, StyleSheet, Pressable, FlatList, TextInput } from 'react-native';
import React, { useEffect, useState, useCallback, useContext } from 'react';
import RadioGroup from 'react-native-radio-buttons-group';
import axios from 'axios';
import { useFocusEffect } from "@react-navigation/native";

import Footer from "../../components/Footer";
import { GlobalStyles } from '../../constants/styles';
import Button from '../../components/UI/Button';
import { useEmail } from '../../store/email-context';
import storeValue, { getValue} from '../../util/useAsyncStorage';
import { ListsContext } from '../../store/lists-context';
import { fetchLists } from '../../util/http-list';

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

const RadioButtonWithDelete = ({ label, selected, itemId, accountOrGroup, onPress, onDelete, deleteYN }) => {
    console.log("settings label:",label);
    // console.log("settings selected:",selected)
    console.log("settings itemId:",itemId);
    console.log("settings accountOrGroup:",accountOrGroup)
    let selected2=false;
    if(selected){
        selected2 = true;
        console.log("settings true:",selected2)
    }else if(itemId===accountOrGroup){
        selected2 = true;
        console.log("settings true_j:",selected2)
    }
    return(
    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5, marginLeft: 15 }}>
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
            borderColor: selected2 ? 'blue' : 'blue',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 10,
          }}
        >
          {selected2 && <View style={{ height: 10, width: 10, borderRadius: 5,
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
    )
};

export default function Settings({ route, navigation }){
    const [firstTime, setFirstTime] = useState(true);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedGroupName,setSelectedGroupName] = useState(null);
    const [creatingNewGroup, setCreatingNewGroup] = useState(false);
    const [newGroupName, setNewGroupName] = useState(null);
    const [selectedOption, setSelectedOption] = useState("personal");
    const { emailAddress, setEmailAddress } = useEmail();
    const [ groupOrGroups, setGroupOrGroups ] = useState(true);
    const { groupUsing, setGroupUsing} = useEmail();
    const [group, setGroup] = useState(null);
    const [accounts, setAccounts] = useState([
        { id: 'personal', label: 'Personal Account' },
        { id: 'shared', label: 'Shared Account' },
    ]);
    const [groups, setGroups] = useState([
        { id: 'his', label: 'his group' },
        { id: 'her', label: 'her group' },
    ]);

    
    const listsCtx = useContext(ListsContext);

    //const retrievedValue=getValue("accountTypeChosen");
    // if(retrievedValue==="personal"){
    //     retrievedValue=getValue("accountTypeChosen");
    //     setSelectedOption(retrievedValue);
    // }

    useFocusEffect(
        useCallback(() => {
            setFirstTime(true);
        }, [])
    );

    if(firstTime===true){
        console.log("Settings firstTime")
        setFirstTime(false);
        // pullGroupChosen();
        // pullAcountTypeChosen()
        const accntType = pullAcountTypeChosen();
        setSelectedAccount(accntType);
        console.log("settings firsttime account:",selectedAccount?selectedAccount.value:null);
        setSelectedGroupName(getValue("groupName"));
    }

    useEffect(()=>{
        //fetchGroup();//pulls all of the groups associated with the login email
        //retrievedValue=getValue("accountTypeChosen");
        setSelectedOption(pullAcountTypeChosen());
        
        setGroup(pullGroupChosen());
    },[]);

    async function pullAcountTypeChosen(){
        const accountTypeChosen = await getValue("accountTypeChosen");
        return accountTypeChosen;
    }

    async function pullGroupChosen(){
        const chosenGroup = await getValue("groupChosen");
        return chosenGroup;
    }
    // // Set default selection based on retrievedValue
    // useEffect(() => {
    //     if(selectedOption){
    //         setSelectedOption(retrievedValue);
    //     }
        
    // }, [retrievedValue]);

    async function fetchGroup(){//pulls the group associated with the login email
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

    async function chooseAccount(id,label){//this runs when you select one of option buttons; shared or personal.
        
        if(id==="shared"){
            fetchGroups();//this is used to filter for your groups meals
            await storeValue("accountTypeChosen","shared")
        }else{
            fetchGroup();//this is used to filter for your personal meals
            await storeValue("accountTypeChosen","personal")
            await storeValue("groupName",label);
            await storeValue("groupChosen",emailAddress);
            setGroup(emailAddress);
            setSelectedGroupName(emailAddress);
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
    async function selectGroup(id,name){
        //set group in state
        setGroup(id);
        setSelectedGroup(id);
        setSelectedGroupName(name);
        //set group in email context
        setGroupUsing(id)
        console.log("Settings group using:",groupUsing)
        await storeValue("groupChosen",id);
        await storeValue("groupName",name);
    }

    async function saveSettings(){
        //fetch meals & grocery items & filter for account.
        //fetch grocery items
        try {
            setFirstTime(true);
              console.log("Makes it to save settings");
              const items = await fetchLists();
              console.log("settings list in GroceryList: ")
        
              const groupUsing = pullGroupChosen()
              .then((result)=>{
                //console.log("RecenetMeals groupChosen:",result);
                let allItems = [];
        
                items.map((item)=>{
                  //console.log("RecentMeals mapped group:",meal)
                  if(item.group === result){
                    allItems.push(item);
                  }
                })
                //console.log("Settings allItems:",allItems);
                // console.log("Settings typeOf:",typeof allItems)
                if(typeof allItems ==='object'){
                
                  listsCtx.setLists(allItems);
                  //console.log("Settings listsCtx.lists:",listsCtx.lists);
                }
              })
              //listsCtx.setLists(allItems);
              //setRecentLists(items);
            } catch (error) {
              console.log(error);
              setError('Could not fetch lists!');
            } finally {
                setFirstTime(false);
            }
        navigation.goBack()
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
                    selected={group === item.group}
                    itemId={item.id}
                    accountOrGroup={group}
                    onPress={() => selectGroup(item.id,item.group)}
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
                    <View style={{flexDirection:'row'}}>
                        <Text style={[styles.textHeader,{ marginBottom: 10 }]}>Select Account Type: </Text>
                    <Text style={[styles.textHeader2,{ paddingTop: 2 }]}> current group = </Text>
                    <Text style={[styles.textHeader2,{ paddingTop: 2, textDecorationLine: 'underline' }]}>{selectedGroupName}</Text>
                    </View>
                    
                    <FlatList
                        data={accounts}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                        <RadioButtonWithDelete
                            label={item.label}
                            //selected={selectedAccount === item.optionChosen}
                            selected={item.id === selectedAccount}
                            itemId={item.id}
                            accountOrGroup={selectedAccount}
                            onPress={() => chooseAccount(item.id,item.label)}
                            //onDelete={() => deleteGroup(item.id)}
                            deleteYN={false}
                        />
                        )}
                    />
                    {selectedAccount==="shared"? groupSelection():noSelection()}
                    {/* Display Selected Values */}
                    {/* <Text style={[styles.text,{ marginTop: 20 }]}>Selected Account: {selectedAccount || "None"}</Text>
                    <Text style={styles.text}>Selected Group: {selectedGroup || "None"}</Text> */}
                    
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
                    onPress={saveSettings}
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
    textHeader2:{
        color: GlobalStyles.colors.primary800,
        fontSize: 13
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