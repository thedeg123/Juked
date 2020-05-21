import React from "react";
import {
  Text,
  FlatList,
  View,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import { withNavigation } from "react-navigation";

const ArtistNames = ({
  navigation,
  artists,
  allowPress,
  textStyle,
  horizontal
}) => {
  textStyle = textStyle || {};
  horizontal = typeof horizontal === "boolean" ? horizontal : true;
  return (
    <FlatList
      horizontal={horizontal}
      scrollEnabled={false}
      data={artists}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item, index }) => {
        return (
          <TouchableOpacity
            disabled={!allowPress}
            onPress={() => navigation.push("Artist", { content_id: item.id })}
          >
            <Text style={textStyle}>
              {index === 0 ? "" : " & "}
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      }}
      keyExtractor={item => item.id}
    ></FlatList>
  );
};

const styles = StyleSheet.create({});
export default withNavigation(ArtistNames);
