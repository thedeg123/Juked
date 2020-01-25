//Provides margin on components
import React from "react";
import { View, StyleSheet, Text } from "react-native";
import colors from "../../constants/colors";

const HomeScreenItem = ({ tracks }) => {
  return (
    <>
      {tracks ? (
        <View style={styles.boxStyle}>
          <Text style={styles.titleStyle}>{tracks.name}</Text>
        </View>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  boxStyle: {
    alignSelf: "stretch",
    marginVertical: 10,
    backgroundColor: colors.backgroundColor,
    borderColor: colors.primary,
    borderWidth: 2,
    height: 150,
    padding: 5
  }
});

export default HomeScreenItem;
