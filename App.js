import {Alert} from 'react-native'
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import ManageMeal from './screens/ManageMeal';
import RecentMeals from './screens/RecentMeals';
import AllMeals from './screens/AllMeals';
import { GlobalStyles } from './constants/styles';
import IconButton from './components/UI/IconButton';
import MealsContextProvider from './store/meals-context';

const Stack = createNativeStackNavigator();
const BottomTabs = createBottomTabNavigator();

function MealsOverview() {
  return (
    <BottomTabs.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: GlobalStyles.colors.primary500 },
        headerTintColor: 'white',
        tabBarStyle: { backgroundColor: GlobalStyles.colors.primary500 },
        tabBarActiveTintColor: GlobalStyles.colors.accent500,
        headerRight: ({ tintColor }) => (
          <>
          <IconButton
            icon="add"
            size={24}
            color={tintColor}
            onPress={() => {
              navigation.navigate('ManageMeal');
            }}
            forLongPress={()=>{Alert.alert("Function of Button","Button adds meal")}}
          />
          <IconButton
            icon="bag-add-outline"
            size={24}
            color={tintColor}
            onPress={() => {
              navigation.navigate('ManageMeal');
            }}
            forLongPress={()=>{Alert.alert("Function of Button","Button adds to grocery list")}}
          />
          </>
          
        ),
      })}
    >
      <BottomTabs.Screen
        name="RecentMeals"
        component={RecentMeals}
        options={{
          title: 'Recent Meals',
          tabBarLabel: 'Recent',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="hourglass" size={size} color={color} />
          ),
        }}
      />
      <BottomTabs.Screen
        name="AllMeals"
        component={AllMeals}
        options={{
          title: 'All Meals',
          tabBarLabel: 'All Meals',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}
      />
    </BottomTabs.Navigator>
  );
}

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <MealsContextProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: GlobalStyles.colors.primary500 },
              headerTintColor: 'white',
            }}
          >
            <Stack.Screen
              name="MealsOverview"
              component={MealsOverview}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ManageMeal"
              component={ManageMeal}
              options={{
                presentation: 'modal',
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </MealsContextProvider>
    </>
  );
}
