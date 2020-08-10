import React from "react";
import { Animated, StatusBar } from "react-native";
import StackHeader from "./StackHeader";
import HeaderBackButton from "./HeaderBackButton.js";
import colors from "../../constants/colors";

export default ({ scene, previous, navigation }) => {
  const { options } = scene.descriptor;
  const title =
    options.title || options.headerTitle || scene.descriptor.state.routeName;
  const onBackPress = options.onBackPress;
  const progress = Animated.add(
    scene.progress.current,
    scene.progress.next || 0
  );
  const opacity = progress.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0, 1, 0]
  });

  return (
    <Animated.View style={{ opacity }}>
      <StatusBar backgroundColor={colors.white} barStyle={"dark-content"} />
      <StackHeader
        title={title}
        previous={previous}
        center={options.headerComponent}
        leftButton={
          previous && (
            <HeaderBackButton
              onPress={() =>
                onBackPress ? onBackPress() : navigation.goBack()
              }
            />
          )
        }
        rightButton={options.headerRight}
      />
    </Animated.View>
  );
};
