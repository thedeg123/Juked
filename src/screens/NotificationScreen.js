import React, { useEffect, useContext, useState } from "react";
import {
  StyleSheet,
  View,
  RefreshControl,
  LayoutAnimation,
  UIManager,
  Text,
  Platform,
  ScrollView
} from "react-native";
import { FlatList } from "react-navigation";
import colors from "../constants/colors";
import { paddingBottom } from "../constants/heights";
import LikeItem from "../components/NotificationScreenComponents/LikeItem";
import CommentItem from "../components/NotificationScreenComponents/CommentItem";
import FollowItem from "../components/NotificationScreenComponents/FollowItem";
import ListenlistItem from "../components/NotificationScreenComponents/ListenlistItem";
import context from "../context/context";
import { customNotificationAnimation } from "../constants/heights";
import LoadingIndicator from "../components/Loading/LoadingIndicator";
import { setBadgeCountAsync } from "expo-notifications";

const NotificationScreen = ({ navigation }) => {
  if (Platform.OS === "android") {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  const { firestore } = useContext(context);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState({});
  const [content, setContent] = useState("waiting");
  const [refreshing, setRefreshing] = useState(false);
  const [loadingNext, setLoadingNext] = useState(false);
  const [paginationItem, setPaginationItem] = useState(null);
  const [allowLoad, setAllowLoad] = useState(true);

  const fetchUser = async ids => {
    if (!ids.length) return;
    const ret_users = await firestore.batchAuthorRequest(ids);
    return setUsers({ ...users, ...ret_users });
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
    if (interactions.length < 10) {
      setAllowLoad(false);
    }
    resetRefresh
      ? setContent(interactions)
      : setContent([...content, ...interactions]);

    setLoadingNext(false);
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
        return <FollowItem item={item} user={users[item.data.author]} />;
      case "listenlist":
        return (
          <ListenlistItem
            item={item}
            user={users[item.data.author]}
            currentUser={currentUser}
          />
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    LayoutAnimation.configureNext(customNotificationAnimation);
    if (!currentUser)
      firestore
        .getUser(firestore.fetchCurrentUID(), false)
        .then(user => setCurrentUser(user));
    fetchDataCheck(paginationItem, true);
  }, []);

  useEffect(() => {
    setBadgeCountAsync(0);
  });

  const refreshControl = (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={async () => {
        setRefreshing(true);
        await fetchDataCheck(null, true);
      }}
    />
  );

  return (
    <View style={{ flex: 1 }}>
      {content === "waiting" ? null : content && !content.length ? (
        <ScrollView
          contentContainerStyle={{ justifyContent: "center", flex: 1 }}
          refreshControl={refreshControl}
        >
          <Text style={styles.emptyTextStyle}>
            One day, this will be filled with Activity 🥳
          </Text>
        </ScrollView>
      ) : (
        <FlatList
          scrollIndicatorInsets={{ right: 1 }}
          contentContainerStyle={{ paddingBottom }}
          data={content}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          onEndReached={async () => {
            if (allowLoad) {
              setLoadingNext(true);
              await fetchDataCheck(paginationItem);
            }
          }}
          onEndReachedThreshold={0}
          refreshControl={refreshControl}
          ListFooterComponent={() =>
            loadingNext &&
            allowLoad && (
              <View style={{ padding: 20 }}>
                <LoadingIndicator size={20} />
              </View>
            )
          }
        ></FlatList>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  emptyTextStyle: {
    textAlign: "center",
    fontWeight: "bold",
    marginHorizontal: 20,
    fontSize: 20,
    color: colors.secondary
  }
});

export default NotificationScreen;
