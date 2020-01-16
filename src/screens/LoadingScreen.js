import React from "react";
import { View, Text, StyleSheet } from "react-native";

const LoadingScreen = () => {
  return (
    <View>
      <Text style={styles.headerStyle}>LoadingScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    fontSize: 60
  }
});

export default LoadingScreen;
