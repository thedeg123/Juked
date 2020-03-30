import React from "react";
import {
  StyleSheet,
  View,
  ImageBackground,
  TouchableOpacity
} from "react-native";
import colors from "../../constants/colors";
import { withNavigation } from "react-navigation";

const HomeScreenBorder = ({ navigation, img, children, rid }) => {
  return rid ? (
    <TouchableOpacity
      style={styles.shadowEdge}
      onPress={() => navigation.navigate("Review", { rid })}
    >
      <ImageBackground
        source={{ uri: img }}
        blurRadius={20}
        style={styles.withTitle}
      >
        <View style={styles.child}>{children}</View>
      </ImageBackground>
    </TouchableOpacity>
  ) : (
    <View style={styles.shadowEdge}>
      <ImageBackground
        source={{ uri: img }}
        blurRadius={20}
        style={styles.noTitle}
      >
        <View style={styles.child}>{children}</View>
      </ImageBackground>
    </View>
  );
};

let boxStyle = {
  borderRadius: 5,
  margin: 5,
  marginBottom: 0,
  resizeMode: "cover",
  overflow: "hidden",
  alignSelf: "stretch",
  marginTop: 10,
  borderColor: colors.shadow,
  borderWidth: 1
};
const styles = StyleSheet.create({
  withTitle: {
    ...boxStyle,
    height: 150 //120+15+15
  },
  shadowEdge: {
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
    flex: 1
  },
  child: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.12)"
  },
  noTitle: {
    ...boxStyle,
    height: 120 //120+15+15
  }
});

export default withNavigation(HomeScreenBorder);
