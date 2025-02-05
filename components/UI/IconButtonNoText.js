import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function IconButtonNoText({ icon, size, color, onPress, forLongPress }) {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={forLongPress}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <View style={styles.buttonContainer}>
        <Ionicons name={icon} size={size} color={color} />
      </View>
    </Pressable>
  );
}

export default IconButtonNoText;

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 3
    ,
    //padding: 6,
    marginHorizontal: 8,
    //marginVertical: 2,
    alignItems: "center"
  },
  pressed: {
    opacity: 0.75,
  },
});
