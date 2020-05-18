import React from "react";
import { StyleSheet, View } from "react-native";
import Modal from "react-native-modal";
import { Feather } from "@expo/vector-icons";
import colors from "../../constants/colors";

const ModalWrapper = ({
  children,
  isVisible,
  onSwipeComplete,
  swipeDirection = ["up", "down"]
}) => {
  return (
    <View style={{ flex: 1 }}>
      <Modal
        backdropOpacity={0.8}
        propagateSwipe={true}
        scrollHorizontal={true}
        isVisible={isVisible}
        onSwipeComplete={onSwipeComplete}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        swipeDirection={swipeDirection}
        style={styles.cardStyle}
      >
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <Feather
            style={{ alignSelf: "center" }}
            name="minus"
            size={42}
            color={colors.white}
          />
          {children}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  cardStyle: {
    justifyContent: "flex-end",
    margin: 0,
    padding: 0
  }
});

export default ModalWrapper;
