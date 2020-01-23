//Provides margin on components
import React from "react";
import { View, StyleSheet, Text } from "react-native";

const HomeScreenItem = ({ tracks }) => {
  return (
    <>
      {tracks ? (
        <View>
          <Text style={styles.titleStyle}>{tracks.name}</Text>
        </View>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  titleStyle: {
    fontSize: 26
  }
});

export default HomeScreenItem;
