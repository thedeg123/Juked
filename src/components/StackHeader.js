import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import colors from "../constants/colors";

const StackHeader = ({ title, leftButton, previous, rightButton }) => {
  const height = Dimensions.get("window").height * 0.098;
  const rightComponent = rightButton ? rightButton() : null;
  return (
    <View
      style={{
        ...styles.containerStyle,
        marginBottom: 0,
        height: height
      }}
    >
      {!previous && rightComponent ? <View style={{ width: 40 }}></View> : null}
      <View style={styles.buttonWrapper}>{leftButton}</View>
      <View style={{ flex: 1, alignItems: "center" }}>
        <Text style={styles.headerTitleStyle}>{title}</Text>
      </View>
      {previous && !rightComponent ? <View style={{ width: 40 }}></View> : null}
      {rightComponent ? (
        <View style={styles.buttonWrapper}>{rightComponent}</View>
      ) : null}
    </View>
  );
};
const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: "row",
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background
  },
  headerTitleStyle: {
    marginTop: Dimensions.get("window").height * 0.037,
    fontSize: 18,
    fontWeight: "500"
  },
  buttonWrapper: {
    marginTop: Dimensions.get("window").height * 0.037
  }
});

export default StackHeader;
