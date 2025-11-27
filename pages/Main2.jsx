import styled from "styled-components";
import NewProfile from "../ncomponents/NewProfile";
import { useEffect, useRef, useState } from "react";
import { FaCheck, FaGamepad } from "react-icons/fa6";
import { BiSolidMoviePlay } from "react-icons/bi";
import {
  TbBook,
  TbBookFilled,
  TbDeviceGamepad2,
  TbDeviceTv,
  TbFolderFilled,
  TbLayoutGridFilled,
  TbMenu2,
  TbMovie,
} from "react-icons/tb";
import {
  G_STATUS,
  GAME_GENRES,
  GENRES,
  MOVIE_GENRES,
} from "../helpers/catHelper";
import {
  Button,
  Col,
  Input,
  Modal,
  Popconfirm,
  Radio,
  Rate,
  Row,
  Select,
  Spin,
} from "antd";
import axios from "axios";
import GameCdImage from "../components/GameCdImage";
import { LoadingOutlined } from "@ant-design/icons";
import GameCdImageSmall from "../components/GameCdImageSmall";
import MovieCdImageSmall from "../components/MovieCdImageSmall";
import { COLOR_GREEN, COLOR_PLATINUM, COLOR_RED } from "../helpers/colorHelper";
import Draggable from "react-draggable";
import TextArea from "antd/es/input/TextArea";
import PlatinumIconS from "../components/PlatinumIconS";
import GoldIconS from "../components/GoldIconS";
import SilverIconS from "../components/SilverIconS";
import BronzeIconS from "../components/BronzeIconS";
import { formatDate1, formatDate2 } from "../helpers/dateHelper";
import PlatinumIcon from "../components/PlatinumIcon";
import {
  getColorBasedOnRarity,
  getRarityBasedOnRarity,
} from "../helpers/achHelper";

export default function Main2() {
  const [loadingTrophies, setLoadingTrophies] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [active, setActive] = useState("GAME");
  const [activeCat, setActiveCat] = useState("All");
  const [hoverActive, setHoverActive] = useState("GAME");
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeShelf, setActiveShelf] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [library, setLibrary] = useState([]);
  const [shelf, setShelf] = useState([]);
  const [checkedGame, setCheckedGame] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreateShelfModal, setShowCreateShelfModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    type: "GAME",
    genre: [],
    title: "",
    image: "",
    status: "NEW",
    shelfName: "",
    rating: 0,
    appId: "",
    platinum: [],
  });
  const [editModeShelf, setEditModeShelf] = useState(false);
  const [shelfForm, setShelfForm] = useState({
    type: "GAME",
    shelfName: "",
  });

  const [positions, setPositions] = useState([]);
  const [indexChecker, setIndexChecker] = useState({});
  const [previousIndex, setPreviousIndex] = useState(0);

  const [trophies, setTrophies] = useState([]);

  useEffect(() => {
    if (window) {
      let oldPositions = JSON.parse(localStorage.getItem("POSITION")) ?? [];
      setPositions(oldPositions);
    } else {
      let newPositionsMap = {};
      const newPositions = library.forEach((item) => {
        let position = {
          x: Math.floor(Math.random() * (600 - 100)),
          y: Math.floor(Math.random() * (400 - 100)),
        };
        newPositions[item?._id] = position;
      });
      setPositions(newPositions);
    }
  }, [library]);

  const handleDrag = (index, e, data, id) => {
    const newPositions = { ...positions };
    newPositions[id] = { x: data.x, y: data.y };
    setPositions(newPositions);
    if (window) {
      localStorage.setItem("POSITION", JSON.stringify(positions));
    }
  };

  const refreshLibrary = () => {
    setLoading(true);
    try {
      axios.get("/api/jeevalibrary").then((response) => {
        let items = response?.data;
        let indexWrap = {};
        items?.forEach((item) => {
          if (!indexWrap?.[item?._id]) {
            indexWrap[item?._id] = 1;
          }
        });
        setIndexChecker(indexWrap);
        setLibrary(items);
        setLoading(false);
        setCreateForm({
          type: "GAME",
          genre: [],
          title: "",
          image: "",
          status: "DONE",
          shelfName: "",
          rating: 0,
          appId: "",
          platinum: [],
        });
        setEditMode(false);
      });
    } catch (e) {
      setLoading(false);
      setCreateForm({
        type: "GAME",
        genre: [],
        title: "",
        image: "",
        status: "DONE",
        shelfName: "",
        rating: 0,
        appId: "",
        platinum: [],
      });
      setEditMode(false);
    }
  };

  const refreshShelfs = () => {
    setLoading(true);
    try {
      axios.get("/api/jeevashelf").then((response) => {
        let items = response?.data;
        items = items?.sort(
          (i1, i2) => new Date(i2?.created) - new Date(i1?.created)
        );
        setShelf(items);
        setLoading(false);
        setShelfForm({
          type: "GAME",
          shelfName: "",
        });
        setEditModeShelf(false);
      });
    } catch (e) {
      setLoading(false);
      setShelfForm({
        type: "GAME",
        shelfName: "",
      });
      setEditModeShelf(false);
    }
  };

  const saveEditGame = () => {
    setLoading(true);
    try {
      axios
        .post("/api/jeevalibraryedit", { ...createForm })
        .then((response) => {
          setLoading(false);
          refreshAll();
        });
    } catch (e) {
      setLoading(false);
      refreshAll();
    }
  };

  const saveFormShelf = () => {
    setLoading(true);
    try {
      axios.post("/api/jeevashelf", { ...shelfForm }).then((response) => {
        setLoading(false);
        refreshAll();
      });
    } catch (e) {
      setLoading(false);
      refreshAll();
    }
  };

  const saveEditShelf = () => {
    setLoading(true);
    try {
      axios.post("/api/jeevashelfedit", { ...shelfForm }).then((response) => {
        setLoading(false);
        refreshAll();
      });
    } catch (e) {
      setLoading(false);
      refreshAll();
    }
  };

  const saveForm = () => {
    setLoading(true);
    try {
      axios.post("/api/jeevalibrary", { ...createForm }).then((response) => {
        setLoading(false);
        refreshAll();
      });
    } catch (e) {
      setLoading(false);
      refreshAll();
    }
  };

  const options = [
    { label: "GAME", value: "GAME" },
    { label: "MOVIE", value: "MOVIE" },
    { label: "TV", value: "TV" },
    { label: "BOOK", value: "BOOK" },
  ];

  const refreshAll = () => {
    refreshLibrary();
    refreshShelfs();
  };

  useEffect(() => {
    refreshAll();
  }, []);

  const initiateEditForm = (game) => {
    setCreateForm(game);
  };

  let items = [];

  if (active == "GAME") {
    items = library?.filter(
      (item) =>
        item?.type == "GAME" &&
        (item?.genre?.includes(activeCat) || activeCat == "All")
    );
  }
  if (active == "MOVIE") {
    items = library?.filter(
      (item) =>
        item?.type == "MOVIE" &&
        (item?.genre?.includes(activeCat) || activeCat == "All")
    );
  }
  if (active == "TV") {
    items = library?.filter(
      (item) =>
        item?.type == "TV" &&
        (item?.genre?.includes(activeCat) || activeCat == "All")
    );
  }
  if (active == "BOOK") {
    items = library?.filter(
      (item) =>
        item?.type == "BOOK" &&
        (item?.genre?.includes(activeCat) || activeCat == "All")
    );
  }

  let shelfItems = library?.filter(
    (item) => item?.shelfName == activeShelf || activeShelf == "All"
  );

  if (activeShelf == "All") {
    shelfItems = shelfItems?.filter((item) => !item?.shelfName?.length > 0);
  }

  let filteredLib = shelfItems?.sort(
    (item1, item2) => item2?.completed - item1?.completed
  );

  let games = library
    ?.filter((item) => item?.type == "GAME")
    ?.sort(
      (game1, game2) => new Date(game2?.updated) - new Date(game1?.updated)
    );

  let movies = filteredLib
    ?.filter(
      (item) =>
        item?.type == "MOVIE" &&
        (item?.genre?.includes(activeCat) || activeCat == "All")
    )
    ?.sort((game1, game2) => game1.title.localeCompare(game2.title));

  let tv = filteredLib
    ?.filter(
      (item) =>
        item?.type == "TV" &&
        (item?.genre?.includes(activeCat) || activeCat == "All")
    )
    ?.sort((game1, game2) => game1.title.localeCompare(game2.title));

  let book = filteredLib
    ?.filter(
      (item) =>
        item?.type == "BOOK" &&
        (item?.genre?.includes(activeCat) || activeCat == "All")
    )
    ?.sort((game1, game2) => game1.title.localeCompare(game2.title));

  const MOVEMENT_SLIP = 50;

  let filteredShelfItems = shelf
    ?.filter((item) => item?.type == active)
    ?.sort((s1, s2) => s1.shelfName.localeCompare(s2.shelfName));

  const deleteGame = () => {
    try {
      axios
        .delete(`/api/jeevalibrary?id=${createForm?._id}`)
        .then((response) => {
          refreshAll();
        });
    } catch (e) {}
  };

  const refreshTrophiesForGame = (appId) => {
    setLoadingTrophies(true);
    try {
      axios.post("/api/steam", { gamesToInclude: [appId] }).then((response) => {
        let data = response?.data?.data;
        let trophiesForGame = data;

        let finalGames = trophiesForGame?.map((game) => {
          let platinumGameData = JSON.parse(
            library?.find((item) => item?.appId == game?.id)?.platinum ?? "[]"
          );
          let formedGame = {};
          let platinumMapper = {};
          let dlcMapper = {};

          platinumGameData?.forEach((ach) => {
            platinumMapper[ach?.title] = ach;
          });

          let sortedPlatinumTrophies = game?.achievements
            ?.map((ach) => {
              return {
                ...ach,
                label: getRarityBasedOnRarity(ach?.percentage),
                color: getColorBasedOnRarity(ach?.percentage),
                title: ach?.displayName,
                hiddenDesc: platinumMapper[ach?.displayName]?.description,
              };
            })
            ?.filter((ach) => {
              if (platinumMapper[ach?.displayName]) {
                return true;
              } else {
                return false;
              }
            })
            ?.sort((ach1, ach2) => +ach2.percentage - +ach1?.percentage);

          let lastAch =
            sortedPlatinumTrophies?.[sortedPlatinumTrophies?.length - 1];

          let total = sortedPlatinumTrophies?.length;
          let completed = sortedPlatinumTrophies?.filter(
            (ach) => ach?.achieved == "1"
          )?.length;

          total = Math.ceil(total * 1);
          completed = completed > total ? total : completed;
          let isCompleted = total == completed && total != 0;

          if (platinumGameData) {
            formedGame = {
              ...game,
              ...platinumGameData,
              achievements: [
                ...sortedPlatinumTrophies?.filter(
                  (ach) => ach?.displayName != lastAch?.displayName
                ),
                { ...lastAch, color: "Gold" },
                {
                  displayName: `Platinum`,
                  description: `Achieved all Trophies in the game`,
                  hiddenDesc: `${game?.name}`,
                  percentage: lastAch?.percentage,
                  label: getRarityBasedOnRarity(lastAch?.percentage),
                  color: "Platinum",
                  achieved: isCompleted ? 1 : 0,
                  completedFinal: completed,
                  unlocktime: lastAch?.unlocktime,
                  icon: "https://pbs.twimg.com/media/GF8EZJZWQAAwDR7.jpg",
                  gameName: lastAch?.gameName,
                },
              ],
            };
          } else {
            formedGame = {
              ...game,
            };
          }

          return formedGame;
        });

        let currentGame = finalGames?.find((item) => item?.id == appId);

        setTrophies(currentGame);
        setLoadingTrophies(false);
      });
    } catch (e) {}
  };

  function generateMonthYearList(startYear = 2025, startMonth = 5) {
    const result = [];
    const startDate = new Date(startYear, startMonth); // Jan 2016
    const today = new Date();

    let current = new Date(startDate);

    while (current <= today) {
      const month = current.toLocaleString("en-US", { month: "long" });
      const year = current.getFullYear();
      result.push(`${month} ${year}`);

      // move to next month
      current.setMonth(current.getMonth() + 1);
    }

    return result;
  }

  let shelfDates = generateMonthYearList()
    ?.map((item) => ({
      value: item,
      label: item,
    }))
    ?.reverse();

  const IGNORE_STEAM = true;

  return (
    <Container>
      {showCreateModal && (
        <Modal
          width={800}
          title={editMode ? "Edit Product" : "Register Product"}
          open={showCreateModal}
          onOk={() => {
            setShowCreateModal(false);
            if (editMode) {
              saveEditGame();
            } else {
              saveForm();
            }
          }}
          onCancel={() => {
            setShowCreateModal(false);
          }}
          cancelText={"Delete"}
          footer={[
            <Popconfirm
              placement="top"
              title={"Delete Game"}
              description={"Do you want to Delete?"}
              okText="Yes"
              cancelText="No"
              onConfirm={() => {
                deleteGame();
              }}
            >
              <Button key="extra" onClick={() => {}}>
                Delete
              </Button>
            </Popconfirm>,
            <Button key="back" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={() => {
                setShowCreateModal(false);
                if (editMode) {
                  saveEditGame();
                } else {
                  saveForm();
                }
              }}
            >
              Submit
            </Button>,
          ]}
        >
          <Row style={{ marginBottom: ".5rem" }}>
            <Radio.Group
              block
              options={options}
              defaultValue="GAME"
              value={createForm?.type}
              optionType="button"
              buttonStyle="solid"
              style={{ width: "100%" }}
              onChange={(e) => {
                setCreateForm((old) => ({ ...old, type: e.target.value }));
              }}
            />
          </Row>
          <Row style={{ marginBottom: ".5rem" }}></Row>
          <Row style={{ marginBottom: ".5rem" }}>
            <Input
              style={{ borderRadius: ".25rem" }}
              placeholder="Enter Title"
              value={createForm?.title}
              onChange={(e) => {
                setCreateForm((old) => ({ ...old, title: e?.target?.value }));
              }}
            />
          </Row>
          {/* <Row style={{ marginBottom: ".5rem" }}>
            <Input
              style={{ borderRadius: ".25rem" }}
              placeholder="Enter App Id"
              value={createForm?.appId}
              onChange={(e) => {
                setCreateForm((old) => ({ ...old, appId: e?.target?.value }));
              }}
            />
          </Row>
          <Row style={{ marginBottom: ".5rem" }}>
            <TextArea
              rows={5}
              style={{ borderRadius: ".25rem" }}
              placeholder="Enter Platinum JSON"
              value={createForm?.platinum}
              onChange={(e) => {
                setCreateForm((old) => ({
                  ...old,
                  platinum: e?.target?.value,
                }));
              }}
            />
          </Row> */}
          <Row style={{ marginBottom: ".5rem" }}>
            <Input
              style={{ borderRadius: ".25rem" }}
              placeholder="Enter Image"
              value={createForm?.image}
              onChange={(e) => {
                setCreateForm((old) => ({ ...old, image: e?.target?.value }));
              }}
            />
          </Row>
          <Row style={{ marginBottom: ".5rem" }} gutter={[16, 16]}>
            <Col span={12}>
              <Select
                value={createForm?.status}
                style={{ width: "100%" }}
                placeholder="Select Status.."
                onChange={(e) => {
                  setCreateForm((old) => ({ ...old, status: e }));
                }}
                allowClear
                options={G_STATUS}
              />
            </Col>
            <Col span={12}>
              <Select
                mode="multiple"
                value={createForm?.genre}
                style={{ width: "100%" }}
                placeholder="Select Genre.."
                onChange={(e) => {
                  setCreateForm((old) => ({ ...old, genre: e }));
                }}
                allowClear
                options={
                  active == "GAME"
                    ? GAME_GENRES
                    : active == "MOVIE"
                    ? MOVIE_GENRES
                    : MOVIE_GENRES
                }
              />
            </Col>
          </Row>
          <Row style={{ marginBottom: ".5rem" }} gutter={[16, 16]}>
            <Col span={12}>
              <Select
                value={createForm?.shelfName}
                style={{ width: "100%" }}
                placeholder="Select Shelf.."
                onChange={(e) => {
                  setCreateForm((old) => ({ ...old, shelfName: e }));
                }}
                allowClear
                options={shelfDates}
              />
            </Col>
            <Col span={12} style={{ transform: "translateY(.45rem)" }}>
              <Rate
                value={createForm?.rating}
                onChange={(e) => {
                  setCreateForm((old) => ({ ...old, rating: e }));
                }}
              />
            </Col>
          </Row>
        </Modal>
      )}
      {showCreateShelfModal && (
        <Modal
          width={800}
          title={editModeShelf ? "Edit Shelf" : "Create Shelf"}
          open={showCreateShelfModal}
          onOk={() => {
            setShowCreateShelfModal(false);
            if (editModeShelf) {
              saveEditShelf();
            } else {
              saveFormShelf();
            }
          }}
          onCancel={() => {
            setShowCreateShelfModal(false);
          }}
        >
          <Row style={{ marginBottom: ".5rem" }}>
            <Radio.Group
              block
              options={options}
              defaultValue="GAME"
              value={shelfForm?.type}
              optionType="button"
              buttonStyle="solid"
              style={{ width: "100%" }}
              onChange={(e) => {
                setShelfForm((old) => ({ ...old, type: e.target.value }));
              }}
            />
          </Row>
          <Row style={{ marginBottom: ".5rem" }}></Row>
          <Row style={{ marginBottom: ".5rem" }}>
            <Input
              style={{ borderRadius: ".25rem" }}
              placeholder="Enter Title"
              value={shelfForm?.shelfName}
              onChange={(e) => {
                setShelfForm((old) => ({
                  ...old,
                  shelfName: e?.target?.value,
                }));
              }}
            />
          </Row>
        </Modal>
      )}
      <Left>
        <NewProfile />
        <Links>
          <Link
            active={active == "GAME" || hoverActive == "GAME"}
            onMouseEnter={() => {
              setHoverActive("GAME");
            }}
            onMouseLeave={() => {
              setHoverActive("");
            }}
            onClick={() => {
              setActive("GAME");
            }}
          >
            <span style={{ transform: "translateY(2px)", marginRight: "1rem" }}>
              <TbDeviceGamepad2 />
            </span>
            <span>Games</span>
          </Link>
        </Links>
        <Seperator></Seperator>
        <Links>
          {shelfDates?.map((shelf, index) => {
            let count = 0;

            count = library?.filter(
              (game) => game?.shelfName == shelf?.value
            )?.length;

            return (
              <Link
                active={
                  activeShelf == shelf?.value || hoverActive == shelf?.value
                }
                onMouseEnter={() => {
                  setHoverActive(shelf?.value);
                }}
                onMouseLeave={() => {
                  setHoverActive("");
                }}
                onClick={() => {
                  setActiveShelf(shelf?.value);
                }}
              >
                <span
                  style={{
                    transform: "translateY(2px)",
                    marginRight: "1rem",
                  }}
                >
                  <TbDeviceGamepad2 />
                </span>
                <span
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span>{shelf?.value}</span>
                  <span
                    style={{
                      background: "#333",
                      padding: "2px 2px",
                      opacity: count > 0 ? 1 : 0.25,
                    }}
                  >
                    {count}
                  </span>
                </span>
              </Link>
            );
          })}
        </Links>
        <PlatinumTitle>GAMES COUNT</PlatinumTitle>
        <PlatinumData>
          <span style={{ transform: "scale(3)" }}>
            <PlatinumIcon />
          </span>
        </PlatinumData>
        <PlatinumCount>
          <span style={{ fontSize: "1.5rem", fontWeight: "bolder" }}>
            {
              library?.filter(
                (item) => item?.type == "GAME" && item?.status == "DONE"
              )?.length
            }
          </span>
        </PlatinumCount>
      </Left>
      <Right>
        <Top>
          <Top1>
            <SearchLeft>
              <Search>
                <input
                  type="text"
                  onChange={(e) => {
                    setSearchTerm(e?.target?.value);
                  }}
                  value={searchTerm}
                  placeholder="Search for Games..."
                />
              </Search>
            </SearchLeft>
            <Categories>
              <Top2L>
                All Games
                <span
                  style={{
                    background: "#272F30",
                    padding: ".125rem .25rem",
                    marginLeft: ".5rem",
                    borderRadius: ".25rem",
                  }}
                >
                  {library?.length}
                </span>
                <CreateButton
                  onClick={() => {
                    setShowCreateModal(true);
                    if (active == "GAME") {
                      setCreateForm((old) => ({ ...old, type: "GAME" }));
                    }
                    if (active == "MOVIE") {
                      setCreateForm((old) => ({ ...old, type: "MOVIE" }));
                    }
                    if (active == "TV") {
                      setCreateForm((old) => ({ ...old, type: "TV" }));
                    }
                    if (active == "BOOK") {
                      setCreateForm((old) => ({ ...old, type: "BOOK" }));
                    }
                  }}
                >
                  {active == "GAME" && "Add Game"}
                  {active == "MOVIE" && "Add Movie"}
                  {active == "TV" && "Add TV"}
                  {active == "BOOK" && "Add Book"}
                </CreateButton>
                {false && (
                  <CreateButton
                    onClick={() => {
                      setShowCreateShelfModal(true);
                      if (active == "GAME") {
                        setShelfForm((old) => ({ ...old, type: "GAME" }));
                      }
                      if (active == "MOVIE") {
                        setShelfForm((old) => ({ ...old, type: "MOVIE" }));
                      }
                      if (active == "TV") {
                        setShelfForm((old) => ({ ...old, type: "TV" }));
                      }
                      if (active == "BOOK") {
                        setShelfForm((old) => ({ ...old, type: "BOOK" }));
                      }
                    }}
                  >
                    Create Shelf
                  </CreateButton>
                )}
                {false && activeShelf?.length != 0 && activeShelf != "All" && (
                  <CreateButton
                    onClick={() => {
                      setShowCreateShelfModal(true);
                      setEditModeShelf(true);
                      setShelfForm((old) => {
                        return {
                          ...shelf?.find(
                            (item) => item?.shelfName == activeShelf
                          ),
                        };
                      });
                    }}
                  >
                    Edit Shelf
                  </CreateButton>
                )}
              </Top2L>
            </Categories>
          </Top1>
          <Top2></Top2>
        </Top>
        {!loading && (
          <Content>
            {!IGNORE_STEAM && active == "GAME" && (
              <CanvasRight>
                {loadingTrophies && (
                  <Spin
                    indicator={
                      <LoadingOutlined style={{ fontSize: 48 }} spin />
                    }
                  />
                )}
                {!loadingTrophies &&
                  [
                    ...(trophies?.achievements ?? [])?.filter(
                      (ach) => ach?.color == "Platinum"
                    ),
                    ...(trophies?.achievements ?? [])?.filter(
                      (ach) => ach?.color != "Platinum"
                    ),
                  ]?.map((ach, index) => {
                    let desc1 = ach?.hiddenDesc;
                    let desc2 = ach?.description;
                    let desc3 = ach?.hiddenDesc?.split(
                      "Hidden achievement:"
                    )?.[1];
                    return (
                      <AchCard
                        color={index % 2 == 0 ? "#F9F9F9" : "#F5F5F7"}
                        achieved={ach?.achieved}
                        platinum={ach?.color == "Platinum"}
                      >
                        {ach?.color != "Platinum" && (
                          <AchIconOuter achieved={ach?.achieved}>
                            <AchIcon
                              icon={
                                ach?.achieved == 1 ? ach?.icon : ach?.icongray
                              }
                              onClick={() => {
                                if (window !== "undefined") {
                                  const searchQuery = `${
                                    ach?.displayName
                                  } achievement ${encodeURIComponent(
                                    ach?.gameName
                                  )} `;
                                  window.open(
                                    `https://www.google.com/search?q=${searchQuery}`
                                  );
                                }
                              }}
                            ></AchIcon>
                          </AchIconOuter>
                        )}
                        {ach?.color == "Platinum" && (
                          <AchIconOuterPlatinum
                            achieved={ach?.achieved}
                            onClick={() => {
                              if (window !== "undefined") {
                                const searchQuery = `${ach?.gameName} Platinum Trophy Guide} `;
                                window.open(
                                  `https://www.google.com/search?q=${searchQuery}`
                                );
                              }
                            }}
                          >
                            {ach?.achieved == 1 && (
                              <span
                                style={{
                                  color: COLOR_GREEN,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  transform: "scale(1.25)",
                                }}
                              >
                                <FaCheck />
                              </span>
                            )}
                            {ach?.achieved != 1 && (
                              <span
                                style={{
                                  background: "#262D35",
                                  width: "60px",
                                  height: "60px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <PlatinumIcon />
                              </span>
                            )}
                          </AchIconOuterPlatinum>
                        )}
                        <AchData>
                          <AchTitle>{ach?.displayName}</AchTitle>
                          <AchDesc>
                            {desc2 ? desc2 : desc3 ? desc3 : desc1}
                          </AchDesc>
                        </AchData>
                        {ach?.achieved == 1 && (
                          <Unlocked>
                            <UnlockedT1>
                              {formatDate1(new Date(ach?.unlocktime * 1000))}
                            </UnlockedT1>
                            <UnlockedT2>
                              {formatDate2(new Date(ach?.unlocktime * 1000))}
                            </UnlockedT2>
                          </Unlocked>
                        )}
                        <SeperatorH padding={".25rem"} />
                        {ach?.color != "Platinum" && (
                          <AchRarity>
                            <span style={{ fontSize: "1.2rem" }}>
                              {ach?.percentage}%
                            </span>
                            <span style={{ fontSize: ".7rem" }}>
                              {ach?.label?.toUpperCase()}
                            </span>
                          </AchRarity>
                        )}
                        {ach?.color == "Platinum" && (
                          <AchRarity>
                            <span style={{ fontSize: ".7rem" }}>PLATINUM</span>
                          </AchRarity>
                        )}
                        <SeperatorH padding={".25rem"} />
                        <AchTrophy achieved={ach?.achieved == "1"}>
                          {ach?.achieved == "1" && ach?.color != "Platinum" && (
                            <GoldIconS />
                          )}
                          {!ach?.achieved == "1" &&
                            ach?.color != "Platinum" && <SilverIconS />}
                          {ach?.color == "Platinum" && <PlatinumIconS />}
                        </AchTrophy>
                      </AchCard>
                    );
                  })}
              </CanvasRight>
            )}
            {active == "GAME" && (
              <CanvasLeft activeShelf={activeShelf}>
                {games.map((item, index) => {
                  let allNotCompleted = trophies?.achievements?.filter(
                    (ach) => ach?.achieved != 1
                  );
                  let isPlatinum = allNotCompleted == 0;
                  return (
                    <GameCD zIndex={indexChecker?.[item?._id]}>
                      <CdImage scale={3.1} onClick={(e) => {}}>
                        <CdInnerImage
                          scale={3.1}
                          cover={item?.image}
                          onDoubleClick={() => {
                            initiateEditForm(item);
                            setShowCreateModal(true);
                            setEditMode(true);
                          }}
                        />
                        {isPlatinum && (
                          <PlatinumWrapper isPlatinum={isPlatinum}>
                            <PlatinumIcon />
                          </PlatinumWrapper>
                        )}
                      </CdImage>
                    </GameCD>
                  );
                })}
              </CanvasLeft>
            )}
            {active == "MOVIE" && (
              <CanvasLeft activeShelf={activeShelf}>
                {movies.map((item, index) => (
                  <Draggable
                    key={index}
                    position={positions[item?._id]}
                    onStart={() => {
                      console.clear();
                      console.log(indexChecker);
                      let lastMax = Math.max(...Object.values(indexChecker));
                      setIndexChecker((old) => {
                        return {
                          ...old,
                          [item?._id]: lastMax + 1,
                        };
                      });
                      setCheckedGame(item?._id);
                    }}
                    onDrag={(e, data) => {
                      handleDrag(index, e, data, item?._id);
                    }}
                    onStop={() => {
                      let lastRefresh = "";
                      let oldId = "";
                    }}
                    bounds="parent"
                  >
                    <GameCDMovie zIndex={indexChecker?.[item?._id]}>
                      <CdImageMovie scale={3.2} onClick={(e) => {}}>
                        <CdInnerImageMovie
                          scale={3.2}
                          cover={item?.image}
                          onDoubleClick={() => {
                            initiateEditForm(item);
                            setShowCreateModal(true);
                            setEditMode(true);
                          }}
                        />
                      </CdImageMovie>
                    </GameCDMovie>
                  </Draggable>
                ))}
              </CanvasLeft>
            )}
          </Content>
        )}
        {loading && (
          <ContentC>
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
            />
          </ContentC>
        )}
      </Right>
    </Container>
  );
}

const PlatinumWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  padding-top: 14rem;
  padding-left: 10rem;
  z-index: 999;
  transform: scale(2);
  animation: ${(props) =>
    props.isPlatinum ? "blinkSmooth 1.5s ease-in-out infinite" : ""};

  @keyframes blinkSmooth {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }
`;

const Unlocked = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100px;
  color: #579428;
`;

const UnlockedT1 = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
`;

const UnlockedT2 = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  padding-top: 0.25rem;
`;

const AchTitle = styled.div`
  display: flex;
  align-items: center;
  padding-left: 0.5rem;
  color: #fefefe;
  justify-content: flex-start;
  flex: 2;
  font-size: 16px;
  width: 100%;
`;

const AchDesc = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding-left: 0.5rem;
  flex: 2;
  width: 100%;
  font-size: 14px;
  color: #898989;
`;

const AchIconOuter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 65px;
  height: 65px;
`;

const AchIconOuterPlatinum = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  margin: 0.125rem;
  background-color: #262d35;
`;

const AchIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: ${(props) => `url(${props?.icon})`};
  background-size: contain;
  background-repeat: no-repeat;
`;

const AchData = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  flex: 1;
  min-width: 300px;
  height: 60px;
`;

const AchRarity = styled.div`
  display: flex;
  align-items: center;
  width: 100px;
  justify-content: flex-start;
  flex-direction: column;
  color: rgb(139, 146, 154);
`;

const AchTrophy = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  min-width: 50px;
  transform: scale(1.5) translate(0.25rem, 0.25rem);
  opacity: ${(props) => (props.achieved ? "1" : "0.25")};
`;

const AchCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: #333;
  width: 100%;
  background-color: #080c11;
  margin-bottom: 0.5rem;
  opacity: ${(props) => (props?.achieved == 1 ? 1 : 1)};
`;

const BASE_WIDTH_MOVIE = 150;
const BASE_HEIGHT_MOVIE = 187.5;
const BASE_INNER_WIDTH_MOVIE = 121;
const BASE_INNER_HEIGHT_MOVIE = 170;
const BASE_TOP_MOVIE = 15;
const BASE_LEFT_MOVIE = 1;

const CdImageMovie = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: ${(props) => props.scale * BASE_WIDTH_MOVIE}px;
  height: ${(props) => props.scale * BASE_HEIGHT_MOVIE}px;
  background: url("/icons/blueray2.png");
  background-size: contain;
  background-repeat: no-repeat;
  position: relative;
  margin: 1rem;
  cursor: pointer;
`;

const CdInnerImageMovie = styled.div`
  width: ${(props) => props.scale * BASE_INNER_WIDTH_MOVIE}px;
  height: ${(props) => props.scale * BASE_INNER_HEIGHT_MOVIE}px;
  position: absolute;
  top: ${(props) => props.scale * BASE_TOP_MOVIE}px;
  left: ${(props) => props.scale * BASE_LEFT_MOVIE}px;
  background: ${(props) => `url(${props.cover})`};
  background-size: cover;
  background-repeat: no-repeat;
  z-index: 99;
  background-position: center center;
  cursor: pointer;
`;

const GameCDMovie = styled.div`
  width: ${(props) => props.scale * BASE_WIDTH_MOVIE}px;
  height: ${(props) => props.scale * BASE_HEIGHT_MOVIE}px;
  border-radius: 12px;
  cursor: grab;
  position: absolute;
  z-index: ${(props) => props.zIndex};
`;

const BASE_WIDTH_GAME = 150;
const BASE_HEIGHT_GAME = 187.5;
const BASE_INNER_WIDTH_GAME = 142;
const BASE_INNER_HEIGHT_GAME = 160;
const BASE_TOP_GAME = 25;
const BASE_LEFT_GAME = 0.5625;

const CdImage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: ${(props) => props.scale * BASE_WIDTH_GAME}px;
  height: ${(props) => props.scale * BASE_HEIGHT_GAME}px;
  background: url("/icons/cover.png");
  background-size: contain;
  background-repeat: no-repeat;
  position: relative;
  margin: 1rem;
  cursor: pointer;
`;

const CdInnerImage = styled.div`
  width: ${(props) => props.scale * BASE_INNER_WIDTH_GAME}px;
  height: ${(props) => props.scale * BASE_INNER_HEIGHT_GAME}px;
  position: absolute;
  top: ${(props) => props.scale * BASE_TOP_GAME}px;
  left: ${(props) => props.scale * BASE_LEFT_GAME}px;
  background: ${(props) => `url(${props.cover})`};
  background-size: cover;
  background-repeat: no-repeat;
  z-index: 99;
  background-position: center center;
  cursor: pointer;
`;

const GameCD = styled.div`
  width: ${(props) => props.scale * BASE_WIDTH_GAME}px;
  height: ${(props) => props.scale * BASE_HEIGHT_GAME}px;
  border-radius: 12px;
  cursor: grab;
  z-index: ${(props) => props.zIndex};
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const CanvasLeft = styled.div`
  flex: 2;
  width: 100vw;
  height: calc(100vh);
  padding-top: 1rem;
  position: relative;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  overflow: scroll;
`;

const CanvasRight = styled.div`
  flex: 1.5;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  max-height: calc(100vh - 100px);
  min-height: calc(100vh - 100px);
  overflow: scroll;
`;

const CreateButton = styled.div`
  background-image: linear-gradient(
    to right,
    #1adeec 0%,
    #4bccf2 51%,
    #7eb9fd 100%
  );
  padding: 4px;
  margin-left: 1rem;
  cursor: pointer;
  text-align: center;
  transition: 0.5s;
  background-size: 200% auto;
  color: white;
  border-radius: 4px;
  font-size: 0.8rem;
  display: block;

  &:hover {
    background-position: right center; /* change the direction of the change here */
    color: #fff;
    text-decoration: none;
  }
`;

const Top2L = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
`;

const ZoomItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Zoom = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Categories = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SearchLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const Search = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: #161b1e;
  width: 250px;
  border-radius: 4px;

  & input {
    padding: 0.25rem;
    background-color: #161b1e;
    outline: none;
    border: none;
    font-size: 0.8rem;
    padding: 0.5rem;
    border-radius: 4px;
  }
`;

const Top1 = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  width: 100%;
`;

const Top2 = styled.div`
  display: flex;
  align-items: center;
  padding: 0rem 1rem;
  justify-content: flex-start;
  width: 100%;
`;

const Seperator = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
  height: 2px;
  background-color: #373c3e;
`;

const SeperatorH = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  content: "";
  height: 40px;
  background: #eee;
  opacity: 0.25;
  width: 1px;
  margin: ${(props) => (props.padding ? `0rem ${props.padding}` : `0rem 1rem`)};
  top: calc(50% - 20px);
`;

const Links = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
  max-height: 80vh;
  overflow: scroll;
`;

const Link = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: flex-start;
  color: ${(props) => (props?.active ? "#98C3CC" : "#9EB2B6")};
  background-color: ${(props) => (!props?.active ? "#060a0b00" : "#060a0b")};
  cursor: pointer;
  padding: 0.25rem 1rem;
  font-size: 0.8rem;
`;

const PlatinumTitle = styled.div`
  position: absolute;
  bottom: 3rem;
  left: 0rem;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 2rem;
  z-index: 1;
  font-size: 0.9rem;
  color: ${COLOR_PLATINUM};
`;

const PlatinumData = styled.div`
  position: absolute;
  bottom: 0rem;
  left: 0rem;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 2rem;
  z-index: 1;
`;

const PlatinumCount = styled.div`
  position: absolute;
  bottom: 1.5rem;
  left: -0.15rem;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 1rem;
  z-index: 5;
  color: #2a447b;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 200px;
  min-height: 100vh;
  max-height: 100vh;
  background-color: #161b1e;
  position: relative;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  flex: 1;
  min-height: 100vh;
  max-height: 100vh;
  background-color: #060a0b;
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 45px;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 92vw;
  padding: 1rem 0.5rem;
  max-height: calc(100vh - 45px);
  min-height: calc(100vh - 45px);
  overflow: hidden;
  position: relative;
`;

const CdInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: absolute;
  left: ${(props) => `${props.left}px`};
  top: ${(props) => `${props.top}px`};
  z-index: ${(props) => props.zIndex};
`;

const ContentC = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1rem 0.25rem;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 100vw;
  max-width: 100vw;
  min-height: 100vh;
  max-height: 100vh;
  color: #636c6e;
`;
