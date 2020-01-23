import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const ArtistScreen = ({ navigation }) => {
  const music_id = navigation.getParam("music_id");
  const title = navigation.getParam("title");
  const result = {};
  const { images, name } = result;

  return (
    <View>
      <Image
        style={{
          width: "50%",
          aspectRatio: images[0].width / images[0].height
        }}
        source={{ uri: images[0].url }}
      />
      <Text style={styles.title}>{name}</Text>
      <View style={{ flexDirection: "row" }}>
        <Text style={styles.subtitle}>
          Your rating: <Text style={styles.rating}>{rating}</Text>
        </Text>
        <Text style={styles.subtitle}>
          Average rating: <Text style={styles.rating}>{avg_rating}</Text>
        </Text>
      </View>
      <FlatList
        data={results}
        keyExtracter={item => item.name}
        renderItem={({ item }) => {
          return <ListPreview result={item} />;
        }}
        columnWrapperStyle={styles.column}
        numColumns={2}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    flexDirection: "column",
    flex: 1,
    alignItems: "center"
  },
  column: { flexShrink: 1, width: "50%" },
  title: { fontSize: 30, color: colors.text },
  subtitle: {
    fontSize: 18,
    color: colors.text,
    padding: 10,
    paddingBottom: 40
  },
  rating: {
    color: colors.primary,
    fontWeight: "bold"
  }
});

export default ArtistScreen;
