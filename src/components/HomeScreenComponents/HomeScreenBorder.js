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
        blurRadius={20}
        style={review.data.title ? styles.withTitle : styles.noTitle}
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
  borderWidth: 1,
  borderColor: colors.shadow
};
const styles = StyleSheet.create({
  withTitle: {
    ...boxStyle,
    height: 150 //120+15+15
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
    backgroundColor: "rgba(0,0,0,0.12)"
  },
  noTitle: {
    ...boxStyle,
    height: 120 //120+15+15
  }
});

export default withNavigation(HomeScreenBorder);
