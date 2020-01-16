import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

const ProfileScreen = ({ navigation }) => {
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

const styles = StyleSheet.create({
  headerStyle: {
    fontSize: 60
  }
});

export default ProfileScreen;
