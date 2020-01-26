import React from "react";
import { Text, View, StyleSheet } from "react-native";
import colors from "../../constants/colors";

const ArtistContent = ({ header, subheader }) => {
  return (
    <View style={styles.containerStyle} onPress={() => {}}>
      <Text style={styles.headerStyle}>{header}</Text>
      <Text style={styles.subheaderStyle}>{subheader}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    bottom: 252, //224 - marginTop = 214
    borderWidth: 1,
    height: 76, //180 - marginTop-marginBottom -picHeight= 76
    justifyContent: "space-between",
    marginRight: 150
  },
  headerStyle: {
    fontSize: 20,
    color: colors.primary
  },
  subheaderStyle: {
    fontSize: 16,
    color: colors.primary
  }
});

export default ArtistContent;
