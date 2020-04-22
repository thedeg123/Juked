//Provides margin on components
import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, FlatList } from "react-native";
import colors from "../../constants/colors";
import BarItem from "./BarItem";

/**
 * @param {Array[11]} data - an array of size 11 where each element corrisponds to the value for said element in the bar graph
 */
const BarGraph = ({ data }) => {
  const COMPONENT_HEIGHT = 100;
  const [num, setNum] = useState(null);
  const screenWidth = Dimensions.get("window").width;
  const barWidth = Math.floor(screenWidth / 10) - 15;
  if (!data) data = new Array(11).fill(0);
  const largestEl = Math.max(...data) || 1;

  const sumData = data.reduce((a, b) => a + b, 0);
  const scaled_data = data.map(element => element / largestEl);
  const prepared_data = [];
  for (let i = 0; i < 11; i++) {
    prepared_data.push({
      value: data[i],
      height: scaled_data[i] * COMPONENT_HEIGHT,
      label: String(i)
    });
  }
  return (
    <View style={styles.containerStyle}>
      <View>
        <FlatList
          data={prepared_data}
          renderItem={({ item }) => (
            <BarItem
              value={item.value}
              height={item.height}
              width={barWidth}
              total_height={COMPONENT_HEIGHT}
              label={item.label}
              setNum={setNum}
            />
          )}
          keyExtractor={item => item.label}
          horizontal
          scrollEnabled={false}
        />
      </View>
      <Text style={styles.textStyle}>{num || num == 0 ? num : sumData}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 5,
    backgroundColor: colors.secondary,
    height: 125,
    paddingTop: 5,
    paddingHorizontal: 10
  },
  textStyle: {
    color: colors.white,
    fontSize: 24
  }
});

export default BarGraph;
