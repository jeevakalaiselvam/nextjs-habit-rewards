import styled from "styled-components";
import NewProfile from "../ncomponents/NewProfile";
import { useEffect, useRef, useState } from "react";
import { FaGamepad } from "react-icons/fa6";
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
import { Col, Input, Modal, Radio, Row, Select, Spin } from "antd";
import axios from "axios";
import GameCdImage from "../components/GameCdImage";
import { LoadingOutlined } from "@ant-design/icons";
import GameCdImageSmall from "../components/GameCdImageSmall";
import MovieCdImageSmall from "../components/MovieCdImageSmall";
import { COLOR_GREEN } from "../helpers/colorHelper";
import Draggable from "react-draggable";

export default function Main2() {
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
  });
  const [editModeShelf, setEditModeShelf] = useState(false);
  const [shelfForm, setShelfForm] = useState({
    type: "GAME",
    shelfName: "",
  });

  const [positions, setPositions] = useState([]);
  const [indexChecker, setIndexChecker] = useState({});
  const [previousIndex, setPreviousIndex] = useState(0);

  useEffect(() => {
    if (window) {
      let oldPositions = JSON.parse(localStorage.getItem("POSITION")) ?? [];
      setPositions(oldPositions);
    } else {
      const newPositions = library.map(() => ({
        x: Math.floor(Math.random() * (600 - 100)),
        y: Math.floor(Math.random() * (400 - 100)),
      }));
      setPositions(newPositions);
    }
  }, [library]);

  const handleDrag = (index, e, data) => {
    const newPositions = [...positions];
    newPositions[index] = { x: data.x, y: data.y };
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

  let games = filteredLib
    ?.filter(
      (item) =>
        item?.type == "GAME" &&
        (item?.genre?.includes(activeCat) || activeCat == "All")
    )
    ?.sort((game1, game2) => game1.title.localeCompare(game2.title));

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

  console.log(shelf);
  let filteredShelfItems = shelf?.filter((item) => item?.type == active);

  return (
    <Container>
      {showCreateModal && (
        <Modal
          width={1200}
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
                options={filteredShelfItems?.map((item) => ({
                  value: item?.shelfName,
                  value: item?.shelfName,
                }))}
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
        <Links>
          <Link
            active={active == "MOVIE" || hoverActive == "MOVIE"}
            onMouseEnter={() => {
              setHoverActive("MOVIE");
            }}
            onMouseLeave={() => {
              setHoverActive("");
            }}
            onClick={() => {
              setActive("MOVIE");
            }}
          >
            <span style={{ transform: "translateY(2px)", marginRight: "1rem" }}>
              <TbMovie />
            </span>
            <span>Movies</span>
          </Link>
        </Links>
        <Links>
          <Link
            active={active == "TV" || hoverActive == "TV"}
            onMouseEnter={() => {
              setHoverActive("TV");
            }}
            onMouseLeave={() => {
              setHoverActive("");
            }}
            onClick={() => {
              setActive("TV");
            }}
          >
            <span style={{ transform: "translateY(2px)", marginRight: "1rem" }}>
              <TbDeviceTv />
            </span>
            <span>TV Series</span>
          </Link>
        </Links>
        <Links>
          <Link
            active={active == "BOOKS" || hoverActive == "BOOKS"}
            onMouseEnter={() => {
              setHoverActive("BOOKS");
            }}
            onMouseLeave={() => {
              setHoverActive("");
            }}
            onClick={() => {
              setActive("BOOKS");
            }}
          >
            <span style={{ transform: "translateY(2px)", marginRight: "1rem" }}>
              <TbBook />
            </span>
            <span>Books</span>
          </Link>
        </Links>
        <Seperator></Seperator>
        <Seperator></Seperator>
        <Links>
          <Link
            active={activeShelf == "Active" || hoverActive == "Active"}
            onMouseEnter={() => {
              setHoverActive("Active");
            }}
            onMouseLeave={() => {
              setHoverActive("");
            }}
            onClick={() => {
              setActiveShelf("Active");
            }}
          >
            <span style={{ transform: "translateY(2px)", marginRight: "1rem" }}>
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
              <span>Active</span>
              <span
                style={{
                  color: "#fefefe7f",
                  background: "#333",
                  padding: ".06125rem .25rem",
                }}
              >
                {library?.filter((item) => item?.shelfName == "Active")?.length}
              </span>
            </span>
          </Link>
          <Link
            active={activeShelf == "Backlog" || hoverActive == "Backlog"}
            onMouseEnter={() => {
              setHoverActive("Backlog");
            }}
            onMouseLeave={() => {
              setHoverActive("");
            }}
            onClick={() => {
              setActiveShelf("Backlog");
            }}
          >
            <span style={{ transform: "translateY(2px)", marginRight: "1rem" }}>
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
              <span>Backlog</span>
              <span
                style={{
                  color: "#fefefe7f",
                  background: "#333",
                  padding: ".06125rem .25rem",
                }}
              >
                {
                  library?.filter((item) => item?.shelfName == "Backlog")
                    ?.length
                }
              </span>
            </span>
          </Link>
          <Link
            active={activeShelf == "Wishlist" || hoverActive == "Wishlist"}
            onMouseEnter={() => {
              setHoverActive("Wishlist");
            }}
            onMouseLeave={() => {
              setHoverActive("");
            }}
            onClick={() => {
              setActiveShelf("Wishlist");
            }}
          >
            <span style={{ transform: "translateY(2px)", marginRight: "1rem" }}>
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
              <span>Wishlist</span>
              <span
                style={{
                  color: "#fefefe7f",
                  background: "#333",
                  padding: ".06125rem .25rem",
                }}
              >
                {
                  library?.filter((item) => item?.shelfName == "Wishlist")
                    ?.length
                }
              </span>
            </span>
          </Link>
          {filteredShelfItems
            ?.filter(
              (shelf) =>
                shelf?.shelfName != "Wishlist" &&
                shelf?.shelfName != "Backlog" &&
                shelf?.shelfName != "Active"
            )
            ?.map((shelf, index) => {
              console.log(library);
              let count = library?.filter((item) =>
                item?.shelfName?.includes(shelf?.shelfName)
              );
              return (
                <Link
                  active={
                    activeShelf == shelf?.shelfName ||
                    hoverActive == shelf?.shelfName
                  }
                  onMouseEnter={() => {
                    setHoverActive(shelf?.shelfName);
                  }}
                  onMouseLeave={() => {
                    setHoverActive("");
                  }}
                  onClick={() => {
                    setActiveShelf(shelf?.shelfName);
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
                    <span>{shelf?.shelfName}</span>
                    <span
                      style={{
                        color: "#fefefe7f",
                        background: "#333",
                        padding: ".06125rem .25rem",
                      }}
                    >
                      {count?.length}
                    </span>
                  </span>
                </Link>
              );
            })}
        </Links>
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
                {activeShelf?.length != 0 && activeShelf != "All" && (
                  <CreateButton
                    onClick={() => {
                      setShowCreateShelfModal(true);
                      setEditModeShelf(true);
                      setShelfForm((old) => {
                        console.log(shelf, activeShelf);
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
            {active == "GAME" && (
              <CanvasLeft activeShelf={activeShelf}>
                {games.map((item, index) => (
                  <Draggable
                    key={index}
                    position={positions[index]}
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
                      handleDrag(index, e, data);
                    }}
                    bounds="parent"
                  >
                    <GameCD zIndex={indexChecker?.[item?._id]}>
                      <CdImage scale={3} onClick={(e) => {}}>
                        <CdInnerImage
                          scale={3}
                          cover={item?.image}
                          onDoubleClick={() => {
                            initiateEditForm(item);
                            setShowCreateModal(true);
                            setEditMode(true);
                          }}
                        />
                      </CdImage>
                    </GameCD>
                  </Draggable>
                ))}
              </CanvasLeft>
            )}
            {active == "MOVIE" && (
              <CanvasLeft activeShelf={activeShelf}>
                {movies.map((item, index) => (
                  <Draggable
                    key={index}
                    position={positions[index]}
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
                      handleDrag(index, e, data);
                    }}
                    bounds="parent"
                  >
                    <GameCDMovie zIndex={indexChecker?.[item?._id]}>
                      <CdImageMovie scale={3} onClick={(e) => {}}>
                        <CdInnerImageMovie
                          scale={3}
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

const CDRealInner = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-52.5%, -52.25%);
  width: 470px;
  height: 470px;
  background: ${(props) => `url("${props?.image}")`};
  background-position: 50% center;
  background-size: cover;
  cursor: pointer;
  background-repeat: no-repeat;
  mask: radial-gradient(circle 30px at center, transparent 100%, black 100%);
  overflow: hidden;
  border-radius: 100rem;
`;
const CDRealOuter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 550px;
  height: 550px;
  background: ${(props) => `url("/icons/cd.png")`};
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
  position: relative;
  cursor: pointer;
`;

const BASE_WIDTH_MOVIE = 150;
const BASE_HEIGHT_MOVIE = 187.5;
const BASE_INNER_WIDTH_MOVIE = 144;
const BASE_INNER_HEIGHT_MOVIE = 170;
const BASE_TOP_MOVIE = 16;
const BASE_LEFT_MOVIE = 0;

const CdImageMovie = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: ${(props) => props.scale * BASE_WIDTH_MOVIE}px;
  height: ${(props) => props.scale * BASE_HEIGHT_MOVIE}px;
  background: url("/icons/blueray.png");
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
  position: absolute;
  z-index: ${(props) => props.zIndex};
`;

const CanvasLeft = styled.div`
  width: calc(100vw - 200px);
  height: calc(100vh);
  position: relative;
  overflow: hidden;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center center;
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

const Links = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
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

const Left = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 200px;
  min-height: 100vh;
  max-height: 100vh;
  background-color: #161b1e;
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
