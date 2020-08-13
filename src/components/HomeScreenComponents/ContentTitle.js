import React from "react";
import { Text, View, StyleSheet } from "react-native";
import colors from "../../constants/colors";
import ArtistNames from "../ArtistNames";

const ContentTitle = ({ header, subheader }) => {
  return (
    <View style={styles.containerStyle}>
      <Text
        numberOfLines={2}
        style={[styles.headerStyle, { fontSize: header.length > 12 ? 18 : 24 }]}
      >
        {header}
      </Text>
      {subheader ? (
        <ArtistNames
          artists={subheader}
          allowPress={false}
          textStyle={[
            styles.subheaderStyle,
            { fontSize: subheader.length === 1 ? 14 : 12 }
          ]}
        ></ArtistNames>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    justifyContent: "center",
    flex: 1,
    height: 65,
    marginHorizontal: 5
  },
  headerStyle: {
    fontSize: 20,
    marginBottom: 5,
    fontWeight: "bold",
    color: colors.white
  },
  subheaderStyle: {
    bottom: 1,
    fontSize: 18,
    color: colors.white
  },
  dateStyle: {
    marginBottom: 5,
    fontSize: 14,
    color: colors.white
  }
});

ContentTitle.defaultProps = {
  header: "",
  subheader: "",
  rating: Date(),
  fontScaling: 1,
  review: false
};

export default ContentTitle;
