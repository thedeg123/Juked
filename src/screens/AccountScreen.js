import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import context from "../context/context";

const AccountScreen = ({ navigation }) => {
  const { firestore } = useContext(context);
  const [error, setError] = useState(null);
  return (
    <View>
      <Text>AccountScreen</Text>
      <Button
        title="Sign out"
        onPress={() =>
          firestore.signout().then(err => (err ? setError(error) : null))
        }
      ></Button>
      <Text>{error}</Text>
    </View>
  );
};

const styles = StyleSheet.create({});

export default AccountScreen;
