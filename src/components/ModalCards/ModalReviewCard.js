import React from "react";
import ModalWrapper from "./ModalWrapper";
import ModalReviewContent from "./ModalReviewContent";
import { withNavigation } from "react-navigation";

const ModalReviewCard = ({
  navigation,
  showModal,
  setShowModal,
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
          link={content.url}
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
          link={content.url}
        ></ModalReviewContent>
      )}
    </ModalWrapper>
  );
};

export default withNavigation(ModalReviewCard);
