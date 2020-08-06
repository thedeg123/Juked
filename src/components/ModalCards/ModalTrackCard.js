import React, { useState } from "react";
import ModalWrapper from "./ModalWrapper";
import ModalTrackContent from "./ModalTrackContent";

const ModalTrackCard = ({
  showModal,
  setShowModal,
  content,
  setShowHighlightedTrackCard,
  author
}) => {
  const [scrollEnabled, setScrollEnabled] = useState(true);
  return (
    <ModalWrapper
      swipeDirection={scrollEnabled ? ["up", "down"] : null}
      isVisible={showModal}
      onSwipeComplete={() => {
        setShowHighlightedTrackCard(null);
        setShowModal(false);
      }}
    >
      <ModalTrackContent
        setScrollEnabled={setScrollEnabled}
        author={author}
        onClose={() => {
          setShowHighlightedTrackCard(null);
          setShowModal(false);
        }}
        content={content}
      ></ModalTrackContent>
    </ModalWrapper>
  );
};

export default ModalTrackCard;
