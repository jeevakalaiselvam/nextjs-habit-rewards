import { Input, Modal, Row } from "antd";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";
import AchCard from "./AchCard";

export default function EditGameForm({
  showEditModal,
  setShowEditModal,
  gameData,
  refreshData,
  setGamesLoading,
}) {
  const [gameForm, setGameForm] = useState({
    id: gameData?.id,
    cover: gameData?.cover,
    price: gameData?.price ?? 0,
    platinum: JSON.stringify(gameData?.platinum ?? []),
    dlc1Name: gameData?.dlc1Name,
    dlc2Name: gameData?.dlc2Name,
    dlc3Name: gameData?.dlc3Name,
    dlc4Name: gameData?.dlc4Name,
    dlc5Name: gameData?.dlc5Name,
    dlc1Image: gameData?.dlc1Image,
    dlc2Image: gameData?.dlc2Image,
    dlc3Image: gameData?.dlc3Image,
    dlc4Image: gameData?.dlc4Image,
    dlc5Image: gameData?.dlc5Image,
    dlc1Trophies: JSON.stringify(gameData?.dlc1Trophies ?? []),
    dlc2Trophies: JSON.stringify(gameData?.dlc2Trophies ?? []),
    dlc3Trophies: JSON.stringify(gameData?.dlc3Trophies ?? []),
    dlc4Trophies: JSON.stringify(gameData?.dlc4Trophies ?? []),
    dlc5Trophies: JSON.stringify(gameData?.dlc5Trophies ?? []),
  });

  const updateGameData = () => {
    try {
      axios
        .put("/api/platinum/update", { ...gameForm, id: gameData?.id })
        .then((response) => {
          refreshData();
        });
    } catch (e) {}
  };

  const handleOk = () => {
    updateGameData();
    setShowEditModal(false);
  };
  const handleCancel = () => {
    setShowEditModal(false);
  };

  useEffect(() => {
    setGameForm((old) => ({
      id: gameData?.id,
      cover: gameData?.cover,
      platinum: JSON.stringify(gameData?.platinum ?? []),
      price: gameData?.price ?? 0,
      dlc1Name: gameData?.dlc1Name,
      dlc2Name: gameData?.dlc2Name,
      dlc3Name: gameData?.dlc3Name,
      dlc4Name: gameData?.dlc4Name,
      dlc5Name: gameData?.dlc5Name,
      dlc1Image: gameData?.dlc1Image,
      dlc2Image: gameData?.dlc2Image,
      dlc3Image: gameData?.dlc3Image,
      dlc4Image: gameData?.dlc4Image,
      dlc5Image: gameData?.dlc5Image,
      dlc1Trophies: JSON.stringify(gameData?.dlc1Trophies ?? []),
      dlc2Trophies: JSON.stringify(gameData?.dlc2Trophies ?? []),
      dlc3Trophies: JSON.stringify(gameData?.dlc3Trophies ?? []),
      dlc4Trophies: JSON.stringify(gameData?.dlc4Trophies ?? []),
      dlc5Trophies: JSON.stringify(gameData?.dlc5Trophies ?? []),
    }));
  }, [gameData]);

  let platinumAchs = JSON.parse(gameForm?.platinum);

  return (
    <Modal
      width={700}
      title="Edit Game"
      closable={{ "aria-label": "Custom Close Button" }}
      open={showEditModal}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      {/* <Row style={{ marginBottom: "1rem" }}>
        <Input
          placeholder="Enter Game Id..."
          type="number"
          readOnly
          value={gameData?.id}
          onChange={(e) =>
            setGameForm((old) => ({ ...old, id: e.target.value }))
          }
        />
      </Row> */}
      {/* <Row style={{ marginBottom: "1rem" }}>
        <Input
          placeholder="Enter Price..."
          type="number"
          value={gameData?.price}
          onChange={(e) =>
            setGameForm((old) => ({ ...old, price: e.target.value }))
          }
        />
      </Row> */}
      {/* <Row style={{ marginBottom: "1rem" }}>
        <Input
          placeholder="Enter Cover URL..."
          value={gameForm?.cover}
          onChange={(e) =>
            setGameForm((old) => ({ ...old, cover: e.target.value }))
          }
        />
      </Row> */}
      <Row style={{ marginBottom: "1rem" }}>
        <TextArea
          rows={3}
          placeholder="Enter Platinum JSON..."
          type="number"
          value={gameForm?.platinum}
          onChange={(e) =>
            setGameForm((old) => ({ ...old, platinum: e.target.value }))
          }
        />
      </Row>
      <Row style={{ marginBottom: "1rem" }}>
        <AchWrapper>
          {platinumAchs?.map((ach, index) => {
            return (
              <AchCard
                ach={ach}
                index={index}
                platinumFlag
                onDeleteClick={(achInner) => {
                  setGameForm((old) => {
                    console.log({ old: old });
                    let newGameForm = { ...gameForm };
                    let newPlats = JSON.parse(gameForm?.platinum)?.filter(
                      (item) => item?.title != achInner?.title
                    );
                    let newPlatsObj = {
                      ...newGameForm,
                      platinum: JSON.stringify(newPlats),
                    };
                    return newPlatsObj;
                  });
                }}
              />
            );
          })}
        </AchWrapper>
      </Row>
    </Modal>
  );
}

const AchWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  min-height: 500px;
  width: 100%;
`;
