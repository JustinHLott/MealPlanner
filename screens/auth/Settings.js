import {View, Text, StyleSheet, Pressable, FlatList, TextInput, Alert, Modal } from 'react-native';
import React, { useEffect, useState, useCallback, useContext } from 'react';
import RadioGroup from 'react-native-radio-buttons-group';
import axios from 'axios';
import { useFocusEffect } from "@react-navigation/native";
import { ScrollView } from 'react-native-virtualized-view'

import Footer from "../../components/Footer";
import { GlobalStyles } from '../../constants/styles';
import Button from '../../components/UI/Button';
import { useEmail } from '../../store/email-context';
import storeValue, { getValue} from '../../util/useAsyncStorage';
import { MealsContext } from '../../store/meals-context';
import { ListsContext } from '../../store/lists-context';
import { fetchLists } from '../../util/http-list';
import { fetchMeals } from '../../util/http';

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

export function deleteGroupFromFirebase(id) {
    return axios.delete(BACKEND_URL + `/groups/${id}.json`);
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

const RadioButtonWithDelete = React.memo(({ label, selected, itemId, accountOrGroup, onPress, onDelete, deleteYN }) => {
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
        <Text style={{ fontSize: 13, color: GlobalStyles.colors.primary800 }}>{label}</Text>
      </Pressable>
  
      {/* Delete Button */}
      {deleteYN??
      <Pressable onPress={onDelete} style={{ marginLeft: 10 }}>
        <Text style={{ color: 'red', fontSize: 16, marginRight:100 }}>❌</Text>
      </Pressable>
      }
      
    </View>
    )
});

export default function Settings({ route, navigation }){
    const [firstTime, setFirstTime] = useState(true);
    const [selectedAccount, setSelectedAccount] = useState(null);
    //const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedGroupName,setSelectedGroupName] = useState(null);
    const [creatingNewGroup, setCreatingNewGroup] = useState(false);
    const [addNewEmail, setAddNewEmail] = useState(false);
    const [newEmail, setNewEmail] = useState(null);
    const [newGroupName, setNewGroupName] = useState(null);
    const [selectedOption, setSelectedOption] = useState("personal");
    const { emailAddress, setEmailAddress } = useEmail();
    const [ groupOrGroups, setGroupOrGroups ] = useState(true);
    //const { groupUsing, setGroupUsing} = useEmail();
    const [group, setGroup] = useState(null);
    const [groupId, setGroupId] = useState(null);
    const [groups, setGroups] = useState(null);
    const [modalVisible,setModalVisible]=useState(false);
    const [idToDelete,setIdToDelete]=useState(false);
    const [accounts, setAccounts] = useState([
        { id: 'personal', label: 'Personal Account' },
        { id: 'shared', label: 'Shared Account' },
    ]);
    

    const mealsCtx = useContext(MealsContext);
    const listsCtx = useContext(ListsContext);

    useFocusEffect(
        useCallback(() => {
            setFirstTime(true);
        }, [])
    );

    if(firstTime===true){
        console.log("Settings firstTime")
        setFirstTime(false);
        const accntType = pullAcountTypeChosen();
        setSelectedAccount(accntType);
        setGroupId(pullGroupChosen());
        console.log("settings firsttime account:",selectedAccount?selectedAccount.value:null);
        setSelectedGroupName(getValue(emailAddress+"groupName"));
    }

    useEffect(()=>{
        //fetchGroup();//pulls all of the groups associated with the login email
        //retrievedValue=getValue(emailAddress+"accountTypeChosen");
        console.log("settings useEffect")
        setSelectedOption(pullAcountTypeChosen());
        
        setGroupId(pullGroupChosen());
    },[]);

    async function pullAcountTypeChosen(){
        const accountTypeChosen = await getValue(emailAddress+"accountTypeChosen");
        return accountTypeChosen;
    }

    async function pullGroupChosen(){
        const chosenGroup = await getValue(emailAddress+"groupChosen");
        if(selectedAccount==='personal'){
            return chosenGroup;
        }else{
            return chosenGroup;
        }
        
    }

    async function fetchGroup(){//pulls the group associated with the login email
        const theGroups = await fetchGroupsByEmail(emailAddress);

        //when true only the personal group is shown.
        setGroupOrGroups(true);
        //filter out all but personal group (group === email)
        setGroup(theGroups.filter((item) => item.email === emailAddress && item.group === emailAddress));
        const theGroup = theGroups.filter((item) => item.email === emailAddress && item.group === emailAddress);
        console.log("TheGroup",theGroup[0].id)
        await storeValue(emailAddress+"groupChosen",theGroup[0].id);
        //console.log("Settings fetched group:",group);

    }

    async function fetchGroups(){//pulls all of the groups associated with the login email
        try{
            const theGroups = await fetchGroupsByEmail(emailAddress);
            //console.log("Settings theGroups",theGroups);
            //filters groups to only see those that have your email & excludes your personal group.
            const allGroups = Object.keys(theGroups)
            .map((key) => ({ id: key, ...theGroups[key] }))
            .filter((group1) => group1.email === emailAddress && group1.group !== group1.email);
            //when false, all groups are shown.
            setGroupOrGroups(false);
            //set groups as all groups with my email.
            setGroups(allGroups)
        }catch(error){
            console.log("Settings fetchGroups error:",error)
        }finally{
            console.log("Settings groups:",groups)
        }
        
    }

    //this runs when you select one of option buttons; shared or personal.
    async function chooseAccount(id,label){
        //id==="shared"
        //label==="Shared Account"
        //this function uses data that is hardcoded at the top of this screen as "accounts."
        if(id==="shared"){
            fetchGroups();//this is used to filter for your groups meals
            await storeValue(emailAddress+"accountTypeChosen","shared")
        }else{
            fetchGroup();//this is used to filter for your personal meals
            await storeValue(emailAddress+"accountTypeChosen","personal");
            await storeValue(emailAddress+"groupName",label);
            //await storeValue(emailAddress+"groupChosen",emailAddress);  //Do this in SetGroup.
            //setGroup(emailAddress);                                       //Do this in SetGroup.
            setSelectedGroupName(emailAddress);
        }
        setSelectedAccount(id);
        setSelectedOption(id);
    }

    const handleTextChange = useCallback((input,form) => {
        if(form==="email"){
            setNewEmail(input);
            console.log("Settings email input:",input)
        }else if(form==="group"){
            setNewGroupName(input);
        }
        
      }, []);

    // function addNewEmailToggle(){//this runs after pressing 'create new group' button.
    //     if(addNewEmail){
    //         setAddNewEmail(false);
    //     }else{
    //         setAddNewEmail(true);
    //     }
    // }

    // async function showNewEmail(){//this runs after pressing 'add new email' button because addNewEmail===true.
    //     return(
    //         <View style={{flexDirection: 'row'}}>
    //             <TextInput
    //                 style={styles.inputBox}
    //                 placeholder="New Email Address"
    //                 value={newEmail}
    //                 onChangeText={(text)=>handleTextChange(text,"email")}
    //             />
    //             <Button style={{justifyContent:"left",alignItems:'left',flexDirection: 'row',marginLeft: 20}}
    //                 onPress={addNewEmail2}>Add New Email</Button>
    //         </View>
    //     )
    // }

    async function addNewEmail2(){
        console.log("Settings selectedGroupName:",selectedGroupName);
        const newEmailGroup = {
            group: selectedGroupName,
            groupId: groupId,
            email: newEmail,
        }
        if(selectedGroupName==='Personal Account'){
            Alert.alert("You must select a shared Group before pushing the group to a different user email.")
        }else{
            const id = await storeGroup(newEmailGroup);
            //groupId needs to be the shared id for the group.
            const newEmail2={...newEmailGroup,id: id};
            console.log("Settings newGroup2",newEmail2);
            updateGroup(id, newEmail2);
            setAddNewEmail(false); 
        }
        
    }

    // function createNewGroup(){//this runs after pressing 'create new group' button.
    //     if(creatingNewGroup){
    //         setCreatingNewGroup(false);
    //     }else{
    //         setCreatingNewGroup(true);
    //     }
    // }

    // async function showNewGroup(){//this runs after pressing 'create new group' button because cretingNewGroup===true.
    //     return(
    //         <View style={{flexDirection: 'row'}}>
    //             <TextInput
    //                 style={styles.inputBox}
    //                 placeholder="New Group Name"
    //                 value={newGroupName}
    //                 onChangeText={(text)=>handleTextChange(text,"group")}
    //             />
    //             <Button style={{justifyContent:"left",alignItems:'left',flexDirection: 'row',marginLeft: 20}}
    //                 onPress={createNewGroup2}>Create New Group</Button>
    //         </View>
    //     )
    // }
    
    async function createNewGroup2(){
        //console.log("Settings email:",emailAddress);
        const newGroup = {
            group: newGroupName,
            email: emailAddress,
        }

        //store in firebase
        const id = await storeGroup(newGroup);
        const newGroup2={...newGroup,id: id, groupId: id}
        console.log("Settings newGroup2",newGroup2);

        //update firebase
        updateGroup(id, newGroup2);

        //update the state
        let newGroups = groups;
        newGroups.push(newGroup2);
        setGroups(newGroups);
        setCreatingNewGroup(false);
        //reset the
        setNewGroupName('');
    }

    // Function to delete a group option
    const deleteGroup = (id) => {
        setIdToDelete(id);
        //This shows the modal that allows you to permanently delete a group.
        setModalVisible(true);
    };

    const deleteGroup2 = () => {
        setGroups((prev) => prev.filter((item) => item.groupId !== idToDelete));
        if (groupId === idToDelete) setGroupId(null); // Reset if deleted option was selected
        //also delete group from firebase
        deleteGroupFromFirebase(idToDelete);
        setIdToDelete(false);
        setModalVisible(false);
    };

    //select the group that will be used.
    async function selectGroup(id,name,groupId){
        //set group in state
        setGroupId(groupId);
        setSelectedGroupName(name);
        //set group in email context
        // setGroupUsing(id);//(it's not used anywhere else.)
        // console.log("Settings group using:",groupUsing);
        await storeValue(emailAddress+"groupChosen",groupId);
        console.log("Settings groupId:",groupId);
        await storeValue(emailAddress+"groupName",name);
    }

    async function saveSettings(){
        //fetch meals & grocery items & filter for account.
        //fetch grocery items

        try {
            setFirstTime(true);
            console.log("Makes it to save settings");
            const items = await fetchLists();
            const meals = await fetchMeals();
            console.log("settings list in GroceryList: ")
        
            const groupUsing = pullGroupChosen()
                .then((result)=>{
                    //console.log("RecenetMeals groupChosen:",result);
                    let allItems = [];
                    let allMeals = [];
            
                    //build an array of grocery items for the specified group.
                    items.map((item)=>{
                    //console.log("RecentMeals mapped group:",meal)
                    if(item.group === result){
                        allItems.push(item);
                    }
                    })

                    //build an array of meals for the specified group.
                    meals.map((meal)=>{
                        console.log("settins result stored-----------------------------------:",result);
                        console.log("Settings mapped group-----------------------------------:",meal.group)
                        if(meal.group === result){
                            
                            allMeals.push(meal);
                            mealsCtx.addMeal(meal);
                        }
                    })

                    if(typeof allItems ==='object'){
                        listsCtx.setLists(allItems);
                    }
                    if(typeof allMeals ==='object'){
                        console.log("settings allMeals:",allMeals)
                        console.log("settings mealsCtx before:",mealsCtx.meals)
                        //mealsCtx.setMeals([...allMeals,].sort((a, b) => b.date - a.date));
                        mealsCtx.setMeals(allMeals);
                        console.log("settings mealsCtx after:",mealsCtx.meals)
                    }
                })
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
                <Text style={[styles.textHeader,{marginTop: 20, marginBottom: 10 }]}>Select Account:</Text>
                <FlatList
                    data={groupOrGroups?group:groups}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                    <RadioButtonWithDelete
                        label={item.group}
                        selected={groupId === item.groupId}//2025-03-17
                        //selected={group === item.groupId}
                        itemId={item.id}
                        accountOrGroup={groupId}
                        onPress={() => selectGroup(item.id,item.group,item.groupId)}
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
    function doNothing(){
        Alert.alert("You must first select a specific shared account.")
    };
    function doNothingGroups(){
        Alert.alert("You must first select the shared account option button.")
    };

    return(
        <View style={styles.topView}>
            <ScrollView>
            <View style={styles.topView}>
                <View style={{ padding: 20 }}>
                    {/* Account Type Selection */}
                    <View style={{flexDirection:'row'}}>
                        <Text style={[styles.textHeader,{ marginBottom: 10 }]}>Select Account Type: </Text>
                    <Text style={[styles.textHeader2,{ paddingTop: 2 }]}> current group = </Text>
                    <Text style={[styles.textHeader2,{ paddingTop: 2, textDecorationLine: 'underline' }]}>{selectedGroupName}</Text>
                    </View>
                    <Text style={[styles.textHeader2,{ paddingTop: 2 }]}>NOTE: if personal account is selected, only you will be able to see the meals created in this app.  If you select shared account, create a shared account then share the account with someone else, your meals will be created on the shared account</Text>
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
                    {/* {selectedAccount==="shared"? groupSelection2():noSelection()} */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={[styles.textHeader,{ marginBottom: 10 }]}>Are you sure you want to permanently delete your connection to this group?</Text>
                                <View style={styles.buttons}>
                                <Button 
                                    onPress={deleteGroup2}
                                    style={{marginTop:8}}
                                    >Delete Group</Button>
                                <Button style={{marginLeft:8,marginTop:8}} onPress={() => setModalVisible(false)}>Cancel</Button>
                                </View>
                            </View>
                        </View>
                    </Modal>
                    <View>
                        <View>
                            {/* <Button style={{justifyContent:"left",alignItems:'left',flexDirection: 'row',margin: 20}}
                                onPress={addNewEmailToggle}>Add New Email</Button> */}
                                {/* {addNewEmail? showNewEmail():noSelection()} */}
                                <Text style={[styles.textHeader2,{ marginTop: 20 }]}>To add another person to your shared account:</Text>
                                <Text style={[styles.textHeader2,{ marginLeft: 8 }]}> (1) Select "Shared account"</Text>
                                <Text style={[styles.textHeader2,{ paddingLeft: 8 }]}> (2) Select an account.</Text>
                                <Text style={[styles.textHeader2,{ paddingLeft: 8 }]}> (3) Enter email of person to share account.</Text>
                                <Text style={[styles.textHeader2,{ marginLeft: 8 }]}> (4) Press the "Add new Email" button.</Text>
                                <View style={{flexDirection: 'row'}}>
                                    <TextInput
                                        style={styles.inputBox}
                                        placeholder="New Email Address"
                                        value={newEmail}
                                        onChangeText={(text)=>handleTextChange(text,"email")}
                                    />
                                    <Button style={{justifyContent:"left",alignItems:'left',flexDirection: 'row',marginLeft: 0,marginTop:8}}
                                        onPress={selectedAccount==="shared"?addNewEmail2:doNothing}>Add New Email
                                    </Button>
                                </View>
                        </View>
                        <View>
                            {/* <Button style={{justifyContent:"left",alignItems:'left',flexDirection: 'row',margin: 20}}
                                onPress={createNewGroup}>Create New Group</Button> */}
                                {/* {creatingNewGroup? showNewGroup():noSelection()} */}
                                <Text style={[styles.textHeader2,{ marginTop: 20 }]}>To create a new shared account:</Text>
                                <Text style={[styles.textHeader2,{ marginLeft: 10 }]}>(1) Type name of new shared account below</Text>
                                <Text style={[styles.textHeader2,{ marginLeft: 10 }]}>(2) Press "Create Shared Account" button.</Text>
                                <View style={{flexDirection: 'row'}}>
                                    <TextInput
                                        style={styles.inputBox}
                                        placeholder="New Group Name"
                                        value={newGroupName}
                                        onChangeText={(text)=>handleTextChange(text,"group")}
                                    />
                                    <Button style={{justifyContent:"left",alignItems:'left',flexDirection: 'row',marginLeft: 0,marginTop:8}}
                                        onPress={selectedAccount==="shared"?createNewGroup2:doNothingGroups}>Create Shared Account
                                    </Button>
                                </View>
                        </View>
                    </View>
                </View>
            </View>
            <View>
                <Button 
                    style={{justifyContent:"center",alignItems:'center',flexDirection: 'row',marginBottom: 20}}
                    onPress={saveSettings}
                    >Save Settings</Button>
            </View>
            </ScrollView>
            <View style={styles.footer}>
                <Footer/>
            </View>
            
        </View>
    )

};


const styles = StyleSheet.create({
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { width: 300, padding: 20, backgroundColor: GlobalStyles.colors.primary50, borderRadius: 10 },
    buttons:{flexDirection:'row',justifyContent: 'center'},
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
        backgroundColor: GlobalStyles.colors.primary500,
        paddingTop: 3,
        paddingBottom: 4,
        paddingRight: 20,
    },
    inputBox:{
        height: 40,
        width: 200,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: 'blue',
        //justifyContent: 'left',
        //alignItems: 'left',
        placeholderTextColor: GlobalStyles.colors.primary800,
        color: GlobalStyles.colors.primary800,
        marginRight: 10,
        marginLeft: 10,
        marginBottom: 10,
        marginTop: 5
    }
})