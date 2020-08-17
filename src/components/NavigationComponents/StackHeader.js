import React from "react";
import { View, Text, StyleSheet, Dimensions, Platform } from "react-native";
import colors from "../../constants/colors";

const StackHeader = ({ title, leftButton, center, previous, rightButton }) => {
  const scaleFactor = Platform.OS === "android" ? 0.07 : 0.098;
  const height = Dimensions.get("window").height * scaleFactor;
  const rightComponent = rightButton ? rightButton() : null;
  return (
    <View
      style={{
        ...styles.containerStyle,
        marginBottom: 0,
        height: height
      }}
    >
      {!previous && rightComponent ? <View style={{ width: 45 }}></View> : null}
      <View style={styles.buttonWrapper}>{leftButton}</View>
      <View style={{ flex: 1, alignItems: "center" }}>
        {center && center}
        {!center && (
          <Text numberOfLines={1} style={styles.headerTitleStyle}>
            {title}
          </Text>
        )}
      </View>
      {previous && !rightComponent ? <View style={{ width: 45 }}></View> : null}
      {rightComponent ? (
        <View style={styles.buttonWrapper}>{rightComponent}</View>
      ) : null}
    </View>
  );
};
const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background
  },
  headerTitleStyle: {
    marginTop:
      Dimensions.get("window").height * (Platform.OS === "android" ? 0 : 0.037),
    fontSize: 18,
    fontWeight: "500",
    color: colors.text
  },
  buttonWrapper: {
    marginTop:
      Dimensions.get("window").height * (Platform.OS === "android" ? 0 : 0.037)
  }
});

export default StackHeader;
