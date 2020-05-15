//Provides margin on components
import React, { useState } from "react";
import { View, Text } from "react-native";
import colors from "../../constants/colors";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

const BarItem = ({ value, width, height, total_height, label, setNum }) => {
  const [activated, setActivated] = useState(false);
  return (
    <View>
      <TouchableWithoutFeedback
        style={{
          height: total_height,
          justifyContent: "flex-end"
        }}
        onPressIn={() => {
          setActivated(true);
          return setNum(value);
        }}
        onPressOut={() => {
          setActivated(false);
          return setNum(null);
        }}
      >
        <View
          style={{
            width,
            height,
            backgroundColor: activated ? colors.white : colors.white,
            opacity: activated ? 0.95 : 0.3,
            marginHorizontal: 1,
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5
          }}
        ></View>
      </TouchableWithoutFeedback>
      <Text
        style={{
          textAlign: "center",
          fontWeight: activated ? "bold" : "normal",
          color: colors.text
        }}
      >
        {label}
      </Text>
    </View>
  );
};

export default BarItem;
