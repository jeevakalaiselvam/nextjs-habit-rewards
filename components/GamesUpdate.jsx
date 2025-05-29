import { LoadingOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getFandomRemovedUrl, ICON_MAPPER } from '../helpers/gameHelper';
import {
  COLOR_BLACK1,
  COLOR_BLACK2,
  COLOR_BLUE,
  COLOR_BLUE_LIGHT,
} from '../helpers/colorHelper';
import { TbRefresh } from 'react-icons/tb';
import { Spin } from 'antd';

export default function GamesUpdate() {
  const [achievements, setAchievementsMap] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allEditableUrl, setAllEditableUrl] = useState({});
  const [allSaving, setAllSaving] = useState({});

  const refreshAchievements = () => {
    setLoading(true);
    try {
      axios.get('/api/jeevagame').then((response) => {
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
        .put(`/api/jeevagame/${achId}`, {
          url: getFandomRemovedUrl(allEditableUrl?.[achId]),
        })
        .then((response) => {
          setAchievementsMap((old) => ({
            ...old,
            [achId]: {
              ...old?.[achId],
              url: getFandomRemovedUrl(allEditableUrl?.[achId]),
            },
          }));
          setAllSaving((old) => ({ ...old, [achId]: false }));
        });
    } catch (e) { }
  };

  let toShowAchs = {};

  Object.keys(achievements)?.forEach((key) => {

    toShowAchs[key] = achievements?.[key];
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
                <Icon
                  image={ach?.url !== '' ? ach?.url : ICON_MAPPER?.[ach?.name]}
                ></Icon>
                <Title>{ach?.name}</Title>
                <Link>
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
                </Link>
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
  cursor: pointer;
  padding: 0rem 1rem;
  height: 30px;
  margin-left: 0.5rem;
  background-color: ${COLOR_BLUE};

  &:hover {
    background-color: ${COLOR_BLUE_LIGHT};
  }
`;

const Icon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  min-height: 40px;
  background: ${(props) => `url('${props.image}')`};
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
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
  flex: 1;
  font-size: .8rem;
`;

const Description = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 30px;
  width: 100%;
  opacity: 0.5;
  font-size: .8rem;
  padding-left: 1rem;
`;

const Link = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 1rem;
  height: 30px;
  width: 100%;
  margin-top: 4px;
  flex: 2;

  & input {
    width: 100%;
    background-color: ${COLOR_BLACK1};
    border: none;
    outline: none;
    height: 30px;
    transform: translateY(0px);
  }
`;

const AchContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  background-color: ${COLOR_BLACK2};
  padding: 0.5rem;
`;

const AchievementContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  overflow: scroll;
  width: 100%;
  min-height: 100vh;
  padding: 1rem;
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
  font-size: .8rem;
  color: #fefefe;
`;
