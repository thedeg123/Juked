import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

const SignUpScreen = ({ navigation }) => {
  return (
    <View>
      <Text style={styles.headerStyle}>SignUpScreen</Text>
      <Button
        onPress={() => navigation.navigate("Home")}
        title="Go to Home"
      ></Button>
    </View>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    fontSize: 60
  }
});

export default SignUpScreen;
