import { useContext, useLayoutEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import GroceryForm from '../components/ManageMeal/GroceryForm';
import ErrorOverlay from '../components/UI/ErrorOverlay';
import IconButton from '../components/UI/IconButton';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import { GlobalStyles } from '../constants/styles';
import { ListsContext } from '../store/lists-context';
import { storeList, updateList, deleteList } from '../util/http-list';

function ManageGroceryItem({ route, navigation }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState();

  const groceriesCtx = useContext(ListsContext);

  const editedGroceryId = route.params?.groceryId;
  const isEditing = !!editedGroceryId;

  const selectedList = groceriesCtx.lists.find(
    (list) => list.id === editedGroceryId
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Edit Grocery List' : 'Add Grocery List',
    });
  }, [navigation, isEditing]);

  async function deleteGroceryHandler() {
    setIsSubmitting(true);
    try {
      await deleteList(editedGroceryId);
      groceriesCtx.deleteList(editedGroceryId);
      navigation.goBack();
    } catch (error) {
      setError('Could not delete grocery list item - please try again later!');
      setIsSubmitting(false);
    }
  }

  function cancelHandler() {
    navigation.goBack();
  }

  async function confirmHandler(groceryData) {
    setIsSubmitting(true);
    try {
      if (isEditing) {
        groceriesCtx.updateList(editedGroceryId, groceryData);
        await updateList(editedGroceryId, groceryData);
      } else {
        const id = await storeList(groceryData);
        groceriesCtx.addList({ ...groceryData, id: id });
      }
      navigation.goBack();
    } catch (error) {
      setError('Could not save data - please try again later!');
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
    <View style={styles.container}>
      <GroceryForm
        submitButtonLabel={isEditing ? 'Update' : 'Add'}
        onSubmit={confirmHandler}
        onCancel={cancelHandler}
        defaultValues={selectedList}
      />
      {isEditing && (
        <View style={styles.deleteContainer}>
          <IconButton
            icon="trash"
            color={GlobalStyles.colors.error500}
            size={36}
            onPress={deleteGroceryHandler}
          />
        </View>
      )}
    </View>
  );
}

export default ManageGroceryItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: GlobalStyles.colors.primary800,
  },
  deleteContainer: {
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: GlobalStyles.colors.primary200,
    alignItems: 'center',
  },
});
