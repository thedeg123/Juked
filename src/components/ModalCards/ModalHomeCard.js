import React from "react";
import ModalWrapper from "./ModalWrapper";

import ModalHomeContent from "./ModalHomeContent";

const ModalHomeCard = ({
  showModal,
  setShowModal,
  refreshData,
  filterTypes,
  setFilterTypes,
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
        refreshData={refreshData}
        onClose={() => {
          refreshData();
          setShowModal(false);
        }}
        following={following}
        userShow={userShow}
        setUserShow={setUserShow}
        filterTypes={filterTypes}
        setFilterTypes={setFilterTypes}
        setChanged={setChanged}
      ></ModalHomeContent>
    </ModalWrapper>
  );
};
export default ModalHomeCard;
