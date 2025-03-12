import { useContext, useState } from 'react';
import { Alert,ActivityIndicator,View,Text,StyleSheet } from 'react-native';
import AuthContent from '../../components/Auth/AuthContent';
import { AuthContext } from '../../store/auth-context';
import { createUser } from '../../util/auth';
import { GlobalStyles } from '../../constants/styles';
import { storeGroup, updateGroup } from './Settings';
import { useEmail } from '../../store/email-context';
import {storeValue} from '../../util/useAsyncStorage';

//screen to sign up for the first time
function SignupScreen({navigation}) {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { emailAddress, setEmailAddress } = useEmail();

  const authCtx = useContext(AuthContext);

  async function signupHandler({ email, password }) {
    setIsAuthenticating(true);
    try {
      
      const token = await createUser(email, password);
      console.log('create');
      createNewGroup(email);
      authCtx.authenticate(token);
    } catch (error) {
      Alert.alert(
        'Authentication failed',
        'Could not create user, please check your input and try again later.'
      );
      setIsAuthenticating(false);
    }
  }

  async function createNewGroup(email){
    console.log("SignupScreen createNewGroup");
    try{
      setEmailAddress(email);
      const newGroup = {
          group: email,
          email: email,
      }
      const id = await storeGroup(newGroup);
      const newGroup2={...newGroup,id: id, groupId: id};
      console.log("SignupScreen createNewGroup:",newGroup2);
      updateGroup(id, newGroup2);
      storeValue("accountTypeChosen","personal")
    }catch(error){
      console.log("SignupScreen createGroup error:",error);
    }
    
  }

  if (isAuthenticating) {
    
    return (
      <View style={styles.rootContainer}>
        <Text style={styles.message}>"Creating User..."</Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <AuthContent onAuthenticate={signupHandler} />;
}

export default SignupScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  message: {
    fontSize: 16,
    marginBottom: 12,
    color: GlobalStyles.colors.primary50,
  },
});
