import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Input } from "react-native-elements";
import colors from "../../constants/colors";

const Bio = ({ bio, setBio }) => {
  const [error, setError] = useState("");
  return (
    <View>
      <Input
        label="Anything else to add?"
        value={bio}
        multiline
        blurOnSubmit
        onChangeText={text => {
          if (bio.length < 400) {
            setError("");
            setBio(text);
          } else {
            setError("Be shwifty! Bios are limited to 500 characters.");
            setBio(text.substring(0, 500));
          }
        }}
        errorMessage={error}
        errorStyle={styles.errorText}
      ></Input>
    </View>
  );
};

const styles = StyleSheet.create({
  errorText: {
    fontSize: 18,
    textAlign: "center",
    color: colors.errorText
  }
});

export default Bio;
