import React from "react";
import ModalWrapper from "./ModalWrapper";
import ModalTrackContent from "./ModalTrackContent";

const ModalTrackCard = ({ showModal, setShowModal, content }) => {
  return (
    <ModalWrapper
      isVisible={showModal}
      onSwipeComplete={() => setShowModal(false)}
    >
      <ModalTrackContent
        onClose={() => setShowModal(false)}
        content={content}
      ></ModalTrackContent>
    </ModalWrapper>
  );
};

export default ModalTrackCard;
