import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import colors from "../../constants/colors";

const ContentPic = ({ children, navigate }) => {
  return (
    <>
      {navigate ? (
        <TouchableOpacity
          style={styles.boxStyle}
          onPress={() => {
            console.log("We will navigate to review:", navigate);
          }}
        >
          {children}
        </TouchableOpacity>
      ) : (
        <View style={styles.boxStyle}>{children}</View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  boxStyle: {
    borderRadius: 5,
    alignSelf: "stretch",
    marginTop: 15,
    backgroundColor: colors.backgroundColor,
    borderColor: colors.primary,
    borderWidth: 2,
    height: 180,
    padding: 10
  }
});

export default ContentPic;
