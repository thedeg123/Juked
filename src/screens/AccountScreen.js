import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Keyboard,
  TouchableOpacity
} from "react-native";
import context from "../context/context";
import { Input } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import colors from "../constants/colors";
import ImagePreview from "../components/MakeProfileScreenComponents/ImagePreview";
import ModalAccountCard from "../components/ModalCards/ModalAccountCard";

const AccountScreen = ({ navigation }) => {
  const user = navigation.getParam("user");
  const { firestore, disconnect } = useContext(context);
  const [showProfile, setShowProfile] = useState(true);
  const [profile_url, setProfile_url] = useState(user.profile_url);
  const [handle, setHandle] = useState(user.handle);
  const [bio, setBio] = useState(user.bio);
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notifyText, setNotifyText] = useState("");

  const [showModal, setShowModal] = useState(false);

  const updatePassword = () =>
    password === confirmPassword
      ? firestore.updatePassword(oldPassword, password).then(res => {
          setNotifyText(res || "Password Succesfully Changed!");
        })
      : setNotifyText("Passwords Don't Match!");

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 85 }}
      keyboardShouldPersistTaps="always"
      style={{ flex: 1 }}
    >
      {notifyText.length ? (
        <Text
          style={{
            marginTop: 10,
            fontSize: 16,
            color: colors.heat,
            textAlign: "center"
          }}
        >
          {notifyText}
        </Text>
      ) : null}
      {showProfile && (
        <View>
          <Text style={styles.reviewTitleStyle}>Update Profile</Text>
          <ImagePreview imageURL={profile_url}></ImagePreview>
          <Input
            label="Update Profile URL,"
            value={profile_url}
            selectionColor={colors.primary}
            labelStyle={{ color: colors.text }}
            containerStyle={{ marginVertical: 10 }}
            onChangeText={setProfile_url}
            autoCapitalize="none"
            returnKeyType={"done"}
            autoCorrect={false}
          ></Input>
          <Input
            label="Update Handle,"
            value={handle}
            selectionColor={colors.primary}
            containerStyle={{ marginVertical: 10 }}
            labelStyle={{ color: colors.text }}
            maxLength={15}
            returnKeyType={"done"}
            onChangeText={setHandle}
            autoCapitalize="none"
            autoCorrect={false}
          ></Input>
          <Input
            label="Update Bio,"
            value={bio}
            multiline
            maxLength={200}
            selectionColor={colors.primary}
            containerStyle={{ marginVertical: 10 }}
            labelStyle={{ color: colors.text }}
            blurOnSubmit
            returnKeyType={"done"}
            onChangeText={setBio}
          ></Input>
          <TouchableOpacity
            onPress={() => {
              Keyboard.dismiss();
              handle.length < 3 || handle.length > 15
                ? setNotifyText("Handles must be between 3 and 15 characters.")
                : handle !== user.handle
                ? firestore
                    .getUserByHandle(handle)
                    .then(res =>
                      res
                        ? setNotifyText("That handle has already been taken!")
                        : firestore
                            .updateUser(handle, bio, profile_url)
                            .then(setNotifyText("Profile Updated"))
                    )
                : firestore
                    .updateUser(handle, bio, profile_url)
                    .then(setNotifyText("Profile Updated"));
            }}
            style={styles.buttonStyle}
          >
            <Text style={styles.buttonTextStyle}>Update</Text>
          </TouchableOpacity>
        </View>
      )}
      <Text style={styles.reviewTitleStyle}>Change Password</Text>
      <Input
        value={oldPassword}
        selectTextOnFocus
        onFocus={() => setShowProfile(false)}
        onBlur={() => setShowProfile(true)}
        secureTextEntry={true}
        labelStyle={{ color: colors.text }}
        label={"Old Password"}
        containerStyle={{ marginVertical: 10 }}
        selectionColor={colors.primary}
        leftIcon={<Ionicons name="ios-unlock" style={styles.iconStyle} />}
        onChangeText={setOldPassword}
        autoCapitalize="none"
        autoCorrect={false}
      ></Input>
      <Input
        value={password}
        selectTextOnFocus
        onFocus={() => setShowProfile(false)}
        onBlur={() => setShowProfile(true)}
        secureTextEntry={true}
        labelStyle={{ color: colors.text }}
        label={"New Password"}
        containerStyle={{ marginVertical: 10 }}
        selectionColor={colors.primary}
        leftIcon={<Ionicons name="ios-unlock" style={styles.iconStyle} />}
        onChangeText={setPassword}
        autoCapitalize="none"
        autoCorrect={false}
      ></Input>
      <View style={styles.verticalSpacerStyle}></View>
      <Input
        value={confirmPassword}
        selectTextOnFocus
        onFocus={() => setShowProfile(false)}
        onBlur={() => setShowProfile(true)}
        secureTextEntry={true}
        selectionColor={colors.primary}
        labelStyle={{ color: colors.text }}
        label={"Confirm New Password"}
        containerStyle={{ marginVertical: 10 }}
        leftIcon={<Ionicons name="ios-lock" style={styles.iconStyle} />}
        returnKeyType={"done"}
        onChangeText={setConfirmPassword}
        autoCapitalize="none"
        autoCorrect={false}
      ></Input>
      <TouchableOpacity onPress={updatePassword} style={styles.buttonStyle}>
        <Text style={styles.buttonTextStyle}>Set Password</Text>
      </TouchableOpacity>
      {showProfile && (
        <View>
          <Text style={styles.reviewTitleStyle}>Delete Account</Text>
          <TouchableOpacity
            style={[styles.buttonStyle, { backgroundColor: colors.danger }]}
            onPress={() => setShowModal(true)}
          >
            <Text style={styles.buttonTextStyle}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      )}
      <ModalAccountCard
        showModal={showModal}
        onClose={() => setShowModal(false)}
        onDelete={async password => {
          await disconnect();
          firestore.deleteAccount(password);
        }}
      ></ModalAccountCard>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  reviewTitleStyle: {
    marginLeft: 10,
    paddingTop: 10,
    marginBottom: 5,
    fontSize: 26,
    color: colors.primary,
    fontWeight: "bold"
  },
  iconStyle: {
    fontSize: 25,
    right: 10,
    alignSelf: "flex-start"
  },
  buttonStyle: {
    alignSelf: "center",
    marginTop: 10,
    padding: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.primary,
    borderRadius: 5
  },
  buttonTextStyle: {
    fontWeight: "bold",
    color: colors.white,
    fontSize: 18
  }
});

export default AccountScreen;
