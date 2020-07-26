import React, { useEffect, useContext, useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  RefreshControl,
  LayoutAnimation,
  UIManager,
  Platform
} from "react-native";
import colors from "../constants/colors";
import LikeItem from "../components/NotificationScreenComponents/LikeItem";
import CommentItem from "../components/NotificationScreenComponents/CommentItem";
import FollowItem from "../components/NotificationScreenComponents/FollowItem";
import ListenlistItem from "../components/NotificationScreenComponents/ListenlistItem";
import context from "../context/context";
import { customNotificationAnimation } from "../constants/heights";
import LoadingIndicator from "../components/Loading/LoadingIndicator";
import RefreshControlLoadingIndicator from "../components/Loading/RefreshControlLoadingIndicator";

const NotificationScreen = ({ navigation }) => {
  if (Platform.OS === "android") {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  const { firestore } = useContext(context);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState({});
  const [content, setContent] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingNext, setLoadingNext] = useState(false);
  const [paginationItem, setPaginationItem] = useState(null);
  const [allowLoad, setAllowLoad] = useState(true);

  const fetchUser = async ids => {
    if (!ids.length) return;
    const toFetch = [];
    ids.forEach(id => !users[id] && toFetch.push(id));
    const ret_users = await firestore.batchAuthorRequest(toFetch);
    return ret_users.forEach(user => (users[user.id] = user.data));
  };

  const fetchDataCheck = async (startAfter, resetRefresh = false) => {
    if ((!resetRefresh && !allowLoad) || loadingNext)
      return setRefreshing(false);
    if (resetRefresh) setAllowLoad(true);

    const [interactions, paginator] = await firestore.getUserInteractions(
      10,
      startAfter
    );
    setPaginationItem(paginator);
    await fetchUser(interactions.map(interaction => interaction.data.author));
    if (!interactions.length) {
      setLoadingNext(false);
      setAllowLoad(false);
    }
    resetRefresh
      ? setContent(interactions)
      : setContent([...content, ...interactions]);
    return setRefreshing(false);
  };

  const renderItem = ({ item }) => {
    const fetchReview = async () => firestore.getReview(item.data.review);
    switch (item.data.type) {
      case "like":
        return (
          <LikeItem
            item={item}
            fetchReview={fetchReview}
            user={users[item.data.author]}
            currentUser={currentUser}
          />
        );
      case "comment":
        return (
          <CommentItem
            item={item}
            fetchReview={fetchReview}
            user={users[item.data.author]}
            currentUser={currentUser}
          />
        );
      case "follow":
        return (
          <FollowItem item={item} user={users[item.data.author]} />
        );
      case "listenlist":
          return <ListenlistItem item={item} user={users[item.data.author]} currentUser={currentUser}/>
      default:
        return null;
    }
  };

  useEffect(() => {
    LayoutAnimation.configureNext(customNotificationAnimation);
    if (!currentUser)
      firestore
        .getUser(firestore.fetchCurrentUID())
        .then(user => setCurrentUser(user));
    if (!content.length) fetchDataCheck(paginationItem);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {content && content.length > 0 && refreshing && (
        <RefreshControlLoadingIndicator />
      )}
      <FlatList
        contentContainerStyle={{ paddingBottom: 85 }}
        data={content}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        onEndReached={async () => {
          if (allowLoad && content.length > 9) {
            setLoadingNext(true);
            await fetchDataCheck(paginationItem);
          }
        }}
        onEndReachedThreshold={0}
        initialNumToRender={10}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            tintColor="transparent"
            onRefresh={async () => {
              setRefreshing(true);
              await fetchDataCheck(null, true);
            }}
          />
        }
        ListFooterComponent={() =>
          loadingNext && (
            <View style={{ padding: 20 }}>
              <LoadingIndicator size={20}></LoadingIndicator>
            </View>
          )
        }
      ></FlatList>
    </View>
  );
};

const styles = StyleSheet.create({});

export default NotificationScreen;
