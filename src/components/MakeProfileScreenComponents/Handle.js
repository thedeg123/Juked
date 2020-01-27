import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Handle = () => {
  return (
    <View>
      <Text style={styles.headerStyle}>Handle</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    fontSize: 10
  }
});

export default Handle;
