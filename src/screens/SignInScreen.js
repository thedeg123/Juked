import React, { useContext } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { Context as AuthContext } from "../context/AuthContext";

const SignInScreen = ({ navigation }) => {
  const { state, signin } = useContext(AuthContext);
  return (
    <View>
      <Text style={styles.headerStyle}>SignInScreen</Text>
      <Button onPress={() => signin()} title="Sign in"></Button>
      <Text>{state.msg}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    fontSize: 60
  }
});

export default SignInScreen;
