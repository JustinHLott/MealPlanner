import React,{useContext} from 'react';
import { View, Text, StyleSheet,Pressable, Image, Linking } from 'react-native';

import { AuthContext } from '../store/auth-context';
import { GlobalStyles } from '../constants/styles';
import { Ionicons } from '@expo/vector-icons';
  
//This is the screen attached to the logout bottomTab
const LogOut = () => {
  const authCtx = useContext(AuthContext);

  //if the logout button is pushed the logout function is run in store/Auth-Context.
  async function logOut() {
    console.log("this should log us out")
    authCtx.logout();
  }

  return (
    <View style={styles.container}>
      <View style={styles.containerTop}>
        <Text style={styles.headerText}>Meal Planner</Text>
      </View>
      <View style={styles.containerBottom}>
        <Image source={require('../assets/images/justus-menke-62XLglIrTJc-unsplash.jpg')} style={styles.image}/>
        <Text style={styles.text}>Photo at Unsplash by{' '} 
          <Pressable onPress={() => Linking.openURL('https://unsplash.com/@justusmenke?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash')} style={{marginTop:12}}>
            <Text style={{ color: 'yellow', textDecorationLine: 'underline', fontSize: 20}}>
            Justus Menke
            </Text>
          </Pressable>
        </Text>
          
          
          
          {/* https://unsplash.com/@justusmenke?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Justus Menke</a> on <a href="https://unsplash.com/photos/brown-and-black-chocolate-cake-62XLglIrTJc?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a></Text> */}
      
        <Text style={styles.text}>Press the Log Out button below to log out of the application.</Text>
        <Pressable
              style={({ pressed }) => [styles.button, pressed && styles.pressed]}
              onPress={()=>logOut()}
              >
              <Ionicons
                  style={styles.icon}
                  name="log-out"
                  size={18}
                  color={GlobalStyles.colors.primary50}
                  backgroundColor={GlobalStyles.colors.primary800}
              />
              <Text style={styles.buttonText}>Log Out</Text>
          </Pressable>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: GlobalStyles.colors.primary800,
  },
  containerTop:{
    backgroundColor: GlobalStyles.colors.primary800,
    flex: 1,
  },
  headerText: {
    color: GlobalStyles.colors.primary50,
    fontWeight:500,
    //fontFamily:'atma-bold',
    fontSize:30,
    marginTop: 32,
    marginBottom: 20,
    marginLeft: 16,
    textAlign: 'left',
  },
  containerBottom:{
    backgroundColor: GlobalStyles.colors.primary500,
    flex:7,
    marginHorizontal: 0,
    alignItems: 'center',
  },
  text: {
    color: GlobalStyles.colors.primary50,
    //fontFamily: 'atma',
    fontSize:20,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 5,
  },
  button: {
    marginTop: 30,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: GlobalStyles.colors.primary50,
    backgroundColor: GlobalStyles.colors.primary800,
  },
  image:{
    height: 180,
    width: 350,
    marginTop: 20,
    
  },
  pressed: {
    opacity: 0.7,
  },
  icon: {
    marginRight: 6,
  },
  buttonText: {
    color: GlobalStyles.colors.primary50,
  },
});

export default LogOut;
