//Provides margin on child components
import React from "react";
import { useState } from "react";
import colors from "../../constants/colors";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

const ButtonFilter = ({ options, onPress }) => {
  const activatedStyle = {
    background: styles.activatedStyleBackground,
    text: styles.activatedStyleText
  };
  const deactivatedStyle = {
    background: styles.deactivatedStyleBackground,
    text: styles.deactivatedStyleText
  };
  const [style1, setStyle1] = useState(activatedStyle);
  const [style2, setStyle2] = useState(deactivatedStyle);
  const updateColors = setFirst => {
    if (setFirst) {
      setStyle1(activatedStyle);
      setStyle2(deactivatedStyle);
    } else {
      setStyle1(deactivatedStyle);
      setStyle2(activatedStyle);
    }
  };
  return (
    <View style={styles.listStyle}>
      <TouchableOpacity
        style={style1.background}
        onPress={() => {
          updateColors(true);
          onPress(options[0]);
        }}
      >
        <Text style={style1.text}>{options[0]}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={style2.background}
        onPress={() => {
          updateColors(false);
          onPress(options[1]);
        }}
      >
        <Text style={style2.text}>{options[1]}</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  listStyle: {
    padding: 2,
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    borderRadius: 3,
    flexDirection: "row",
    justifyContent: "space-around"
  },
  activatedStyleBackground: {
    paddingVertical: 2,
    flex: 1,
    backgroundColor: colors.primary
  },
  activatedStyleText: {
    textAlign: "center",
    color: colors.object,
    fontSize: 20
  },
  deactivatedStyleBackground: {
    paddingVertical: 2,
    flex: 1,
    backgroundColor: colors.object,
    color: "blue"
  },
  deactivatedStyleText: {
    color: colors.primary,
    textAlign: "center",
    fontSize: 20
  }
});

export default ButtonFilter;
