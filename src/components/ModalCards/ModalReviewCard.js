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
  onDelete,
  content_type
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
            return review.data.type === "list"
              ? navigation.navigate("WriteList", {
                  list: review
                })
              : navigation.navigate("WriteReview", {
                  review,
                  content
                });
          }}
          onClose={() => setShowModal(false)}
          link={content.url}
          content_type={content_type}
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
          content_type={content_type}
        ></ModalReviewContent>
      )}
    </ModalWrapper>
  );
};

ModalReviewCard.defaultProps = {
  content_type: "Review"
}

export default withNavigation(ModalReviewCard);
