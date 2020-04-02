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

const FolloWButton = ({ following, onPress }) => {
  const [processingFollow, setProcessingFollow] = useState(false);
  return processingFollow ? (
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
        following ? styles.followContainerStyle : styles.unfollowContainerStyle
      }
    >
      <View style={styles.contentStyle}>
        <SimpleLineIcons
          name={following ? "user-following" : "user-follow"}
          style={styles.iconStyle}
          color={following ? colors.white : colors.primary}
        ></SimpleLineIcons>
        <Text
          style={following ? styles.unfollowTextStyle : styles.followTextStyle}
        >
          {following ? "Unfollow" : "Follow"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const textStyle = {
  textAlign: "center",
  fontSize: 18,
  fontWeight: "bold"
};
const containerStyle = {
  alignSelf: "center",
  width: 120,
  height: 45,
  borderRadius: 5,
  paddingHorizontal: 10,
  shadowColor: colors.shadow,
  shadowOpacity: 0.6,
  shadowOffset: { width: 2, height: 2 },
  shadowRadius: 3,
  marginTop: 20
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
