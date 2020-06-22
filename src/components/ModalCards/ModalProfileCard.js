import React from "react";
import ModalWrapper from "./ModalWrapper";
import ModalProfileContent from "./ModalProfileContent";

const ModalProfileCard = ({ showModal, setShowModal, onSignOut, onEdit }) => {
  return (
    <ModalWrapper
      isVisible={showModal}
      onSwipeComplete={() => {
        setShowModal(false);
      }}
    >
      <ModalProfileContent
        onClose={() => {
          setShowModal(false);
        }}
        onEdit={onEdit}
        onSignOut={onSignOut}
      ></ModalProfileContent>
    </ModalWrapper>
  );
};

export default ModalProfileCard;
