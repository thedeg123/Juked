import React, { useContext } from "react";
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
import * as firebase from "firebase";
import Container from "../components/Container";
import ListPreview from "../components/ListPreview";

const UserProfileScreen = ({ navigation }) => {
  var user = firebase.auth().currentUser;

  const { signout } = useContext(AuthContext);
  return (
    <Container>
      {/* <Text style={styles.headerStyle}>ProfileScreen</Text> */}
      {/* <Button
        title="Go to List"
        onPress={() => navigation.navigate("List")}
      ></Button> */}

      {/* {user.URL ? (
        <Image source={{ uri: user.photoURL }} style={styles.image} />
      ) : (
        <Octicons
          name="person"
          color={colors.primary}
          style={{ fontSize: 50 }}
        />
      )} */}

      {user.URL ? (
        <Image
          source={{
            uri:
              "http://www.morrishospital.org/wp-content/uploads/2018/12/penguin2_2-1024x768.jpg"
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

      <Text style={styles.handleStyle}>@Handle</Text>

      <View style={styles.numberStyle}>
        <Text style={styles.followStyle}># Followers</Text>
        <Text style={styles.followStyle}># Following</Text>
      </View>

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
    </Container>
  );
};

UserProfileScreen.navigationOptions = ({ navigation }) => {
  var user = firebase.auth().currentUser;

  return {
    title: user.displayName !== null ? user.displayName : user.email,
    headerRight: () => (
      <TouchableOpacity onPress={() => navigation.navigate("Account")}>
        <AntDesign
          style={styles.headerRightStyle}
          name="setting"
          color={colors.primary}
        ></AntDesign>
      </TouchableOpacity>
    )
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
