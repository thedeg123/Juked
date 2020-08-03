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
  author,
  onLongPress,
  forWriteList,
  containerStyle,
  height
}) => {
  const [show, setShow] = useState(false);
  if (review && review.data.type === "list") content = review.data.items[0];

  if (Platform.OS === "android") {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  useEffect(() => {
    if (!forWriteList) LayoutAnimation.configureNext(customCardAnimation);
    setShow(true);
  }, []);

  return (
    show && (
      <TouchableOpacity
        style={[styles.showBox, containerStyle]}
        activeOpacity={0.8}
        onLongPress={onLongPress}
        onPress={() => {
          !forWriteList &&
            navigateContent(
              navigation,
              review ? review.content_id : null,
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
          style={[styles.boxStyle, { height: height }]}
        >
          <View style={styles.child}>{children}</View>
        </ImageBackground>
      </TouchableOpacity>
    )
  );
};

const styles = StyleSheet.create({
  boxStyle: {
    borderRadius: 5,
    margin: 5,
    marginBottom: 0,
    resizeMode: "cover",
    overflow: "hidden",
    alignSelf: "stretch",
    marginTop: 12,
    marginHorizontal: 10,
    borderWidth: 0.5,
    borderColor: colors.shadow
  },
  showBox: {
    shadowColor: colors.darkShadow,
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 6,
    flex: 1
  },
  child: {
    flex: 1,
    backgroundColor: colors.darkener
  }
});

HomeScreenBorder.defaultProps = {
  height: 100
};

export default withNavigation(HomeScreenBorder);
