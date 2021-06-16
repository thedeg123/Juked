import React, { useEffect, useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl
} from "react-native";
import { ScrollView } from "react-navigation";
import colors from "../constants/colors";
import UserListItem from "../components/UserPreview";
import ListPreview from "../components/ListPreview";
import context from "../context/context";
import images from "../constants/images";
import { paddingBottom } from "../constants/heights";
import FollowButton from "../components/FollowButton";
import BarGraph from "../components/Graphs/BarGraph";
import firebase from "firebase";
import "firebase/firestore";
import ModalProfileCard from "../components/ModalCards/ModalProfileCard";
import ModalBlockCard from "../components/ModalCards/ModalBlockCard";
import ModalButton from "../components/ModalCards/ModalButton";
import HomeScreenItem from "../components/HomeScreenComponents/HomeScreenItem";
import UserPreview from "../components/HomeScreenComponents/UserPreview";
import OptionBar from "../components/OptionBar";
import { profileButtonOptions } from "../constants/buttonOptions";
import LoadingPage from "../components/Loading/LoadingPage";
import HomeScreenListItem from "../components/HomeScreenComponents/HomeScreenListItem";
import ListenListButton from "../components/ProfileScreen/ListenListButton";
import BlockView from "../components/BlockView";

const UserProfileScreen = ({ navigation }) => {
  const { firestore, useMusic, disconnect } = useContext(context);
  const uid = navigation.getParam("uid") || firestore.fetchCurrentUID();
  const [user, setUser] = useState(null);
  const [followsYou, setFollowsYou] = useState(null);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [userFollowing, setUserFollowing] = useState(null);
  const [removers, setRemovers] = useState([]);
  const [userIsBlocked, setUserIsBlocked] = useState(false);
  const [viewerIsBlocked, setViewerIsBlocked] = useState(false);
  const [graphType, setGraphType] = useState(profileButtonOptions[0].type);
  const [personalListenList, setPersonalListenList] = useState(null);

  const [lists, setLists] = useState([]);
  const [trackReviews, setTrackReviews] = useState([]);
  const [albumReviews, setAlbumReviews] = useState([]);
  const [artistReviews, setArtistReviews] = useState([]);

  const [refreshing, setRefreshing] = useState(false);

  const [scrollEnabled, setScrollEnabled] = useState(true);

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

  const reviewTypeSelector = type => {
    switch (type) {
      case "list":
        return lists;
      case "track":
        return trackReviews;
      case "album":
        return albumReviews;
      case "artist":
        return artistReviews;
      default:
        return [];
    }
  };

  const fetchPersonalList = async () => {
    return await firestore
      .getPersonalListenlist(uid)
      .then(res => setPersonalListenList(res));
  };

  const init = () => {
    setUserIsBlocked(firestore.currentUserHasBlocked(uid));
    setViewerIsBlocked(firestore.currentUserIsBlocked(uid));

    fetchPersonalList();

    updateFollow();

    const track_remover = firestore.listenToReviewsByAuthorType(
      uid,
      ["track_review", "track_rating"],
      5,
      setTrackReviews
    );
    const album_remover = firestore.listenToReviewsByAuthorType(
      uid,
      ["album_review", "album_rating"],
      5,
      setAlbumReviews
    );
    const artist_remover = firestore.listenToReviewsByAuthorType(
      uid,
      ["artist_review", "artist_rating"],
      5,
      setArtistReviews
    );
    const list_remover = firestore.listenToReviewsByAuthorType(
      uid,
      ["list"],
      5,
      setLists
    );
    return [track_remover, album_remover, artist_remover, list_remover];
  };

  const onSignOut = async () => {
    useMusic.stopContent();
    clearRemovers();
    await disconnect();
    firestore.signout();
  };

  const clearRemovers = () => {
    removers.forEach(remover => (remover ? remover() : null));
  };

  useEffect(() => {
    const firestoreConcurrent = firebase.firestore();
    const removers = init();

    navigation.setParams({ setShowModal: setShowProfileCard });

    const local_remover = firestoreConcurrent
      .collection("users")
      .doc(uid)
      .onSnapshot(res => setUser(res.data()));

    removers.push(local_remover);

    setRemovers(removers);
    return () => clearRemovers();
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
    !personalListenList ||
    typeof followsYou !== "boolean" ||
    typeof userFollowing !== "boolean"
  ) {
    return <LoadingPage></LoadingPage>;
  }
  return user ? (
    <View style={{ flex: 1 }}>
      {userIsBlocked || viewerIsBlocked ? (
        <BlockView userBlocked={userIsBlocked} />
      ) : (
        <ScrollView
          scrollEnabled={scrollEnabled}
          style={styles.containerStyle}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={async () => {
                setRefreshing(true);
                await fetchPersonalList();
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
                  disabled={!user.num_follower}
                  onPress={async () =>
                    navigateFollow(
                      "Followers",
                      await firestore.getFollowers(uid)
                    )
                  }
                >
                  <Text style={styles.followStyle}>
                    {user.num_follower} Follower
                    {user.num_follower === 1 ? "" : "s"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={!user.num_following}
                  onPress={async () =>
                    navigateFollow(
                      "Following",
                      await firestore.getFollowing(uid)
                    )
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
            <BarGraph
              data={graphDataContentSelector(graphType)}
              setScrollEnabled={setScrollEnabled}
            />
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
              count={personalListenList.incoming_item_count}
              type_of_interest={"all"}
              user={user}
            />
          </View>
          {"all" === graphType &&
          (reviewTypeSelector("list").length ||
            uid === firestore.fetchCurrentUID()) ? (
            <ListPreview
              title="Most Recent Lists"
              user={user}
              data={reviewTypeSelector("list")}
              onPress={() => navigateContent("Lists", ["list"])}
              showAddListButton={uid === firestore.fetchCurrentUID()}
              showListItems
            />
          ) : null}
          {reviewTypeSelector("track").length &&
          ["all", "track"].includes(graphType) ? (
            <ListPreview
              title="Most Recent Songs"
              user={user}
              data={reviewTypeSelector("track")}
              onPress={() =>
                navigateContent("Songs", ["track_review", "track_rating"])
              }
              marginBottom={10}
            />
          ) : null}
          {reviewTypeSelector("album").length &&
          ["all", "album"].includes(graphType) ? (
            <ListPreview
              title="Most Recent Albums"
              user={user}
              data={reviewTypeSelector("album")}
              onPress={() =>
                navigateContent("Albums", ["album_review", "album_rating"])
              }
            />
          ) : null}
          {reviewTypeSelector("artist").length &&
          ["all", "artist"].includes(graphType) ? (
            <ListPreview
              title="Most Recent Artists"
              user={user}
              data={reviewTypeSelector("artist")}
              onPress={() =>
                navigateContent("Artists", ["artist_review", "artist_rating"])
              }
            />
          ) : null}
        </ScrollView>
      )}
      {firestore.fetchCurrentUID() === uid ? (
        <ModalProfileCard
          showModal={showProfileCard}
          onSignOut={onSignOut}
          onEdit={() => {
            setShowProfileCard(false);
            navigation.navigate("Account", { user });
          }}
          setShowModal={setShowProfileCard}
        ></ModalProfileCard>
      ) : (
        <ModalBlockCard
          showModal={showProfileCard}
          setShowModal={setShowProfileCard}
          isBlocked={userIsBlocked}
          onBlock={() => {
            console.log(userIsBlocked);
            userIsBlocked
              ? firestore.unblockUser(uid)
              : firestore.blockUser(uid);
            setUserIsBlocked(!userIsBlocked);
          }}
        />
      )}
    </View>
  ) : null;
};

UserProfileScreen.navigationOptions = ({ navigation }) => {
  const setShowModal = navigation.getParam("setShowModal");
  return {
    headerRight: () => (
      <ModalButton settingType={false} setShowModal={setShowModal} />
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
