import React from "react";
import { View, KeyboardAvoidingView, Platform } from "react-native";

const KeyboardAvoidingViewWrapper = ({ style, children, behavior }) => {
  return Platform.OS === "android" ? (
    <View style={style}>{children}</View>
  ) : (
    <KeyboardAvoidingView style={style} behavior={behavior}>
      {children}
    </KeyboardAvoidingView>
  );
};

KeyboardAvoidingViewWrapper.defaultProps = {
  behavior: "position"
};

export default KeyboardAvoidingViewWrapper;
