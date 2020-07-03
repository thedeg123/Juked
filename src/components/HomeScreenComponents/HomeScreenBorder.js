import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ImageBackground,
  LayoutAnimation,
  UIManager,
  Platform,
  TouchableOpacity
} from "react-native";
import colors, { blurRadius } from "../../constants/colors";
import { withNavigation } from "react-navigation";
import navigateContent from "../../helpers/navigateContent";
import { customCardAnimation } from "../../constants/heights";

const HomeScreenBorder = ({
  navigation,
  children,
  content,
  review,
  author
}) => {
  const [show, setShow] = useState(false);

  if (Platform.OS === "android") {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  useEffect(() => {
    LayoutAnimation.configureNext(customCardAnimation);
    setShow(true);
  }, []);

  return (
    <TouchableOpacity
      style={show ? styles.showBox : styles.hideBox}
      activeOpacity={0.8}
      onPress={() => {
        navigateContent(
          navigation,
          review.content_id,
          content.album_id,
          review,
          content,
          author
        );
      }}
    >
      <ImageBackground
        source={{ uri: content.image }}
        blurRadius={blurRadius}
        style={review.data.is_review ? styles.withTitle : styles.noTitle}
      >
        <View style={styles.child}>{children}</View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const boxStyle = {
  borderRadius: 5,
  margin: 5,
  marginBottom: 0,
  resizeMode: "cover",
  overflow: "hidden",
  alignSelf: "stretch",
  marginTop: 10,
  borderWidth: 0.5,
  borderColor: colors.shadow
};

const shadowEdge = {
  shadowColor: colors.shadow,
  shadowOpacity: 1,
  shadowOffset: { width: 3, height: 3 },
  shadowRadius: 1
};

const styles = StyleSheet.create({
  withTitle: {
    ...boxStyle,
    height: 135 //100+17+17
  },
  showBox: shadowEdge,
  hideBox: { ...shadowEdge, width: 0 },
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
