import React, { useContext } from "react";
import {
  StyleSheet,
  View,
  ImageBackground,
  TouchableOpacity
} from "react-native";
import colors from "../../constants/colors";
import images from "../../constants/images";
import { AntDesign } from "@expo/vector-icons";
import context from "../../context/context";

const ContentPic = ({
  content,
  width,
  is_review,
  style,
  imageStyle,
  showPlay
}) => {
  const { useMusic } = useContext(context);
  const img = content.image || images.artistDefault; //becuase we cant set a default val from another file
  return (
    <View style={[styles.contentStyle, style]}>
      <View
        style={{
          borderRightWidth: 1,
          borderBottomWidth: is_review ? 1 : 0,
          borderRadius: 5,
          borderColor: colors.veryTranslucentWhite,
          ...style
        }}
      >
        <ImageBackground
          style={[{ width, ...styles.imageStyle }, imageStyle]}
          source={{ uri: img }}
        >
          {content.preview_url && showPlay && (
            <TouchableOpacity
              onPress={() => useMusic.playContent(content)}
              style={styles.buttonWrapper}
            >
              <AntDesign
                name="play"
                size={width / 3}
                color={colors.semiTranslucentWhite}
              />
            </TouchableOpacity>
          )}
        </ImageBackground>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    aspectRatio: 1,
    borderRadius: 5
  },
  buttonWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});

ContentPic.defaultProps = {
  style: {},
  imageStyle: {},
  width: 0,
  showPlay: false
};

export default ContentPic;
