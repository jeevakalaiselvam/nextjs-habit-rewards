import { LoadingOutlined } from '@ant-design/icons';
import { Descriptions, Spin } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ICON_MAPPER } from '../helpers/gameHelper';
import {
  COLOR_BLACK1,
  COLOR_BLUE,
  COLOR_BLUE_DARK,
  COLOR_BLUE_LIGHT,
} from '../helpers/colorHelper';
import { HiRefresh } from 'react-icons/hi';
import { TbRefresh } from 'react-icons/tb';

export default function GamesUpdate() {
  const [achievements, setAchievementsMap] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allEditableUrl, setAllEditableUrl] = useState({});
  const [allSaving, setAllSaving] = useState({});

  const refreshAchievements = () => {
    setLoading(true);
    try {
      axios.get('/api/jeevaachievement').then((response) => {
        let achievementsInner = response?.data;
        let allEditMap = {};
        let allSaveMap = {};
        let allAchDetailsMap = {};
        achievementsInner?.forEach((ach) => {
          allAchDetailsMap[ach?._id] = ach;
          allEditMap[ach?._id] = '';
          allSaveMap[ach?._id] = false;
        });
        setAllEditableUrl(allEditMap);
        setAllSaving(allSaveMap);
        setAchievementsMap(allAchDetailsMap);
        setLoading(false);
      });
    } catch (e) {
      message.info('Error refreshing Achievement !');
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAchievements();
  }, []);

  const updateInfo = (achId) => {
    setAllSaving((old) => ({ ...old, [achId]: true }));
    try {
      axios
        .put(`/api/jeevaachievement/${achId}`, {
          url: allEditableUrl?.[achId],
        })
        .then((response) => {
          setAchievementsMap((old) => ({
            ...old,
            [achId]: { ...old?.[achId], url: allEditableUrl?.[achId] },
          }));
          setAllSaving((old) => ({ ...old, [achId]: false }));
        });
    } catch (e) {}
  };

  let toShowAchs = {};

  Object.keys(achievements)?.forEach((key) => {
    if (achievements?.[key]?.type == 'Games') {
      toShowAchs[key] = achievements?.[key];
    }
  });

  return (
    <Container>
      {loading && (
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
      )}
      {!loading && (
        <AchievementContainer>
          {Object.keys(toShowAchs)?.map((key) => {
            let ach = achievements?.[key];
            return (
              <AchContainer>
                <Icon image={ach?.url ?? ICON_MAPPER?.[ach?.name]}></Icon>
                <Data>
                  <Title>{ach?.title}</Title>
                  <Description>{ach?.description}</Description>
                  <Link>
                    <Save
                      onClick={() => {
                        updateInfo(ach?._id);
                      }}
                    >
                      <span>SAVE</span>
                      <span
                        style={{
                          transform: 'translateY(2px)',
                          marginLeft: '.5rem',
                        }}
                      >
                        <TbRefresh />
                      </span>
                    </Save>
                    <input
                      type="text"
                      onChange={(e) => {
                        setAllEditableUrl((old) => ({
                          ...old,
                          [ach?._id]: e.target.value,
                        }));
                      }}
                      value={allEditableUrl?.[ach?._id]}
                    />
                  </Link>
                </Data>
              </AchContainer>
            );
          })}
        </AchievementContainer>
      )}
    </Container>
  );
}

const Save = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 30px;
  cursor: pointer;
  padding: 0rem 1rem;
  margin-right: 1rem;
  background-color: ${COLOR_BLUE};

  &:hover {
    background-color: ${COLOR_BLUE_LIGHT};
  }
`;

const Icon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 150px;
  min-height: 90px;
  background: ${(props) => `url('${props.image}')`};
  background-size: cover;
  background-repeat: no-repeat;
  background-origin: center;
`;

const Data = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  flex: 1;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 30px;
  padding-left: 1rem;
  width: 100%;
`;

const Description = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 30px;
  width: 100%;
  opacity: 0.5;
  padding-left: 1rem;
`;

const Link = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 1rem;
  height: 30px;
  width: 100%;

  & input {
    width: 100%;
    background-color: ${COLOR_BLACK1};
    border: none;
    outline: none;
    height: 30px;
  }
`;

const AchContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
`;

const AchievementContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  overflow: scroll;
  width: 100%;
  min-height: 100vh;
  max-height: 100vh;
  color: #fefefe;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  min-height: 100vh;
  max-height: 100vh;
  color: #fefefe;
`;
