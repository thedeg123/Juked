import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { MaterialIcons } from '@expo/vector-icons'; 
import colors from "../../constants/colors";

const UserSelectorScrollItem = ({
  containerStyle,
  textStyle,
  text,
  image,
  showCheck,
  onPress
}) => (
  <TouchableOpacity
    style={[styles.userItemStyle, containerStyle]}
    onPress={onPress}
  >
    <Image style={styles.imageStyle} source={image}></Image>
    <View style={{ flexDirection: "row", alignItems:"flex-end"}}>
      <Text style={[styles.handleText, textStyle]}>{text}</Text>
      {showCheck && (
        <MaterialIcons name="check" size={18} style={{marginLeft: 2, marginBottom: 2}} color={colors.secondary} />
      )}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  handleText: {
    marginTop: 5,
    fontSize: 16,
    color: colors.text
  },
  userItemStyle: {
    paddingHorizontal: 5,
    borderRadius: 5,
    borderWidth: 3,
    borderColor:"transparent",
    justifyContent: "center",
    alignItems: "center"
  },
  imageStyle: {
    marginTop: 5,
    aspectRatio: 1,
    height: 50,
    borderRadius: 5
  }
});

export default UserSelectorScrollItem;
