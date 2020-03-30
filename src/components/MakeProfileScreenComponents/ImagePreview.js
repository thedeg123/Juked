import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import images from "../../constants/images";

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
    borderWidth: 1,
    alignSelf: "center",
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
