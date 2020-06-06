import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import colors from "../../constants/colors";
import images from "../../constants/images";
import { withNavigation } from "react-navigation";

const UserPreview = ({
  navigation,
  img,
  username,
  uid,
  size,
  color,
  containerStyle,
  fontScaler,
  allowPress
}) => {
  containerStyle = containerStyle || {};
  fontScaler = fontScaler || 0.3;
  size = size || 40;
  allowPress = typeof allowPress === "boolean" ? allowPress : true;
  const fontSize = size * fontScaler;
  color = color || colors.white;
  img = img || images.profileDefault; //becuase we cant set a default val from another file
  return (
    <TouchableOpacity
      style={[styles.containerStyle, containerStyle]}
      disabled={!allowPress}
      onPress={() => {
        navigation.push("Profile", { uid });
      }}
    >
      <Image
        style={{
          width: size,
          aspectRatio: 1,
          borderColor: colors.lightShadow,
          borderWidth: 0.7 * (1 - fontScaler),
          alignSelf: "center",
          borderRadius: 5
        }}
        source={{ uri: img }}
      ></Image>
      <View style={{ alignSelf: "stretch" }}>
        <Text
          style={{ marginVertical: 1, color, fontSize, textAlign: "center" }}
        >
          {username}
        </Text>
      </View>
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
