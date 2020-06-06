import React from "react";
import { StyleSheet, Image, View } from "react-native";
import colors from "../../constants/colors";
import images from "../../constants/images";

const ContentPic = ({ img, width, is_review }) => {
  img = img || images.artistDefault; //becuase we cant set a default val from another file
  return (
    <View style={styles.contentStyle}>
      <View
        style={{
          borderRightWidth: 1,
          borderBottomWidth: is_review ? 1 : 0,
          borderRadius: 5,
          borderColor: colors.veryTranslucentWhite
        }}
      >
        <Image
          style={{ width, ...styles.imageStyle }}
          source={{ uri: img }}
        ></Image>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contentStyle: {
    alignSelf: "flex-start"
  },
  imageStyle: {
    aspectRatio: 1,
    borderRadius: 5
  }
});

export default ContentPic;
