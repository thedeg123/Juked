import React, { useEffect, useState, useContext } from "react";
import {
  View,
  StyleSheet,
  LayoutAnimation,
  UIManager,
  Text,
  Platform,
  Dimensions
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
  const inactiveHeight = heights.tabBarHeight + (shorten ? 0 : iosBottomHeight);
  const activeHeight = inactiveHeight + 55;
  const height = activeMusic ? activeHeight : inactiveHeight;

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
          height,
          borderColor: colors.lightShadow,
          backgroundColor: activeMusic ? colors.white : colors.translucentWhite,
          top: Dimensions.get("window").height - height,
          position: "absolute",
          width: Dimensions.get("window").width,
          borderTopWidth: activeMusic ? 0.5 : 0,
          borderRadius: 0,
          borderColor: colors.lightShadow
        }
      ]}
    >
      {activeMusic && (
        <View
          style={{
            flex: 1,
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
          isAndroid ? styles.androidNavigatorStyle : styles.iosNavigatorStyle
        ]}
        activeTintColor={colors.primary}
        inactiveTintColor={colors.shadow}
        {...props}
      >
        <Text>he</Text>
      </BottomTabBar>
    </View>
  );
};

const styles = StyleSheet.create({
  iosNavigatorStyle: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderColor: colors.lightShadow,
    backgroundColor: "transparent",
    borderTopWidth: 0,
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
