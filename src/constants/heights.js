import { Platform, Dimensions } from "react-native";

export default {
  tabBarHeight:
    Platform.OS === "android"
      ? 50
      : Dimensions.get("window").height === 667 // iPhone 8 or SE2
      ? 50
      : Dimensions.get("window").height === 736 // iPhone 8 Plus
      ? 50
      : 40
};

export const paddingBottom =
  Platform.OS === "android"
    ? 65
    : Dimensions.get("window").height === 667 // iPhone 8 or SE2
    ? 65
    : Dimensions.get("window").height === 736 // iPhone 8 Plus
    ? 65
    : 85;

export const customSearchAnimation = {
  create: {
    property: "opacity",
    type: "linear"
  },
  delete: {
    property: "opacity",
    type: "linear"
  },
  duration: 400,
  update: {
    springDamping: 0.5,
    type: "spring"
  }
};

export const customCommentBarAnimation = {
  create: {
    property: "opacity",
    type: "linear"
  },

  duration: 400,
  update: {
    springDamping: 0.7,
    type: "spring"
  }
};

export const customBarAnimation = {
  create: {
    property: "opacity",
    type: "easeInEaseOut"
  },
  delete: {
    property: "opacity",
    type: "easeInEaseOut"
  },
  duration: 200,
  update: {
    type: "easeInEaseOut"
  }
};

export const customCardAnimation = {
  create: {
    property: "opacity",
    type: "easeIn"
  },
  delete: {
    property: "opacity",
    type: "easeIn"
  },
  duration: 300,
  update: {
    springDamping: 0.8,
    type: "spring"
  }
};

export const customNotificationAnimation = {
  create: {
    property: "opacity",
    type: "easeIn"
  },
  delete: {
    property: "opacity",
    type: "easeIn"
  },
  duration: 200,
  update: {
    springDamping: 0.8,
    type: "spring"
  }
};
