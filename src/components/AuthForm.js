import React, { useState } from "react";
import { View, StyleSheet, Button } from "react-native";
import { Text, Input } from "react-native-elements";
import PasswordField from "./PasswordField";

const AuthForm = ({
  headerText,
  submitButtonAction,
  submitButtonTitle,
  confirmPassword
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");

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
      <PasswordField
        password={password}
        updatePassword={setPassword}
      ></PasswordField>
      <View style={styles.verticalSpacerStyle}></View>
      {confirmPassword ? (
        <PasswordField
          password={verifyPassword}
          updatePassword={setVerifyPassword}
          title="Confirm Password"
        ></PasswordField>
      ) : null}
      <Button
        onPress={() =>
          confirmPassword
            ? submitButtonAction(email, password, verifyPassword)
            : submitButtonAction(email, password)
        }
        title={submitButtonTitle}
      ></Button>
    </View>
  );
};

AuthForm.defaultProps = {
  confirmPassword: false
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
