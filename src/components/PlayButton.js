//Provides margin on components
import React, { useContext } from "react";
import { TouchableOpacity } from "react-native";

import colors from "../constants/colors";
import context from "../context/context";
import { Entypo } from "@expo/vector-icons";

const PlayButton = ({ content, PlayComponent, containerStyle }) => {
  const { useMusic } = useContext(context);
  if (!content || !content.preview_url) return null;
  return (
    <TouchableOpacity
      style={containerStyle ? containerStyle : { paddingHorizontal: 10 }}
      onPress={() => useMusic.playContent(content)}
    >
      {!PlayComponent ? (
        <Entypo name="controller-play" size={25} color={colors.text} />
      ) : (
        PlayComponent
      )}
    </TouchableOpacity>
  );
};

export default PlayButton;
