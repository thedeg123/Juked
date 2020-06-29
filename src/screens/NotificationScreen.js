import React, { useEffect, useContext, useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  RefreshControl,
  ActivityIndicator
} from "react-native";
import colors from "../constants/colors";
import OptionBar from "../components/OptionBar";
import LikeItem from "../components/NotificationScreenComponents/LikeItem";
import CommentItem from "../components/NotificationScreenComponents/CommentItem";
import FollowItem from "../components/NotificationScreenComponents/FollowItem";
import { notificationButtonOptions } from "../constants/buttonOptions";
import context from "../context/context";

const NotificationScreen = ({ navigation }) => {
  const { firestore } = useContext(context);
  const [currentUser, setCurrentUser] = useState(null);
  const initialTab = notificationButtonOptions[0].type;
  const [filterType, setFilterType] = useState(initialTab);
  const [users, setUsers] = useState({});
  const [content, setContent] = useState({
    likes: [],
    comments: [],
    follows: []
  });
  const [refreshing, setRefreshing] = useState(false);
  const [loadingNext, setLoadingNext] = useState(false);
  const [paginationItems, setPaginationItems] = useState({
    likes: null,
    comments: null,
    follows: null
  });
  const [allowLoad, setAllowLoad] = useState({
    likes: true,
    comments: true,
    follows: true
  });

  const fetchUser = async ids => {
    if (!ids.length) return;
    const toFetch = [];
    ids.forEach(id => !users[id] && toFetch.push(id));
    const ret_users = await firestore.batchAuthorRequest(toFetch);
    return ret_users.forEach(user => (users[user.id] = user.data));
  };

  const fetchDataCheck = async (
    filterType,
    startAfter,
    resetRefresh = false
  ) => {
    let likes, comments, follows, paginator;
    if (resetRefresh) allowLoad[filterType] = true;
    switch (filterType) {
      case "likes":
        [likes, paginator] = await firestore.getUserLikes(10, startAfter);
        setPaginationItems({ ...paginationItems, likes: paginator });
        await fetchUser(likes.map(like => like.data.author));
        if (!likes.length) {
          setLoadingNext(false);
          setAllowLoad({ ...allowLoad, likes: false });
        }
        resetRefresh
          ? setContent({ ...content, likes })
          : setContent({ ...content, likes: [...content["likes"], ...likes] });
        return setRefreshing(false);
      case "comments":
        [comments, paginator] = await firestore.getUserComments(10, startAfter);
        setPaginationItems({ ...paginationItems, comments: paginator });
        await fetchUser(comments.map(comment => comment.data.author));
        if (!comments.length) {
          setLoadingNext(false);
          setAllowLoad({ ...allowLoad, comments: false });
        }
        resetRefresh
          ? setContent({ ...content, comments })
          : setContent({
              ...content,
              comments: [...content["comments"], ...comments]
            });
        return setRefreshing(false);
      case "follows":
        [follows, paginator] = await firestore.getUserFollows(10, startAfter);
        setPaginationItems({ ...paginationItems, follows: paginator });
        await fetchUser(follows.map(follow => follow.data.follower));
        if (!follows.length) {
          setLoadingNext(false);
          return setAllowLoad({ ...allowLoad, follows: false });
        }
        resetRefresh
          ? setContent({ ...content, follows })
          : setContent({
              ...content,
              follows: [...content["follows"], ...follows]
            });
        return setRefreshing(false);
      default:
        return setRefreshing(false);
    }
  };

  const renderItem = ({ item }) => {
    const fetchReview = async () => firestore.getReview(item.data.review);
    switch (filterType) {
      case "likes":
        return (
          <LikeItem
            item={item}
            fetchReview={fetchReview}
            user={users[item.data.author]}
            currentUser={currentUser}
          ></LikeItem>
        );
      case "comments":
        return (
          <CommentItem
            item={item}
            fetchReview={fetchReview}
            user={users[item.data.author]}
            currentUser={currentUser}
          ></CommentItem>
        );
      case "follows":
        return (
          <FollowItem item={item} user={users[item.data.follower]}></FollowItem>
        );
    }
  };

  useEffect(() => {
    if (!currentUser)
      firestore
        .getUser(firestore.fetchCurrentUID())
        .then(user => setCurrentUser(user));
    if (!content[filterType].length)
      fetchDataCheck(filterType, paginationItems[filterType]);
  }, [filterType]);

  return (
    <View style={{ flex: 1, marginTop: 10 }}>
      <View
        style={{
          paddingHorizontal: 5,
          paddingBottom: 10,
          borderBottomWidth: 1,
          borderBottomColor: colors.lightShadow
        }}
      >
        <OptionBar
          onPress={setFilterType}
          options={notificationButtonOptions}
          searchType={filterType}
        ></OptionBar>
      </View>
      <FlatList
        contentContainerStyle={{ paddingBottom: 85 }}
        data={content[filterType]}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        onEndReached={async () => {
          if (allowLoad[filterType] && content[filterType].length > 9) {
            setLoadingNext(true);
            await fetchDataCheck(filterType, paginationItems[filterType]);
          }
        }}
        onEndReachedThreshold={0}
        initialNumToRender={10}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              await fetchDataCheck(filterType, null, true);
            }}
          />
        }
        ListFooterComponent={() =>
          loadingNext && (
            <View style={{ padding: 20 }}>
              <ActivityIndicator size="small"></ActivityIndicator>
            </View>
          )
        }
      ></FlatList>
    </View>
  );
};

const styles = StyleSheet.create({});

export default NotificationScreen;
