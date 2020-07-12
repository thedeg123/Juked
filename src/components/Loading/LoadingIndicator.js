import React from "react";
import colors from "../../constants/colors";
import { View } from "react-native";
import { WaveIndicator } from "react-native-indicators";

const LoadingIndicator = ({ size, color }) => {
  return (
    <View style={{ height: size || 40 }}>
      <WaveIndicator
        waveMode="fill"
        count={3}
        size={size || 40}
        color={color || colors.primary}
      ></WaveIndicator>
    </View>
  );
};

export default LoadingIndicator;
