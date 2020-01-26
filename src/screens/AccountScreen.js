import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, Button, TextInput } from "react-native";
import { Context as AuthContext } from "../context/AuthContext";
import { AntDesign } from "@expo/vector-icons";
import colors from "../constants/colors";
import useFirestore from "../hooks/useFirestore";

const AccountScreen = ({ navigation }) => {
  const { signout, errorMessage } = useContext(AuthContext);
  const [handle, setHandle] = useState("");
  const { email } = useContext(AuthContext);

  return (
    <View>
      <View style={styles.backgroundStyle}>
        <TextInput
          style={styles.inputStyle}
          placeholder="Change Handle"
          autocorrect="false"
          autoCapitalize="none"
          placeholderTextColor={colors.shadow}
          value={handle}
          onChangeText={setHandle}
          onEndEditing={() => {
            // Unhandled promise rejection error
            useFirestore.updateUser({ uid: email, handle: handle });
          }}
        />
        {handle !== "" ? (
          <AntDesign
            name="close"
            style={styles.iconStyle}
            color={colors.primary}
            // We should discuss if this should also actually change the handle in Firestore
            onPress={() => setHandle("")}
          />
        ) : null}
      </View>
      <Button
        title="Sign out"
        onPress={() => signout(() => navigation.navigate("loginFlow"))}
      ></Button>
      <Text>{errorMessage}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundStyle: {
    marginVertical: 10,
    marginHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "#ccc",
    height: 45,
    flexDirection: "row"
  },
  inputStyle: {
    marginHorizontal: 10,
    fontSize: 18,
    flex: 1
  },
  iconStyle: {
    marginHorizontal: 10,
    fontSize: 25,
    alignSelf: "center"
  }
});

export default AccountScreen;
