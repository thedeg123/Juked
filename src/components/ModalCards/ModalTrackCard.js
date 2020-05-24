import React from "react";
import ModalWrapper from "./ModalWrapper";
import ModalTrackContent from "./ModalTrackContent";

const ModalTrackCard = ({
  showModal,
  setShowModal,
  content,
  setShowHighlightedTrackCard
}) => {
  return (
    <ModalWrapper
      isVisible={showModal}
      onSwipeComplete={() => {
        setShowHighlightedTrackCard(null);
        setShowModal(false);
      }}
    >
      <ModalTrackContent
        onClose={() => {
          setShowHighlightedTrackCard(null);
          setShowModal(false);
        }}
        onFinish={() => setisFinished(true)}
        content={content}
      ></ModalTrackContent>
    </ModalWrapper>
  );
};

export default ModalTrackCard;
