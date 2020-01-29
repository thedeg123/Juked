import React from "react";
import { View, StyleSheet } from "react-native";
import { Input } from "react-native-elements";
import useFirestore from "../../hooks/useFirestore";
import colors from "../../constants/colors";

const Handle = ({ error, setError, handle, setHandle }) => {
  return (
    <View style={styles.handleStyle}>
      <Input
        label="Choose a handle,"
        value={"@" + handle}
        onChangeText={text => setHandle(text.substring(1, 11))}
        onEndEditing={() => {
          if (handle.length === 0) return;
          handle.length < 3 || handle.length > 10
            ? setError("Handles must be between 3 and 10 characters.")
            : useFirestore.getUserByHandle(handle).then(res => {
                Object.keys(res).length
                  ? setError(
                      "That handle has already been taken! Give it another shot!"
                    )
                  : setError("");
              });
        }}
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
