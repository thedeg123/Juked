import React from "react";
import { StyleSheet, Image, TouchableOpacity } from "react-native";
import colors from "../../constants/colors";
import images from "../../constants/images";

const ContentPic = ({ img, cid }) => {
  return (
    <TouchableOpacity style={styles.contentStyle} onPress={() => {}}>
      <Image
        style={styles.imageStyle}
        source={{ uri: img || images.artistDefault }}
      ></Image>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  contentStyle: {
    alignSelf: "flex-start",
    bottom: 254
  },
  imageStyle: {
    width: 84,
    height: 84,
    borderColor: colors.shadow,
    borderWidth: 1
  }
});

export default ContentPic;
