import { Button, Col, Input, Modal, Row, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  TROPHY_GAME_LIST,
  TROPHY_GAME_OPTIONS,
  TROPHY_GAMES_OPTIONS,
} from "../helpers/optionHelper";
import { AppleOutlined } from "@ant-design/icons";
import SilverIconS from "./SilverIconS";
import PlatinumIconS from "./PlatinumIconS";
import BronzeIconS from "./BronzeIconS";
import GoldIconS from "./GoldIconS";

export default function CreateAchForm({
  refreshData,
  setShowCreatModal,
  showCreateModal,
  formData,
}) {
  const [gameForm, setGameForm] = useState({
    name: "",
    title: "",
    url: "",
    platinum: 0,
    gold: 0,
    silver: 0,
    bronze: 0,
  });

  const saveGame = () => {
    try {
      axios.post("/api/onboard", { ...gameForm }).then((response) => {
        refreshData();
      });
    } catch (e) {}
  };

  const handleOk = () => {
    saveAchData();
    setShowCreatModal(false);
  };
  const handleCancel = () => {
    setShowCreatModal(false);
  };

  let optionForList = [];
  let optionForSub = [];

  return (
    <Container>
      <Modal
        title="Create Game"
        open={showCreateModal}
        onOk={() => {
          saveGame();
          setShowCreatModal(false);
        }}
        onCancel={() => {
          setShowCreatModal(false);
        }}
      >
        <Row style={{ marginBottom: "1rem" }}>
          <Input
            placeholder="Name..."
            rows={3}
            value={formData?.name}
            style={{ width: 350, fontSize: ".9rem" }}
            onChange={(e) => {
              setGameForm((old) => ({
                ...old,
                name: e.target.value,
                title: e.target.value,
              }));
            }}
          />
        </Row>
        <Row style={{ marginBottom: "1rem" }}>
          <Input
            placeholder="URL..."
            rows={3}
            value={formData?.url}
            style={{ width: 350, fontSize: ".9rem" }}
            onChange={(e) => {
              setGameForm((old) => ({ ...old, url: e.target.value }));
            }}
          />
        </Row>
      </Modal>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 1rem;
  justify-content: flex-start;
  width: 100%;
  border-radius: 4px;
`;
