import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import colors from "../../constants/colors";
import HomeScreenBorder from "../HomeScreenComponents/HomeScreenBorder";
import ContentPic from "../HomeScreenComponents/ContentPic";
import ContentTitle from "../HomeScreenComponents/ContentTitle";
import { FontAwesome5 } from "@expo/vector-icons";

/**
 * ReviewPreview Component for ListScreen
 * @param {string} title - title of this song
 * @param {integer} rating - your rating
 * @param {integer} avg_rating - average rating from users
 * @param {string} rid - any identifier for this song provided by spotify
 * @param {Object} navigation - navigation objected passed from screen
 * @param {boolean} highlighted - this song will be highlighted or not
 */
const UserListItem = ({
  content,
  index,
  onPress,
  onLongPress,
  forWriteList,
  containerStyle,
  indexStyle,
  showGrip
}) => {
  return (
    <View style={styles.containerStyle}>
      <Text style={[styles.listNumberStyle, indexStyle]}>
        {typeof index === "number" ? index + 1 : index}
      </Text>
      <HomeScreenBorder
        onPress={onPress}
        onLongPress={onLongPress}
        forWriteList={forWriteList}
        content={content}
        height={70}
        containerStyle={containerStyle}
      >
        <View style={{ flexDirection: "row" }}>
          <ContentPic
            img={content.image}
            style={{
              borderBottomRightRadius: 0,
              borderTopRightRadius: 0
            }}
            imageStyle={{
              borderBottomRightRadius: 0,
              borderTopRightRadius: 0
            }}
            width={70}
            is_review={false}
          ></ContentPic>
          <ContentTitle
            header={content.name}
            subheader={content.artists}
            fontScaling={0.8}
          ></ContentTitle>
          {showGrip && (
            <FontAwesome5
              name="grip-lines"
              size={24}
              style={{ marginRight: 5, marginTop: 25 }}
              color={colors.veryTranslucentWhite}
            />
          )}
        </View>
      </HomeScreenBorder>
    </View>
  );
};

const styles = StyleSheet.create({
  listNumberStyle: {
    fontSize: 15,
    textAlign: "center",
    width: 32,
    color: colors.shadow
  },
  containerStyle: {
    marginHorizontal: 5,
    flexDirection: "row",
    alignItems: "center",
    flex: 1
  }
});

export default UserListItem;
