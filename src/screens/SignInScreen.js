import React from "react";
import { View, Text, StyleSheet } from "react-native";

const SignInScreen = () => {
  return (
    <View>
      <Text style={styles.headerStyle}>SignInScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    fontSize: 60
  }
});

export default SignInScreen;
