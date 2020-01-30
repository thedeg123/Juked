import React from "react";
import { StyleSheet, Image, TouchableOpacity } from "react-native";
import colors from "../../constants/colors";
import images from "../../constants/images";
import { withNavigation } from "react-navigation";

const ContentPic = ({ navigation, img, cid, type, album_cid }) => {
  img = img || images.artistDefault; //becuase we cant set a default val from another file
  return (
    <TouchableOpacity
      style={styles.contentStyle}
      onPress={() => {
        switch (type) {
          case "album":
            return navigation.navigate("Album", {
              content_id: cid,
              highlighted: ""
            });
          case "artist":
            return navigation.navigate("Artist", { content_id: cid });
          case "track":
            return navigation.navigate("Album", {
              content_id: album_cid,
              highlighted: cid
            });
          default:
            return;
        }
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
    borderWidth: 1,
    borderRadius: 5
  }
});

export default withNavigation(ContentPic);
