import React, { useEffect, useState, useContext } from "react";
import {
  View,
  StyleSheet,
  LayoutAnimation,
  UIManager,
  Dimensions,
  Platform
} from "react-native";
import colors from "../../constants/colors";
import heights from "../../constants/heights";
import { BottomTabBar } from "react-navigation-tabs";
import context from "../../context/context";

import { customCardAnimation } from "../../constants/heights";
import MusicPlayer from "./MusicPlayer";

const TabBarComponent = props => {
  const { useMusic } = useContext(context);

  const [activeMusic, setActiveMusic] = useState(false);
  const [activeContent, setActiveContent] = useState(null);

  const isAndroid = Platform.OS == "android";
  const shorten =
    isAndroid ||
    Dimensions.get("window").height === 667 || // iPhone 8 or SE2
    Dimensions.get("window").height === 736; // iPhone 8 Plus

  const iosBottomHeight = 35;
  const activeHeight =
    heights.tabBarHeight + 55 + (shorten ? 0 : iosBottomHeight);

  if (isAndroid) {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  useEffect(() => {
    useMusic.establishMusicPlayer(setActiveMusic, setActiveContent);
  }, []);

  useEffect(() => {
    LayoutAnimation.configureNext(customCardAnimation);
  }, [activeMusic]);

  return (
    <View
      style={[
        {
          height: activeMusic
            ? activeHeight
            : isAndroid
            ? heights.tabBarHeight
            : 0
        },
        styles.border
      ]}
    >
      {activeMusic && (
        <View
          style={{
            height: 55,
            borderTopWidth: 0.5,
            borderColor: colors.lightShadow,
            paddingTop: 5
          }}
        >
          <MusicPlayer
            content={activeContent}
            onClose={() => {
              LayoutAnimation.configureNext(customCardAnimation);
              setActiveMusic(false);
            }}
          />
        </View>
      )}
      <BottomTabBar
        style={[
          isAndroid ? styles.androidNavigatorStyle : styles.iosNavigatorStyle,
          {
            borderColor: colors.shadow,
            backgroundColor: activeMusic
              ? "transparent"
              : colors.translucentWhite,
            borderTopWidth: 0
          }
        ]}
        activeTintColor={colors.primary}
        inactiveTintColor={colors.shadow}
        {...props}
      ></BottomTabBar>
    </View>
  );
};

const styles = StyleSheet.create({
  border: {
    borderColor: colors.lightShadow
  },
  iosNavigatorStyle: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderColor: colors.lightShadow,
    position: "absolute",
    height: heights.tabBarHeight
  },
  androidNavigatorStyle: {
    borderTopWidth: 1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderColor: colors.lightShadow,
    height: heights.tabBarHeight
  }
});

export default TabBarComponent;
