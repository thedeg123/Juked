import React from "react";
import {
  StyleSheet,
  View,
  ImageBackground,
  TouchableOpacity
} from "react-native";
import colors from "../../constants/colors";
import images from "../../constants/images";
import { AntDesign } from "@expo/vector-icons";
import PlayButton from "../PlayButton";

const ContentPic = ({
  content,
  width,
  showPlay,
  borderRadius,
  borderWidth
}) => {
  const img = content.image || images.artistDefault; //becuase we cant set a default val from another file
  return (
    <View
      style={{
        overflow: "hidden",
        borderColor: colors.veryTranslucentWhite,
        ...borderWidth,
        ...borderRadius
      }}
    >
      <ImageBackground
        imageStyle={borderRadius}
        style={{ ...styles.imageStyle, width: width + 5 }}
        source={{ uri: img }}
      >
        {showPlay ? (
          <PlayButton
            content={content}
            containerStyle={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center"
            }}
            PlayComponent={
              <AntDesign
                name="play"
                size={width / 2.5}
                color={colors.semiTranslucentWhite}
              />
            }
          />
        ) : null}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  imageStyle: {
    aspectRatio: 1
  }
});

ContentPic.defaultProps = {
  width: 50,
  showPlay: false
};

export default ContentPic;
