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
    let contentReccomendedToFollower = contentRecs[content.id + item.id];
    return (
      <UserSelectorScrollItem
        image={{
          uri: item.data.profile_url || images.profileDefault
        }}
        showCheck={contentReccomendedToFollower}
        textStyle={{
          fontWeight: contentReccomendedToFollower ? "bold" : "normal"
        }}
        onPress={async () => {
          contentReccomendedToFollower
            ? await firestore.unreccomendContentToFollower(content, item.id)
            : await firestore.reccomendContentToFollower(content, item.id);
          contentRecs[content.id + item.id] = !contentReccomendedToFollower;
          setContentRecs({ ...contentRecs });
        }}
        text={item.data.handle}
      />
    );
  };

  const getContentRecs = async followers => {
    let cr = {};
    for (let index = 0; index < followers.length; index++) {
      const user = followers[index];
      cr[content.id + user.id] = await firestore.contentReccomendedToFollower(
        content.id,
        user.id
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
          link={link}
          showSpotify={content.type !== "List"}
        />
        {showContentType === "listenlist" ? (
          <View>
            <Text style={styles.sectionTitle}>
              Add to Follower's Listenlist
            </Text>
            <FlatList
              data={followers}
              horizontal
              keyExtractor={item => item.id}
              renderItem={renderItem}
            />
          </View>
        ) : showContentType === "userlist" ? (
          <View>
            <Text style={styles.sectionTitle}>Add to a List</Text>
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
