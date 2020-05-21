import React, { useState } from "react";
import {
  StyleSheet,
  Button,
  Text,
  View,
  Image,
  TouchableOpacity
} from "react-native";

import colors from "../../constants/colors";
import { FlatList } from "react-native-gesture-handler";
import images from "../../constants/images";
import { FontAwesome5 } from "@expo/vector-icons";

const ModalReviewContent = ({
  contentTypes,
  onClose,
  following,
  userShow,
  setUserShow,
  ratingTypes,
  setRatingTypes
}) => {
  const [activeTrack, setActiveTrack] = useState(contentTypes.has("track"));
  const [activeAlbum, setActiveAlbum] = useState(contentTypes.has("album"));
  const [activeArtist, setActiveArtist] = useState(contentTypes.has("artist"));
  const updateContent = type => {
    contentTypes.has(type) ? contentTypes.delete(type) : contentTypes.add(type);
    type === "track"
      ? setActiveTrack(!activeTrack)
      : type === "album"
      ? setActiveAlbum(!activeAlbum)
      : setActiveArtist(!activeArtist);
  };
  return (
    <View style={styles.content}>
      <View style={{ alignItems: "flex-start" }}>
        <Button onPress={() => onClose()} title="Done" />
      </View>
      <Text style={styles.sectionTitle}>Filter</Text>
      <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
        <TouchableOpacity
          onPress={() => setRatingTypes(ratingTypes === true ? null : true)}
          style={
            ratingTypes === true
              ? styles.deactivatedBorder
              : styles.activatedBorder
          }
        >
          <Text
            style={
              ratingTypes === true ? styles.deactiveText : styles.activeText
            }
          >
            Ratings
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setRatingTypes(ratingTypes === false ? null : false)}
          style={
            ratingTypes === false
              ? styles.deactivatedBorder
              : styles.activatedBorder
          }
        >
          <Text
            style={
              ratingTypes === false ? styles.deactiveText : styles.activeText
            }
          >
            Reviews
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            updateContent("track");
          }}
          disabled={activeTrack && contentTypes.size === 1}
          style={
            activeTrack ? styles.activatedBorder : styles.deactivatedBorder
          }
        >
          <Text style={activeTrack ? styles.activeText : styles.deactiveText}>
            Songs
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            updateContent("album");
          }}
          disabled={activeAlbum && contentTypes.size === 1}
          style={
            activeAlbum ? styles.activatedBorder : styles.deactivatedBorder
          }
        >
          <Text style={activeAlbum ? styles.activeText : styles.deactiveText}>
            Albums
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            updateContent("artist");
          }}
          disabled={activeArtist && contentTypes.size === 1}
          style={
            activeArtist ? styles.activatedBorder : styles.deactivatedBorder
          }
        >
          <Text style={activeArtist ? styles.activeText : styles.deactiveText}>
            Artists
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>See Friends</Text>
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          onPress={() => setUserShow(null)}
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <FontAwesome5
            name="users"
            size={30}
            style={{ margin: 9 }}
            color={userShow ? colors.text : colors.primary}
          />
          <Text
            style={{
              marginTop: 5,
              fontSize: 16,
              color: colors.text,
              fontWeight: !userShow ? "bold" : "normal"
            }}
          >
            All
          </Text>
        </TouchableOpacity>
        {following.length ? (
          <FlatList
            data={following}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  style={
                    userShow === item.id
                      ? styles.activatedUserItemStyle
                      : styles.deactivatedUserItemStyle
                  }
                  onPress={() =>
                    setUserShow(userShow === item.id ? null : item)
                  }
                >
                  <Image
                    style={styles.imageStyle}
                    source={{
                      uri: item.data.profile_url || images.profileDefault
                    }}
                  ></Image>
                  <Text
                    style={{
                      marginTop: 5,
                      fontSize: 16,
                      color: colors.text,
                      fontWeight: userShow === item.id ? "bold" : "normal"
                    }}
                  >
                    {item.data.handle}
                  </Text>
                </TouchableOpacity>
              );
            }}
            keyExtractor={item => item.id}
          ></FlatList>
        ) : (
          <View
            style={{
              justifyContent: "center",
              flex: 1
            }}
          >
            <Text
              style={{ fontSize: 16, color: colors.text, textAlign: "center" }}
            >
              Follow users to filter by friends.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};
const buttonBorder = {
  borderRadius: 5,
  paddingVertical: 10,
  width: 70,
  justifyContent: "center",
  alignItems: "center",
  borderWidth: 1,
  borderColor: "rgba(0,0,0,0)"
};

const userItemStyle = {
  borderWidth: 1,
  paddingHorizontal: 5,
  borderRadius: 5,
  borderWidth: 3,
  justifyContent: "center",
  alignItems: "center"
};
const styles = StyleSheet.create({
  content: {
    backgroundColor: colors.cardColor,
    paddingBottom: 50,
    borderRadius: 5,
    borderColor: colors.heat
  },
  ratingNumber: {
    fontSize: 20,
    color: colors.primary
  },
  imageStyle: {
    marginTop: 5,
    aspectRatio: 1,
    height: 50,
    borderRadius: 5
  },
  sectionTitle: {
    marginLeft: 10,
    fontSize: 20,
    marginVertical: 10
  },
  activeText: {
    fontWeight: "bold",
    color: colors.white
  },
  deactiveText: {
    fontWeight: "bold",
    color: colors.primary
  },
  activatedBorder: {
    ...buttonBorder,
    backgroundColor: colors.primary
  },
  deactivatedBorder: {
    ...buttonBorder,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.shadow
  },
  deactivatedUserItemStyle: {
    ...userItemStyle,
    borderColor: "rgba(0,0,0,0)"
  },
  activatedUserItemStyle: {
    ...userItemStyle,
    borderColor: colors.primary
  }
});

export default ModalReviewContent;
