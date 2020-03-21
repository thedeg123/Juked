import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import colors from "../../constants/colors";
import { withNavigation } from "react-navigation";

const HomeScreenBorder = ({ navigation, children, rid }) => {
  return rid ? (
    <TouchableOpacity
      style={styles.withTitle}
      onPress={() => navigation.navigate("Review", { rid })}
    >
      {children}
    </TouchableOpacity>
  ) : (
    <View style={styles.noTitle}>{children}</View>
  );
};

let boxStyle = {
  shadowColor: colors.shadow,
  shadowOpacity: 1,
  shadowOffset: { width: 0, height: 0 },
  shadowRadius: 5,
  backgroundColor: colors.object,
  borderRadius: 5,
  margin: 5,
  marginBottom: 0,
  alignSelf: "stretch",
  marginTop: 10,
  borderColor: colors.shadow,
  borderWidth: 1
};
const styles = StyleSheet.create({
  withTitle: {
    ...boxStyle,
    height: 150 //120+15+15
  },
  noTitle: {
    ...boxStyle,
    height: 120 //120+15+15
  }
});

export default withNavigation(HomeScreenBorder);
