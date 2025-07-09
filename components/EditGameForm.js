import { Input, Modal, Row } from "antd";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";

export default function EditGameForm({
  showEditModal,
  setShowEditModal,
  gameData,
  setIsEditMode,
}) {
  const [gamesLoading, setGamesLoading] = useState(false);
  const [games, setGames] = useState([]);
  const [gameForm, setGameForm] = useState({
    id: gameData?.id,
    cover: gameData?.cover,
    platinum: JSON.stringify(gameData?.platinum),
  });

  const updateGameData = () => {
    try {
      axios
        .put("/api/platinum/update", { ...gameForm, id: gameData?.id })
        .then((response) => {
          setIsEditMode(false);
        });
    } catch (e) {
      setIsEditMode(false);
    }
  };

  const handleOk = () => {
    updateGameData();
    setShowEditModal(false);
  };
  const handleCancel = () => {
    setShowEditModal(false);
  };

  const refreshGameData = () => {
    setGamesLoading(true);
    try {
      axios.get("/api/platinum").then((response) => {
        setGamesLoading(false);
        setGames(response?.data);
      });
    } catch (e) {
      setGamesLoading(false);
    }
  };

  useEffect(() => {
    refreshGameData();
  }, []);

  useEffect(() => {
    setGameForm((old) => ({
      id: gameData?.id,
      cover: gameData?.cover,
      platinum: JSON.stringify(gameData?.platinum),
    }));
  }, [gameData]);

  return (
    <Modal
      width={1500}
      title="Edit Game"
      closable={{ "aria-label": "Custom Close Button" }}
      open={showEditModal}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Row style={{ marginBottom: "1rem" }}>
        <Input
          placeholder="Enter Game Id..."
          type="number"
          readOnly
          value={gameData?.id}
          onChange={(e) =>
            setGameForm((old) => ({ ...old, id: e.target.value }))
          }
        />
      </Row>{" "}
      <Row style={{ marginBottom: "1rem" }}>
        <Input
          placeholder="Enter Cover URL..."
          value={gameForm?.cover}
          onChange={(e) =>
            setGameForm((old) => ({ ...old, cover: e.target.value }))
          }
        />
      </Row>{" "}
      <Row style={{ marginBottom: "1rem" }}>
        <TextArea
          rows={30}
          placeholder="Enter Platinum JSON..."
          type="number"
          value={gameForm?.platinum}
          onChange={(e) =>
            setGameForm((old) => ({ ...old, platinum: e.target.value }))
          }
        />
      </Row>
    </Modal>
  );
}
