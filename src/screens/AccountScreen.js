import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import useAuth from "../hooks/useAuth";

const AccountScreen = ({ navigation }) => {
  const { error, signout } = useAuth();
  return (
    <View>
      <Text style={styles.headerStyle}>AccountScreen</Text>
      <Button
        title="Sign out"
        onPress={() => signout(() => navigation.navigate("loginFlow"))}
      ></Button>
      <Text>{error}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    fontSize: 60
  }
});

export default AccountScreen;
