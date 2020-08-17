import React from "react";
import { TouchableOpacity, Text } from "react-native";
import colors from "../constants/colors";

const Button = ({ title, color, onPress }) => {
  return (
    <TouchableOpacity style={{ margin: 5 }} onPress={onPress}>
      <Text
        style={{
          textAlign: "center",
          fontSize: 18,
          color: color || colors.primary
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
