import React, { useState, useEffect } from "react";
import { StyleSheet, FlatList } from "react-native";
import Container from "../components/Container";
import ButtonFilter from "../components/HomeScreenComponents/ButtonFilter";
import HomeScreenItem from "../components/HomeScreenComponents/HomeScreenItem";
import useMusic from "../hooks/useMusic";
import simplifyContent from "../helpers/simplifyContent";
import LoadingIndicator from "../components/LoadingIndicator";
import useFiresore from "../hooks/useFirestore";
const HomeScreen = ({ navigation }) => {
  const [Tab1, Tab2] = ["All", "Friends"];
  const [filter, setFilter] = useState(Tab1);
  const [reviews, setReviews] = useState(null);
  const [content, setContent] = useState(null);
  const [authors, setAuthors] = useState(null);
  const { findContent } = useMusic();
  let firestore = new useFiresore();
  // if yk sql, this is what were doing here:
  // select * from (select * from (select content_id from Reviews sortby last_modified limit 1)
  // groupby type theta join type==content_id on (select * from Music)) natural join Users;
  // except harder bc Music is from a different dbs ;)
  const fetchHomeScreenData = async (limit = 20) => {
    const reviews = await firestore.getMostRecentReviews(limit);
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
    setReviews(reviews.sort((a, b) => b.last_modified - a.last_modified));
  };
  useEffect(() => {
    fetchHomeScreenData(5);
    const listener = navigation.addListener("didFocus", () =>
      fetchHomeScreenData(5)
    ); //any time we return to this screen we do another fetch
    return () => listener.remove();
  }, []);
  return (
    <Container>
      <ButtonFilter options={[Tab1, Tab2]} setSelected={setFilter} />
      {content && reviews && authors ? (
        <FlatList
          keyExtractor={reviewItem =>
            reviewItem.review.last_modified + reviewItem.id
          }
          data={reviews}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            return (
              <HomeScreenItem
                review={{ ...item.review, rid: item.id }}
                content={content[item.review.content_id]}
                author={authors[item.review.author]}
              ></HomeScreenItem>
            );
          }}
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
