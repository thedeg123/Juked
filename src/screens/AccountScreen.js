import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import useAuth from "../hooks/useAuth";

const AccountScreen = ({ navigation }) => {
  const { error, signout } = useAuth();
  return (
    <View>
      <Text>AccountScreen</Text>
      <Button title="Sign out" onPress={() => signout()}></Button>
      <Text>{error}</Text>
    </View>
  );
};

const styles = StyleSheet.create({});

export default AccountScreen;
