import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ListScreen = () => {
  return (
    <View>
      <Text style={styles.headerStyle}>ListScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    fontSize: 60
  }
});

export default ListScreen;
