import React, { useState, useContext } from "react";
import { StyleSheet, Button, Text, View, FlatList } from "react-native";
import colors from "../../constants/colors";
import TopBar from "./TopBar";
import UserSelectorScrollItem from "./UserSelectorScrollItem";
import context from "../../context/context";
import UserListPreviewItem from "../ProfileScreen/UserListPreviewItem";
import images from "../../constants/images";

const ModalContentContent = ({ onClose, link, content }) => {
  const [showContentType, setShowContentType] = useState(null);
  const [followers, setFollowers] = useState(null);
  const [lists, setLists] = useState(null);
  const { firestore } = useContext(context);
  const [contentRecs, setContentRecs] = useState({});

  const renderItem = ({ item }) => {
    let contentReccomendedToFollower = contentRecs[content.id + item.email];
    return (
      <UserSelectorScrollItem
        image={{
          uri: item.profile_url || images.profileDefault
        }}
        showCheck={contentReccomendedToFollower}
        textStyle={{
          fontWeight: contentReccomendedToFollower ? "bold" : "normal"
        }}
        onPress={async () => {
          contentReccomendedToFollower
            ? await firestore.unreccomendContentToFollower(content, item.email)
            : await firestore.reccomendContentToFollower(content, item.email);
          contentRecs[content.id + item.email] = !contentReccomendedToFollower;
          setContentRecs({ ...contentRecs });
        }}
        text={item.handle}
      />
    );
  };

  const getContentRecs = async followers => {
    let cr = {};
    for (let index = 0; index < followers.length; index++) {
      const user = followers[index];
      const id = user.id || user.email;
      cr[content.id + id] = await firestore.contentReccomendedToFollower(
        content.id,
        id
      );
    }
    return cr;
  };

  const getFollowers = async () => {
    const followers = await firestore.getUserFollowersObjects(
      firestore.fetchCurrentUID()
    );
    setFollowers(followers);
    return setContentRecs(await getContentRecs(followers));
  };

  const getLists = async () => {
    return await firestore
      .getReviewsByAuthorType(firestore.fetchCurrentUID(), ["list"], 5)
      .then(res => setLists(res[0]));
  };

  const updateUserList = list => {
    if (list.data.itemKeys.includes(content.id)) {
      const newItem = list.data.items.filter(c => c.id !== content.id);
      const newItemKeys = list.data.itemKeys.filter(c => c !== content.id);
      firestore.updateList(
        list.id,
        list.data.title,
        list.data.description,
        newItem,
        newItemKeys
      );
      list.data.itemKeys = newItemKeys;
      list.data.items = newItem;
    } else {
      firestore.updateList(
        list.id,
        list.data.title,
        list.data.description,
        [...list.data.items, content],
        [...list.data.itemKeys, content.id]
      );
      list.data.itemKeys.push(content.id);
      list.data.items.push(content);
    }
    setLists([...lists]);
  };
  return (
    <View style={styles.content}>
      <View>
        <TopBar
          onClose={onClose}
          content={content}
          showSpotify={content.type !== "List"}
        />
        {showContentType === "listenlist" ? (
          <View>
            <Text style={styles.sectionTitle}>
              {followers && followers.length
                ? "Add to a Follower's Listenlist"
                : "You have no followers to recommend this to 😞"}
            </Text>
            <FlatList
              data={followers}
              horizontal
              keyExtractor={item => item.email}
              renderItem={renderItem}
            />
          </View>
        ) : showContentType === "userlist" ? (
          <View>
            <Text style={styles.sectionTitle}>
              {lists && lists.length
                ? "Add to a List"
                : "Create a list from your profile to add to it"}
            </Text>
            {lists && lists.length ? (
              <FlatList
                data={lists}
                horizontal
                keyExtractor={item => item.id + item.last_modified}
                renderItem={({ item }) => (
                  <UserListPreviewItem
                    showCheck={item.data.itemKeys.includes(content.id)}
                    list={item}
                    onPress={() => updateUserList(item)}
                  />
                )}
              />
            ) : null}
          </View>
        ) : (
          <View>
            <Button
              title={"Add to a list"}
              onPress={async () =>
                lists
                  ? setShowContentType("userlist")
                  : getLists().then(() => {
                      setShowContentType("userlist");
                    })
              }
            />
            <Button
              title={"Add to follower's listenlist"}
              onPress={async () =>
                followers
                  ? setShowContentType("listenlist")
                  : getFollowers().then(() => {
                      setShowContentType("listenlist");
                    })
              }
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: colors.cardColor,
    paddingBottom: 50,
    borderRadius: 5
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12
  },
  sectionTitle: {
    fontWeight: "bold",
    color: colors.text,
    marginLeft: 10,
    fontSize: 20,
    marginVertical: 10
  }
});

export default ModalContentContent;
