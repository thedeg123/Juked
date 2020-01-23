import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

const AlbumScreen = ({ navigation }) => {
  const music_id = navigation.getParam("music_id");
  const title = navigation.getParam("title");
  return (
    <View>
      <Text style={styles.headerStyle}>AlbumScreen</Text>
      <FlatList
        data={l}
        keyExtracter={i => i.item.name}
        renderItem={i => {
          return <ListPreview result={i.item} />;
        }}
        columnWrapperStyle={styles.column}
        numColumns={2}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    fontSize: 60
  }
});

export default AlbumScreen;
