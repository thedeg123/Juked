import React from "react";
import ModalWrapper from "./ModalWrapper";

import ModalHomeContent from "./ModalHomeContent";

const ModalHomeCard = ({
  showModal,
  setShowModal,
  refreshData,
  contentTypes,
  ratingTypes,
  setRatingTypes,
  following,
  userShow,
  setUserShow,
  setChanged
}) => {
  return (
    <ModalWrapper
      isVisible={showModal}
      onSwipeComplete={() => {
        refreshData();
        setShowModal(false);
      }}
    >
      <ModalHomeContent
        contentTypes={contentTypes}
        refreshData={refreshData}
        onClose={() => {
          refreshData();
          setShowModal(false);
        }}
        following={following}
        userShow={userShow}
        setUserShow={setUserShow}
        ratingTypes={ratingTypes}
        setRatingTypes={setRatingTypes}
        setChanged={setChanged}
      ></ModalHomeContent>
    </ModalWrapper>
  );
};
export default ModalHomeCard;
