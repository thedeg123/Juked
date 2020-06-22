import React, { useState, useContext, useEffect, useRef } from "react";
import {
  StyleSheet,
  FlatList,
  View,
  RefreshControl,
  ActivityIndicator
} from "react-native";
import context from "../context/context";
import HomeScreenItem from "../components/HomeScreenComponents/HomeScreenItem";
import LoadingIndicator from "../components/LoadingIndicator";

import ModalButton from "../components/ModalCards/ModalButton";
import ModalHomeCard from "../components/ModalCards/ModalHomeCard";

const HomeScreen = ({ navigation }) => {
  const [showModal, setShowModal] = useState(false);
  const [reviews, setReviews] = useState(null);
  const [content, setContent] = useState(null);
  const [authors, setAuthors] = useState(null);
  const [following, setFollowing] = useState(null);
  const [userShow, setUserShow] = useState(null);
  const [contentTypes, setContentTypes] = useState(
    new Set(["track", "album", "artist"])
  );
  const [ratingTypes, setRatingTypes] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { firestore, useMusic } = useContext(context);
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
      .getFollowing(firestore.fetchCurrentUID())
      .then(res => firestore.batchAuthorRequest(res))
      .then(res => setFollowing(res));

  const fetchHomeScreenData = async (limit = 20, start_after = null) => {
    const [local_reviews, start_next] = userShow
      ? await firestore.getReviewsByAuthorType(
          userShow,
          Array.from(contentTypes),
          limit,
          ratingTypes,
          start_after
        )
      : await firestore.getReviewsByType(
          Array.from(contentTypes),
          limit,
          ratingTypes,
          start_after
        );
    if (!local_reviews.length) {
      return setAllowRefresh(false);
    }
    setStartAfter(start_next);
    let cid_byType = { track: new Set(), album: new Set(), artist: new Set() };
    local_reviews.forEach(r => cid_byType[r.data.type].add(r.data.content_id));
    let temp_content = content ? content : {};
    for (let [type, cids] of Object.entries(cid_byType)) {
      cids = Array.from(cids);
      if (!cids.length) continue;
      await useMusic
        .findContent(cids, type)
        .then(result => result.forEach(el => (temp_content[el.id] = el)));
    }
    setContent(temp_content);
    temp_authors = authors ? authors : {};
    await firestore
      .batchAuthorRequest([
        ...new Set(
          local_reviews
            .map(review => review.data.author)
            .filter(uid => temp_authors[uid] === undefined)
        )
      ])
      .then(res => res.forEach(r => (temp_authors[r.id] = r.data)));
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

  if (!content || !reviews || !authors || !following)
    return <LoadingIndicator></LoadingIndicator>;
  return (
    <View style={{ flex: 1, marginHorizontal: 5 }}>
      <FlatList
        ref={flatListRef}
        contentContainerStyle={{ paddingBottom: 85 }}
        keyExtractor={reviewItem =>
          reviewItem.data.last_modified + reviewItem.id
        }
        data={reviews}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          return content[item.data.content_id] && authors[item.data.author] ? ( //for when we have fetched new reviews but not finished fetching new content //we dont want our content/authors to be undefined, so we skip and wait to finish the fetch
            <HomeScreenItem
              review={item}
              content={content[item.data.content_id]}
              author={authors[item.data.author]}
            ></HomeScreenItem>
          ) : null;
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
              <ActivityIndicator size="small"></ActivityIndicator>
            </View>
          )
        }
      ></FlatList>
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
        contentTypes={contentTypes}
        ratingTypes={ratingTypes}
        setRatingTypes={setRatingTypes}
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

const styles = StyleSheet.create({});
export default HomeScreen;
