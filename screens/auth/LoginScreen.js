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

  async function loginHandler({ email, password }) {
    setIsAuthenticating(true);
    try {
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
        <Text style={styles.message}>"Logging you in..."</Text>
        <ActivityIndicator size="large" />
        <Footer/>
      </View>
    )
  }

  return (
    <View style={styles.topContainer}>
      <View style={styles.container2}>
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
    // justifyContent: 'center',
    // alignItems: 'center',
    //paddingHorizontal: 20,
  },
  container2:{
    flex: 1,
  },
  rootContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  footerView:{
    marginRight:32,
    marginBottom:5
  },
  message: {
    fontSize: 16,
    marginBottom: 12,
    color: GlobalStyles.colors.primary50,
  },
});
