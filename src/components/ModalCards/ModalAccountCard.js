import React from "react";
import ModalWrapper from "./ModalWrapper";
import ModalAccountContent from "./ModalAccountContent";

const ModalAccountCard = ({ showModal, onClose, onDelete }) => {
  return (
    <ModalWrapper isVisible={showModal} onSwipeComplete={onClose}>
      <ModalAccountContent
        onClose={onClose}
        onDelete={onDelete}
      ></ModalAccountContent>
    </ModalWrapper>
  );
};

export default ModalAccountCard;
