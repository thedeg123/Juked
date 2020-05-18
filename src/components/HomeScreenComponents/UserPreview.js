import React from "react";
import { StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import colors from "../../constants/colors";
import images from "../../constants/images";
import { withNavigation } from "react-navigation";

const UserPreview = ({ navigation, img, username, uid, size, color }) => {
  size = size || 40;
  const fontSize = size * 0.3;
  color = color || colors.white;
  img = img || images.profileDefault; //becuase we cant set a default val from another file
  return (
    <TouchableOpacity
      style={styles.containerStyle}
      onPress={() => {
        navigation.navigate("Profile", { uid });
      }}
    >
      <Image
        style={{
          width: size,
          aspectRatio: 1,
          borderColor: colors.shadow,
          borderWidth: 1,
          borderRadius: 5
        }}
        source={{ uri: img }}
      ></Image>
      <Text style={{ marginVertical: 1, color, fontSize }}>{username}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    alignSelf: "flex-end",
    alignItems: "flex-end"
  }
});

UserPreview.defaultProps = {
  img: images.profileDefault,
  username: "",
  uid: ""
};
export default withNavigation(UserPreview);
