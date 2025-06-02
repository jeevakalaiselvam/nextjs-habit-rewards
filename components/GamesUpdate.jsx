import { LoadingOutlined } from "@ant-design/icons";
import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  getFandomRemovedUrl,
  ICON_MAPPER,
  TROPHY_PLACEHOLDER,
} from "../helpers/gameHelper";
import {
  COLOR_ACCENT,
  COLOR_ACH,
  COLOR_BLACK1,
  COLOR_BLACK2,
  COLOR_BLUE,
  COLOR_BLUE_DARK,
  COLOR_BLUE_LIGHT,
  COLOR_GREEN,
  generateDarkTextColorForLightBg,
} from "../helpers/colorHelper";
import { TbHomePlus, TbRefresh } from "react-icons/tb";
import { Popconfirm, Spin } from "antd";
import { FaHome } from "react-icons/fa";
import { useRouter } from "next/router";

export default function GamesUpdate() {
  const router = useRouter();
  const [achievements, setAchievementsMap] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allEditableUrl, setAllEditableUrl] = useState({});
  const [allSaving, setAllSaving] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const refreshAchievements = () => {
    setLoading(true);
    try {
      axios.get("/api/jeevagame").then((response) => {
        let achievementsInner = response?.data;
        let allEditMap = {};
        let allSaveMap = {};
        let allAchDetailsMap = {};
        achievementsInner?.forEach((ach) => {
          allAchDetailsMap[ach?._id] = ach;
          allEditMap[ach?._id] = "";
          allSaveMap[ach?._id] = false;
        });
        setAllEditableUrl(allEditMap);
        setAllSaving(allSaveMap);
        setAchievementsMap(allAchDetailsMap);
        setLoading(false);
      });
    } catch (e) {
      message.info("Error refreshing Achievement !");
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
    } catch (e) {}
  };

  let toShowAchs = {};

  Object.keys(achievements)?.forEach((key) => {
    toShowAchs[key] = achievements?.[key];
  });

  return (
    <Container>
      <Header>
        <SearchContainer>
          <input
            type="text"
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            placeholder="Search for Game..."
            value={searchTerm}
          />
          <span
            style={{ fontSize: "1.25rem", margin: "0rem 0rem 0rem 1rem" }}
            onClick={() => {
              router.push("/");
            }}
          >
            <TbHomePlus />
          </span>
        </SearchContainer>
      </Header>
      {loading && (
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
      )}
      {!loading && (
        <AchievementContainer>
          {Object.keys(toShowAchs)
            ?.filter((key) => {
              let ach = achievements?.[key];
              return ach?.name
                ?.toLowerCase()
                ?.includes(searchTerm?.toLowerCase());
            })
            ?.map((key) => {
              let ach = achievements?.[key];
              return (
                <A1Container>
                  <A1Icon icon={ach?.url}></A1Icon>
                  <A1Right onClick={(e) => {}}>
                    <A1Title>{ach?.name}</A1Title>
                    <A1Desc>
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
                    </A1Desc>
                  </A1Right>
                  <Tag
                    achieved={ach?.achieved}
                    forGame={true}
                    onClick={() => {
                      setSelectedAchToEdit(ach);
                      setShowModalEdit(true);
                    }}
                  >
                    <InnerTagMoney>
                      <span
                        style={{
                          marginLeft: ".25rem",
                          fontSize: "1rem",
                        }}
                      >
                        SAVE
                      </span>
                    </InnerTagMoney>
                  </Tag>
                </A1Container>
              );
            })}
        </AchievementContainer>
      )}
    </Container>
  );
}

const A1Right = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  height: 70px;
`;

const Tag = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) =>
    props.forGame
      ? COLOR_ACCENT
      : props?.achieved
      ? COLOR_GREEN
      : COLOR_ACCENT};
  color: ${(props) =>
    props.forGame
      ? generateDarkTextColorForLightBg(COLOR_ACCENT)
      : props?.achieved
      ? generateDarkTextColorForLightBg(COLOR_GREEN)
      : generateDarkTextColorForLightBg(COLOR_ACCENT)};
  height: 70px;
  font-size: 0.8rem;
`;

const InnerTagMoney = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(-90deg) translateX(-0.1rem);
  width: 25px;
`;

const A1Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 1rem;
  font-size: 0.9rem;
  flex: 1;
`;

const A1Desc = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0rem 1rem;
  opacity: 0.7;
  font-size: 0.8rem;
  flex: 1;

  & input {
    background-color: #111421;
    border: none;
    outline: none;
    transform: translateY(0px);
    height: 25px;
  }
`;

const A1Icon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 140px;
  height: 70px;
  background: ${(props) => `url('${props.icon}')`};
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`;

const A1Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 1rem 0.25rem 0rem 0.25rem;
  background-color: ${COLOR_ACH};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 60px;
  padding: 1rem;
  background-color: ${COLOR_BLUE_DARK};
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem;
  justify-content: center;
  width: 100%;

  & input {
    width: 100%;
    background-color: ${COLOR_BLUE_DARK};
    border: none;
    outline: none;
    height: 30px;
    font-size: 1rem;
    transform: translateY(0px);
  }
`;

const Save = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  cursor: pointer;
  height: 30px;
  background-color: ${COLOR_BLUE};

  &:hover {
    background-color: ${COLOR_BLUE_LIGHT};
  }
`;

const Icon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 150px;
  background: ${(props) => `url('${props.image}')`};
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  padding: 0.5rem;
  width: 100%;
  font-size: 0.9rem;
  background-color: rgba(0, 0, 0, 0.75);
  position: absolute;
  top: 0;
  left: 0;
`;

const Link = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding: 0.25rem;
  margin-top: 4px;
  background-color: rgba(0, 0, 0, 0.75);
  position: absolute;
  bottom: 0;
  left: 0;

  & input {
    width: 100%;
    background-color: rgba(0, 0, 0, 0.75);
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
  flex-direction: column;
  position: relative;
  width: 100%;
`;

const AchievementContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  overflow: scroll;
  flex-direction: column;
  width: 100%;
  min-height: 90vh;
  padding: 1rem;
  max-height: 90vh;
  color: #fefefe;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  min-width: 100vw;
  min-height: 100vh;
  max-height: 100vh;
  font-size: 0.8rem;
  color: #fefefe;
`;
