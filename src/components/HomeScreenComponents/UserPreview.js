import React from "react";
import { StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import colors from "../../constants/colors";
import images from "../../constants/images";

const UserPreview = ({ img, username, uid }) => {
  img = img || images.profileDefault; //becuase we cant set a default val from another file
  return (
    <TouchableOpacity
      style={styles.containerStyle}
      onPress={() => {
        console.log("We will navigate to user:", uid);
      }}
    >
      <Image style={styles.imageStyle} source={{ uri: img }}></Image>
      <Text style={styles.textStyle}>@{username}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    alignItems: "flex-end",
    alignSelf: "flex-end"
  },
  imageStyle: {
    width: 64,
    height: 64,
    borderColor: colors.shadow,
    borderWidth: 1,
    borderRadius: 5
  },
  textStyle: {
    marginVertical: 1,
    color: colors.textLight,
    fontWeight: "bold"
  }
});

UserPreview.defaultProps = {
  img: images.profileDefault,
  username: "",
  uid: ""
};
export default UserPreview;
