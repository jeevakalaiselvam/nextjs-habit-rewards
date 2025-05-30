import { LoadingOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getFandomRemovedUrl, ICON_MAPPER, TROPHY_PLACEHOLDER } from '../helpers/gameHelper';
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
                  image={ach?.url !== '' ? ach?.url : TROPHY_PLACEHOLDER}
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
                </Link>
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
  width: 100%;
  cursor: pointer;
  padding: 0rem 1rem;
  height: 30px;
  margin-top: 0.5rem;
  background-color: ${COLOR_BLUE};

  &:hover {
    background-color: ${COLOR_BLUE_LIGHT};
  }
`;

const Icon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 140px;
  min-height: 70px;
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
  justify-content: center;
  height: 30px;
  padding: .5rem;
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
`;

const Link = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 30px;
  width: 100%;
  margin-top: 4px;

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
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  background-color: ${COLOR_BLACK2};
  flex-direction:column;
  padding: 0.5rem;
  margin:1rem;
`;

const AchievementContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
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
