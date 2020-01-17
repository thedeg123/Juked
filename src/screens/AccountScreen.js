import React, { useContext } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { Context as AuthContext } from "../context/AuthContext";

const AccountScreen = ({ navigation }) => {
  const { signout, errorMessage } = useContext(AuthContext);
  return (
    <View>
      <Text style={styles.headerStyle}>AccountScreen</Text>
      <Button
        title="Sign out"
        onPress={() => signout(() => navigation.navigate("loginFlow"))}
      ></Button>
      <Text>{errorMessage}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    fontSize: 60
  }
});

export default AccountScreen;
