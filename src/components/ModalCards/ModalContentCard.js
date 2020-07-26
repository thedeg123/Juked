import React from "react";
import ModalWrapper from "./ModalWrapper";
import ModalContentContent from "./ModalContentContent";
import { withNavigation } from "react-navigation";

const ModalReviewCard = ({
  navigation,
  showModal,
  setShowModal,
  content,
}) => {
  return (
    <ModalWrapper
      isVisible={showModal}
      onSwipeComplete={() => setShowModal(false)}
    >
    <ModalContentContent
        onClose={() => setShowModal(false)}
        content={content}
    ></ModalContentContent>
    </ModalWrapper>
  );
};

ModalReviewCard.defaultProps = {
  content_type: "Review"
}

export default withNavigation(ModalReviewCard);
