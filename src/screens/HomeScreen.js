import React, { useState, useContext, useEffect, useRef } from "react";
import { StyleSheet, FlatList, Text, View, RefreshControl } from "react-native";
import context from "../context/context";
import HomeScreenItem from "../components/HomeScreenComponents/HomeScreenItem";
import LoadingPage from "../components/Loading/LoadingPage";

import ModalButton from "../components/ModalCards/ModalButton";
import ModalHomeCard from "../components/ModalCards/ModalHomeCard";
import HomeScreenListItem from "../components/HomeScreenComponents/HomeScreenListItem";
import LoadingIndicator from "../components/Loading/LoadingIndicator";
import colors from "../constants/colors";

const HomeScreen = ({ navigation }) => {
  const [showModal, setShowModal] = useState(false);
  const [reviews, setReviews] = useState("waiting");
  const [authors, setAuthors] = useState("waiting");
  const [following, setFollowing] = useState("waiting");
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
  const { firestore } = useContext(context);
  const [startAfter, setStartAfter] = useState(null);
  const [allowRefresh, setAllowRefresh] = useState(true);
  const [changed, setChanged] = useState(false);
  const flatListRef = useRef();

  // if yk sql, this is what were doing here:
  // select * from (select * from (select content_id from Reviews sortby last_modified limit 1)
  // groupby type theta join type==content_id on (select * from Music)) natural join Users;
  // except harder bc Music is from a different dbs ;)
  const fetchFollowing = () =>
    firestore
      .getUserFollowingObjects(firestore.fetchCurrentUID())
      .then(res => setFollowing(res));

  const fetchHomeScreenData = async (limit = 20, start_after = null) => {
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
    if (!local_reviews.length && start_after) return setAllowRefresh(false);
    setStartAfter(start_next);
    let temp_authors = await firestore.batchAuthorRequest(
      local_reviews.map(review => review.data.author)
    );
    setAuthors(temp_authors);
    return reviews && start_after
      ? setReviews([...reviews, ...local_reviews])
      : setReviews(local_reviews);
  };

  useEffect(() => {
    navigation.setParams({ setShowModal });
    fetchFollowing();
    fetchHomeScreenData(10, null);
  }, []);
  if (reviews === "waiting" || authors === "waiting" || following === "waiting")
    return <LoadingPage />;
  return (
    <View style={{ flex: 1 }}>
      {!reviews ? null : reviews.length ? null : (
        <View style={{ justifyContent: "center", flex: 1 }}>
          <Text style={styles.emptyTextStyle}>
            No Results Match your current filters
          </Text>
        </View>
      )}
      <FlatList
        ref={flatListRef}
        contentContainerStyle={{ paddingBottom: 85 }}
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
              setRefreshing(true);
              setAllowRefresh(true);
              await fetchHomeScreenData(10, null);
              await fetchFollowing();
              return setRefreshing(false);
            }}
          />
        }
        onEndReached={async () => {
          if (!allowRefresh || reviews.length < 10) return;
          setRefreshing(true);
          await fetchHomeScreenData(10, startAfter);
          setRefreshing(false);
        }}
        onEndReachedThreshold={0.5}
        initialNumToRender={10}
        ListFooterComponent={() =>
          refreshing &&
          reviews.length > 9 && (
            <View style={{ padding: 20 }}>
              <LoadingIndicator />
            </View>
          )
        }
      />
      <ModalHomeCard
        showModal={showModal}
        setShowModal={setShowModal}
        refreshData={() => {
          if (changed) {
            setChanged(false);
            setReviews(null);
            flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
            setAllowRefresh(true);
            setStartAfter(null);
            fetchHomeScreenData(10, null);
          }
        }}
        filterTypes={filterTypes}
        setFilterTypes={setFilterTypes}
        following={following}
        userShow={userShow}
        setUserShow={val => {
          navigation.setParams({ userStream: val ? val.data.handle : null });
          setUserShow(val ? val.id : null);
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
    title: handle ? `${handle}'s Stream` : "Stream",
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
