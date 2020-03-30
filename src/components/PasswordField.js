import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Input } from "react-native-elements";
import colors from "../constants/colors";

const PasswordField = ({ password, updatePassword, leftIcon, title }) => {
  return (
    <>
      <Input
        value={password}
        secureTextEntry={true}
        labelStyle={{ color: colors.white }}
        label={title}
        leftIcon={leftIcon}
        onChangeText={text => updatePassword(text)}
        autoCapitalize="none"
        autoCorrect={false}
      ></Input>
    </>
  );
};
PasswordField.defaultProps = {
  title: "Password"
};

const styles = StyleSheet.create({});

export default PasswordField;
