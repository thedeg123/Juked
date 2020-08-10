import React, { useEffect, useState, useContext } from "react";
import {
  View,
  StyleSheet,
  LayoutAnimation,
  UIManager,
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

  const activeHeight = heights.tabBarHeight + 35 + 55;

  if (Platform.OS === "android") {
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
    <View style={[{ height: activeMusic ? activeHeight : 0 }, styles.border]}>
      {activeMusic && (
        <View style={{ height: 55, paddingTop: 5 }}>
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
          styles.navigatorStyle,
          {
            borderColor: colors.shadow,
            backgroundColor: activeMusic
              ? "transparent"
              : colors.translucentWhite,
            borderTopWidth: activeMusic ? 0 : 0.5,
            borderWidth: activeMusic ? 0 : 1
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
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderColor: colors.lightShadow,
    borderWidth: 1
  },
  navigatorStyle: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 1,
    borderColor: colors.lightShadow,
    position: "absolute",
    paddingBottom: 5,
    height: heights.tabBarHeight
  }
});

export default TabBarComponent;
