export default {
  tabBarHeight: 40
};

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
