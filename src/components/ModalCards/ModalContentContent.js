import React, { useState, useContext } from "react";
import { StyleSheet, Button, Text, View, FlatList } from "react-native";
import colors from "../../constants/colors";
import TopBar from "./TopBar";
import UserSelectorScrollItem from "./UserSelectorScrollItem";
import context from "../../context/context";
import images from "../../constants/images";

const ModalContentContent = ({ onClose, link, content,  }) => {
  const [showAddToListenlist, setShowAddToListenlist] = useState(false);
  const [forceRefresh, executeforceRefresh] = useState(0)
  const [followers, setFollowers] = useState(null);
  const { firestore } = useContext(context);
  
  const getFollowers = async () =>
    await firestore
      .getUserFollowersObjects(firestore.fetchCurrentUID())
      .then(res => setFollowers(res));
  return (
    <View style={styles.content}>
      <View>
        <TopBar
          onClose={onClose}
          link={link}
          showSpotify={content.type !== "List"}
        />
        {showAddToListenlist ? (
          <View>
            <Text style={styles.sectionTitle}>
              Add to Follower's Listenlist
            </Text>
            <FlatList
              data={followers}
              horizontal
              keyExtractor={item => item.id}
              renderItem={({ item }) => {
                const contentReccomendedToFollower = 
                  firestore.contentReccomendedToFollower(content.id, item.id)
                return (
                  <UserSelectorScrollItem
                    image={{
                      uri: item.data.profile_url || images.profileDefault
                    }}
                    showCheck={contentReccomendedToFollower}
                    textStyle={{fontWeight: contentReccomendedToFollower ? "bold":"normal"}}
                    onPress={() => {
                      contentReccomendedToFollower
                      ? firestore.unreccomendContentToFollower(
                            content,
                            item.id
                          ).then(()=> executeforceRefresh(forceRefresh+1))
                        : firestore.reccomendContentToFollower(
                            content,
                            item.id
                          ).then(()=> executeforceRefresh(forceRefresh+1))
                    }}
                    text={item.data.handle}
                  />
                );
              }}
            />
          </View>
        ) : (
          <View>
            <Button title={"Add to a list"} />
            <Button
              title={"Add to follower's listenlist"}
              onPress={async () =>
                followers
                  ? setShowAddToListenlist(true)
                  : getFollowers().then(() => setShowAddToListenlist(true))
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
  },
});

export default ModalContentContent;
