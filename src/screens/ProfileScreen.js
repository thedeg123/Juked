import React from "react";
import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import useAuth from "../hooks/useAuth";

const UserProfileScreen = ({ navigation }) => {
  const { signout } = useAuth();
  return (
    <View>
      <Text style={styles.headerStyle}>ProfileScreen</Text>
      <Button
        title="Go to account"
        onPress={() => navigation.navigate("Account")}
      ></Button>
      <Button
        title="Go to List"
        onPress={() => navigation.navigate("List")}
      ></Button>
    </View>
  );
};

UserProfileScreen.navigationOptions = ({ navigation }) => {
  return {
    headerRight: () => (
      <TouchableOpacity onPress={() => navigation.navigate("Account")}>
        <AntDesign style={styles.headerRightStyle} name="setting"></AntDesign>
      </TouchableOpacity>
    )
  };
};

const styles = StyleSheet.create({
  headerStyle: {
    fontSize: 60
  },
  headerRightStyle: {
    fontSize: 25,
    marginRight: 10
  }
});

export default UserProfileScreen;
