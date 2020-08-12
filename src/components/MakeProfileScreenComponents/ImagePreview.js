import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import images from "../../constants/images";
import colors from "../../constants/colors";

const ImagePreview = ({ imageURL }) => {
  return (
    <View style={styles.imageBorderStyle}>
      <Image
        style={styles.imageStyle}
        source={{ uri: imageURL.length ? imageURL : images.profileDefault }}
      ></Image>
    </View>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    fontSize: 10
  },
  imageBorderStyle: {
    backgroundColor: colors.white,
    borderWidth: 0.5,
    alignSelf: "center",
    borderColor: colors.shadow,
    width: 100,
    aspectRatio: 1,
    borderRadius: 5,
    marginBottom: 20
  },
  imageStyle: {
    flex: 1,
    borderRadius: 5
  }
});

export default ImagePreview;
