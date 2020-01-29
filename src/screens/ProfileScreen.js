import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  Image
} from "react-native";
import { AntDesign, Octicons } from "@expo/vector-icons";
import useAuth from "../hooks/useAuth";
import colors from "../constants/colors";
import { auth } from "firebase";
import Container from "../components/Container";
import ListPreview from "../components/ListPreview";
import useFirestore from "../hooks/useFirestore";

const UserProfileScreen = ({ navigation }) => {
  const uid = navigation.getParam("uid") || auth().currentUser.email;
  const { signout } = useAuth();
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState(null);

  useEffect(() => {
    useFirestore.getReviewsByAuthor(uid).then(allReviews => {
      setReviews(allReviews);
    });
    useFirestore.getUser(uid).then(myUser => {
      setUser(myUser);
    });
  }, []);

  const numType = ({ reviews, type }) => {
    var num = 0;
    reviews.map(review => {
      if (review.review.type === type) {
        num++;
      }
    });
    return num;
  };

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

      <View style={styles.numberStyle}>
        <Text style={styles.followStyle}>
          {user.followers.length} Followers
        </Text>
        <Text style={styles.followStyle}>
          {user.following.length} Following
        </Text>
      </View>

      {user.bio ? (
        <Text style={styles.bioStyle}>{user.bio}</Text>
      ) : (
        <Text style={styles.bioStyle}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </Text>
      )}

      <Text style={styles.reviewTitleStyle}>Reviews</Text>
      <ListPreview
        title="Artists"
        num={reviews ? numType({ reviews: reviews, type: "artist" }) : 0}
        //id
        navigation={navigation}
      />
      <ListPreview
        title="Albums"
        num={reviews ? numType({ reviews: reviews, type: "album" }) : 0}
        //id
        navigation={navigation}
      />
      <ListPreview
        title="Songs"
        num={reviews ? numType({ reviews: reviews, type: "track" }) : 0}
        //id
        navigation={navigation}
      />
      <ListPreview
        title="Lists"
        num={reviews ? reviews.length : 0}
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
  uid = auth().currentUser.email
}) => {
  const user = useFirestore.getUser(uid);

  return {
    // Right now, having problems with this
    title: user.handle ? user.handle : <Text>Profile</Text>,
    headerRight: () =>
      uid === auth().currentUser.email ? (
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
