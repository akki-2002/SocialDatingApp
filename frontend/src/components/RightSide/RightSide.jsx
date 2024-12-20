import React, { useState } from "react";
import "./RightSide.css";

import TrendCard from "../TrendCard/TrendCard";
import ShareModal from "../ShareModal/ShareModal";
import NavIcons from "../NavIcons/NavIcons";
const RightSide = ({handleHashId}) => {
  const [modalOpened, setModalOpened] = useState(false);

  return (
    <div className="RightSide">
  

      <NavIcons />

      <TrendCard handleHashId={handleHashId}/>


      <button className="button r-button" onClick={() => setModalOpened(true)}>
        Share
      </button>
      <ShareModal modalOpened={modalOpened} setModalOpened={setModalOpened} />
    </div>
  );
};

export default RightSide;