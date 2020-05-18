import React from "react";
import { StyleSheet, ActivityIndicator, Text, View } from "react-native";
import colors from "../constants/colors";

const LoadingIndicator = () => {
  return (
    <View style={styles.indicatorStyle}>
      <ActivityIndicator color={colors.primary} size="large" />
      <Text style={styles.textStyle}>LOADING</Text>
    </View>
  );
};
{
  /* <Image
  style={{
    aspectRatio: (287 / 403) * 0.5,
    resizeMode: "contain",
    alignSelf: "center"
  }}
  source={require("../../assets/logos/Logo1.png")}
></Image>; */
}

const styles = StyleSheet.create({
  indicatorStyle: {
    alignContent: "center",
    justifyContent: "center",
    flex: 1
  },
  textStyle: {
    fontSize: 12,
    fontWeight: "300",
    color: colors.shadow,
    textAlign: "center"
  }
});

export default LoadingIndicator;
