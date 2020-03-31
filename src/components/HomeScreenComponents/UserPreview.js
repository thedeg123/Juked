import React from "react";
import { StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import colors from "../../constants/colors";
import images from "../../constants/images";
import { withNavigation } from "react-navigation";

const UserPreview = ({ navigation, img, username, uid }) => {
  img = img || images.profileDefault; //becuase we cant set a default val from another file
  return (
    <TouchableOpacity
      style={styles.containerStyle}
      onPress={() => {
        navigation.navigate("Profile", { uid });
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
    width: 50,
    aspectRatio: 1,
    borderColor: colors.shadow,
    borderWidth: 1,
    borderRadius: 5
  },
  textStyle: {
    marginVertical: 1,
    color: colors.white,
    fontSize: 11
  }
});

UserPreview.defaultProps = {
  img: images.profileDefault,
  username: "",
  uid: ""
};
export default withNavigation(UserPreview);
