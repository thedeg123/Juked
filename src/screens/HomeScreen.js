import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, FlatList, RefreshControl } from "react-native";
import useMusic from "../hooks/useMusic";
import context from "../context/context";

import Container from "../components/Container";
import ButtonFilter from "../components/HomeScreenComponents/ButtonFilter";
import HomeScreenItem from "../components/HomeScreenComponents/HomeScreenItem";
import simplifyContent from "../helpers/simplifyContent";
import LoadingIndicator from "../components/LoadingIndicator";

const HomeScreen = ({ navigation }) => {
  const [Tab1, Tab2] = ["All", "Following"];
  const [filter, setFilter] = useState(Tab1);
  const [reviews, setReviews] = useState(null);
  const [content, setContent] = useState(null);
  const [authors, setAuthors] = useState(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const { findContent } = useMusic();
  let firestore = useContext(context);
  // if yk sql, this is what were doing here:
  // select * from (select * from (select content_id from Reviews sortby last_modified limit 1)
  // groupby type theta join type==content_id on (select * from Music)) natural join Users;
  // except harder bc Music is from a different dbs ;)
  const fetchHomeScreenData = async (limit = 20, filter) => {
    const reviews =
      filter === "Following"
        ? await firestore.getMostRecentReviews(limit)
        : await firestore.getMostRecentReviews(limit);
    let cid_byType = { track: new Set(), album: new Set(), artist: new Set() };
    reviews.forEach(r => {
      return cid_byType[r.review.type].add(r.review.content_id);
    });
    let temp_content = {};
    for (let [type, cids] of Object.entries(cid_byType)) {
      cids = Array.from(cids);
      if (!cids.length) continue;
      await findContent(cids, type).then(result =>
        result.forEach(el => (temp_content[el.id] = simplifyContent(el, type)))
      );
    }
    setContent(temp_content);
    setAuthors(
      await firestore
        .batchAuthorRequest(reviews.map(review => review.review.author))
        .then(res => {
          let ret = {};
          res.forEach(r => (ret[r.id] = r.data));
          return ret;
        })
    );
    return setReviews(
      reviews.sort((a, b) => b.last_modified - a.last_modified)
    );
  };
  useEffect(() => {
    fetchHomeScreenData(10, filter);
    const listener = navigation.addListener("didFocus", () => {
      return fetchHomeScreenData(10, filter);
    }); //any time we return to this screen we do another fetch
    return () => listener.remove();
  }, []);
  return (
    <Container>
      <ButtonFilter
        options={[Tab1, Tab2]}
        onPress={update => {
          fetchHomeScreenData(10, update);
          return setFilter(update);
        }}
      />
      {content && reviews && authors ? (
        <FlatList
          keyExtractor={reviewItem =>
            reviewItem.review.last_modified + reviewItem.id
          }
          data={reviews}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            return content[item.review.content_id] && //for when we have fetched new reviews but not finished fetching new content
              authors[item.review.author] ? ( //we dont want our content/authors to be undefined, so we skip and wait to finish the fetch
              <HomeScreenItem
                review={{ ...item.review, rid: item.id }}
                content={content[item.review.content_id]}
                author={authors[item.review.author]}
              ></HomeScreenItem>
            ) : null;
          }}
          refreshControl={
            <RefreshControl
              colors={["red", "blue"]}
              refreshing={refreshing}
              onRefresh={async () => {
                setRefreshing(true);
                await fetchHomeScreenData(10);
                return setRefreshing(false);
              }}
            />
          }
        ></FlatList>
      ) : (
        <LoadingIndicator></LoadingIndicator>
      )}
    </Container>
  );
};

HomeScreen.navigationOptions = () => {
  return {
    title: "Stream"
  };
};

const styles = StyleSheet.create({});
export default HomeScreen;
