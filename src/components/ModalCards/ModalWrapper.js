import React from "react";
import { StyleSheet, View } from "react-native";
import Modal from "react-native-modal";

const ModalWrapper = ({ children, isVisible, onSwipeComplete }) => {
  return (
    <View style={{ flex: 1 }}>
      <Modal
        backdropOpacity={0.8}
        isVisible={isVisible}
        onSwipeComplete={onSwipeComplete}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        swipeDirection={["up", "left", "right", "down"]}
        style={styles.cardStyle}
      >
        {children}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  cardStyle: {
    justifyContent: "flex-end",
    margin: 0
  }
});

export default ModalWrapper;
