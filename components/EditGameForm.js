import { Input, Modal, Row } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import axios from 'axios';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import ACH_CARD_PLATINUM from './ACH_CARD_PLATINUM';

export default function EditGameForm({
  showEditModal,
  setShowEditModal,
  gameData,
  refreshData,
  games,
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
        .put('/api/platinum/update', { ...gameForm, id: gameData?.id })
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

  const onAchDelete = (ach) => {
    let removedJSON = JSON.parse(gameForm?.platinum ?? [])?.filter(
      (inner) => inner?.title != ach?.title
    );
    setGameForm((old) => ({ ...old, platinum: JSON.stringify(removedJSON) }));
  };

  let current = games?.find((game) => game.id == gameData.id) ?? [];

  let obtainedMap = {};

  current?.achievements?.forEach((ach) => {
    obtainedMap[ach?.displayName] = ach?.achieved;
  });

  return (
    <Modal
      width={1000}
      title={`Edit Game - ${gameData?.name}`}
      closable={{ 'aria-label': 'Custom Close Button' }}
      open={showEditModal}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Row style={{ marginBottom: '1rem' }}>
        <Input
          placeholder="Enter Game Id..."
          type="number"
          readOnly
          value={gameData?.id}
          onChange={(e) =>
            setGameForm((old) => ({ ...old, id: e.target.value }))
          }
        />
      </Row>
      <Row style={{ marginBottom: '1rem' }}>
        <Input
          placeholder="Enter Cover URL..."
          value={gameForm?.cover}
          onChange={(e) =>
            setGameForm((old) => ({ ...old, cover: e.target.value }))
          }
        />
      </Row>
      <Row style={{ marginBottom: '1rem' }}>
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
      <Row>
        <AllAchs>
          {JSON.parse(gameForm?.platinum ?? [])?.map((ach) => {
            return (
              <ACH_CARD_PLATINUM
                ach={{
                  ...ach,
                  achieved: obtainedMap[ach?.title],
                }}
                onDelete={(ach) => {
                  onAchDelete(ach);
                }}
              />
            );
          })}
        </AllAchs>
      </Row>
    </Modal>
  );
}

const AllAchs = styled.div`
  max-height: 300px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  overflow: scroll;
`;
