//Provides margin on components
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  LayoutAnimation,
  UIManager,
  Platform,
  FlatList
} from "react-native";
import colors from "../../constants/colors";
import BarItem from "./BarItem";
import { customBarAnimation } from "../../constants/heights";
/**
 * @param {Array[11]} data - an array of size 11 where each element corrisponds to the value for said element in the bar graph
 */
const BarGraph = ({ data }) => {
  const COMPONENT_HEIGHT = 100;
  const [show, setShow] = useState(false);
  const [num, setNum] = useState(null);
  const screenWidth = Dimensions.get("window").width;
  const barWidth = Math.floor(screenWidth / 10) - 15;
  if (!data) data = new Array(11).fill(0);
  const largestEl = Math.max(...data) || 1;

  if (Platform.OS === "android") {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

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
  useEffect(() => {
    LayoutAnimation.configureNext(customBarAnimation);
    setShow(true);
  }, []);
  return (
    <View style={styles.containerStyle}>
      <View>
        <FlatList
          data={prepared_data}
          renderItem={({ item }) => (
            <BarItem
              value={item.value}
              height={show ? item.height : 0}
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
      <Text
        style={{
          color: colors.primary,
          fontWeight: "300",
          fontSize: sumData < 10000 ? 35 : 25
        }}
      >
        {num || num == 0 ? num : sumData}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 5,
    height: 125,
    paddingTop: 5,
    paddingHorizontal: 10
  }
});

export default BarGraph;
