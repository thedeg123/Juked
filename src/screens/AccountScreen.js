import React, { useContext, useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, TextInput, Image } from "react-native";
import { Context as AuthContext } from "../context/AuthContext";
import { AntDesign, Octicons } from "@expo/vector-icons";
import colors from "../constants/colors";
import useFirestore from "../hooks/useFirestore";
import Container from "../components/Container";
import { auth } from "firebase";

const AccountScreen = ({ navigation, uid = auth().currentUser.email }) => {
  const { signout, errorMessage } = useContext(AuthContext);
  const [handle, setHandle] = useState("");
  const [bio, setBio] = useState("");

  const [user, setUser] = useState(null);

  useEffect(() => {
    useFirestore.getUser(uid).then(myUser => {
      setUser(myUser);
    });
  }, []);

  return user ? (
    <Container>
      {user.profile_url ? (
        <Image
          source={{
            uri: user.profile_url
          }}
          style={styles.imageStyle}
        />
      ) : (
        <Octicons
          name="person"
          color={colors.primary}
          style={styles.holderImageStyle}
        />
      )}

      {/* This is the handle bar */}
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
            useFirestore.updateUser({ uid: uid, handle: handle });
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

      {/* This is the bio bar */}
      <View style={styles.backgroundStyle}>
        <TextInput
          style={styles.inputStyle}
          placeholder="Change Bio"
          autocorrect="false"
          autoCapitalize="none"
          placeholderTextColor={colors.shadow}
          value={bio}
          onChangeText={setBio}
          onEndEditing={() => {
            // Unhandled promise rejection error
            useFirestore.updateUser({ uid: uid, bio: bio });
          }}
        />
        {bio !== "" ? (
          <AntDesign
            name="close"
            style={styles.iconStyle}
            color={colors.primary}
            // We should discuss if this should also actually change the handle in Firestore
            onPress={() => setBio("")}
          />
        ) : null}
      </View>

      <Button
        title="Sign out"
        onPress={() => signout(() => navigation.navigate("loginFlow"))}
      ></Button>
      <Text>{errorMessage}</Text>
    </Container>
  ) : null;
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
  },
  imageStyle: {
    height: 175,
    width: 175,
    alignSelf: "center"
  },
  holderImageStyle: {
    alignSelf: "center",
    fontSize: 175
  }
});

export default AccountScreen;
