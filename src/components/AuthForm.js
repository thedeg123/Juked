import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, Input } from "react-native-elements";
import Button from "./AuthButton";
import colors from "../constants/colors";
import PasswordField from "./PasswordField";
import { Ionicons } from "@expo/vector-icons";

const AuthForm = ({
  submitButtonAction,
  submitButtonTitle,
  confirmPassword
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");

  return (
    <View>
      <View style={styles.verticalSpacerStyle}></View>
      <Input
        label="Email"
        leftIcon={<Ionicons name="ios-mail" style={styles.iconStyle} />}
        value={email}
        onChangeText={text => setEmail(text)}
        autoCapitalize="none"
        returnKeyType={"done"}
        labelStyle={{ color: colors.white }}
        autoCorrect={false}
      ></Input>
      <View style={styles.verticalSpacerStyle}></View>
      <PasswordField
        password={password}
        returnKeyType={"done"}
        leftIcon={<Ionicons name="ios-unlock" style={styles.iconStyle} />}
        updatePassword={setPassword}
      ></PasswordField>
      <View style={styles.verticalSpacerStyle}></View>
      {confirmPassword ? (
        <PasswordField
          password={verifyPassword}
          leftIcon={<Ionicons name="ios-lock" style={styles.iconStyle} />}
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
  iconStyle: {
    fontSize: 25,
    right: 10,
    alignSelf: "flex-start"
  },
  verticalSpacerStyle: {
    marginVertical: 10
  }
});

export default AuthForm;
