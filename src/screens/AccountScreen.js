import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import context from "../context/context";

const AccountScreen = ({ navigation }) => {
  const { firestore, disconnect } = useContext(context);
  const [error, setError] = useState(null);
  return (
    <View>
      <Text>AccountScreen</Text>
      <Text>{error}</Text>
    </View>
  );
};

const styles = StyleSheet.create({});

export default AccountScreen;
