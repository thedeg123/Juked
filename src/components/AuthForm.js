import React, { useState, useRef } from "react";
import { View, StyleSheet, Linking, Text } from "react-native";
import { Input } from "react-native-elements";
import Button from "./AuthButton";
import colors from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import AuthLoading from "../components/AuthLoading";
import CheckBox from "../components/MakeProfileScreenComponents/checkBox";
import { TouchableOpacity } from "react-native-gesture-handler";

const AuthForm = ({
  submitButtonAction,
  submitButtonTitle,
  confirmPassword
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [termsOfService, setTermsOfService] = useState(false);
  const [loading, setLoading] = useState(false);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  return (
    <View>
      <View style={styles.verticalSpacerStyle}></View>
      <Input
        label="Email"
        leftIcon={<Ionicons name="ios-mail" style={styles.iconStyle} />}
        value={email}
        onChangeText={text => setEmail(text)}
        autoCapitalize="none"
        keyboardType="email-address"
        returnKeyType={"next"}
        selectionColor={colors.white}
        labelStyle={styles.textStyle}
        inputContainerStyle={{ borderColor: colors.veryVeryTranslucentWhite }}
        autoCorrect={false}
        onSubmitEditing={() => passwordRef.current.focus()}
      ></Input>
      <View style={styles.verticalSpacerStyle}></View>
      <Input
        ref={passwordRef}
        value={password}
        selectTextOnFocus
        inputContainerStyle={{ borderColor: colors.veryVeryTranslucentWhite }}
        secureTextEntry={true}
        labelStyle={styles.textStyle}
        label={"Password"}
        selectionColor={colors.white}
        leftIcon={<Ionicons name="ios-unlock" style={styles.iconStyle} />}
        returnKeyType={confirmPassword ? "next" : "done"}
        onChangeText={setPassword}
        autoCapitalize="none"
        autoCorrect={false}
        onSubmitEditing={() =>
          confirmPassword ? confirmPasswordRef.current.focus() : null
        }
      ></Input>
      <View style={styles.verticalSpacerStyle}></View>
      {confirmPassword ? (
        <View>
          <Input
            ref={confirmPasswordRef}
            value={verifyPassword}
            selectTextOnFocus
            inputContainerStyle={{
              borderColor: colors.veryVeryTranslucentWhite
            }}
            secureTextEntry={true}
            selectionColor={colors.white}
            labelStyle={styles.textStyle}
            label={"Confirm Password"}
            leftIcon={<Ionicons name="ios-lock" style={styles.iconStyle} />}
            returnKeyType={"next"}
            onChangeText={setVerifyPassword}
            autoCapitalize="none"
            autoCorrect={false}
          ></Input>
          <View
            style={{
              marginVertical: 20,
              marginHorizontal: 10,
              flexDirection: "row"
            }}
          >
            <CheckBox
              onPress={() => setTermsOfService(!termsOfService)}
              active={termsOfService}
            />
            <View
              style={{
                marginLeft: 10,
                justifyContent: "center"
              }}
            >
              <Text style={styles.textStyle}>I have read and agree to the</Text>
              <TouchableOpacity
                onPress={() =>
                  Linking.openURL(
                    "https://raw.githubusercontent.com/thedeg123/Juked/master/LICENSE"
                  )
                }
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    ...styles.textStyle
                  }}
                >
                  terms of service
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : null}
      {loading ? (
        <AuthLoading></AuthLoading>
      ) : (
        <Button
          onPress={() => {
            setLoading(true);
            confirmPassword
              ? submitButtonAction(
                  email,
                  password,
                  verifyPassword,
                  termsOfService
                ).then(ok => !ok && setLoading(false))
              : submitButtonAction(email, password).then(
                  ok => !ok && setLoading(false)
                );
          }}
          title={submitButtonTitle}
        ></Button>
      )}
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
  textStyle: { fontSize: 20, color: colors.white },
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
