import React, { useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Input } from "react-native-elements";

const ImagePreview = ({ imageURL, setImageUrl }) => {
  const [showImage, setShowImage] = useState(false);
  return (
    <View>
      <View style={styles.imageBorderStyle}>
        {showImage ? (
          <Image style={styles.imageStyle} source={{ uri: imageURL }}></Image>
        ) : null}
      </View>
      <Input
        label="Paste a URL for a profile pic,"
        value={imageURL}
        onChangeText={text => {
          setShowImage(false);
          setImageUrl(text);
        }}
        onEndEditing={text => {
          setShowImage(Boolean(text.nativeEvent.text.length));
        }}
        autoCapitalize="none"
        keyboardType="web-search"
        autoCorrect={false}
      ></Input>
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
    width: 200,
    borderRadius: 5,
    height: 200,
    marginBottom: 20
  },
  imageStyle: {
    flex: 1,
    borderRadius: 5
  }
});

export default ImagePreview;
