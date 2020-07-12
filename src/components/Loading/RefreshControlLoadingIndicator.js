import React from "react";
import { View, Dimensions } from "react-native";
import LoadingIndicator from "./LoadingIndicator";

const RefreshControlLoadingIndicator = ({ size, color }) => {
  return (
    <View
      style={{
        position: "absolute",
        width: Dimensions.get("window").width,
        height: 60,
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <LoadingIndicator size={size} color={color}></LoadingIndicator>
    </View>
  );
};

export default RefreshControlLoadingIndicator;
