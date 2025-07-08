import styled from "styled-components";
import {
  COLOR_ACCENT,
  COLOR_BLACK1,
  COLOR_BLUE_DARK,
  COLOR_GREY,
} from "../helpers/colorHelper";
import { useEffect, useState } from "react";
import {
  TbCirclePlus,
  TbDeviceDesktopAnalytics,
  TbFlagPlus,
  TbLayoutGridFilled,
  TbPlus,
  TbRefresh,
} from "react-icons/tb";
import { TbCalendarMonthFilled } from "react-icons/tb";
import { Input, Modal, Popconfirm, Row, Select, Spin } from "antd";
import { BACKLOG_TYPE_OPTIONS } from "../helpers/optionHelper";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import { LoadingOutlined } from "@ant-design/icons";

const TAB_BACKLOG = "TAB_BACKLOG";
const TAB_CALENDAR = "TAB_CALENDAR";

const ICON_HEIGHT = 60;

export default function App() {
  const [selectedTab, setSelectedTab] = useState(TAB_BACKLOG);
  const [backlogItems, setBacklogItems] = useState([]);
  const [calendarItems, setCalendarItems] = useState([]);
  const [backlogLoading, setBacklogLoading] = useState(false);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [showBacklogCreate, setShowBackLogCreate] = useState(false);
  const [showCalendarCreate, setShowCalendarCreate] = useState(false);
  const [isBacklogEdit, setIsBacklogEdit] = useState(false);
  const [backlogForm, setBacklogForm] = useState({
    title: "",
    desc: "",
    type: BACKLOG_TYPE_OPTIONS?.[0]?.value,
  });

  const refreshBacklogItems = () => {
    setBacklogLoading(true);
    try {
      axios.get("/api/backlogitem").then((response) => {
        let data = response?.data;
        setBacklogItems(data);
      });
      setBacklogLoading(false);
    } catch (e) {
      setBacklogLoading(false);
    }
  };
  const refreshCalendarItems = () => {
    try {
    } catch (e) {}
  };

  const createBacklogItem = () => {
    try {
      axios.post("/api/backlogitem", { ...backlogForm }).then((response) => {
        refreshBacklogItems();
      });
    } catch (e) {}
  };

  const updateBacklogItem = () => {
    try {
      axios
        .put(`/api/backlogitem/${backlogForm?._id}`, { ...backlogForm })
        .then((response) => {
          refreshBacklogItems();
        });
    } catch (e) {}
  };

  useEffect(() => {
    refreshBacklogItems();
  }, []);

  return (
    <Container>
      {/* Modal Section Start */}
      <Modal
        title={`${isBacklogEdit ? "Edit" : "Add"} Backlog`}
        open={showBacklogCreate}
        onOk={() => {
          if (!isBacklogEdit) {
            createBacklogItem();
          } else {
            updateBacklogItem();
          }
          setShowBackLogCreate(false);
        }}
        onCancel={() => {
          setShowBackLogCreate(false);
        }}
      >
        <Row style={{ marginBottom: "1rem" }}>
          <Select
            defaultValue={BACKLOG_TYPE_OPTIONS?.[0]?.value}
            value={backlogForm?.type}
            style={{ width: "100%" }}
            onChange={(value) => {
              setBacklogForm((old) => ({ ...old, type: value }));
            }}
            options={BACKLOG_TYPE_OPTIONS}
          />
        </Row>
        <Row style={{ marginBottom: "1rem" }}>
          <Input
            placeholder="Enter Title..."
            value={backlogForm?.title}
            onChange={(e) => {
              setBacklogForm((old) => ({ ...old, title: e.target.value }));
            }}
            size="medium"
          />
        </Row>
        <Row style={{ marginBottom: "1rem" }}>
          <TextArea
            placeholder="Enter Description..."
            value={backlogForm?.desc}
            onChange={(e) => {
              setBacklogForm((old) => ({ ...old, desc: e.target.value }));
            }}
            size="medium"
          />
        </Row>
      </Modal>
      {/* Top Section Start */}
      <Top>
        {selectedTab == TAB_BACKLOG && (
          <BacklogTop>
            <TLeft>Backlog</TLeft>
            <TRight>
              <Icon
                onClick={() => {
                  setShowBackLogCreate(true);
                }}
              >
                <TbCirclePlus />
              </Icon>
              <Icon>
                <TbRefresh />
              </Icon>
            </TRight>
          </BacklogTop>
        )}
        {selectedTab == TAB_CALENDAR && (
          <CalendarTop>
            <TLeft>Calendar</TLeft>
            <TRight>
              <Icon>
                <TbCirclePlus />
              </Icon>
              <Icon>
                <TbRefresh />
              </Icon>
            </TRight>
          </CalendarTop>
        )}
      </Top>
      {/* Content Section Start */}
      <Content>
        {selectedTab == TAB_BACKLOG && (
          <BacklogContent>
            {backlogLoading && (
              <Spin
                indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
              />
            )}
            {!backlogLoading && backlogItems?.length == 0 && (
              <span style={{ padding: "1rem" }}>No Backlog !</span>
            )}
            {!backlogLoading &&
              backlogItems?.length > 0 &&
              backlogItems?.map((backlog) => {
                return (
                  <BacklogSingle>
                    <Popconfirm
                      title="Actions"
                      description="Select Action on Task?"
                      onConfirm={() => {
                        setBacklogForm(backlog);
                        setIsBacklogEdit(true);
                        setShowBackLogCreate(true);
                      }}
                      onCancel={() => {}}
                      okText="Edit"
                      cancelText="Delete"
                    >
                      <BSLeft></BSLeft>
                    </Popconfirm>

                    <BSRight>
                      <BSTitle>{backlog?.title}</BSTitle>
                      <BSDesc>{backlog?.desc}</BSDesc>
                    </BSRight>
                  </BacklogSingle>
                );
              })}
          </BacklogContent>
        )}
        {selectedTab == TAB_CALENDAR && <CalendarContent></CalendarContent>}
      </Content>
      {/* Bottom Section Start */}
      <Bottom>
        <BItem
          selected={selectedTab == TAB_BACKLOG}
          onClick={() => setSelectedTab(TAB_BACKLOG)}
        >
          <span>
            <TbDeviceDesktopAnalytics />
          </span>
          <span style={{ fontSize: ".85rem" }}>Backlog</span>
        </BItem>
        <BItem
          selected={selectedTab == TAB_CALENDAR}
          onClick={() => setSelectedTab(TAB_CALENDAR)}
        >
          <span>
            <TbCalendarMonthFilled />
          </span>
          <span style={{ fontSize: ".85rem" }}>Calendar</span>
        </BItem>
      </Bottom>
    </Container>
  );
}

const BSTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 0.5rem;
  height: ${`${ICON_HEIGHT / 2}px`};
`;

const BSDesc = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 0.5rem;
  height: ${`${ICON_HEIGHT / 2}px`};
  opacity: 0.5;
`;

const BSLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${`${ICON_HEIGHT}px`};
  height: ${`${ICON_HEIGHT}px`};
  background: url("/icons/verizon.jpeg");
  background-size: cover;
`;

const BSRight = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  flex: 1;
`;

const BacklogSingle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom: 1rem;
  background-color: ${COLOR_BLACK1};
`;

const Icon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  padding: 0.5rem;
`;

const TLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const TRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
`;

const BacklogContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  min-height: calc(100vh - 120px);
  max-height: calc(100vh - 120px);
  overflow: scroll;
  width: 100%;
`;

const CalendarContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
`;

const BacklogTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1rem;
`;

const CalendarTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1rem;
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  width: 100%;
  background-color: ${COLOR_BLUE_DARK};
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  padding: 0.5rem;
  flex: 1;
  width: 100%;
`;

const Bottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
  width: 100%;
  background-color: ${COLOR_BLUE_DARK};
  padding-bottom: 1rem;
`;

const BItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  flex: 1;
  cursor: pointer;
  color: ${(props) => (props.selected ? COLOR_ACCENT : COLOR_GREY)};
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  min-height: 100vh;
  width: 100%;
  max-height: 100vh;
  color: #fefefe;
`;
