//Provides margin on components
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  LayoutAnimation,
  UIManager,
  PanResponder,
  Platform,
  FlatList
} from "react-native";
import colors from "../../constants/colors";
import BarItem from "./BarItem";
import { customBarAnimation } from "../../constants/heights";
import { selectionAsync } from "expo-haptics";

/**
 * @param {Array[11]} data - an array of size 11 where each element corrisponds to the value for said element in the bar graph
 */
const BarGraph = ({ data, setScrollEnabled }) => {
  const COMPONENT_HEIGHT = 100;
  const [show, setShow] = useState(false);
  const [activatedBar, setActivatedBar] = useState(null);
  data = data || new Array(11).fill(0);
  const screenWidth = Dimensions.get("window").width;
  const barWidth = Math.floor(screenWidth / 10) - 15;

  const largestEl = Math.max(...data) || 1;

  if (Platform.OS === "android") {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  const sumData = data.reduce((a, b) => a + b, 0);
  const prepared_data = [];
  data.forEach((value, index) => {
    prepared_data.push({
      value,
      height: (value / largestEl) * COMPONENT_HEIGHT,
      label: String(index)
    });
  });

  useEffect(() => {
    LayoutAnimation.configureNext(customBarAnimation);
    setShow(true);
  }, []);

  //vibrate on change of bar value
  useEffect(() => {
    selectionAsync();
  }, [activatedBar]);

  const updatePosition = location => {
    let newVal = Math.ceil(location / barWidth - 2.5);
    setActivatedBar(newVal > 10 ? 10 : newVal < 0 ? 0 : newVal);
    return true;
  };

  const _panResponder = PanResponder.create({
    onStartShouldSetPanResponderCapture: () => {
      setScrollEnabled(false);
      return true;
    },
    onPanResponderTerminate: () => {
      setActivatedBar(null);
      setScrollEnabled(true);
      return true;
    },
    onPanResponderEnd: () => {
      setScrollEnabled(true);
      return true;
    },
    onPanResponderRelease: () => {
      setScrollEnabled(true);
      return true;
    },
    onStartShouldSetPanResponder: (evt, gestureState) => {
      setScrollEnabled(false);
      updatePosition(evt.nativeEvent.pageX);
    },
    onPanResponderMove: (evt, gestureState) =>
      updatePosition(evt.nativeEvent.pageX),
    onPanResponderRelease: () => {
      setScrollEnabled(true);
      setActivatedBar(null);
      return true;
    }
  });

  return (
    <View style={styles.containerStyle}>
      <View {..._panResponder.panHandlers}>
        <FlatList
          data={prepared_data}
          renderItem={({ item }) => (
            <BarItem
              height={show ? item.height : 0}
              width={barWidth}
              total_height={COMPONENT_HEIGHT}
              label={item.label}
              activated={activatedBar === Number(item.label)}
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
        {activatedBar || activatedBar === 0 ? data[activatedBar] : sumData}
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

BarGraph.defaultProps = {
  setScrollEnabled: () => {}
};

export default BarGraph;
