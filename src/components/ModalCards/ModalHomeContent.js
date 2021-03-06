import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import Button from "../BaseButton";
import UserSelectorScroll from "./UserSelectorScroll";
import colors from "../../constants/colors";
import { FontAwesome5 } from "@expo/vector-icons";
import ModalFilterButton from "./ModalFilterButton";
import ContentTypeRow from "./ContentTypeRow";

const ModalHomeContent = ({
  onClose,
  userShow,
  setUserShow,
  filterTypes,
  setFilterTypes,
  setChanged,
  fetchFollowing
}) => {
  const [following, setFollowing] = useState([]);
  const updateState = () => {
    setShowReviews(
      filterTypes.has("track_review") ||
        filterTypes.has("album_review") ||
        filterTypes.has("artist_review")
    );
    setShowRatings(
      filterTypes.has("track_rating") ||
        filterTypes.has("album_rating") ||
        filterTypes.has("artist_rating")
    );
    setShowArtists(
      filterTypes.has("artist_rating") || filterTypes.has("artist_review")
    );
    setShowAlbums(
      filterTypes.has("album_rating") || filterTypes.has("album_review")
    );
    setShowSongs(
      filterTypes.has("track_rating") || filterTypes.has("track_review")
    );
    setShowList(filterTypes.has("list"));
  };
  const [showReviews, setShowReviews] = useState();
  const [showRatings, setShowRatings] = useState();
  const [showSongs, setShowSongs] = useState();
  const [showAlbums, setShowAlbums] = useState();
  const [showArtists, setShowArtists] = useState();
  const [showList, setShowList] = useState();

  useEffect(() => {
    fetchFollowing().then(res => setFollowing(res));
    updateState();
  }, []);

  const types = ["track", "album", "artist"];
  const review_types = ["rating", "review"];

  const updateContent = (type, value) => {
    const old_filterTypes = new Set(filterTypes);
    if (review_types.includes(type)) {
      types.forEach(t =>
        value
          ? filterTypes.delete(t + "_" + type)
          : filterTypes.add(t + "_" + type)
      );
    } else if (type === "list") {
      value ? filterTypes.delete("list") : filterTypes.add("list");
    } else {
      review_types.forEach(t =>
        value
          ? filterTypes.delete(type + "_" + t)
          : filterTypes.add(type + "_" + t)
      );
    }

    if (filterTypes.size === 0) return setFilterTypes(old_filterTypes);
    return updateState();
  };

  return (
    <View style={styles.content}>
      <View style={{ alignItems: "flex-start" }}>
        <Button onPress={onClose} title="Done" />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          marginVertical: 10
        }}
      >
        <ModalFilterButton
          title={"Reviews"}
          onPress={() => {
            setChanged(true);
            return updateContent("review", showReviews);
          }}
          show={showReviews}
        />
        <ModalFilterButton
          title={"Ratings"}
          onPress={() => {
            setChanged(true);
            return updateContent("rating", showRatings);
          }}
          show={showRatings}
        />
        <ModalFilterButton
          title={"Lists"}
          onPress={() => {
            setChanged(true);
            return updateContent("list", showList);
          }}
          show={showList}
        />
      </View>
      <ContentTypeRow
        showSongs={showSongs}
        showAlbums={showAlbums}
        showArtists={showArtists}
        onPress={(type, val) => {
          setChanged(true);
          return updateContent(type, val);
        }}
      />
      <Text style={styles.sectionTitle}>See Following</Text>
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          onPress={() => {
            setChanged(true);
            setUserShow(null);
          }}
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <FontAwesome5
            name="users"
            size={30}
            style={{ margin: 9 }}
            color={userShow ? colors.text : colors.secondary}
          />
          <Text
            style={[
              styles.allTextStyle,
              { fontWeight: !userShow ? "bold" : "normal" }
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        {following.length ? (
          <UserSelectorScroll
            data={following}
            selected={userShow}
            onUserPress={user => {
              setChanged(true);
              return setUserShow(
                userShow === (user.id || user.email) ? null : user
              );
            }}
          />
        ) : (
          <View style={styles.noneWrapper}>
            <Text style={styles.noneText}>
              Follow users to filter by friends.
            </Text>
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
  allTextStyle: {
    marginTop: 5,
    fontSize: 16,
    color: colors.text
  },
  noneText: { fontSize: 16, color: colors.text, textAlign: "center" },
  noneWrapper: {
    justifyContent: "center",
    flex: 1
  },
  sectionTitle: {
    fontWeight: "bold",
    color: colors.text,
    marginLeft: 10,
    fontSize: 20,
    marginVertical: 10
  }
});

export default ModalHomeContent;
