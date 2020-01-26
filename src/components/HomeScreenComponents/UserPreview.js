import React from "react";
import { StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import colors from "../../constants/colors";
import images from "../../constants/images";

const UserPreview = ({ img, username, uid }) => {
  return (
    <TouchableOpacity style={styles.containerStyle} onPress={() => {}}>
      <Image
        style={styles.imageStyle}
        source={{ uri: img || images.profileDefault }}
      ></Image>
      <Text style={styles.textStyle}>@{username}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    alignItems: "flex-end",
    alignSelf: "flex-end",
    borderWidth: 1
  },
  imageStyle: {
    width: 64,
    height: 64,
    borderColor: colors.shadow,
    borderWidth: 1
  },
  textStyle: {
    marginVertical: 1,
    color: colors.textLight,
    fontWeight: "bold"
  }
});

export default UserPreview;
