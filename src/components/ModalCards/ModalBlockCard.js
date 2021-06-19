import React from "react";
import ModalWrapper from "./ModalWrapper";
import ModalBlockContent from "./ModalBlockContent";

const ModalBlockCard = ({ showModal, setShowModal, onBlock, isBlocked }) => {
  return (
    <ModalWrapper
      isVisible={showModal}
      onSwipeComplete={() => {
        setShowModal(false);
      }}
    >
      <ModalBlockContent
        onClose={() => {
          setShowModal(false);
        }}
        isBlocked={isBlocked}
        onBlock={onBlock}
      ></ModalBlockContent>
    </ModalWrapper>
  );
};

export default ModalBlockCard;
