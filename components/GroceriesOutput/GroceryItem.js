import { useState, useContext } from 'react';
import { Pressable, StyleSheet, Text, View, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { GlobalStyles } from '../../constants/styles';
import IconButtonNoText from '../UI/IconButtonNoText';
import ErrorOverlay from '../UI/ErrorOverlay'
import LoadingOverlay from '../UI/LoadingOverlay'
import { ListsContext } from '../../store/lists-context';
import { deleteList } from '../../util/http-list';
//import { getFormattedDate } from '../../util/date';

function GroceryItem({ id, description }) {
  const navigation = useNavigation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState();
  const isEditing = !!id;

  const groceriesCtx = useContext(ListsContext);

  function groceryPressHandler() {
    navigation.navigate('ManageGroceryItem', {
      groceryId: id
    });
  }

  async function deleteGroceryHandler() {
    setIsSubmitting(true);
    try {
      await deleteList(id);
      groceriesCtx.deleteList(id);
    } catch (error) {
      console.log(error)
      setError('Could not delete grocery list item - please try again later!');
      setIsSubmitting(false);
    }
  }

  if (error && !isSubmitting) {
    return <ErrorOverlay message={error} />;
  }

  if (isSubmitting) {
    return <LoadingOverlay />;
  }

  return (
    <Pressable
      onPress={groceryPressHandler}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <View style={styles.groceryItem}>
        <View>
          <Text style={[styles.textBase, styles.description]}>
            {description}
          </Text>
        </View>
        {isEditing && (
        <View style={styles.deleteContainer}>
          <IconButtonNoText
            icon="trash"
            color={GlobalStyles.colors.error500}
            size={20}
            onPress={deleteGroceryHandler}
            forLongPress={()=>{Alert.alert("Function of Button","Trash button deletes grocery item")}}
          />
        </View>
      )}
      </View>
    </Pressable>
  );
}

export default GroceryItem;

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.75,
  },
  groceryItem: {
    padding: 6,
    marginVertical: 4,
    backgroundColor: GlobalStyles.colors.primary500,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 6,
    elevation: 3,
    shadowColor: GlobalStyles.colors.gray500,
    shadowRadius: 4,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
  },
  textBase: {
    color: GlobalStyles.colors.primary50,
  },
  description: {
    fontSize: 16,
    //marginBottom: 4,
    fontWeight: 'bold',
  },
  amountContainer: {
    paddingHorizontal: 12,
    paddingVertical: 0
    ,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    minWidth: 80,
  },
  amount: {
    color: GlobalStyles.colors.primary500,
    fontWeight: 'bold',
  },
  deleteContainer: {
    marginBottom: 0,
    paddingBottom: 0,
    //marginTop: 16,
    //paddingTop: 8,
    //borderTopWidth: 2,
    //borderTopColor: GlobalStyles.colors.primary200,
    //alignItems: 'center',
  },
});
