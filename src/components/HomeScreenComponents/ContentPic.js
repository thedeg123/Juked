import React from "react";
import { StyleSheet, Image, TouchableOpacity } from "react-native";
import colors from "../../constants/colors";
import images from "../../constants/images";

const ContentPic = ({ img, cid }) => {
  img = img || images.artistDefault; //becuase we cant set a default val from another file
  return (
    <TouchableOpacity
      style={styles.contentStyle}
      onPress={() => {
        console.log("We will navigate to content:", cid);
      }}
    >
      <Image style={styles.imageStyle} source={{ uri: img }}></Image>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  contentStyle: {
    alignSelf: "flex-start",
    bottom: 250
  },
  imageStyle: {
    width: 84,
    height: 84,
    borderColor: colors.shadow,
    borderWidth: 1
  }
});

export default ContentPic;
