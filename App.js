import {Alert} from 'react-native'
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import ManageMeal from './screens/ManageMeal';
import ManageGroceryItem from './screens/ManageGroceryItem';
import RecentMeals from './screens/RecentMeals';
import AllMeals from './screens/AllMeals';
import AddMealAndGrocery from './screens/AddMealAndGrocery';
import AddMealAndGrocery3 from './screens/AddMealAndGrocery3';
import GroceryList from './screens/GroceryList';
import { GlobalStyles } from './constants/styles';
import IconButton from './components/UI/IconButton';
import MealsContextProvider from './store/meals-context';
import ListsContextProvider from './store/lists-context';

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
            iconText="Add meal"
          />
          <IconButton
            icon="bag-add-outline"
            size={24}
            color={tintColor}
            onPress={() => {
              navigation.navigate('ManageGroceryItem');
            }}
            forLongPress={()=>{Alert.alert("Function of Button","Button adds to grocery list")}}
            iconText="Grocery"
          />
          </>
          
        ),
      })}
    >
      <BottomTabs.Screen
        name="RecentMeals"
        component={RecentMeals}
        options={{
          title: 'Current Week',
          tabBarLabel: 'Current Week',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="fast-food-outline" size={size} color={color} />
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
            <Ionicons name="fast-food" size={size} color={color} />
          ),
        }}
      />
      <BottomTabs.Screen
        name="GroceryList"
        component={GroceryList}
        options={{
          title: 'Grocery List',
          tabBarLabel: 'Grocery List',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-sharp" size={size} color={color} />
          ),
        }}
      />
      <BottomTabs.Screen
        name="AddMealAndGrocery"
        component={AddMealAndGrocery}
        options={{
          title: 'Add Meal',
          tabBarLabel: 'Add Meal',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="fast-food-outline" size={size} color={color} />
          ),
        }}
      />
      <BottomTabs.Screen
        name="AddMealAndGrocery3"
        component={AddMealAndGrocery3}
        options={{
          title: 'Add Meal3',
          tabBarLabel: 'Add Meal3',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="fast-food-outline" size={size} color={color} />
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
        <ListsContextProvider>
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
            <Stack.Screen
              name="ManageGroceryItem"
              component={ManageGroceryItem}
              options={{
                presentation: 'modal',
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
        </ListsContextProvider>
      </MealsContextProvider>
    </>
  );
}
