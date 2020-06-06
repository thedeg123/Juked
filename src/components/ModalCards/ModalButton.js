import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Entypo, AntDesign } from "@expo/vector-icons";
import colors from "../../constants/colors";

const ModalButton = ({ setShowModal, settingType }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => setShowModal(true)}
    >
      {settingType ? (
        <AntDesign size={24} name="setting" color={colors.primary}></AntDesign>
      ) : (
        <Entypo name="dots-three-horizontal" size={24} color={colors.primary} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10
  }
});

export default ModalButton;
