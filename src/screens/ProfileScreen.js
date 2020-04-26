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
import { AntDesign } from "@expo/vector-icons";
import colors from "../constants/colors";
import { auth } from "firebase";
import Container from "../components/Container";
import ListPreview from "../components/ListPreview";
import context from "../context/context";
import images from "../constants/images";
import FollowButton from "../components/FollowButton";
import LoadingIndicator from "../components/LoadingIndicator";
import BarGraph from "../components/Graphs/BarGraph";
import useMusic from "../hooks/useMusic";
import simplifyContent from "../helpers/simplifyContent";

const UserProfileScreen = ({ navigation }) => {
  const firestore = useContext(context);
  const uid = navigation.getParam("uid") || firestore.fetchCurrentUID();
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [following, setFollowing] = useState(null);
  const [followers, setFollowers] = useState(null);
  const [content, setContent] = useState(null);
  const { findContent } = useMusic();

  const fetchFollow = async () => {
    await firestore.getFollowing(uid).then(res => setFollowing(res));
    await firestore.getFollowers(uid).then(res => setFollowers(res));
  };
  const fetch = async () => {
    if (!uid) uid = firestore.fetchCurrentUID();
    const reviews = await firestore.getReviewsByAuthor(uid, 10).then(res => {
      const ret = { track: [], album: [], artist: [] };
      res.forEach(r => ret[r.data.type].push(r));
      return ret;
    });
    setReviews(reviews);
    let cid_byType = {
      track: new Set(reviews["track"].map(r => r.data.content_id)),
      album: new Set(reviews["album"].map(r => r.data.content_id)),
      artist: new Set(reviews["artist"].map(r => r.data.content_id))
    };
    let temp_content = {};
    for (let [type, cids] of Object.entries(cid_byType)) {
      cids = Array.from(cids);
      if (!cids.length) continue;
      await findContent(cids, type).then(result =>
        result.forEach(el => (temp_content[el.id] = simplifyContent(el, type)))
      );
    }
    setContent(temp_content);
    firestore.getUser(uid).then(res => setUser(res));
    fetchFollow();
  };
  useEffect(() => {
    fetch();
    const listener = navigation.addListener("didFocus", () => fetch()); //any time we return to this screen we do another fetch
    return () => listener.remove();
  }, []);
  if (!user || !reviews || !followers || !content || !following) {
    return (
      <Container>
        <LoadingIndicator></LoadingIndicator>
      </Container>
    );
  }
  return user ? (
    <ScrollView
      style={styles.containerStyle}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerContainer}>
        <View>
          <Image
            source={{
              uri: user.profile_url || images.profileDefault
            }}
            style={styles.imageStyle}
          />
          <Text style={styles.handleStyle}>@{user.handle}</Text>
        </View>
        <View style={styles.followContainer}>
          {uid == firestore.fetchCurrentUID() ? null : followers.has(
              firestore.fetchCurrentUID()
            ) ? (
            <FollowButton
              following
              onPress={() =>
                firestore.unfollowUser(uid).then(() => fetchFollow())
              }
            ></FollowButton>
          ) : (
            <FollowButton
              following={false}
              onPress={() =>
                firestore.followUser(uid).then(() => fetchFollow())
              }
            ></FollowButton>
          )}
          <View style={styles.numberStyle}>
            <TouchableOpacity onPress={() => navigation.navigate("List")}>
              <Text style={styles.followStyle}>{followers.size} Followers</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("List")}>
              <Text style={styles.followStyle}>{following.size} Following</Text>
            </TouchableOpacity>
          </View>
          {following.has(firestore.fetchCurrentUID()) ? (
            <View style={styles.followsYouWrapper}>
              <Text style={styles.followsYou}>Follows You</Text>
            </View>
          ) : null}
        </View>
      </View>
      <View style={{ marginHorizontal: 10 }}>
        {user.bio ? (
          <Text style={styles.bioStyle}>{user.bio}</Text>
        ) : uid === firestore.fetchCurrentUID() ? (
          <Text style={styles.bioStyle}>Add a bio from the Account screen</Text>
        ) : null}
        <Text style={styles.reviewTitleStyle}>Reviews</Text>
      </View>
      {/* TODO: DELETE OR CASE BEFORE LAUNCH */}
      <View style={{ marginTop: 10, marginHorizontal: 10 }}>
        <BarGraph data={user.review_data || new Array(11).fill(0)} />
      </View>
      <ListPreview
        title="Most Recent Artists"
        content={content}
        user={user}
        data={reviews["artist"]}
        onPress={() => navigation.navigate("List")}
      />
      <ListPreview
        title="Most Recent Albums"
        user={user}
        content={content}
        data={reviews["album"]}
        onPress={() => navigation.navigate("List")}
      />
      <ListPreview
        title="Most Recent Songs"
        user={user}
        content={content}
        data={reviews["track"]}
        onPress={() => navigation.navigate("List")}
        marginBottom={10}
      />
    </ScrollView>
  ) : null;
};

UserProfileScreen.navigationOptions = ({ navigation }) => {
  var uid = navigation.getParam("uid");
  //const user = useFirestore.getUser(uid);

  return {
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
  containerStyle: {
    flex: 1,
    paddingTop: 10
  },
  headerRightStyle: {
    fontSize: 25,
    marginRight: 15
  },
  followContainer: {
    alignItems: "center",
    alignSelf: "center",
    height: 155,
    flex: 1
  },
  headerContainer: {
    marginHorizontal: 10,
    flexDirection: "row"
  },
  container: {
    backgroundColor: colors.white,
    flexDirection: "column",
    flex: 1
  },
  imageStyle: {
    aspectRatio: 1,
    width: 125,
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
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
    justifyContent: "space-evenly",
    flex: 1
  },
  followStyle: {
    textAlign: "center",
    color: colors.primary,
    fontSize: 16
  },
  bioStyle: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 16,
    color: colors.shadow
  },
  followsYouContianer: {
    height: 40,
    justifyContent: "center"
  },
  followsYouWrapper: {
    width: 135,
    height: 45,
    borderRadius: 5,
    paddingHorizontal: 15,
    justifyContent: "center",
    backgroundColor: colors.secondary
  },
  followsYou: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: colors.white
  },
  followIconStyle: {
    fontSize: 30,
    alignSelf: "center"
  },
  reviewTitleStyle: {
    fontSize: 30,
    color: colors.text,
    fontWeight: "bold"
  }
});

export default UserProfileScreen;
