//Provides margin on components
import React from "react";
import { View, StyleSheet, Text, FlatList, Dimensions } from "react-native";
import ArtistPreview from "./ArtistPreview";
import colors from "../constants/colors";

const RecordRow = ({ title, data }) => {
  const width = Dimensions.get("window").width;

  return (
    <View>
      <Text style={styles.sectionStyle}>{title}</Text>
      <FlatList
        horizontal
        key={() => title}
        keyExtractor={item => String(item.id) + title}
        data={data}
        horizontal={true}
        decelerationRate={0}
        snapToInterval={width * 0.5} //your element width snapToAlignment=
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View
            style={{
              width: width * 0.5
            }}
          >
            <ArtistPreview content={item} />
          </View>
        )}
      ></FlatList>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionStyle: {
    marginVertical: 10,
    marginHorizontal: 10,
    fontSize: 30,
    color: colors.text,
    fontWeight: "bold"
  }
});

export default RecordRow;
