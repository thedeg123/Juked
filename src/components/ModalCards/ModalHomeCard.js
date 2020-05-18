import React from "react";
import ModalWrapper from "./ModalWrapper";
import { Modal, Text, FlatList, Button, View, StyleSheet } from "react-native";
import ModalHomeContent from "./ModalHomeContent";
import colors from "../../constants/colors";

const ModalHomeCard = ({
  showModal,
  setShowModal,
  refreshData,
  contentTypes,
  following,
  userShow,
  setUserShow
}) => {
  return (
    <ModalWrapper
      isVisible={showModal}
      onSwipeComplete={() => {
        refreshData();
        setShowModal(false);
      }}
    >
      <ModalHomeContent
        contentTypes={contentTypes}
        refreshData={refreshData}
        onClose={() => {
          refreshData();
          setShowModal(false);
        }}
        following={following}
        userShow={userShow}
        setUserShow={setUserShow}
      ></ModalHomeContent>
    </ModalWrapper>
  );
};
export default ModalHomeCard;
