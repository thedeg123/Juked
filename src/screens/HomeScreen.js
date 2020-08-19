import React, { useState, useContext, useEffect, useRef } from "react";
import { StyleSheet, Text, View, RefreshControl } from "react-native";
import { FlatList } from "react-navigation";
import context from "../context/context";
import HomeScreenItem from "../components/HomeScreenComponents/HomeScreenItem";
import LoadingPage from "../components/Loading/LoadingPage";
import { paddingBottom } from "../constants/heights";
import ModalButton from "../components/ModalCards/ModalButton";
import ModalHomeCard from "../components/ModalCards/ModalHomeCard";
import HomeScreenListItem from "../components/HomeScreenComponents/HomeScreenListItem";
import LoadingIndicator from "../components/Loading/LoadingIndicator";
import colors from "../constants/colors";
import Logo from "../components/Logo";

const HomeScreen = ({ navigation }) => {
  const [showModal, setShowModal] = useState(false);
  const [reviews, setReviews] = useState("waiting");
  const [authors, setAuthors] = useState("waiting");
  const [userShow, setUserShow] = useState(null);
  const [filterTypes, setFilterTypes] = useState(
    new Set([
      "track_review",
      "album_review",
      "artist_review",
      "track_rating",
      "album_rating",
      "artist_rating",
      "list"
    ])
  );

  const [refreshing, setRefreshing] = useState(false);
  const [loadingNext, setLoadingNext] = useState(false);
  const [allowLoad, setAllowLoad] = useState(true);

  const [startAfter, setStartAfter] = useState(null);

  const { firestore, useMusic } = useContext(context);
  const [changed, setChanged] = useState(false);
  const flatListRef = useRef();

  const fetchFollowing = async () =>
    await firestore.getUserFollowingObjects(firestore.fetchCurrentUID());

  const fetchHomeScreenData = async (limit = 20, reset_refresh = false) => {
    if (refreshing || loadingNext || (!allowLoad && !reset_refresh)) return;
    const start_after = reset_refresh ? null : startAfter;
    if (reset_refresh) {
      setAllowLoad(true);
      setRefreshing(true);
    } else {
      setLoadingNext(true);
    }

    const [local_reviews, start_next] = userShow
      ? await firestore.getReviewsByAuthorType(
          userShow,
          Array.from(filterTypes),
          limit,
          start_after
        )
      : await firestore.getReviewsByType(
          Array.from(filterTypes),
          limit,
          start_after
        );

    let local_authors = await firestore.batchAuthorRequest(
      local_reviews.map(review => review.data.author)
    );

    if (local_reviews.length < limit) setAllowLoad(false);

    if (reset_refresh) {
      setReviews(local_reviews);
      setAuthors(local_authors);
    } else {
      setReviews([...reviews, ...local_reviews]);
      setAuthors({ ...authors, ...local_authors });
    }
    setStartAfter(start_next);

    return reset_refresh ? setRefreshing(false) : setLoadingNext(false);
  };

  useEffect(() => {
    navigation.setParams({ setShowModal });
    fetchHomeScreenData(15, true);
    firestore.registerForPushNotifications();
    // Alert.alert(
    //   "Welcome to the Juked Beta!",
    //   `Remember this is for testing purposes only. All beta accounts will likely be deleted prior to launch. Have fun!`
    // );
  }, []);

  if (reviews === "waiting" || authors === "waiting") return <LoadingPage />;
  return (
    <View style={{ flex: 1 }}>
      {reviews && reviews.length ? (
        <FlatList
          ref={flatListRef}
          contentContainerStyle={{ paddingBottom }}
          keyExtractor={reviewItem =>
            reviewItem.data.last_modified + reviewItem.id
          }
          data={reviews}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            return (
              authors[item.data.author] && //we dont want our authors to be undefined, so we skip and wait to finish the fetch
              (item.data.type === "list" ? (
                <HomeScreenListItem
                  list={item}
                  author={authors[item.data.author]}
                ></HomeScreenListItem>
              ) : (
                <HomeScreenItem
                  review={item}
                  content={item.data.content}
                  author={authors[item.data.author]}
                ></HomeScreenItem>
              ))
            );
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={async () => {
                return await fetchHomeScreenData(15, true);
              }}
            />
          }
          onEndReached={async ({ distanceFromEnd }) => {
            if (distanceFromEnd >= 0) {
              await fetchHomeScreenData(15);
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            loadingNext && (
              <View style={{ padding: 20 }}>
                <LoadingIndicator />
              </View>
            )
          }
        />
      ) : (
        <View style={{ justifyContent: "center", flex: 1 }}>
          <Text style={styles.emptyTextStyle}>
            No Results Match your current filters
          </Text>
        </View>
      )}
      <ModalHomeCard
        showModal={showModal}
        setShowModal={setShowModal}
        refreshData={() => {
          if (changed) {
            if (flatListRef.current)
              flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
            fetchHomeScreenData(15, true);
          }
        }}
        filterTypes={filterTypes}
        setFilterTypes={setFilterTypes}
        fetchFollowing={fetchFollowing}
        userShow={userShow}
        setUserShow={user => {
          navigation.setParams({
            userStream: !user
              ? null
              : user.data
              ? user.data.handle
              : user.handle
          });
          setUserShow(!user ? null : user.id || user.email);
        }}
        setChanged={setChanged}
      ></ModalHomeCard>
    </View>
  );
};
HomeScreen.navigationOptions = ({ navigation }) => {
  const setShowModal = navigation.getParam("setShowModal");
  const handle = navigation.getParam("userStream");
  return {
    headerComponent: handle ? null : <Logo />,
    title: handle ? `${handle}'s Stream` : "",
    headerRight: () => <ModalButton setShowModal={setShowModal}></ModalButton>
  };
};

const styles = StyleSheet.create({
  emptyTextStyle: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
    color: colors.secondary
  }
});
export default HomeScreen;
