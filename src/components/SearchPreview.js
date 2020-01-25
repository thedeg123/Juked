import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import colors from "../constants/colors";
/**
 * UserPreview Component for ListScreen
 * @param {string} title - title of this song/album/artist
 * @param {string} type - "Song"/"Album"/"Artist"
 * @param {string} music_id - original id from spotify
 * @param {Object} navigation - navigation objected passed from screen
 */
const UserPreview = ({ username, type, music_id, navigation }) => {
  const handleNavigate = () => {
    switch (type) {
      case "Song":
        navigation.navigate("Album", { music_id: "", highlighted: musci_id });
        break;
      case "Album":
        navigation.navigate("Album", { music_id, highlighted: "" });
        break;
      case "Artist":
        navigation.navigate("Artist", { music_id });
        break;
      default:
        break;
    }
  };
  return (
    <View style={styles.overallStyle}>
      <Text style={styles.textStyle}>{username}</Text>
      <Text style={styles.typeStyle}>{type}</Text>
      <TouchableOpacity onPress={handleNavigate}>
        <EvilIcons name="chevron-right" style={styles.iconStyle} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  overallStyle: {
    marginVertical: 10,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.shadow
  },
  iconStyle: {
    fontSize: 30,
    color: colors.secondary
  },
  textStyle: {
    fontSize: 20,
    color: colors.text,
    flex: 1
  },
  typeStyle: {
    fontSize: 20,
    color: colors.shadow
  }
});

export default UserPreview;
