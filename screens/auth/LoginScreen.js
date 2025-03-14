import { useContext, useState } from 'react';
import { Alert,ActivityIndicator,View,Text,StyleSheet } from 'react-native';
import AuthContent from '../../components/Auth/AuthContent';
import { AuthContext } from '../../store/auth-context';
import { login } from '../../util/auth';
import { GlobalStyles } from '../../constants/styles';
import Footer from '../../components/Footer';


//screen for loggin in
function LoginScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authCtx = useContext(AuthContext);

  //const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  async function loginHandler({ email, password }) {
    setIsAuthenticating(true);
    try {
      //await delay(4000); // Wait for 4 seconds
      const token = await login(email, password);
      authCtx.authenticate(token);
      
    } catch (error) {
      Alert.alert(
        'Authentication failed!',
        'Could not log you in. Please check your credentials or try again later!'
      );
      setIsAuthenticating(false);
    }
  }

  if (isAuthenticating) {
    return (
      <View style={styles.rootContainer}>
        <View style={styles.container1}>
          <Text style={styles.message}>"Logging you in..."</Text>
          <ActivityIndicator size="large" />
        </View>
        <View style={styles.footerView}>
          <Footer/>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.rootContainer}>
      <View style={styles.rootContainer}>
        <AuthContent isLogin onAuthenticate={loginHandler} />
      </View>
      <View style={styles.footerView}>
        <Footer/>
      </View>
    </View>
  );
}

export default LoginScreen;

const styles = StyleSheet.create({
  topContainer: {
    flex: 1,
  },
  container1:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  rootContainer: {
    flex: 1,
  },
  footerView:{
    marginRight:32,
    marginBottom:5
  },
  message: {
    fontSize: 16,
    marginTop: 70,
    marginBottom: 12,
    color: GlobalStyles.colors.primary50,
  },
});
