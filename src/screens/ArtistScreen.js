import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ArtistScreen = ({ navigation }) => {
  const music_id = navigation.getParam("music_id");
  const title = navigation.getParam("title");
  const results;
  return (
    <View>
      <Text style={styles.headerStyle}>ArtistScreen</Text>
      <FlatList
        data={results}
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
  },
  column: { flexShrink: 1, width: "50%" }
});

export default ArtistScreen;
