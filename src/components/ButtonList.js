//Provides margin on components
import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import colors from "../constants/colors";
import { withNavigation } from "react-navigation";

const ButtonList = ({ navigation, user_num, list_num, review_num }) => {
  return (
    <View style={styles.containerStyle}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("List")}
      >
        <Text style={styles.textStyle}>Users</Text>
        <Text style={styles.textStyle}>{user_num}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("List")}
      >
        <Text style={styles.textStyle}>Lists</Text>
        <Text style={styles.textStyle}>{list_num}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("List")}
      >
        <Text style={styles.textStyle}>Reviews</Text>
        <Text style={styles.textStyle}>{review_num}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "stretch"
  },
  textStyle: {
    textAlign: "center",
    color: colors.white,
    fontWeight: "bold",
    fontSize: 20
  },

  button: {
    justifyContent: "center",
    backgroundColor: colors.secondary,
    borderRadius: 5,
    margin: 5,
    height: 80,
    flex: 1
  }
});

export default withNavigation(ButtonList);
