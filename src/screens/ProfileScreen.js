import React, { useEffect, useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  RefreshControl,
  ScrollView
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import colors from "../constants/colors";
import { auth } from "firebase";
import Container from "../components/Container";
import UserListItem from "../components/UserPreview";
import ListPreview from "../components/ListPreview";
import context from "../context/context";
import images from "../constants/images";
import FollowButton from "../components/FollowButton";
import LoadingIndicator from "../components/LoadingIndicator";
import BarGraph from "../components/Graphs/BarGraph";
import firebase from "firebase";
import "firebase/firestore";
import HomeScreenItem from "../components/HomeScreenComponents/HomeScreenItem";
import UserPreview from "../components/HomeScreenComponents/UserPreview";

const UserProfileScreen = ({ navigation }) => {
  const { firestore, useMusic } = useContext(context);
  const firestoreConcurrent = firebase.firestore();
  const uid = navigation.getParam("uid") || firestore.fetchCurrentUID();
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [content, setContent] = useState(null);
  const [followsYou, setFollowsYou] = useState(null);
  const [userFollowing, setUserFollowing] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  let remover = null;

  const updateFollow = async () => {
    firestore
      .followingRelationExists(uid, firestore.fetchCurrentUID())
      .then(res => setFollowsYou(res));
    return firestore
      .followingRelationExists(firestore.fetchCurrentUID(), uid)
      .then(res => setUserFollowing(res));
  };

  const fetch = async () => {
    if (!uid) uid = firestore.fetchCurrentUID();
    const reviews = {
      track: await firestore.getReviewsByAuthorType(uid, ["track"], 5),
      album: await firestore.getReviewsByAuthorType(uid, ["album"], 5),
      artist: await firestore.getReviewsByAuthorType(uid, ["artist"], 5)
    };
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
      await useMusic
        .findContent(cids, type)
        .then(result => result.forEach(el => (temp_content[el.id] = el)));
    }
    setContent(temp_content);
    updateFollow();
  };
  useEffect(() => {
    remover = firestoreConcurrent
      .collection("users")
      .doc(uid)
      .onSnapshot(res => setUser(res.data()));
    fetch();
    return () => {
      return remover ? remover() : null;
    };
  }, []);

  const navigateFollow = (title, follow) =>
    navigation.push("List", {
      title,
      fetchData: () => firestore.batchAuthorRequest(follow),
      renderItem: ({ item }) => <UserListItem user={item.data} />,
      keyExtractor: item => item.id
    });
  const navigateContent = (title, types) => {
    return navigation.push("List", {
      title,
      fetchData: async () => {
        const reviews = await firestore.getReviewsByAuthorType(uid, types);
        const music = await useMusic
          .findContent(
            reviews.map(review => review.data.content_id),
            types[0]
          )
          .then(res => {
            const ret = {};
            res.forEach(m => (ret[m.id] = m));
            return ret;
          });
        return reviews.map(r => {
          return { review: r, content: music[r.data.content_id] };
        });
      },
      renderItem: ({ item }) => (
        <HomeScreenItem
          review={item.review}
          content={item.content}
          author={user}
        ></HomeScreenItem>
      ),
      keyExtractor: item => item.review.id + item.review.content_id
    });
  };

  if (
    !user ||
    !reviews ||
    typeof followsYou !== "boolean" ||
    typeof userFollowing !== "boolean" ||
    !content
  ) {
    return (
      <Container>
        <LoadingIndicator></LoadingIndicator>
      </Container>
    );
  }
  return user ? (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.containerStyle}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 85 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              fetch();
              return setRefreshing(false);
            }}
          />
        }
      >
        <View style={styles.headerContainer}>
          <UserPreview
            img={user.profile_url || images.profileDefault}
            username={user.handle}
            containerStyle={styles.imageStyle}
            size={125}
            color={colors.text}
            fontScaler={0.2}
            allowPress={false}
          ></UserPreview>
          <View style={styles.followContainer}>
            {userFollowing ? (
              <FollowButton
                following
                onPress={() =>
                  firestore.unfollowUser(uid).then(() => updateFollow())
                }
              ></FollowButton>
            ) : firestore.fetchCurrentUID() != uid ? (
              <FollowButton
                following={false}
                onPress={() =>
                  firestore.followUser(uid).then(() => updateFollow())
                }
              ></FollowButton>
            ) : null}
            <View style={styles.numberStyle}>
              <TouchableOpacity
                onPress={async () =>
                  navigateFollow("Followers", await firestore.getFollowers(uid))
                }
              >
                <Text style={styles.followStyle}>
                  {user.num_follower} Followers
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () =>
                  navigateFollow("Following", await firestore.getFollowing(uid))
                }
              >
                <Text style={styles.followStyle}>
                  {user.num_following} Following
                </Text>
              </TouchableOpacity>
            </View>
            {followsYou ? (
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
            <Text style={styles.bioStyle}>
              Add a bio from the Account screen
            </Text>
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
          onPress={() => navigateContent("Artists", ["artist"])}
        />
        <ListPreview
          title="Most Recent Albums"
          user={user}
          content={content}
          data={reviews["album"]}
          onPress={() => navigateContent("Albums", ["album"])}
        />
        <ListPreview
          title="Most Recent Songs"
          user={user}
          content={content}
          data={reviews["track"]}
          onPress={() => navigateContent("Songs", ["track"])}
          marginBottom={10}
        />
      </ScrollView>
    </View>
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
