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
  setFormData,
  formData,
}) {
  const [desc, setDesc] = useState("");

  const saveAchData = () => {
    try {
      axios.post("/api/jeevaachievement", { ...gameForm }).then((response) => {
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
      <Row style={{ marginBottom: "1rem" }}>
        <TextArea
          placeholder="Description..."
          rows={3}
          value={formData?.description}
          style={{ width: 350, fontSize: ".9rem" }}
          onChange={(e) => {
            setFormData((old) => ({ ...old, description: e.target.value }));
          }}
        />
      </Row>
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
