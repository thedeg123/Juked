import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, FlatList, View, RefreshControl } from "react-native";
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

  // if yk sql, this is what were doing here:
  // select * from (select * from (select content_id from Reviews sortby last_modified limit 1)
  // groupby type theta join type==content_id on (select * from Music)) natural join Users;
  // except harder bc Music is from a different dbs ;)
  const fetchFollowing = () =>
    setFollowing(
      firestore
        .getFollowing(firestore.fetchCurrentUID())
        .then(res => firestore.batchAuthorRequest(res))
    );

  const fetchHomeScreenData = async (limit = 20) => {
    const reviews = userShow
      ? await firestore.getReviewsByAuthorType(
          userShow,
          Array.from(contentTypes),
          limit,
          ratingTypes
        )
      : await firestore.getReviewsByType(
          Array.from(contentTypes),
          limit,
          ratingTypes
        );

    let cid_byType = { track: new Set(), album: new Set(), artist: new Set() };
    reviews.forEach(r => {
      return cid_byType[r.data.type].add(r.data.content_id);
    });
    let temp_content = {};
    for (let [type, cids] of Object.entries(cid_byType)) {
      cids = Array.from(cids);
      if (!cids.length) continue;
      await useMusic
        .findContent(cids, type)
        .then(result => result.forEach(el => (temp_content[el.id] = el)));
    }
    setContent(temp_content);

    firestore
      .batchAuthorRequest([
        ...new Set(reviews.map(review => review.data.author))
      ])
      .then(res => {
        let ret = {};
        res.forEach(r => (ret[r.id] = r.data));
        return ret;
      })
      .then(res => setAuthors(res));
    return setReviews(
      reviews.sort((a, b) => b.last_modified - a.last_modified)
    );
  };

  useEffect(() => {
    navigation.setParams({ setShowModal });
    fetchFollowing();
    fetchHomeScreenData(10);
  }, []);

  if (!content || !reviews || !authors || !following)
    return <LoadingIndicator></LoadingIndicator>;

  return (
    <View style={{ flex: 1, marginHorizontal: 5 }}>
      <FlatList
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
              await fetchHomeScreenData(10);
              await fetchFollowing();
              return setRefreshing(false);
            }}
          />
        }
      ></FlatList>
      <ModalHomeCard
        showModal={showModal}
        setShowModal={setShowModal}
        refreshData={() => fetchHomeScreenData(10)}
        contentTypes={contentTypes}
        ratingTypes={ratingTypes}
        setRatingTypes={setRatingTypes}
        following={following}
        userShow={userShow}
        setUserShow={val => {
          navigation.setParams({ userStream: val ? val.data.handle : null });
          setUserShow(val ? val.id : null);
        }}
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
