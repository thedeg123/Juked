import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import colors from "../constants/colors";

/**
 * ReviewPreview Component for ListScreen
 * @param {string} title - title of this song
 * @param {integer} rating - your rating
 * @param {integer} avg_rating - average rating from users
 * @param {string} rid - any identifier for this song provided by spotify
 * @param {Object} navigation - navigation objected passed from screen
 * @param {boolean} highlighted - this song will be highlighted or not
 */
const AlbumPreview = ({
  content,
  showTrackCard,
  disabled,
  highlighted,
  showHighlightedTrackCard,
  showContentCard
}) => {
  if (showHighlightedTrackCard && !disabled) showTrackCard();
  return (
    <View style={{ flexDirection: "row", marginHorizontal: 10 }}>
      <View
        style={{ width: 30, justifyContent: "center", alignItems: "center" }}
      >
        <Text style={styles.track_numberStyle}>{content.track_number}</Text>
      </View>
      <TouchableOpacity
        disabled={disabled}
        onPress={showTrackCard}
        onLongPress={showContentCard}
        style={[
          styles.containerStyle,
          {
            backgroundColor: highlighted ? colors.highlight : colors.background
          }
        ]}
      >
        <Text style={styles.textStyle} numberOfLines={1}>
          {content.name}
        </Text>
        <Text style={styles.timeStyle} numberOfLines={1}>
          {content.duration}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    marginVertical: 2,
    borderRadius: 2,
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    flex: 1,
    borderTopWidth: 0.5,
    borderTopColor: colors.lightShadow
  },
  timeStyle: {
    marginLeft: 5,
    color: colors.text,
    fontWeight: "300"
  },
  track_numberStyle: {
    alignSelf: "center",
    fontSize: 20,
    color: colors.shadow,
    fontWeight: "300",
    marginRight: 5
  },
  iconStyle: {
    fontSize: 20,
    marginLeft: 10,
    color: colors.secondary
  },
  textStyle: {
    fontSize: 18,
    color: colors.text,
    flex: 1
  },
  scoreStyle: {
    fontSize: 30,
    color: colors.primary,
    fontWeight: "bold"
  },
  avgScoreStyle: {
    marginLeft: 5,
    fontSize: 30,
    color: colors.shadow
  },
  hint: {
    fontSize: 10,
    color: colors.shadow
  }
});

export default AlbumPreview;
