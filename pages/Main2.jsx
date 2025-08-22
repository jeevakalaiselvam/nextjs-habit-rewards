import styled from "styled-components";
import NewProfile from "../ncomponents/NewProfile";
import { useEffect, useState } from "react";
import { FaGamepad } from "react-icons/fa6";
import { BiSolidMoviePlay } from "react-icons/bi";
import { TbFolderFilled, TbLayoutGridFilled } from "react-icons/tb";
import {
  G_STATUS,
  GAME_GENRES,
  GENRES,
  MOVIE_GENRES,
} from "../helpers/catHelper";
import { Input, Modal, Radio, Row, Select, Spin } from "antd";
import axios from "axios";
import GameCdImage from "../components/GameCdImage";
import { LoadingOutlined } from "@ant-design/icons";
import GameCdImageSmall from "../components/GameCdImageSmall";
import MovieCdImageSmall from "../components/MovieCdImageSmall";

export default function Main2() {
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [active, setActive] = useState("GAMES");
  const [activeCat, setActiveCat] = useState("All");
  const [hoverActive, setHoverActive] = useState("GAMES");
  const [searchTerm, setSearchTerm] = useState("");
  const [library, setLibrary] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    type: "GAME",
    genre: [],
    title: "",
    image: "",
    status: "COMPLETED",
  });

  const refreshLibrary = () => {
    setLoading(true);
    try {
      axios.get("/api/jeevalibrary").then((response) => {
        let items = response?.data;
        setLibrary(items);
        setLoading(false);
        setCreateForm({
          type: "GAME",
          genre: [],
          title: "",
          image: "",
          status: "COMPLETED",
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
        status: "COMPLETED",
      });
      setEditMode(false);
    }
  };

  const saveEditGame = () => {
    setLoading(true);
    try {
      axios
        .post("/api/jeevalibraryedit", { ...createForm })
        .then((response) => {
          setLoading(false);
          refreshLibrary();
        });
    } catch (e) {
      setLoading(false);
      refreshLibrary();
    }
  };

  const saveForm = () => {
    setLoading(true);
    try {
      axios.post("/api/jeevalibrary", { ...createForm }).then((response) => {
        setLoading(false);
        refreshLibrary();
      });
    } catch (e) {
      setLoading(false);
      refreshLibrary();
    }
  };

  const options = [
    { label: "GAME", value: "GAME" },
    { label: "MOVIE", value: "MOVIE" },
    { label: "TV", value: "TV" },
    { label: "BOOK", value: "BOOK" },
  ];

  useEffect(() => {
    refreshLibrary();
  }, []);

  const initiateEditForm = (game) => {
    setCreateForm(game);
  };

  let games = library
    ?.filter(
      (item) =>
        item?.type == "GAME" &&
        (item?.genre?.includes(activeCat) || activeCat == "All")
    )
    ?.sort((game1, game2) => game1.title.localeCompare(game2.title));

  let movies = library
    ?.filter(
      (item) =>
        item?.type == "MOVIE" &&
        (item?.genre?.includes(activeCat) || activeCat == "All")
    )
    ?.sort((game1, game2) => game1.title.localeCompare(game2.title));

  let tv = library
    ?.filter(
      (item) =>
        item?.type == "TV" &&
        (item?.genre?.includes(activeCat) || activeCat == "All")
    )
    ?.sort((game1, game2) => game1.title.localeCompare(game2.title));

  let book = library
    ?.filter(
      (item) =>
        item?.type == "BOOK" &&
        (item?.genre?.includes(activeCat) || activeCat == "All")
    )
    ?.sort((game1, game2) => game1.title.localeCompare(game2.title));

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
        >
          <Row style={{ marginBottom: ".5rem" }}>
            <Radio.Group
              block
              options={options}
              defaultValue="GAME"
              optionType="button"
              buttonStyle="solid"
              style={{ width: "100%" }}
              onChange={(e) => {
                setCreateForm((old) => ({ ...old, type: e.target.value }));
              }}
            />
          </Row>
          <Row style={{ marginBottom: ".5rem" }}>
            <Select
              mode="multiple"
              value={createForm?.genre}
              style={{ width: "100%" }}
              placeholder="Select Genre.."
              onChange={(e) => {
                setCreateForm((old) => ({ ...old, genre: e }));
              }}
              allowClear
              options={GAME_GENRES}
            />
          </Row>
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
          <Row style={{ marginBottom: ".5rem" }}>
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
          </Row>
        </Modal>
      )}
      <Left>
        <NewProfile />
        <Links>
          <Link
            active={active == "GAMES" || hoverActive == "GAMES"}
            onMouseEnter={() => {
              setHoverActive("GAMES");
            }}
            onMouseLeave={() => {
              setHoverActive("");
            }}
            onClick={() => {
              setActive("GAMES");
            }}
          >
            <span style={{ transform: "translateY(2px)", marginRight: "1rem" }}>
              <FaGamepad />
            </span>
            <span>Games</span>
          </Link>
        </Links>
        <Links>
          <Link
            active={active == "MOVIES" || hoverActive == "MOVIES"}
            onMouseEnter={() => {
              setHoverActive("MOVIES");
            }}
            onMouseLeave={() => {
              setHoverActive("");
            }}
            onClick={() => {
              setActive("MOVIES");
            }}
          >
            <span style={{ transform: "translateY(2px)", marginRight: "1rem" }}>
              <BiSolidMoviePlay />
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
              <BiSolidMoviePlay />
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
              <BiSolidMoviePlay />
            </span>
            <span>Books</span>
          </Link>
        </Links>
        <Seperator></Seperator>
        <Links>
          <Link
            active={activeCat == "All" || hoverActive == "All"}
            onMouseEnter={() => {
              setHoverActive("All");
            }}
            onMouseLeave={() => {
              setHoverActive("");
            }}
            onClick={() => {
              setActiveCat("All");
            }}
          >
            <span style={{ transform: "translateY(2px)", marginRight: "1rem" }}>
              <TbLayoutGridFilled />
            </span>
            <span style={{ width: "120px" }}>All</span>
            <span
              style={{
                background: "#272F30",
                padding: "0rem .25rem",
                marginLeft: ".5rem",
                borderRadius: ".25rem",
              }}
            >
              {library?.length}
            </span>
          </Link>
          {GAME_GENRES?.map((genre) => {
            return (
              <Link
                active={
                  activeCat == genre?.value || hoverActive == genre?.value
                }
                onMouseEnter={() => {
                  setHoverActive(genre?.value);
                }}
                onMouseLeave={() => {
                  setHoverActive("");
                }}
                onClick={() => {
                  setActiveCat(genre?.value);
                }}
              >
                <span
                  style={{ transform: "translateY(2px)", marginRight: "1rem" }}
                >
                  <TbLayoutGridFilled />
                </span>
                <span style={{ width: "120px" }}>{genre?.label}</span>
                <span
                  style={{
                    background: "#272F30",
                    padding: "0rem .25rem",
                    marginLeft: ".5rem",
                    borderRadius: ".25rem",
                  }}
                >
                  {
                    library?.filter((item) =>
                      item?.genre?.includes(genre?.value)
                    )?.length
                  }
                </span>
              </Link>
            );
          })}
        </Links>
      </Left>
      <Right>
        <Top>
          <Top1>
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
                  }}
                >
                  {active == "GAMES" && "Register Game"}
                  {active == "MOVIES" && "Register Movie"}
                  {active == "TV" && "Register TV"}
                  {active == "BOOK" && "Register Book"}
                </CreateButton>
              </Top2L>
            </Categories>
          </Top1>
          <Top2></Top2>
        </Top>
        {!loading && (
          <Content>
            {active == "GAMES" &&
              games?.map((game) => {
                return (
                  <GameCdImageSmall
                    scale={3}
                    cover={game?.image}
                    onClick={() => {
                      initiateEditForm(game);
                      setShowCreateModal(true);
                      setEditMode(true);
                    }}
                  />
                );
              })}{" "}
            {active == "MOVIES" &&
              movies?.map((movie) => {
                return (
                  <MovieCdImageSmall
                    scale={3}
                    cover={movie?.image}
                    onClick={() => {
                      initiateEditForm(movie);
                      setShowCreateModal(true);
                      setEditMode(true);
                    }}
                  />
                );
              })}
            {active == "TV" &&
              tv?.map((movie) => {
                return (
                  <MovieCdImageSmall
                    scale={3}
                    cover={movie?.image}
                    onClick={() => {
                      initiateEditForm(movie);
                      setShowCreateModal(true);
                      setEditMode(true);
                    }}
                  />
                );
              })}
            {active == "BOOK" &&
              tv?.map((movie) => {
                return (
                  <MovieCdImageSmall
                    scale={3}
                    cover={movie?.image}
                    onClick={() => {
                      initiateEditForm(movie);
                      setShowCreateModal(true);
                      setEditMode(true);
                    }}
                  />
                );
              })}
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

const Categories = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
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
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  width: 100%;
  padding: 1rem 0.5rem;
  max-height: 100vh;
  overflow: scroll;
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
