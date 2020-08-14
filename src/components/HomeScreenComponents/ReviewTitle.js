import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  LayoutAnimation,
  UIManager,
  Platform,
  TouchableOpacity
} from "react-native";
import colors from "../../constants/colors";
import { customCardAnimation } from "../../constants/heights";
import { AntDesign } from "@expo/vector-icons";

const ReviewTitle = ({ title }) => {
  const [multiline, setMultiline] = useState(false);

  if (Platform.OS === "android") {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  return (
    <TouchableOpacity
      disabled={title.length <= 40}
      onPress={() => {
        LayoutAnimation.configureNext(customCardAnimation);
        setMultiline(!multiline);
      }}
      style={{
        flexDirection: "row",
        alignSelf: "stretch",
        paddingLeft: 5,
        paddingVertical: 5
      }}
    >
      <Text numberOfLines={multiline ? 3 : 1} style={styles.textStyle}>
        {title}
      </Text>
      {title.length > 40 && (
        <AntDesign
          name={multiline ? "up" : "down"}
          size={20}
          style={{
            paddingRight: 5
          }}
          color={colors.translucentWhite}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    color: colors.translucentWhite
  }
});
export default ReviewTitle;
