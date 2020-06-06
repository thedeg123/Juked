import React, { useState } from "react";
import {
  TouchableOpacity,
  ActivityIndicator,
  Text,
  View,
  StyleSheet
} from "react-native";
import colors from "../constants/colors";
import { SimpleLineIcons } from "@expo/vector-icons";

const FolloWButton = ({ following, onPress, followsYou }) => {
  const [processingFollow, setProcessingFollow] = useState(false);
  return (
    <View
      style={{
        flexDirection: "row",

        justifyContent: "space-evenly"
      }}
    >
      {processingFollow ? (
        <View style={styles.loadingStyle}>
          <ActivityIndicator color={colors.white} size="small" />
        </View>
      ) : (
        <TouchableOpacity
          onPress={async () => {
            setProcessingFollow(true);
            await onPress();
            setProcessingFollow(false);
          }}
          style={
            following
              ? styles.followContainerStyle
              : styles.unfollowContainerStyle
          }
        >
          <View style={styles.contentStyle}>
            <SimpleLineIcons
              name={following ? "user-following" : "user-follow"}
              style={styles.iconStyle}
              color={following ? colors.white : colors.primary}
            ></SimpleLineIcons>
            <Text
              numberOfLines={1}
              style={
                following ? styles.unfollowTextStyle : styles.followTextStyle
              }
            >
              {following ? "Unfollow" : "Follow"}
            </Text>
          </View>
        </TouchableOpacity>
      )}
      {followsYou ? (
        <View
          style={[styles.followContainerStyle, { justifyContent: "center" }]}
        >
          <Text numberOfLines={1} style={styles.unfollowTextStyle}>
            Follows You
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const textStyle = {
  textAlign: "center",
  fontSize: 15,
  fontWeight: "bold"
};
const containerStyle = {
  alignSelf: "center",
  width: 105,
  height: 40,
  borderRadius: 5,
  paddingHorizontal: 7,
  shadowColor: colors.shadow,
  shadowOpacity: 0.6,
  shadowOffset: { width: 1, height: 1 },
  shadowRadius: 2,
  alignItems: "stretch"
};
const styles = StyleSheet.create({
  followContainerStyle: {
    ...containerStyle,
    backgroundColor: colors.secondary
  },
  iconStyle: {
    fontSize: 20
  },
  unfollowContainerStyle: {
    ...containerStyle,
    backgroundColor: colors.object,
    justifyContent: "center"
  },
  loadingStyle: {
    ...containerStyle,
    backgroundColor: colors.secondary,
    justifyContent: "center"
  },
  contentStyle: {
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between"
  },
  unfollowTextStyle: {
    ...textStyle,
    color: colors.white
  },
  followTextStyle: {
    ...textStyle,
    color: colors.secondary
  }
});

export default FolloWButton;
