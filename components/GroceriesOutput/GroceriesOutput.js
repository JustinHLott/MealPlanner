import { StyleSheet, Text, View } from 'react-native';

import { GlobalStyles } from '../../constants/styles';
import GroceriesList from './GroceriesList';


function GroceriesOutput({ groceries, fallbackText }) {
  let content = <Text style={styles.infoText}>{fallbackText}</Text>;

  if (groceries.length > 0) {
    content = <GroceriesList groceries={groceries} />;
  }

  return (
    <View style={styles.container}>
      {content}
    </View>
  );
}

export default GroceriesOutput;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 0,
    backgroundColor: GlobalStyles.colors.primary700,
  },
  infoText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 32,
  },
});
