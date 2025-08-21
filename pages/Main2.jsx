import styled from "styled-components";
import NewProfile from "../ncomponents/NewProfile";
import { useEffect, useState } from "react";
import { FaGamepad } from "react-icons/fa6";
import { BiSolidMoviePlay } from "react-icons/bi";
import { TbFolderFilled } from "react-icons/tb";
import { GAME_GENRES, GENRES, MOVIE_GENRES } from "../helpers/catHelper";
import { Input, Modal, Radio, Row, Select, Spin } from "antd";
import axios from "axios";
import GameCdImage from "../components/GameCdImage";
import { LoadingOutlined } from "@ant-design/icons";

export default function Main2() {
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [active, setActive] = useState("GAMES");
  const [hoverActive, setHoverActive] = useState("GAMES");
  const [searchTerm, setSearchTerm] = useState("");
  const [library, setLibrary] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    type: "GAME",
    genre: [],
    title: "",
    image: "",
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
        });
      });
    } catch (e) {
      setLoading(false);
      setCreateForm({
        type: "GAME",
        genre: [],
        title: "",
        image: "",
      });
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
    { label: "BOOK", value: "BOOK" },
  ];

  useEffect(() => {
    refreshLibrary();
  }, []);

  let games = library?.filter((item) => item?.type == "GAME");

  const initiateEditForm = (game) => {
    setCreateForm(game);
  };

  console.log({ createForm });

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
        <Seperator></Seperator>
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
        <Seperator></Seperator>
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
            <Categories></Categories>
          </Top1>
          <Top2>
            <Top2L>
              All Games
              <span
                style={{
                  background: "#272F30",
                  padding: ".25rem",
                  marginLeft: ".5rem",
                  borderRadius: ".25rem",
                }}
              >
                {games?.length}
              </span>
              <CreateButton
                onClick={() => {
                  setShowCreateModal(true);
                }}
              >
                ADD GAME
              </CreateButton>
            </Top2L>
          </Top2>
        </Top>
        {!loading && (
          <Content>
            {active == "GAMES" &&
              games?.map((game) => {
                return (
                  <GameCdImage
                    game={game}
                    onClick={() => {
                      initiateEditForm(game);
                      setShowCreateModal(true);
                      setEditMode(true);
                    }}
                  />
                );
              })}
          </Content>
        )}
        {loading && (
          <Content>
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
            />
          </Content>
        )}
      </Right>
    </Container>
  );
}

const CreateButton = styled.div`
  background-image: linear-gradient(
    to right,
    #4776e6 0%,
    #8e54e9 51%,
    #4776e6 100%
  );
  padding: 4px;
  margin-left: 1rem;
  cursor: pointer;
  text-align: center;
  text-transform: uppercase;
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
    box-shadow: 0 0 10px #eee;
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
  justify-content: center;
  background-color: #161b1e;
  width: 200px;
  border-radius: 4px;

  & input {
    padding: 0.25rem;
    background-color: #161b1e;
    outline: none;
    border: none;
    font-size: 0.8rem;
    padding: 0.5rem;
  }
`;

const Top1 = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 1rem;
  width: 100%;
`;

const Top2 = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
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
