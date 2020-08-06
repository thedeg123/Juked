//Provides margin on components
import React from "react";
import { View, Text } from "react-native";
import colors from "../../constants/colors";

const BarItem = ({ width, height, total_height, label, activated }) => {
  return (
    <View>
      <View
        style={{
          height: total_height,
          justifyContent: "flex-end"
        }}
      >
        <View
          style={{
            width,
            height,
            backgroundColor: colors.secondary,
            opacity: activated ? 1 : 0.4,
            marginHorizontal: 1,
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5
          }}
        ></View>
      </View>
      <Text
        style={{
          textAlign: "center",
          fontWeight: activated ? "bold" : "300",
          color: colors.text,
          fontSize: 15
        }}
      >
        {label}
      </Text>
    </View>
  );
};

export default BarItem;
