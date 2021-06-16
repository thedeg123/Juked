//Provides margin on components
import React from "react";
import { View, StyleSheet, Text } from "react-native";
import colors from "../constants/colors";
/***
 * @param userBlocked {bool} - if the current user is the one who did the blocking, if false the other user blocked the current user
 */
const BlockView = ({ userBlocked }) => {
  return (
    <View style={styles.containerStyle}>
      <Text style={styles.textStyle}>
        {userBlocked
          ? "Because you blocked this user, you may not view this content"
          : "This user has blocked you so you may not view this content"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10
  },
  textStyle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary,
    textAlign: "center"
  }
});

export default BlockView;
