import React from "react";
import { View, StyleSheet } from "react-native";
import { Input } from "react-native-elements";
import colors from "../../constants/colors";

const Handle = ({ error, handle, setHandle }) => {
  return (
    <View style={styles.handleStyle}>
      <Input
        label="Choose a handle,"
        value={"@" + handle}
        onChangeText={text => setHandle(text.substring(1, 11))}
        autoCapitalize="none"
        errorMessage={error}
        errorStyle={styles.errorText}
        autoCorrect={false}
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

export default Handle;
