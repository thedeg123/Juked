import React from "react";
import ModalWrapper from "./ModalWrapper";
import ModalListContent from "./ModalListContent";

const ModalListCard = ({
  showModal,
  setShowModal,
  onDelete,
  showDelete,
  content
}) => {
  return (
    <ModalWrapper
      isVisible={showModal}
      onSwipeComplete={() => {
        setShowModal(false);
      }}
    >
      <ModalListContent
        content={content}
        onClose={() => {
          setShowModal(false);
        }}
        showDelete={showDelete}
        onDelete={onDelete}
      ></ModalListContent>
    </ModalWrapper>
  );
};

export default ModalListCard;
