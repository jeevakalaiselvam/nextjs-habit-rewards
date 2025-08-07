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
}) {
  const [gameForm, setGameForm] = useState({
    name: TROPHY_GAME_OPTIONS?.[0]?.name,
    title: TROPHY_GAMES_OPTIONS?.[0]?.name,
    header: TROPHY_GAME_LIST?.[0]?.name,
    description: "",
    color: "Bronze",
  });

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

  if (gameForm?.name == "Game") {
    optionForSub = TROPHY_GAMES_OPTIONS;
    optionForList = TROPHY_GAME_LIST;
  }

  return (
    <Container>
      <Row style={{ marginBottom: "1rem" }}>
        <Select
          defaultValue={TROPHY_GAME_OPTIONS?.[0]?.name}
          style={{ width: 375 }}
          value={gameForm?.name}
          onSelect={(e) => {
            setGameForm((old) => ({ ...old, name: e }));
          }}
          options={[
            ...TROPHY_GAME_OPTIONS?.map((item) => ({
              value: item?.name,
              label: item?.name,
            })),
          ]}
        />
      </Row>
      <Row style={{ marginBottom: "1rem" }}>
        <Select
          defaultValue={optionForList?.[0]?.name}
          style={{ width: 375 }}
          value={gameForm?.header}
          onSelect={(e) => {
            setGameForm((old) => ({
              ...old,
              header: e,
            }));
          }}
        >
          {optionForList?.map((item) => {
            return (
              <Option value={item?.value}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transform: "translateY(4px)",
                    }}
                  >
                    {item?.color == "Platinum" && <PlatinumIconS />}
                    {item?.color == "Gold" && <GoldIconS />}
                    {item?.color == "Silver" && <SilverIconS />}
                    {item?.color == "Bronze" && <BronzeIconS />}
                  </span>
                  <span>{item?.name}</span>
                </div>
              </Option>
            );
          })}
        </Select>
      </Row>
      <Row style={{ marginBottom: "1rem" }}>
        <Select
          defaultValue={optionForSub?.[0]?.name}
          style={{ width: 375 }}
          value={gameForm?.title}
          onSelect={(e) => {
            setGameForm((old) => ({
              ...old,
              title: e,
              color: optionForSub?.find((item) => item?.name == e)?.color,
            }));
          }}
        >
          {optionForSub?.map((item) => {
            return (
              <Option value={item?.value}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transform: "translateY(4px)",
                    }}
                  >
                    {item?.color == "Platinum" && <PlatinumIconS />}
                    {item?.color == "Gold" && <GoldIconS />}
                    {item?.color == "Silver" && <SilverIconS />}
                    {item?.color == "Bronze" && <BronzeIconS />}
                  </span>
                  <span>{item?.name}</span>
                </div>
              </Option>
            );
          })}
        </Select>
      </Row>
      <Row style={{ marginBottom: "1rem" }}>
        <TextArea
          placeholder="Description..."
          rows={3}
          value={gameForm?.description}
          style={{ width: 375 }}
          onChange={(e) => {
            setGameForm((old) => ({ ...old, description: e?.target?.value }));
          }}
        />
      </Row>
      <Row style={{ marginBottom: "2rem", width: "100%", textAlign: "center" }}>
        <Col span={12}>
          <Button
            onClick={() => {
              setShowCreatModal(false);
            }}
          >
            Cancel
          </Button>
        </Col>
        <Col span={12}>
          <Button
            onClick={() => {
              saveAchData();
            }}
          >
            Save
          </Button>
        </Col>
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
