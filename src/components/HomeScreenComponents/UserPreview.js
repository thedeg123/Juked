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
  allowPress,
  horizontal
}) => {
  containerStyle = containerStyle || {};
  fontScaler = fontScaler || 0.3;
  size = size || 35;
  allowPress = typeof allowPress === "boolean" ? allowPress : true;
  const fontSize = size * fontScaler;
  color = color || colors.white;
  img = img || images.profileDefault; //becuase we cant set a default val from another file

  const getImg = () => (
    <Image
      style={{
        backgroundColor: colors.white,
        width: size,
        aspectRatio: 1,
        borderColor: colors.lightShadow,
        borderWidth: 0.7 * (1 - fontScaler),
        alignSelf: "center",
        borderRadius: 5
      }}
      source={{ uri: img }}
    ></Image>
  );

  return (
    <TouchableOpacity
      style={[
        styles.containerStyle,
        {
          alignItems: "center",
          flexDirection: horizontal ? "row" : "column"
        },
        containerStyle
      ]}
      disabled={!allowPress}
      onPress={() => {
        navigation.push("Profile", { uid });
      }}
    >
      {!horizontal && getImg()}
      <View style={{ alignSelf: "stretch", justifyContent: "center" }}>
        {username ? (
          <Text
            style={{
              marginVertical: horizontal ? 0 : 1,
              marginRight: horizontal ? 5 : 0,
              color,
              fontSize,
              textAlign: "center"
            }}
          >
            {username}
          </Text>
        ) : null}
      </View>
      {horizontal && getImg()}
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
