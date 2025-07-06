import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import {
  calculatePsnLevel,
  COLOR_ACCENT,
  COLOR_ACH,
  COLOR_BLACK1,
  COLOR_BLACK2,
  COLOR_BLUE,
  COLOR_BLUE_DARK,
  COLOR_BLUE_LIGHT,
  COLOR_COPPER,
  COLOR_GOLD,
  COLOR_GREEN,
  COLOR_GREY,
  COLOR_PLATINUM,
  COLOR_PURPLE,
  COLOR_RED,
  COLOR_SILVER,
  COLOR_WHITE,
  generateDarkTextColorForLightBg,
} from "../helpers/colorHelper";
import { Dropdown, message, Popconfirm, Progress, Space, Spin } from "antd";
import {
  FaCaretDown,
  FaCheck,
  FaGlobe,
  FaHome,
  FaIcons,
  FaMinusCircle,
  FaPlus,
  FaPlusCircle,
  FaRupeeSign,
  FaShoppingCart,
  FaTrophy,
} from "react-icons/fa";
import { LuIndianRupee } from "react-icons/lu";
import {
  Battlefield2042,
  Feature,
  formatIndianMoney,
  GAMES_ARRAY,
  getIconBasedOnKeyword,
  getTimeFormattedForAch,
  getTrophyColor,
  Habit,
  HABIT_ARRAY,
  ICON_MAPPER,
  LEARtitleRAY,
  MONEY_TRACKER,
  TROPHY_PLACEHOLDER,
  Work,
  WORK_ARRAY,
} from "../helpers/gameHelper";
import {
  TbDeviceDesktopAnalytics,
  TbDeviceDesktopFilled,
  TbDialpad,
  TbExposurePlus1,
  TbFlareFilled,
  TbGoGame,
  TbHome,
  TbHourglassFilled,
  TbJewishStarFilled,
  TbKeyframeFilled,
  TbKeyframesFilled,
  TbLayoutGridFilled,
  TbLayoutListFilled,
  TbOctagonFilled,
  TbPresentationFilled,
  TbRefresh,
  TbShield,
  TbShieldFilled,
  TbTallymark1,
  TbTallymark2,
  TbTallymark3,
  TbTallymark4,
  TbTilde,
  TbTrophy,
} from "react-icons/tb";
import { MdVideogameAsset } from "react-icons/md";
import axios from "axios";
import {
  HiHeart,
  HiHome,
  HiLibrary,
  HiMailOpen,
  HiOutlinePlusSm,
  HiPlusCircle,
  HiRefresh,
  HiShieldCheck,
  HiSparkles,
  HiStar,
  HiUser,
  HiUserGroup,
  HiViewBoards,
} from "react-icons/hi";
import { LoadingOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

const SECTION_MONEY = "SECTION_MONEY";
const SECTION_WORK = "Work";
const SECTION_HABIT = "Habit";
const SECTION_GAMES = "Games";
const SECTION_ICONS = "Icons";
const SECTION_GAMES_ALL = "Games All";
const SECTION_GAME = "Game";

let MAX_FOR_COUNT = 100;

export default function Main() {
  const router = useRouter();
  const [randomOperator, setRandomOperator] = useState(null);
  const rotateCountRef = useRef(0);
  const intervalRef = useRef(null);
  const [showRecentAchUnlock, setShowRecentAchUnlock] = useState(false);
  const [searchTerm1, setSearchTerm1] = useState("");
  const [loading, setLoading] = useState(false);
  const [games, setGames] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [selected, setSelected] = useState("GAMES");
  const [selectedPriority, setSelectedPriority] = useState("Completed");
  const [showModal, setShowModal] = useState(false);
  const [showModalGames, setShowModalGame] = useState(false);
  const [selectedAchToEdit, setSelectedAchToEdit] = useState({});
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [selectedOverviewAchGame, setSelectedOverviewAchGame] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [formValues, setFormValues] = useState({
    type: "Games",
    name: "",
    gameValue: "",
    title: "",
    description: "",
    date: new Date(),
    priority: "Priority 2",
    total: 1,
    completed: 0,
  });

  const [formValuesGame, setFormValuesGame] = useState({
    name: "",
    url: "",
  });

  const itemsGame = [
    {
      key: "22",
      label: <div style={{ width: "100%" }}>All Games</div>,
      disabled: true,
    },
    ...games
      ?.map((inner) => inner?.name)
      ?.map((game) => {
        return {
          key: game,
          label: game,
          extra: `⌘${game?.[0]?.toUpperCase()}`,
        };
      }),
  ];

  const itemsWork = [
    {
      key: "33",
      label: <div style={{ width: "100%" }}>All Priority</div>,
      disabled: true,
    },
    {
      key: "Priority 1",
      label: "Priority 1",
      extra: `⌘P1`,
    },
    {
      key: "Priority 2",
      label: "Priority 2",
      extra: `⌘P2`,
    },
    {
      key: "Priority 3",
      label: "Priority 3",
      extra: `⌘P3`,
    },
  ];

  const clearFormData = () => {
    setFormValuesGame((old) => ({
      name: "",
      url: "",
    }));
    setFormValues((old) => ({
      ...old,
      description: "",
      date: new Date(),
    }));
  };

  const handleItemClickName = (e) => {
    setFormValues((old) => ({
      ...old,
      name: String(e.key),
      value: String(e.key)?.toLowerCase()?.split(" ")?.join("_"),
      title: "",
      description: "",
    }));
  };

  const handleItemClickPriority = (e) => {
    setFormValues((old) => ({
      ...old,
      priority: e.key,
    }));

    setFormValues((old) => ({ ...old, title: String(e.key) }));
  };

  const handleItemClickPriorityEdit = (e) => {
    setSelectedAchToEdit((old) => ({
      ...old,
      priority: e.key,
    }));
  };

  const menuTypeGame = {
    items: itemsGame,
    onClick: handleItemClickName,
  };

  const menuTypeWork = {
    items: itemsWork,
    onClick: handleItemClickPriority,
  };

  const menuTypeWorkEdit = {
    items: itemsWork,
    onClick: handleItemClickPriorityEdit,
  };

  const refreshAchievements = () => {
    setLoading(true);
    setAchievements((old) => []);
    try {
      axios.get("/api/jeevaachievement").then((response) => {
        setAchievements([]);
        setAchievements(response?.data);
        setLoading(false);
      });
    } catch (e) {
      message.info("Error refreshing Achievement !");
      setLoading(false);
    }
  };

  const refreshGames = () => {
    setLoading(true);
    setGames((old) => []);
    try {
      axios.get("/api/jeevagame").then((response) => {
        setGames([]);
        setGames(response?.data);
        setLoading(false);
      });
    } catch (e) {
      message.info("Error refreshing Achievement !");
      setLoading(false);
    }
  };

  const saveGame = () => {
    setLoading(true);
    try {
      axios.post("/api/jeevagame", { ...formValuesGame }).then((response) => {
        setShowModalGame(false);
        refreshGames();
      });
    } catch (e) {
      message.info("Error saving Achievement !");
      setLoading(false);
    }
  };

  const saveAchievement = () => {
    try {
      if (formValues?.total > MAX_FOR_COUNT) {
        message.info(`Max Limit is ${MAX_FOR_COUNT} `);
      } else {
        setLoading(true);
        axios
          .post("/api/jeevaachievement", { ...formValues })
          .then((response) => {
            setShowModal(false);
            setShowRecentAchUnlock(true);
            refreshAchievements();
          });
      }
    } catch (e) {
      message.info("Error saving Achievement !");
      setLoading(false);
    }
  };

  const resetAchievement = (achInner) => {
    try {
      if (achInner?.total > MAX_FOR_COUNT) {
        message.info(`Max Limit is ${MAX_FOR_COUNT} `);
      } else {
        setLoading(true);
        axios
          .put(
            `/api/jeevaachievement/${achInner?._id}?value=${achInner?.name
              ?.toLowerCase()
              ?.split(" ")
              ?.join("_")}`,
            { ...achInner, completed: 0 }
          )
          .then((response) => {
            setShowModalEdit(false);
            setShowRecentAchUnlock(true);
            refreshAchievements();
          });
      }
    } catch (e) {
      message.info("Error saving Achievement !");
      console.error(e);
      setLoading(false);
    }
  };

  const editAchievement = () => {
    try {
      if (selectedAchToEdit?.total > MAX_FOR_COUNT) {
        message.info(`Max Limit is ${MAX_FOR_COUNT} `);
      } else {
        setLoading(true);
        axios
          .put(
            `/api/jeevaachievement/${
              selectedAchToEdit?._id
            }?value=${selectedAchToEdit?.name
              ?.toLowerCase()
              ?.split(" ")
              ?.join("_")}`,
            { ...selectedAchToEdit }
          )
          .then((response) => {
            setShowModalEdit(false);
            setShowRecentAchUnlock(true);
            refreshAchievements();
          });
      }
    } catch (e) {
      message.info("Error saving Achievement !");
      console.error(e);
      setLoading(false);
    }
  };

  const deleteAchievement = (ach) => {
    console.log(ach);
    setLoading(true);
    try {
      axios
        .delete(
          `/api/jeevaachievement/${ach?._id}?value=${ach?.name
            ?.toLowerCase()
            ?.split(" ")
            ?.join("_")}`
        )
        .then((response) => {
          refreshAchievements();
        });
    } catch (e) {
      message.info("Error deleting Achievement !");
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAchievements();
    refreshGames();
  }, []);

  useEffect(() => {
    let timer = setTimeout(() => {
      setShowRecentAchUnlock(false);
    }, 5000);
    return () => {
      clearTimeout(timer);
    };
  }, [achievements]);

  let achToShow = achievements
    ?.sort((ach1, ach2) => new Date(ach2?.unlocked) - new Date(ach1?.unlocked))
    ?.map((item, index) => ({ ...item, index: achievements?.length - index }));

  achToShow = achToShow?.map((ach) => {
    return { ...ach, url: games?.find((game) => game?.name == ach?.name)?.url };
  });

  let lastAch = achToShow?.[0];

  let moneyAchievement = [];

  achievements?.forEach((ach) => {
    let isMoneyRelated = ach?.type == Work || ach?.type == Habit;
    moneyAchievement.push(ach);
  });

  let isLongAchievementsActive =
    selected == SECTION_GAMES ||
    selected == SECTION_HABIT ||
    selected == SECTION_WORK;

  let isOverviewMode = selected == SECTION_MONEY;
  let isGamesMode = selected == SECTION_GAMES;

  let isGameIconsActive = selected == SECTION_ICONS;

  let finalSelectedOverviewAch = selectedOverviewAchGame ?? achievements?.[0];
  let isfinalMoneyRelated =
    finalSelectedOverviewAch?.type == Work ||
    finalSelectedOverviewAch?.type == Habit;

  let onlyGameAchs = achToShow;
  let finalSelectedOverviewGameAch =
    selectedOverviewAchGame ?? onlyGameAchs?.[0];

  let allGames = achToShow?.map((ach) => {
    return { name: ach?.name, url: ach?.url };
  });

  allGames = new Set([...allGames]);

  let totalXP = achievements?.reduce((acc, ach) => acc + 100, 0);
  let currentLevel = Math.floor(totalXP / 1000);
  let nextLevel = Math.floor(totalXP / 1000) + 1;
  let completionForNext = (totalXP / (nextLevel * 1000)) * 100;

  allGames = [...allGames];

  let achsForGame = achievements
    ?.filter((ach) => ach?.name == selectedGame)
    ?.filter((ach) => {
      if (searchTerm1?.length == 0) {
        return true;
      } else {
        if (searchTerm1?.includes("&")) {
          let allKeys = searchTerm1?.split("&");
          let shouldInclude = allKeys?.reduce((acc, item) => {
            if (
              ach?.title?.toLowerCase()?.includes(item?.toLowerCase()) ||
              ach?.title?.toLowerCase()?.includes(item?.toLowerCase())
            ) {
              return acc && true;
            } else {
              return acc && false;
            }
          }, true);
          return shouldInclude;
        } else if (searchTerm1?.includes("||")) {
          let allKeys = searchTerm1?.split("||");
          let shouldInclude = allKeys?.reduce((acc, item) => {
            if (
              ach?.title?.toLowerCase()?.includes(item?.toLowerCase()) ||
              ach?.title?.toLowerCase()?.includes(item?.toLowerCase())
            ) {
              return acc || true;
            } else {
              return acc || false;
            }
          }, true);
          return shouldInclude;
        } else {
          if (
            ach?.title?.toLowerCase()?.includes(searchTerm1?.toLowerCase()) ||
            ach?.title?.toLowerCase()?.includes(searchTerm1?.toLowerCase())
          ) {
            return true;
          } else {
            return false;
          }
        }
      }
    });

  let final = [];
  let completed = achsForGame?.filter((ach) => ach?.completed == ach?.total);
  let notCompleted = achsForGame
    ?.filter((ach) => ach?.completed != ach?.total)
    ?.sort(
      (ach1, ach2) =>
        ach2.completed / ach2?.total - ach1.completed / ach1?.total
    );

  achsForGame = [...notCompleted, ...completed]?.sort(
    (ach1, ach2) => +ach2.percentage - +ach1?.percentage
  );

  let urlsForGame = {};
  let achAllForGame = {};
  let achAllForGameCompleted = {};

  achievements.forEach((ach) => {
    if (!achAllForGame?.[ach?.name]) {
      achAllForGame[ach?.name] = [];
      achAllForGame[ach?.name].push(ach);
    } else {
      achAllForGame[ach?.name].push(ach);
    }

    if (ach?.completed == ach?.total) {
      if (!achAllForGameCompleted?.[ach?.name]) {
        achAllForGameCompleted[ach?.name] = [];
        achAllForGameCompleted[ach?.name].push(ach);
      } else {
        achAllForGameCompleted[ach?.name].push(ach);
      }
    }
  });

  console.log({ achAllForGame, achievements });

  games.forEach((game) => {
    if (!urlsForGame?.[game?.name]) {
      urlsForGame[game?.name] = game?.url;
    }
  });

  const deleteGame = (id) => {
    axios.delete(`/api/jeevagame/${id}`).then((response) => {
      refreshGames();
    });
  };

  let onlyUnlockedWorkItems = achToShow?.filter(
    (ach) => ach?.achieved && ach?.name == "Work Tracker"
  );
  let onlyLockedWorkItems = achToShow?.filter(
    (ach) => ach?.achieved && ach?.name == "Work Tracker"
  );

  let onlyP1WorkItems = achToShow?.filter(
    (ach) =>
      ach?.priority == "Priority 1" &&
      !ach?.achieved &&
      ach?.name == "Work Tracker"
  );
  let onlyP2WorkItems = achToShow?.filter(
    (ach) =>
      ach?.priority == "Priority 2" &&
      !ach?.achieved &&
      ach?.name == "Work Tracker"
  );
  let onlyP3WorkItems = achToShow?.filter(
    (ach) =>
      ach?.priority == "Priority 3" &&
      !ach?.achieved &&
      ach?.name == "Work Tracker"
  );

  const addOneToAch = (ach) => {
    if (true) {
      const audio = new Audio("/effect.mp3");
      audio.play();
    }
    try {
      if (ach?.completed == ach?.total) {
      } else {
        axios
          .put(
            `/api/jeevaachievement/${ach?._id}?value=${ach?.name
              ?.toLowerCase()
              ?.split(" ")
              ?.join("_")}`,
            {
              ...ach,
              completed: ach?.completed + 1,
              achieved: ach?.completed + 1 == ach?.completed ? "true" : "false",
            }
          )
          .then((response) => {
            setShowModalEdit(false);
            setShowRecentAchUnlock(true);
            refreshAchievements();
          });
      }
    } catch (e) {
      message.info("Error saving Achievement !");
      console.error(e);
      setLoading(false);
    }
  };
  const removeOneToAch = (ach) => {
    try {
      if (ach?.completed == 0) {
      } else {
        axios
          .put(
            `/api/jeevaachievement/${ach?._id}?value=${ach?.name
              ?.toLowerCase()
              ?.split(" ")
              ?.join("_")}`,
            {
              ...ach,
              completed: ach?.completed - 1,
              achieved: ach?.total == ach?.completed ? "true" : "false",
            }
          )
          .then((response) => {
            setShowModalEdit(false);
            setShowRecentAchUnlock(true);
            refreshAchievements();
          });
      }
    } catch (e) {
      message.info("Error saving Achievement !");
      console.error(e);
      setLoading(false);
    }
  };

  const getRandomOperator = () => {
    const achsForGame = achievements
      ?.filter((ach) => ach?.name === selectedGame)
      ?.filter((ach) => ach?.completed !== ach?.total);

    return achsForGame[Math.floor(Math.random() * achsForGame.length)];
  };

  const startRotation = () => {
    if (!achievements?.length || !selectedGame) return;

    clearInterval(intervalRef.current);
    rotateCountRef.current = 0;

    intervalRef.current = setInterval(() => {
      const randomOp = getRandomOperator();
      if (randomOp) setRandomOperator(randomOp);

      rotateCountRef.current += 1;
      if (rotateCountRef.current >= 30) {
        clearInterval(intervalRef.current);
      }
    }, 10);
  };

  useEffect(() => {
    if (achievements?.length && selectedGame) {
      startRotation();
    }

    return () => clearInterval(intervalRef.current); // Cleanup on unmount
  }, [achievements, selectedGame]);

  let platinum = 0,
    gold = 0,
    silver = 0,
    bronze = 0;
  let gameAchievements = {};
  achievements?.forEach((ach) => {
    if (!gameAchievements?.[ach?.name]) {
      gameAchievements[ach?.name] = [];
      gameAchievements[ach?.name].push(ach);
    } else {
      gameAchievements[ach?.name].push(ach);
    }

    if (ach?.completed == ach?.total) {
      if (ach?.color == "Gold") {
        gold++;
      }
      if (ach?.color == "Silver") {
        silver++;
      }
      if (ach?.color == "Bronze") {
        bronze++;
      }
    }
  });

  Object.keys(gameAchievements)?.forEach((game) => {
    let total = gameAchievements?.[game]?.length;
    let completed = gameAchievements?.[game]?.filter(
      (item) => item?.total == item?.completed
    )?.length;
    if (total == completed) {
      platinum++;
    }
  });

  const {
    totalPoints,
    level,
    progressPercent,
    pointsInCurrentLevel,
    pointsNeededForNextLevel,
  } = calculatePsnLevel({ platinum, gold, silver, bronze });

  return (
    <Container>
      <Header>
        <HLeft
          onClick={() => {
            setSelected("GAMES");
          }}
        >
          <span
            style={{
              fontSize: "1.25rem",
              marginRight: ".5rem",
              color: COLOR_WHITE,
            }}
          >
            <TbHome />
          </span>
        </HLeft>
        <HCenter>
          <span
            style={{
              fontSize: "1.1rem",
              marginLeft: "1.75rem",
              marginRight: ".5rem",
              color: COLOR_PLATINUM,
            }}
          >
            <FaTrophy />
          </span>
          <span
            style={{
              fontSize: "1.25rem",
              transform: "translateY(-2px)",
              marginRight: "1rem",
              color: COLOR_PLATINUM,
            }}
          >
            {platinum}
          </span>{" "}
          <span
            style={{
              fontSize: "1.1rem",
              marginRight: ".5rem",
              color: COLOR_GOLD,
            }}
          >
            <FaTrophy />
          </span>
          <span
            style={{
              fontSize: "1.25rem",
              transform: "translateY(-2px)",
              marginRight: "1rem",
              color: COLOR_GOLD,
            }}
          >
            {gold}
          </span>{" "}
          <span
            style={{
              fontSize: "1.1rem",
              marginRight: ".5rem",
              color: COLOR_SILVER,
            }}
          >
            <FaTrophy />
          </span>
          <span
            style={{
              fontSize: "1.25rem",
              transform: "translateY(-2px)",
              marginRight: "1rem",
              color: COLOR_SILVER,
            }}
          >
            {silver}
          </span>{" "}
          <span
            style={{
              fontSize: "1.1rem",
              marginRight: ".5rem",
              color: COLOR_COPPER,
            }}
          >
            <FaTrophy />
          </span>
          <span
            style={{
              fontSize: "1.25rem",
              transform: "translateY(-2px)",
              marginRight: "1rem",
              color: COLOR_COPPER,
            }}
          >
            {bronze}
          </span>
        </HCenter>
        <HRight>
          {/* <AddIcon
            onClick={() => {
              clearFormData();
              setShowModal(true);
            }}
          >
            <span>
              <HiOutlinePlusSm />
            </span>
          </AddIcon>{" "} */}
          <AddIconRefresh
            onClick={() => {
              refreshAchievements();
            }}
          >
            <span style={{ marginLeft: "1rem" }}>
              <TbRefresh />
            </span>
          </AddIconRefresh>
        </HRight>
      </Header>
      {showModalGames && (
        <ModalContainerGame>
          <ModalContent>
            <Form>
              <Title>Add Game</Title>
              <Row>
                <SubTitle>Name</SubTitle>
              </Row>
              <RowInput>
                <input
                  type="text"
                  value={formValuesGame?.name}
                  onChange={(e) => {
                    setFormValuesGame((old) => ({
                      ...old,
                      name: String(e.target.value),
                      value: String(e.target.value)
                        ?.toLowerCase()
                        ?.split(" ")
                        ?.join("_"),
                    }));
                  }}
                />
              </RowInput>
              <Row>
                <SubTitle>URL</SubTitle>
              </Row>
              <RowInputDescription>
                <input
                  value={formValues?.url}
                  type="text"
                  onChange={(e) => {
                    setFormValuesGame((old) => ({
                      ...old,
                      url: String(e.target.value),
                    }));
                  }}
                />
              </RowInputDescription>
            </Form>
          </ModalContent>
          <ModalBottom>
            <ButtonSmall
              onClick={() => setShowModalGame(false)}
              color={COLOR_RED}
            >
              CANCEL
            </ButtonSmall>
            <ButtonSmall onClick={() => saveGame()} color={COLOR_GREEN}>
              SAVE
            </ButtonSmall>
          </ModalBottom>
        </ModalContainerGame>
      )}
      {showModal && (
        <ModalContainer>
          <ModalContent>
            <Form>
              <Title>Add Achievement</Title>
              <Row>
                <SubTitle>Game</SubTitle>
                <Dropdown
                  trigger={["click"]}
                  overlayStyle={{ minWidth: "60%" }}
                  menu={menuTypeGame}
                  overlayClassName="full-width-dropdown"
                >
                  <Space>
                    <span
                      style={{
                        fontSize: ".9rem",
                        color: "#ACAEB2",
                      }}
                    >
                      {formValues?.name ? formValues?.name : "Select Game"}
                    </span>
                    <Caret>
                      <FaCaretDown />
                    </Caret>
                  </Space>
                </Dropdown>
                <span
                  style={{ marginLeft: "1rem", opacity: 0.5 }}
                  onClick={() => {
                    setShowModalGame(true);
                    setShowModal(false);
                  }}
                >
                  <FaPlus />
                </span>
              </Row>
              <Row>
                <SubTitle>Name</SubTitle>
              </Row>
              <RowInput>
                <input
                  type="text"
                  value={formValues?.title}
                  onChange={(e) => {
                    setFormValues((old) => ({
                      ...old,
                      title: String(e.target.value),
                    }));
                  }}
                />
              </RowInput>
              <Row>
                <SubTitle>Count</SubTitle>
              </Row>
              <RowInput>
                <input
                  type="number"
                  min={1}
                  step={1}
                  max={MAX_FOR_COUNT}
                  value={formValues?.total}
                  onChange={(e) => {
                    setFormValues((old) => ({
                      ...old,
                      total: String(e.target.value),
                    }));
                  }}
                />
              </RowInput>
              <Row>
                <SubTitle>Description</SubTitle>
              </Row>
              <RowInputDescription>
                <textarea
                  value={formValues?.description}
                  type="text"
                  onChange={(e) => {
                    setFormValues((old) => ({
                      ...old,
                      description: String(e.target.value),
                    }));
                  }}
                />
              </RowInputDescription>
            </Form>
          </ModalContent>
          <ModalBottom>
            <ButtonSmall onClick={() => setShowModal(false)} color={COLOR_RED}>
              CANCEL
            </ButtonSmall>
            <ButtonSmall onClick={() => saveAchievement()} color={COLOR_GREEN}>
              SAVE
            </ButtonSmall>
          </ModalBottom>
        </ModalContainer>
      )}
      {showModalEdit && (
        <ModalContainer>
          <ModalContent>
            <Form>
              <Title>Edit Achievement</Title>
              <Row>
                <SubTitle>Game</SubTitle>
                <Dropdown
                  trigger={["click"]}
                  overlayStyle={{ minWidth: "60%" }}
                  menu={menuTypeGame}
                  overlayClassName="full-width-dropdown"
                >
                  <Space>
                    <span
                      style={{
                        fontSize: ".9rem",
                        color: "#ACAEB2",
                      }}
                    >
                      {selectedAchToEdit?.name}
                    </span>
                    <Caret>
                      <FaCaretDown />
                    </Caret>
                  </Space>
                </Dropdown>
              </Row>
              <Row>
                <SubTitle>Name</SubTitle>
              </Row>
              <RowInput>
                <input
                  type="text"
                  value={selectedAchToEdit?.title}
                  onChange={(e) => {
                    setSelectedAchToEdit((old) => ({
                      ...old,
                      title: String(e.target.value),
                    }));
                  }}
                />
              </RowInput>
              <Row>
                <SubTitle>Count</SubTitle>
              </Row>
              <RowInput>
                <input
                  type="number"
                  min={1}
                  max={MAX_FOR_COUNT}
                  step={1}
                  value={selectedAchToEdit?.total}
                  onChange={(e) => {
                    setSelectedAchToEdit((old) => ({
                      ...old,
                      total: String(e.target.value),
                    }));
                  }}
                />
              </RowInput>
              <Row>
                <SubTitle>Description</SubTitle>
              </Row>
              <RowInputDescription>
                <textarea
                  value={selectedAchToEdit?.description}
                  type="text"
                  onChange={(e) => {
                    setSelectedAchToEdit((old) => ({
                      ...old,
                      description: String(e.target.value),
                    }));
                  }}
                />
              </RowInputDescription>
            </Form>
          </ModalContent>
          <ModalBottom>
            <ButtonSmall
              onClick={() => setShowModalEdit(false)}
              color={COLOR_RED}
            >
              CANCEL
            </ButtonSmall>
            <ButtonSmall onClick={() => editAchievement()} color={COLOR_GREEN}>
              SAVE
            </ButtonSmall>
          </ModalBottom>
        </ModalContainer>
      )}
      <BottomSmallInput>
        <input
          type="text"
          placeholder="Search for keywords..."
          onChange={(e) => {
            setSearchTerm1(e.target.value);
          }}
          value={searchTerm1}
        />
      </BottomSmallInput>
      <Middle showModal={showModal}>
        {!loading && (
          <MiddleTopContainer>
            {achToShow?.length == 0 &&
              !isOverviewMode &&
              isLongAchievementsActive && <NoData>No Games</NoData>}
            {games?.length > 0 &&
              selected == "GAMES" &&
              games?.map((ach, index) => {
                return (
                  <A1Container>
                    <Popconfirm
                      title="Delete Game"
                      description="Are you sure to delete this game?"
                      onConfirm={() => {
                        deleteGame(ach?._id);
                      }}
                      onCancel={() => {}}
                      okText="Yes"
                      cancelText="No"
                    >
                      <A1Icon2 icon={ach?.url}></A1Icon2>
                    </Popconfirm>
                    <A1Right
                      onClick={(e) => {
                        setSelectedGame(ach?.name);
                        setSelected("GAME");
                      }}
                    >
                      <A1Title>{ach?.name}</A1Title>
                      <A1Desc>{`Played ${ach?.name}`}</A1Desc>
                    </A1Right>
                    <Tag
                      achieved={ach?.achieved}
                      forGame={true}
                      onClick={() => {
                        setSelectedAchToEdit(ach);
                        setShowModalEdit(true);
                      }}
                    >
                      <InnerTagGameAbsolute>
                        <span
                          style={{
                            marginLeft: ".25rem",
                            fontSize: "1rem",
                          }}
                        >
                          {achAllForGameCompleted?.[ach?.name]?.length ?? 0} /{" "}
                          {achAllForGame?.[ach?.name]?.length ?? 0}
                        </span>
                      </InnerTagGameAbsolute>
                    </Tag>
                  </A1Container>
                );
              })}
            {achsForGame?.length > 0 &&
              selectedGame !== "Work Tracker" &&
              selected == "GAME" &&
              selectedGame?.length > 0 &&
              achsForGame?.map((ach, index) => {
                return (
                  <A1Container opaque={ach?.total == ach?.completed}>
                    <Popconfirm
                      title="Actions"
                      description="Select action for Achievement"
                      onConfirm={() => {
                        setSelectedAchToEdit(ach);
                        setShowModalEdit(true);
                      }}
                      onCancel={() => {
                        deleteAchievement(ach);
                      }}
                      okText="Edit"
                      cancelText="Delete"
                    >
                      <A1IconOuter>
                        <A1Icon
                          icon={
                            ach?.name == "Rainbow Six Siege"
                              ? getIconBasedOnKeyword(ach?.title)
                              : ach?.icon
                          }
                        ></A1Icon>
                      </A1IconOuter>
                    </Popconfirm>
                    <A1Right>
                      <A1Title>
                        {ach?.title}
                        <A1TrophyColor color={getTrophyColor(ach?.color)}>
                          <FaTrophy />
                        </A1TrophyColor>
                      </A1Title>
                      <A1Desc>{ach?.description}</A1Desc>
                      <A1Progress>
                        <A1Progress1>
                          <Progress
                            strokeColor={COLOR_ACCENT}
                            percent={(
                              (ach?.completed / ach?.total) *
                              100
                            )?.toFixed(0)}
                            showInfo={false}
                          />
                        </A1Progress1>
                        <A1Progress2>
                          <span style={{ marginLeft: ".25rem" }}>
                            <span>{ach?.completed}</span>
                            <span>/</span>
                            <span>{ach?.total}</span>
                          </span>
                        </A1Progress2>
                      </A1Progress>
                    </A1Right>
                    {ach?.completed < ach?.total && (
                      <MainTag>
                        <TagPositived achieved={ach?.achieved}>
                          <InnerTag
                            onClick={() => {
                              addOneToAch(ach);
                            }}
                          >
                            <span
                              style={{
                                marginLeft: ".25rem",
                                fontSize: "1rem",
                              }}
                            >
                              <FaPlusCircle />
                            </span>
                          </InnerTag>
                        </TagPositived>
                        <TagNegative achieved={ach?.achieved}>
                          <InnerTag
                            onClick={() => {
                              removeOneToAch(ach);
                            }}
                          >
                            <span
                              style={{
                                marginLeft: ".25rem",
                                fontSize: "1rem",
                              }}
                            >
                              <FaMinusCircle />
                            </span>
                          </InnerTag>
                        </TagNegative>
                      </MainTag>
                    )}
                    {ach?.completed == ach?.total && (
                      <MainTag>
                        <TagCompleted achieved={ach?.achieved}>
                          <InnerTagGameDone
                            onClick={() => {
                              resetAchievement(ach);
                            }}
                          >
                            <span
                              style={{
                                marginLeft: ".25rem",
                                fontSize: "1rem",
                              }}
                            >
                              DONE
                            </span>
                          </InnerTagGameDone>
                        </TagCompleted>
                      </MainTag>
                    )}
                  </A1Container>
                );
              })}
            {achsForGame?.length == 0 &&
              selected == "GAME" &&
              selectedGame?.length > 0 && <NoData>No Achievements</NoData>}
            {!selectedGame && selected == "GAME" && (
              <NoData>No Game Selected</NoData>
            )}
          </MiddleTopContainer>
        )}
        {loading && (
          <MiddleTopContainer>
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
            />
          </MiddleTopContainer>
        )}
      </Middle>
      <BottomProgress>
        <ProgresLeft>Level {level}</ProgresLeft>
        <ProgressLevel>
          <span style={{ fontSize: "0.75rem" }}>
            {pointsNeededForNextLevel} XP
          </span>
          <Progress percent={progressPercent} showInfo={false} />
        </ProgressLevel>
        <ProgresRight>Level {level + 1}</ProgresRight>
      </BottomProgress>
    </Container>
  );
}

const ProgresLeft = styled.div`
  display: flex;
  align-items: flex-end;
  padding: 0rem 1rem;
  justify-content: center;
  height: 20px;
`;

const ProgresRight = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0rem 1rem;
  height: 20px;
`;

const ProgressLevel = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  flex: 1;
  height: 20px;
`;

const LevelHex = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateX(-50%);
  width: 80px;
  height: 35px;
  background: #4db8ff;
  color: ${generateDarkTextColorForLightBg("#4db8ff", 50)};
  margin: 60px auto;
  position: absolute;
  left: 50%;
  font-size: 2rem;
  top: -200%;

  &:before,
  &:after {
    content: "";
    position: absolute;
    width: 0;
    border-left: 40px solid transparent;
    border-right: 40px solid transparent;
  }

  &:before {
    bottom: 100%;
    border-bottom: 27.5px solid #4db8ff;
  }

  &:after {
    top: 100%;
    border-top: 27.5px solid #4db8ff;
  }
`;

const Middle = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
  min-height: 78vh;
  max-height: 78vh;
  padding-bottom: 2rem;
  overflow: scroll;
  flex: 1;
  opacity: ${(props) => (props.showModal ? "0" : "1")};
`;

const BottomProgress = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: ${COLOR_BLACK1};
  padding-bottom: 1rem;
  height: 80px;
  position: relative;
`;

const InnerTag = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  transform: translate(-0.1rem, 0.2rem);
  width: 30px;
`;

const InnerTagGameDone = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  transform: translateX(-0.1rem) rotate(-90deg);
  font-size: 1rem;
  width: 30px;
`;

const InnerTagGameAbsolute = styled.div`
  position: absolute;
  right: 0;
  top: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translate(32%, -50%) rotate(-90deg);
  width: 60px;
  height: 30px;
  background-color: ${(props) => (props.background ? props.background : "")};
  background-color: ${COLOR_ACCENT};
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
  height: 60px;
  font-size: 0.8rem;
  position: relative;
`;

const MainTag = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
`;

const TagNegative = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) =>
    props.forGame ? COLOR_GREY : props?.achieved ? COLOR_GREY : COLOR_GREY};
  color: ${(props) =>
    props.forGame
      ? generateDarkTextColorForLightBg(COLOR_GREY)
      : props?.achieved
      ? generateDarkTextColorForLightBg(COLOR_GREY)
      : generateDarkTextColorForLightBg(COLOR_GREY)};
  height: 40px;
  font-size: 0.8rem;
`;

const TagPositived = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) =>
    props.forGame ? COLOR_GREY : props?.achieved ? COLOR_GREY : COLOR_GREY};
  color: ${(props) =>
    props.forGame
      ? generateDarkTextColorForLightBg(COLOR_GREY)
      : props?.achieved
      ? generateDarkTextColorForLightBg(COLOR_GREY)
      : generateDarkTextColorForLightBg(COLOR_GREY)};
  height: 40px;
  font-size: 0.8rem;
`;

const TagCompleted = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) =>
    props.forGame ? COLOR_GREEN : props?.achieved ? COLOR_GREEN : COLOR_GREEN};
  color: ${(props) =>
    props.forGame
      ? generateDarkTextColorForLightBg(COLOR_GREEN)
      : props?.achieved
      ? generateDarkTextColorForLightBg(COLOR_GREEN)
      : generateDarkTextColorForLightBg(COLOR_GREEN)};
  height: 70px;
  font-size: 0.8rem;
`;

const NoData = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const A1Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 0.25rem 0.25rem 0.25rem 0.25rem;
  opacity: ${(props) => (props.opaque ? 0.2 : 1)};
  background-color: ${COLOR_ACH};
`;

const A1IconOuter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: #000000;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`;

const A1Icon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70px;
  height: 70px;
  background: ${(props) => `url('${props.icon}')`};
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
`;

const A1Icon2 = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 140px;
  height: 60px;
  background: ${(props) => `url('${props.icon}')`};
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`;

const A1Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0.25rem 2rem 0.25rem 1rem;
  font-size: 0.9rem;
  flex: 1;
  width: 100%;
  position: relative;
`;

const A1TrophyColor = styled.div`
  position: absolute;
  right: 0.825rem;
  top: 50%;
  transform: translateY(-35%);
  color: ${(props) => props.color};
  width: 20px;
  height: 20px;
`;

const A1Desc = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0rem 2rem 0rem 1rem;
  opacity: 0.7;
  font-size: 0.75rem;
  flex: 3;
`;

const A1Progress = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0rem 1rem;
  opacity: 1;
  font-size: 0.8rem;
  width: 100%;
  flex: 3;
`;

const A1Progress1 = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  opacity: 1;
  font-size: 0.8rem;
  width: 80%;
`;

const A1Progress2 = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  opacity: 1;
  font-size: 0.8rem;
  width: 20%;
`;

const A1Right = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  height: 60px;
  flex: 1;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
`;

const RowInput = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom: 0.5rem;

  & input {
    outline: none;
    border: none;
    width: 100%;
    height: 40px;
    border-radius: 0px;
    opacity: 0.5;
    padding: 0.5rem 1rem;
    background-color: ${COLOR_BLACK2};
  }
`;

const RowInputDescription = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom: 0.5rem;

  & textarea {
    outline: none;
    border: none;
    width: 100%;
    height: 80px;
    border-radius: 0px;
    opacity: 0.5;
    padding: 0.5rem 1rem;
    background-color: ${COLOR_BLACK2};
  }

  & input {
    outline: none;
    border: none;
    width: 100%;
    height: 35px;
    border-radius: 0px;
    opacity: 0.5;
    padding: 0.5rem 1rem;
    background-color: ${COLOR_BLACK2};
  }
`;

const SubTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
  color: ${COLOR_BLUE};
`;

const Title = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: ${COLOR_WHITE};
  padding: 1rem 0rem;
  font-size: 1.1rem;
`;

const Form = styled.div`
  width: 100%;
  flex-direction: column;
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  justify-content: flex-start;
  overflow: scroll;
  font-size: 0.9rem;
`;

const Caret = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateY(-1px);
`;

const ModalContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const ModalBottom = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  position: absolute;
  left: 50%;
  width: 90%;
  top: 45%;
  z-index: 2;
  transform: translate(-50%, -50%);
  background-color: ${COLOR_BLACK1};
`;

const ModalContainerGame = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  position: absolute;
  left: 50%;
  width: 90%;
  top: 45%;
  z-index: 3;
  transform: translate(-50%, -50%);
  background-color: ${COLOR_BLACK1};
`;

const ButtonSmall = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  width: 90%;
  border-radius: 4px;
  margin: 0.5rem;
  background-color: ${(props) => props.color};
  color: ${(props) => generateDarkTextColorForLightBg(props.color)};

  &:active {
    transform: translate(-2px, 2px);
  }
`;

const MiddleTopContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  padding: 0.1rem 0.5rem;
  flex: 1;
  opacity: ${(props) => (props.showModal ? "0" : "1")};
`;

const BottomSmallInput = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  margin-top: 4px;

  & input {
    outline: none;
    border: none;
    width: 100%;
    text-align: left;
    height: 40px;
    border-radius: 0px;
    opacity: 0.5;
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
    background-color: #00000000;
  }
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

const HLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: ${COLOR_GREEN};
`;

const HCenter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  color: ${COLOR_ACCENT};
`;

const HRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const AddIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;

  &:active {
    color: ${COLOR_BLUE};
  }
`;

const AddIconRefresh = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;

  &:active {
    color: ${COLOR_BLUE};
  }
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
