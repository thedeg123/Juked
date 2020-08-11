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
  showPlay,
  borderRadius,
  borderWidth
}) => {
  const { useMusic } = useContext(context);
  const img = content.image || images.artistDefault; //becuase we cant set a default val from another file
  return (
    <View
      style={{
        overflow: "hidden",
        ...borderWidth,
        ...borderRadius,
        borderColor: colors.veryTranslucentWhite
      }}
    >
      <ImageBackground
        imageStyle={borderRadius}
        style={{ ...styles.imageStyle, width: width + 5 }}
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
