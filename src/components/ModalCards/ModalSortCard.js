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
  return (
    <ModalWrapper
      isVisible={showModal}
      onSwipeComplete={() => setShowModal(false)}
    >
      <ModalSortContent
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
