import React, { useContext, useEffect, useState } from "react";
import { Context as AuthContext } from "../context/AuthContext";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  Image
} from "react-native";
import { AntDesign, Octicons } from "@expo/vector-icons";
import colors from "../constants/colors";
// Change this
import firebase from "firebase";
import Container from "../components/Container";
import ListPreview from "../components/ListPreview";
import useFirestore from "../hooks/useFirestore";

const UserProfileScreen = ({
  navigation,
  uid = firebase.auth().currentUser.email
}) => {
  // No matter what, we will load the profile page for the person
  // who has the id of uid

  const { signout } = useContext(AuthContext);
  const [user, setUser] = useState(null);

  useEffect(() => {
    useFirestore.getUser(uid).then(myUser => {
      console.log(myUser);
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

      {user.handle !== "" ? (
        <Text style={styles.handleStyle}>@{user.handle}</Text>
      ) : (
        <Text style={styles.handleStyle}>@{user.email}</Text>
      )}

      {/* Not working */}
      {/* <View style={styles.numberStyle}>
        <Text style={styles.followStyle}>
          {user.followers.length} Followers
        </Text>
        <Text style={styles.followStyle}>
          {user.following.length} Following
        </Text>
      </View> */}

      <Text style={styles.bioStyle}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </Text>

      <Text style={styles.reviewTitleStyle}>Reviews</Text>
      <ListPreview
        title="Artists"
        num="5"
        //id
        navigation={navigation}
      />
      <ListPreview
        title="Albums"
        num="7"
        //id
        navigation={navigation}
      />
      <ListPreview
        title="Songs"
        num="20"
        //id
        navigation={navigation}
      />
      <ListPreview
        title="Lists"
        num="3"
        //id
        navigation={navigation}
      />

      <Button
        title="Go to List"
        onPress={() => navigation.navigate("List")}
      ></Button>
    </Container>
  ) : null;
};

UserProfileScreen.navigationOptions = ({
  navigation,
  uid = firebase.auth().currentUser.email
}) => {
  const user = useFirestore.getUser(uid);

  return {
    title: user.handle ? user.handle : user.email,
    headerRight: () =>
      uid === firebase.auth().currentUser.email ? (
        <TouchableOpacity onPress={() => navigation.navigate("Account")}>
          <AntDesign
            style={styles.headerRightStyle}
            name="setting"
            color={colors.primary}
          ></AntDesign>
        </TouchableOpacity>
      ) : null
  };
};

const styles = StyleSheet.create({
  headerStyle: {
    fontSize: 60
  },
  headerRightStyle: {
    fontSize: 25,
    marginRight: 10
  },
  imageStyle: {
    height: 175,
    width: 175,
    alignSelf: "center"
  },
  holderImageStyle: {
    alignSelf: "center",
    fontSize: 175
  },
  handleStyle: {
    fontSize: 25,
    alignSelf: "center",
    color: colors.text
  },
  numberStyle: {
    marginTop: 10,
    flexDirection: "row"
  },
  followStyle: {
    flex: 1,
    textAlign: "center",
    color: colors.secondary,
    fontSize: 18
  },
  bioStyle: {
    marginTop: 20,
    textAlign: "center",
    color: colors.shadow
  },
  reviewTitleStyle: {
    marginTop: 40,
    fontSize: 25
  }
});

export default UserProfileScreen;
