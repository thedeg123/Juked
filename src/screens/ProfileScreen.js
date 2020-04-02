import React, { useEffect, useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  Image,
  ScrollView
} from "react-native";
import { AntDesign, SimpleLineIcons } from "@expo/vector-icons";
import colors from "../constants/colors";
import { auth } from "firebase";
import Container from "../components/Container";
import ListPreview from "../components/ListPreview";
import context from "../context/context";
import images from "../constants/images";
import FollowButton from "../components/FollowButton";
import LoadingIndicator from "../components/LoadingIndicator";

const UserProfileScreen = ({ navigation }) => {
  const firestore = useContext(context);
  const uid = navigation.getParam("uid") || firestore.fetchCurrentUID();
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [following, setFollowing] = useState(null);
  const [followers, setFollowers] = useState(null);
  const fetchFollow = async () => {
    await firestore.getFollowing(uid).then(res => setFollowing(res));
    await firestore.getFollowers(uid).then(res => setFollowers(res));
  };
  useEffect(() => {
    const fetch = () => {
      if (!uid) uid = firestore.fetchCurrentUID();
      firestore.getReviewsByAuthor(uid).then(res => setReviews(res));
      firestore.getUser(uid).then(res => setUser(res));
      fetchFollow();
    };
    fetch();
    const listener = navigation.addListener("didFocus", () => fetch()); //any time we return to this screen we do another fetch
    return () => listener.remove();
  }, []);

  const numType = ({ reviews, type }) => {
    var num = 0;
    reviews.map(review => {
      if (review.data.type === type) {
        num++;
      }
    });
    return num;
  };
  if (!user || !reviews || !followers || !following)
    return (
      <Container style={styles.container}>
        <LoadingIndicator></LoadingIndicator>
      </Container>
    );
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
        <Image
          source={{ uri: images.profileDefault }}
          style={styles.imageStyle}
        />
      )}
      {user.handle !== "" ? (
        <Text style={styles.handleStyle}>@{user.handle}</Text>
      ) : (
        <Text style={styles.handleStyle}>@{user.email}</Text>
      )}
      <View style={styles.numberStyle}>
        <Text style={styles.followStyle}>{followers.size} Followers</Text>
        <Text style={styles.followStyle}> {following.size} Following</Text>
      </View>
      {user.bio ? (
        <Text style={styles.bioStyle}>{user.bio}</Text>
      ) : uid === firestore.fetchCurrentUID() ? (
        <Text style={styles.bioStyle}>Add a bio from the Account screen</Text>
      ) : null}
      {uid == firestore.fetchCurrentUID() ? null : followers.has(
          firestore.fetchCurrentUID()
        ) ? (
        <FollowButton
          following
          onPress={() => firestore.unfollowUser(uid).then(() => fetchFollow())}
        ></FollowButton>
      ) : (
        <FollowButton
          following={false}
          onPress={() => firestore.followUser(uid).then(() => fetchFollow())}
        ></FollowButton>
      )}
      <Text style={styles.reviewTitleStyle}>Reviews</Text>
      <ScrollView>
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
      </ScrollView>
    </Container>
  ) : null;
};

UserProfileScreen.navigationOptions = ({ navigation }) => {
  var uid = navigation.getParam("uid");
  //const user = useFirestore.getUser(uid);

  return {
    // Right now, having problems with this
    //title: user.handle ? user.handle : <Text>Profile</Text>,
    headerRight: () =>
      uid === auth().currentUser.email || !uid ? (
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
  container: {
    backgroundColor: colors.white,
    flexDirection: "column",
    flex: 1
  },
  imageStyle: {
    height: 175,
    width: 175,
    alignSelf: "center",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.shadow
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
    marginVertical: 20,
    textAlign: "center",
    color: colors.shadow
  },
  followIconStyle: {
    fontSize: 30,
    alignSelf: "center"
  },
  reviewTitleStyle: {
    marginTop: 20,
    fontSize: 25
  }
});

export default UserProfileScreen;
