import React from "react";
import { View, Image, Dimensions, Platform } from "react-native";

const Logo = ({ size, inverse }) => {
  const img = inverse
    ? require("../../assets/logos/logo_large_inverse.png")
    : require("../../assets/logos/logo_large.png");
  return (
    <View
      style={{
        marginTop:
          Dimensions.get("window").height *
          (Platform.OS === "android" ? 0 : 0.037),
        width: size,
        height: size,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Image
        style={{
          flex: 1,
          resizeMode: "contain"
        }}
        source={img}
      ></Image>
    </View>
  );
};
Logo.defaultProps = {
  size: 35
};

export default Logo;
