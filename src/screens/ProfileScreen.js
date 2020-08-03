import React, { useEffect, useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ScrollView
} from "react-native";
import colors from "../constants/colors";
import UserListItem from "../components/UserPreview";
import ListPreview from "../components/ListPreview";
import context from "../context/context";
import images from "../constants/images";
import FollowButton from "../components/FollowButton";
import BarGraph from "../components/Graphs/BarGraph";
import firebase from "firebase";
import "firebase/firestore";
import ModalProfileCard from "../components/ModalCards/ModalProfileCard";
import ModalButton from "../components/ModalCards/ModalButton";
import HomeScreenItem from "../components/HomeScreenComponents/HomeScreenItem";
import UserPreview from "../components/HomeScreenComponents/UserPreview";
import OptionBar from "../components/OptionBar";
import { profileButtonOptions } from "../constants/buttonOptions";
import LoadingPage from "../components/Loading/LoadingPage";
import HomeScreenListItem from "../components/HomeScreenComponents/HomeScreenListItem";
import ListenListButton from "../components/ProfileScreen/ListenListButton";

const UserProfileScreen = ({ navigation }) => {
  const { firestore, disconnect } = useContext(context);
  const firestoreConcurrent = firebase.firestore();
  const uid = navigation.getParam("uid") || firestore.fetchCurrentUID();
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [followsYou, setFollowsYou] = useState(null);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [userFollowing, setUserFollowing] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [remover, setRemover] = useState(null);
  const [graphType, setGraphType] = useState(profileButtonOptions[0].type);
  const [personalListenList, setPersonalListenList] = useState(null);

  const updateFollow = async () => {
    firestore
      .followingRelationExists(uid, firestore.fetchCurrentUID())
      .then(res => setFollowsYou(res));
    return firestore
      .followingRelationExists(firestore.fetchCurrentUID(), uid)
      .then(res => setUserFollowing(res));
  };

  const graphDataContentSelector = graphType => {
    switch (graphType) {
      case "all":
        return user.review_data;
      case "track":
        return user.review_data_songs;
      case "album":
        return user.review_data_albums;
      case "artist":
        return user.review_data_artists;
      default:
        return;
    }
  };

  const fetch = async () => {
    if (!uid) uid = firestore.fetchCurrentUID();
    const reviews = {
      track: await firestore
        .getReviewsByAuthorType(uid, ["track_review", "track_rating"], 5)
        .then(res => res[0]),
      album: await firestore
        .getReviewsByAuthorType(uid, ["album_review", "album_rating"], 5)
        .then(res => res[0]),
      artist: await firestore
        .getReviewsByAuthorType(uid, ["artist_review", "artist_rating"], 5)
        .then(res => res[0]),
      list: await firestore
        .getReviewsByAuthorType(uid, ["list"], 5)
        .then(res => res[0])
    };
    setPersonalListenList(await firestore.getPersonalListenlist(uid));
    setReviews(reviews);
    updateFollow();
  };

  useEffect(() => {
    navigation.setParams({ setShowModal: setShowProfileCard });
    const local_remover = firestoreConcurrent
      .collection("users")
      .doc(uid)
      .onSnapshot(res => setUser(res.data()));
    setRemover(() => async () => await local_remover());
    fetch();
    return () => (local_remover ? local_remover() : null);
  }, []);

  const navigateFollow = (title, follow) =>
    navigation.push("List", {
      title,
      fetchData: async (limit, start_after) => {
        const res = await firestore.batchAuthorRequest(follow, false, false);
        return [res];
      },
      renderItem: ({ item }) => <UserListItem user={item.data} />,
      keyExtractor: item => item.id,
      notPaginated: true
    });

  const navigateContent = (title, types) => {
    return navigation.push("List", {
      title,
      fetchData: async (limit, start_after) => {
        const [reviews, start_next] = await firestore.getReviewsByAuthorType(
          uid,
          types,
          limit,
          start_after
        );
        if (!reviews.length) return [[], null];
        return [reviews, start_next];
      },
      renderItem: ({ item }) =>
        types[0] === "list" ? (
          <HomeScreenListItem list={item} author={user}></HomeScreenListItem>
        ) : (
          <HomeScreenItem
            review={item}
            content={item.data.content}
            author={user}
          ></HomeScreenItem>
        ),
      keyExtractor: item => item.id + item.content_id
    });
  };
  if (
    !user ||
    !reviews ||
    !personalListenList ||
    typeof followsYou !== "boolean" ||
    typeof userFollowing !== "boolean"
  ) {
    return <LoadingPage></LoadingPage>;
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
              await fetch();
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
            size={80}
            color={colors.text}
            fontScaler={0.2}
            allowPress={false}
          ></UserPreview>
          <View style={styles.followContainer}>
            {firestore.fetchCurrentUID() === uid ? null : (
              <FollowButton
                following={userFollowing}
                followsYou={followsYou}
                onPress={() =>
                  userFollowing
                    ? firestore.unfollowUser(uid).then(() => updateFollow())
                    : firestore.followUser(uid).then(() => updateFollow())
                }
              ></FollowButton>
            )}
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
          </View>
        </View>
        <View style={{ marginHorizontal: 10, marginBottom: 10 }}>
          {user.bio ? (
            <Text style={styles.bioStyle}>{user.bio}</Text>
          ) : uid === firestore.fetchCurrentUID() ? (
            <Text style={styles.bioStyle}>
              Add a bio from the Account screen
            </Text>
          ) : null}
        </View>
        <OptionBar
          options={profileButtonOptions}
          searchType={graphType}
          containerStyle={{ marginHorizontal: 5, marginTop: 5 }}
          onPress={setGraphType}
        ></OptionBar>

        <View style={{ marginTop: 10, marginHorizontal: 10 }}>
          <BarGraph data={graphDataContentSelector(graphType)} />
        </View>
        <View
          style={{
            marginTop: 10,
            flexDirection: "row",
            justifyContent: "space-evenly"
          }}
        >
          <ListenListButton
            count={
              graphType !== "all"
                ? personalListenList.items.filter(
                    item => item.content.type === graphType
                  ).length
                : personalListenList.items.length
            }
            type_of_interest={graphType}
            user={user}
            personal
          />
          <ListenListButton
            count={
              graphType === "all"
                ? personalListenList.incoming_item_count
                : graphType === "song"
                ? personalListenList.incoming_item_count_track
                : graphType === "album"
                ? personalListenList.incoming_item_count_album
                : personalListenList.incoming_item_count_artist
            }
            type_of_interest={graphType}
            user={user}
          />
        </View>
        {"all" === graphType &&
        (reviews["list"].length || uid === firestore.fetchCurrentUID()) ? (
          <ListPreview
            title="Most Recent Lists"
            user={user}
            data={reviews["list"]}
            onPress={() => navigateContent("Lists", ["list"])}
            showAddListButton={uid === firestore.fetchCurrentUID()}
            showListItems
          />
        ) : null}
        {reviews["artist"].length && ["all", "artist"].includes(graphType) ? (
          <ListPreview
            title="Most Recent Artists"
            user={user}
            data={reviews["artist"]}
            onPress={() =>
              navigateContent("Artists", ["artist_review", "artist_rating"])
            }
          />
        ) : null}
        {reviews["album"].length && ["all", "album"].includes(graphType) ? (
          <ListPreview
            title="Most Recent Albums"
            user={user}
            data={reviews["album"]}
            onPress={() =>
              navigateContent("Albums", ["album_review", "album_rating"])
            }
          />
        ) : null}
        {reviews["track"].length && ["all", "track"].includes(graphType) ? (
          <ListPreview
            title="Most Recent Songs"
            user={user}
            data={reviews["track"]}
            onPress={() =>
              navigateContent("Songs", ["track_review", "track_rating"])
            }
            marginBottom={10}
          />
        ) : null}
      </ScrollView>
      <ModalProfileCard
        showModal={showProfileCard}
        onSignOut={async () => {
          remover ? await remover() : null;
          await disconnect();
          firestore.signout();
        }}
        onEdit={() => {
          setShowProfileCard(false);
          navigation.navigate("Account", { user });
        }}
        setShowModal={setShowProfileCard}
        content={[]}
        setShowHighlightedTrackCard={null}
      ></ModalProfileCard>
    </View>
  ) : null;
};

UserProfileScreen.navigationOptions = ({ navigation }) => {
  const setShowModal = navigation.getParam("setShowModal");
  const uid = navigation.getParam("uid");
  return {
    headerRight: () =>
      uid ? null : (
        <ModalButton
          settingType={true}
          setShowModal={setShowModal}
        ></ModalButton>
      )
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
    justifyContent: "space-evenly",
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
  handleStyle: {
    fontSize: 25,
    alignSelf: "center",
    color: colors.text
  },
  numberStyle: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
    justifyContent: "space-evenly"
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
  reviewTitleStyle: {
    fontSize: 30,
    color: colors.text,
    fontWeight: "bold"
  }
});

export default UserProfileScreen;
