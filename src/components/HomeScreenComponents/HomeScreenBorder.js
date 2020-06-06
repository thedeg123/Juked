import React from "react";
import {
  StyleSheet,
  View,
  ImageBackground,
  TouchableOpacity
} from "react-native";
import colors from "../../constants/colors";
import { withNavigation } from "react-navigation";
import navigateContent from "../../helpers/navigateContent";

const HomeScreenBorder = ({
  navigation,
  children,
  content,
  review,
  author
}) => {
  return (
    <TouchableOpacity
      style={styles.shadowEdge}
      activeOpacity={0.8}
      onPress={() =>
        navigateContent(
          navigation,
          content.id,
          content.album_id,
          review,
          content,
          author
        )
      }
    >
      <ImageBackground
        source={{ uri: content.image }}
        blurRadius={70}
        style={review.data.is_review ? styles.withTitle : styles.noTitle}
      >
        <View style={styles.child}>{children}</View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

let boxStyle = {
  borderRadius: 5,
  margin: 5,
  marginBottom: 0,
  resizeMode: "cover",
  overflow: "hidden",
  alignSelf: "stretch",
  marginTop: 10,
  borderWidth: 0.5,
  borderColor: colors.lightShadow
};
const styles = StyleSheet.create({
  withTitle: {
    ...boxStyle,
    height: 135 //100+17+17
  },
  shadowEdge: {
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowOffset: { width: 3, height: 3 },
    shadowRadius: 2,
    flex: 1
  },
  child: {
    flex: 1,
    backgroundColor: colors.darkener
  },
  noTitle: {
    ...boxStyle,
    height: 100 //70+15+15
  }
});

export default withNavigation(HomeScreenBorder);
