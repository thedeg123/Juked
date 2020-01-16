import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

const SignInScreen = ({ navigation }) => {
  return (
    <View>
      <Text style={styles.headerStyle}>SignInScreen</Text>
      <Button
        onPress={() => navigation.navigate("SignUp")}
        title="Go to Sign Up"
      ></Button>
    </View>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    fontSize: 60
  }
});

export default SignInScreen;
