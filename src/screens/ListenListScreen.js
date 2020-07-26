import React, { useEffect, useState, useContext } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  UIManager,
  FlatList,
  Platform,
} from "react-native";
import context from "../context/context";
import colors, { blurRadius } from "../constants/colors";
import { auth } from "firebase";
import TopButton from "../components/TopButton";
import { getAbreveatedTimeDif } from "../helpers/simplifyContent";
import ModalListCard from "../components/ModalCards/ModalListCard";
import UserListItem from "../components/UserList/UserListItem"
import OptionBar from "../components/OptionBar";
import { listenlistButtonOptions as optionButtons } from "../constants/buttonOptions";
import LoadingPage from "../components/Loading/LoadingPage";
import UserPreview from "../components/HomeScreenComponents/UserPreview";

const ListenListScreen = ({ navigation }) => {
  const { firestore } = useContext(context);
  const user = navigation.getParam("user");

  const [listType, setListType] = useState(navigation.getParam("type") || "personal")
  const [personalList, setPersonalList] = useState(navigation.getParam("personalList") || "waiting");
  const [incomingList, setIncomingList] = useState(navigation.getParam("incomingList") || "waiting");
  const [listenListContributors, setListenListContributors] =  useState("waiting");

  const [showModal, setShowModal] = useState(false);
  const [currentContent, setCurrentContent] = useState(false);
  if (Platform.OS === "android") {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  const fetchLists = async () => {
    if (listType === "personal" && personalList === "waiting")
      return firestore
        .getListenlist(user.email, true)
        .then(list => setPersonalList(list));
    if (listType === "incoming" && incomingList === "waiting") {
      return await firestore
        .getListenlist(user.email, false)
        .then(res => setIncomingList(res));
    }
  };

  const fetchContributors = async () => {
    if (listenListContributors === "waiting" && listType === "incoming") {
      const items = incomingList.items.map(item => item.author);
      const users = await firestore.batchAuthorRequest(items).then(res => {
        let ret = {};
        res.forEach(r => (ret[r.id] = r.data));
        return ret;
      });
      return setListenListContributors(users);
    }
  };

  useEffect(() => {
    if(incomingList !== "waiting")
     fetchContributors()
  }, [incomingList]);

  useEffect(() => {
    navigation.setParams({ type: listType, setShowModal });
    fetchLists()
  }, [listType]);

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
      (listType === "incoming" && incomingList === "waiting")  ||
      (listType === "incoming" && listenListContributors === "waiting")  ? (
        <LoadingPage />
      ) : (
        <FlatList
          contentContainerStyle={{ paddingBottom: 85 }}
          keyExtractor={item => item.content.id + item.last_modified}
          data={
            listType === "personal" ? personalList.items : incomingList.items
          }
          renderItem={({ item }) => {
            return (
              <View style={{ flexDirection: "row" }}>
                <UserListItem
                  index={getAbreveatedTimeDif(item.last_modified)}
                  content={item.content}
                  onLongPress={() => {
                    setCurrentContent(item.content);
                    return setShowModal(true);
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
          }}
        ></FlatList>
      )}
      <ModalListCard
        showModal={showModal}
        setShowModal={setShowModal}
        onDelete={() =>
          listType === "incoming"
            ? null
            : firestore.removeFromPersonalListenlist(currentContent)
        }
        content={currentContent}
      />
    </View>
  );
};

ListenListScreen.navigationOptions = ({ navigation }) => {
  const setShowModal = navigation.getParam("setShowModal");
  const { handle } = navigation.getParam("user"); 
  const type = navigation.getParam("type");

  return {
    title: `${handle}'s ${type} listenlist`,
    headerRight: () =>
      navigation.getParam("user").email === auth().currentUser.email ? (
        <TouchableOpacity onPress={() => setShowModal(true)}>
          <TopButton text={"Sort"} />
        </TouchableOpacity>
      ) : null
  };
};

export default ListenListScreen;
