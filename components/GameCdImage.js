import styled from "styled-components";
import { HEADER_IMAGE } from "../helpers/urlHelper";
import { TbSettingsFilled } from "react-icons/tb";
import { COLOR_ACCENT, COLOR_BLUE_DARK } from "../helpers/colorHelper";
import EditGameForm from "./EditGameForm";
import { useState } from "react";

export default function GameCdImage({
  game,
  editMode,
  platinumData,
  setIsEditMode,
}) {
  const [showEditModal, setShowEditModal] = useState(false);

  let gameData = platinumData?.find((data) => {
    return data?.id == game?.id;
  });

  return (
    <CdImage>
      <EditGameForm
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        gameData={gameData}
        setIsEditMode={setIsEditMode}
      />
      <CdInnerImage cover={gameData?.cover}>
        {editMode && (
          <EditIcon
            onClick={() => {
              setShowEditModal(true);
            }}
          >
            <span
              style={{ transform: "translateY(2px)", marginRight: ".25rem" }}
            >
              <TbSettingsFilled />
            </span>
            <span>EDIT</span>
          </EditIcon>
        )}
      </CdInnerImage>
    </CdImage>
  );
}

const EditIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 100%;
  bottom: 0;
  padding: 0.25rem 1rem;
  z-index: 2;
  background-color: ${COLOR_ACCENT};
  opacity: 0.8;

  &:hover {
    opacity: 1;
  }
`;

const CdImage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 200px;
  height: 250px;
  background: url("/icons/cover.png");
  background-size: contain;
  background-repeat: no-repeat;
  position: relative;
`;

const CdInnerImage = styled.div`
  width: 194px; /* scaled down from 388px by 25% */
  height: 210px; /* scaled down from 420px by 25% */
  position: absolute;
  top: 38px; /* scaled down from 76px by 25% */
  left: 0.75px; /* scaled down from 1px by 25% */
  background: ${(props) => `url(${props.cover})`};
  background-size: cover;
  background-repeat: no-repeat;
`;
