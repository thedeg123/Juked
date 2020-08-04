import React, { useEffect, useState, useContext, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  UIManager,
  FlatList,
  Platform
} from "react-native";
import context from "../context/context";
import colors from "../constants/colors";
import { auth } from "firebase";
import TopButton from "../components/TopButton";
import { getAbreveatedTimeDif } from "../helpers/simplifyContent";
import ModalSortCard from "../components/ModalCards/ModalSortCard";
import ModalListCard from "../components/ModalCards/ModalListCard";
import UserListItem from "../components/UserList/UserListItem";
import OptionBar from "../components/OptionBar";
import { listenlistButtonOptions as optionButtons } from "../constants/buttonOptions";
import LoadingPage from "../components/Loading/LoadingPage";
import UserPreview from "../components/HomeScreenComponents/UserPreview";
import LoadingIndicator from "../components/Loading/LoadingIndicator";

const ListenListScreen = ({ navigation }) => {
  const { firestore } = useContext(context);
  const user = navigation.getParam("user");
  const [listType, setListType] = useState(
    navigation.getParam("type") || "personal"
  );
  const [personalList, setPersonalList] = useState("waiting");
  const [incomingList, setIncomingList] = useState("waiting");
  const [listenListContributors, setListenListContributors] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [startAfter, setStartAfter] = useState(null);
  const [allowRefresh, setAllowRefresh] = useState(
    navigation.getParam("type") === "incoming"
  );
  const batchLimit = 10;

  const [showModal, setShowModal] = useState(false);
  const [showModalItemCard, setShowModalItemCard] = useState(false);
  const [newestFirst, setNewestFirst] = useState(true);
  const [filterTypes, setFilterTypes] = useState(["track", "album", "artist"]);

  let onEndReachedCalledDuringMomentum = false;

  const flatListRef = useRef();

  const [currentContent, setCurrentContent] = useState(false);
  if (Platform.OS === "android") {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  const fetchLists = async (resetRefresh = false) => {
    if (listType === "personal") {
      return await firestore
        .getPersonalListenlist(user.email, newestFirst, filterTypes)
        .then(list => setPersonalList(list));
    }
    if (listType === "incoming") {
      return await firestore
        .getIncomingListenlist(
          user.email,
          batchLimit,
          !resetRefresh ? startAfter : null,
          newestFirst,
          filterTypes
        )
        .then(async res => {
          await fetchContributors(res[0].map(item => item.author));
          if (incomingList === "waiting" || resetRefresh) {
            setIncomingList(res[0]);
          } else {
            setIncomingList([...incomingList, ...res[0]]);
          }
          if (res[0].length < batchLimit) {
            setAllowRefresh(false);
          }
          setStartAfter(res[1]);
        });
    }
  };

  const fetchContributors = async ids => {
    const newContribs = await firestore.batchAuthorRequest(ids);
    return setListenListContributors({
      ...listenListContributors,
      ...newContribs
    });
  };

  useEffect(() => {
    navigation.setParams({ setShowModal });
    if (flatListRef.current)
      flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
    setStartAfter(null);
    fetchLists(true);
    setAllowRefresh(true);
    setAllowRefresh(listType === "incoming");
  }, [listType]);

  useEffect(() => {
    if (flatListRef.current)
      flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
    setStartAfter(null);
    setAllowRefresh(true);
    fetchLists(true);
  }, [newestFirst, filterTypes]);

  const renderListItem = ({ item }) => (
    <View style={{ flexDirection: "row" }}>
      <UserListItem
        index={getAbreveatedTimeDif(item.last_modified)}
        content={item.content}
        onLongPress={() => {
          setCurrentContent(item);
          return setShowModalItemCard(true);
        }}
      />
      {listType === "incoming" && (
        <UserPreview
          uid={listenListContributors[item.author].email}
          color={colors.text}
          size={40}
          img={listenListContributors[item.author].profile_url}
          containerStyle={{ marginRight: 10 }}
          username={listenListContributors[item.author].handle}
        />
      )}
    </View>
  );
  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 10 }}>
        <OptionBar
          onPress={setListType}
          options={optionButtons}
          searchType={listType}
        />
      </View>
      {(listType === "personal" && personalList === "waiting") ||
      (listType === "incoming" && incomingList === "waiting") ||
      (listType === "incoming" && listenListContributors === "waiting") ? (
        <LoadingPage />
      ) : (
        <FlatList
          ref={flatListRef}
          contentContainerStyle={{ paddingBottom: 85 }}
          keyExtractor={item => item.content.id + item.last_modified}
          data={listType === "personal" ? personalList.items : incomingList}
          renderItem={renderListItem}
          onMomentumScrollBegin={() =>
            (onEndReachedCalledDuringMomentum = true)
          }
          onEndReached={async () => {
            if (!allowRefresh || !onEndReachedCalledDuringMomentum) {
              return;
            }
            onEndReachedCalledDuringMomentum = false;
            setRefreshing(true);
            await fetchLists();
            setRefreshing(false);
          }}
          onEndReachedThreshold={0}
          initialNumToRender={10}
          ListFooterComponent={() =>
            refreshing &&
            allowRefresh && (
              <View style={{ padding: 20 }}>
                <LoadingIndicator />
              </View>
            )
          }
        />
      )}
      <ModalSortCard
        showModal={showModal}
        setShowModal={setShowModal}
        newestFirst={newestFirst}
        setNewestFirst={setNewestFirst}
        setFilterTypes={setFilterTypes}
        filterTypes={filterTypes}
      />
      <ModalListCard
        showModal={showModalItemCard}
        setShowModal={setShowModalItemCard}
        showDelete={user.email === firestore.fetchCurrentUID()}
        onDelete={() => {
          if (listType === "incoming") {
            firestore
              .unreccomendContentToFollower(
                currentContent.content,
                firestore.fetchCurrentUID()
              )
              .then(() =>
                setIncomingList(
                  incomingList.filter(
                    item =>
                      item.content.id !== currentContent.content.id ||
                      item.author !== currentContent.author
                  )
                )
              );
          } else {
            firestore
              .removeFromPersonalListenlist(currentContent.content)
              .then(res => fetchLists());
          }
        }}
        content={currentContent && currentContent.content}
      />
    </View>
  );
};

ListenListScreen.navigationOptions = ({ navigation }) => {
  const setShowModal = navigation.getParam("setShowModal");
  const { handle } = navigation.getParam("user");

  return {
    title: `${handle}'s listenlist`,
    headerRight: () =>
      navigation.getParam("user").email === auth().currentUser.email ? (
        <TouchableOpacity onPress={() => setShowModal(true)}>
          <TopButton text={"Sort"} />
        </TouchableOpacity>
      ) : null
  };
};

export default ListenListScreen;
