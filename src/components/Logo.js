import React from "react";
import { View, Image, Dimensions } from "react-native";

const Logo = ({ size }) => (
  <View
    style={{
      marginTop: Dimensions.get("window").height * 0.037,
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
      source={require("../../assets/logos/logo_large.png")}
    ></Image>
  </View>
);
Logo.defaultProps = {
  size: 35
};

export default Logo;
