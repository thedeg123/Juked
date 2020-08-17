import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Input } from "react-native-elements";
import colors from "../../constants/colors";
import KeyboardAvoidingView from "../KeyboardAvoidingViewWrapper";
import { Ionicons } from "@expo/vector-icons";

const ModalAccountContent = ({ onClose, onDelete }) => {
  const [oldPassword, setOldPassword] = useState("");
  return (
    <KeyboardAvoidingView>
      <View style={styles.content}>
        <Text
          style={{
            textAlign: "center",
            marginBottom: 10,
            fontSize: 20,
            color: colors.text
          }}
        >
          Are you sure you want to delete your account?
        </Text>
        <Text style={{ fontSize: 16, marginBottom: 10, color: colors.text }}>
          All your reviews, ratings, and lists will be permanently deleted. This
          cannot be undone.
        </Text>
        <Input
          value={oldPassword}
          selectTextOnFocus
          secureTextEntry={true}
          labelStyle={{ color: colors.text }}
          label={"To delete enter your password."}
          containerStyle={{ marginVertical: 10 }}
          selectionColor={colors.primary}
          leftIcon={<Ionicons name="ios-unlock" style={styles.iconStyle} />}
          onChangeText={setOldPassword}
          autoCapitalize="none"
          autoCorrect={false}
        ></Input>
        <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
          <TouchableOpacity style={styles.buttonStyle} onPress={onClose}>
            <Text style={styles.buttonTextStyle}>No, take me back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ justifyContent: "center" }}
            onPress={() => onDelete(oldPassword)}
          >
            <Text style={{ color: colors.danger, fontSize: 16, top: 3 }}>
              Yes, delete my account
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: colors.cardColor,
    padding: 10,
    paddingBottom: 50,
    borderRadius: 5
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12
  },
  buttonStyle: {
    alignSelf: "center",
    marginTop: 10,
    padding: 10,
    backgroundColor: colors.primary,
    borderRadius: 5
  },
  iconStyle: {
    fontSize: 25,
    right: 10,
    alignSelf: "flex-start"
  },
  buttonTextStyle: {
    fontWeight: "bold",
    color: colors.white,
    fontSize: 18
  }
});

export default ModalAccountContent;
