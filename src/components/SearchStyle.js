import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import colors from "../constants/colors";

const SearchStyle = ({ options, setSearchType, onChangeButton }) => {
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
  const [style3, setStyle3] = useState(deactivatedStyle);
  const [style4, setStyle4] = useState(deactivatedStyle);

  const updateColors = setNum => {
    if (setNum === 1) {
      setStyle1(activatedStyle);
      setStyle2(deactivatedStyle);
      setStyle3(deactivatedStyle);
      setStyle4(deactivatedStyle);
    } else if (setNum === 2) {
      setStyle1(deactivatedStyle);
      setStyle2(activatedStyle);
      setStyle3(deactivatedStyle);
      setStyle4(deactivatedStyle);
    } else if (setNum === 3) {
      setStyle1(deactivatedStyle);
      setStyle2(deactivatedStyle);
      setStyle3(activatedStyle);
      setStyle4(deactivatedStyle);
    } else {
      setStyle1(deactivatedStyle);
      setStyle2(deactivatedStyle);
      setStyle3(deactivatedStyle);
      setStyle4(activatedStyle);
    }
  };

  return (
    <View style={styles.listStyle}>
      <TouchableOpacity
        style={style1.background}
        onPress={() => {
          updateColors(1);
          onChangeButton("track");
        }}
      >
        <Text style={style1.text}>{options[0]}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={style2.background}
        onPress={() => {
          updateColors(2);
          onChangeButton("album");
        }}
      >
        <Text style={style2.text}>{options[1]}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={style3.background}
        onPress={() => {
          updateColors(3);
          onChangeButton("artist");
        }}
      >
        <Text style={style3.text}>{options[2]}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={style4.background}
        onPress={() => {
          updateColors(4);
          onChangeButton("user");
          //setSearchType("user");
        }}
      >
        <Text style={style4.text}>{options[3]}</Text>
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
    color: colors.background,
    fontSize: 20
  },
  deactivatedStyleBackground: {
    paddingVertical: 2,
    flex: 1,
    backgroundColor: colors.background,
    color: "blue"
  },
  deactivatedStyleText: {
    color: colors.primary,
    textAlign: "center",
    fontSize: 20
  }
});

export default SearchStyle;
