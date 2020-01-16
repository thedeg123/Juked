import React, { useContext, useState } from "react";
import { View, StyleSheet, Button } from "react-native";
import { Context as AuthContext } from "../context/AuthContext";
import { Text, Input } from "react-native-elements";

const AuthForm = ({ headerText, submitButtonAction, submitButtonTitle }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <View>
      <Text style={styles.headerStyle}>Juked</Text>
      <Text h3>{headerText}</Text>
      <View style={styles.verticalSpacerStyle}></View>
      <Input
        label="Email"
        value={email}
        onChangeText={text => setEmail(text)}
        autoCapitalize="none"
        autoCorrect={false}
      ></Input>
      <View style={styles.verticalSpacerStyle}></View>
      <Input
        value={password}
        secureTextEntry={true}
        label="Password"
        onChangeText={text => setPassword(text)}
        autoCapitalize="none"
        autoCorrect={false}
      ></Input>
      <Button
        onPress={() => submitButtonAction()}
        title={submitButtonTitle}
      ></Button>
    </View>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    fontSize: 64,
    alignSelf: "center",
    marginBottom: 30
  },
  verticalSpacerStyle: {
    marginVertical: 20
  }
});

export default AuthForm;
