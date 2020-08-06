import React from "react";
import ModalWrapper from "./ModalWrapper";
import ModalSortContent from "./ModalSortContent";
import { withNavigation } from "react-navigation";

const ModalSortCard = ({
  showModal,
  setShowModal,
  newestFirst,
  setNewestFirst,
  filterTypes,
  setFilterTypes
}) => {
  const onClose = () => setShowModal(false);
  return (
    <ModalWrapper isVisible={showModal} onSwipeComplete={onClose}>
      <ModalSortContent
        onClose={onClose}
        newestFirst={newestFirst}
        setNewestFirst={setNewestFirst}
        filterTypes={filterTypes}
        setFilterTypes={setFilterTypes}
      />
    </ModalWrapper>
  );
};

ModalSortCard.defaultProps = {
  content_type: "Review"
};

export default withNavigation(ModalSortCard);
