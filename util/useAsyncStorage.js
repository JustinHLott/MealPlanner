import AsyncStorage from '@react-native-async-storage/async-storage';

const storeValue = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
    console.log("Value stored successfully!");
  } catch (error) {
    console.error("Error storing value:", error);
  }
};

export default storeValue;

export async function getValue(key){
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        console.log("Retrieved value:", value);
        return value;
      }
    } catch (error) {
      console.error("Error retrieving value:", error);
    }
  };