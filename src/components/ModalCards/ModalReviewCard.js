import React from "react";
import ModalWrapper from "./ModalWrapper";
import ModalReviewContent from "./ModalReviewContent";
import { withNavigation } from "react-navigation";

const ModalReviewCard = ({
  navigation,
  showModal,
  setShowModal,
  setReview,
  review,
  content,
  onDelete
}) => {
  return (
    <ModalWrapper
      isVisible={showModal}
      onSwipeComplete={() => setShowModal(false)}
    >
      {review ? (
        <ModalReviewContent
          onDelete={onDelete}
          onEdit={() => {
            setShowModal(false);
            return navigation.navigate("WriteReview", {
              review,
              content
            });
          }}
          onClose={() => setShowModal(false)}
        ></ModalReviewContent>
      ) : (
        <ModalReviewContent
          onCreate={() => {
            setShowModal(false);
            return navigation.navigate("WriteReview", {
              content
            });
          }}
          onClose={() => setShowModal(false)}
        ></ModalReviewContent>
      )}
    </ModalWrapper>
  );
};

export default withNavigation(ModalReviewCard);
