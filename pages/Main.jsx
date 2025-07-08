import styled from "styled-components";
import {
  COLOR_ACCENT,
  COLOR_BLACK1,
  COLOR_BLUE_DARK,
  COLOR_GREEN,
  COLOR_GREY,
  generateDarkTextColorForLightBg,
  getColorForStatus,
} from "../helpers/colorHelper";
import { useEffect, useState } from "react";
import {
  TbArrowRightSquareFilled,
  TbCirclePlus,
  TbDeviceDesktopAnalytics,
  TbFlagPlus,
  TbLayoutGridFilled,
  TbMinus,
  TbPlus,
  TbRefresh,
} from "react-icons/tb";
import { TbCalendarMonthFilled } from "react-icons/tb";
import { Input, Modal, Popconfirm, Row, Select, Spin } from "antd";
import { BACKLOG_TYPE_OPTIONS } from "../helpers/optionHelper";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import { LoadingOutlined } from "@ant-design/icons";
import {
  formatTimeSpent,
  getDateFormatted,
  getDateFormattedName,
  getRelativeDateString,
} from "../helpers/timeHelper";
import { TbArrowLeftSquareFilled } from "react-icons/tb";
import { formatTimeStr } from "antd/es/statistic/utils";

const TAB_BACKLOG = "TAB_BACKLOG";
const TAB_CALENDAR = "TAB_CALENDAR";

const ICON_HEIGHT = 60;

let MONEY_FOR_15_MINUTES = 25;

export default function App() {
  const [selectedTab, setSelectedTab] = useState(TAB_CALENDAR);
  const [backlogItems, setBacklogItems] = useState([]);
  const [calendarItems, setCalendarItems] = useState([]);
  const [backlogLoading, setBacklogLoading] = useState(false);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [showBacklogCreate, setShowBackLogCreate] = useState(false);
  const [isBacklogEdit, setIsBacklogEdit] = useState(false);
  const [backlogForm, setBacklogForm] = useState({
    title: "",
    desc: "",
    type: BACKLOG_TYPE_OPTIONS?.[0]?.value,
  });

  const [showCalendarCreate, setShowCalendarCreate] = useState(false);
  const [isCalendarCreateFromBacklog, setIsCalendarCreateFromBacklog] =
    useState(false);
  const [calendarForm, setCalendarForm] = useState({
    type: BACKLOG_TYPE_OPTIONS?.[5]?.value,
    id: "",
    title: "",
    desc: "",
    timeSpent: 15,
  });
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(new Date());

  const resetBackLogForm = () => {
    setBacklogForm({
      title: "",
      desc: "",
      type: BACKLOG_TYPE_OPTIONS?.[0]?.value,
    });
  };

  const resetCalendarForm = () => {
    setBacklogForm({
      type: BACKLOG_TYPE_OPTIONS?.[5]?.value,
      id: "",
      title: "",
      desc: "",
      timeSpent: "",
    });
  };

  const updateStatusForBacklog = (backlog) => {
    let newStatus = "ACTIVE";

    if (backlog?.status == "ACTIVE") {
      newStatus = "INPROG";
    }
    if (backlog?.status == "INPROG") {
      newStatus = "WAIT";
    }
    if (backlog?.status == "WAIT") {
      newStatus = "DONE";
    }
    if (backlog?.status == "DONE") {
      newStatus = "ACTIVE";
    }
    try {
      axios
        .put(`/api/backlogitem/${backlog?._id}`, {
          ...backlog,
          status: newStatus,
        })
        .then((response) => {
          refreshBacklogItems();
        });
    } catch (e) {}
  };

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
    setCalendarForm(true);
    try {
      axios.get("/api/calendaritem").then((response) => {
        let data = response?.data;
        setCalendarItems(data);
      });
      setCalendarForm(false);
    } catch (e) {
      setCalendarForm(false);
    }
  };

  const createBacklogItem = () => {
    try {
      axios.post("/api/backlogitem", { ...backlogForm }).then((response) => {
        refreshBacklogItems();
        resetBackLogForm();
        setIsBacklogEdit(false);
      });
    } catch (e) {
      resetBackLogForm();
      setIsBacklogEdit(false);
    }
  };

  const createCalendarItem = () => {
    try {
      axios.post("/api/calendaritem", { ...calendarForm }).then((response) => {
        refreshCalendarItems();
        resetCalendarForm();
        setIsBacklogEdit(false);
      });
    } catch (e) {
      resetBackLogForm();
      setIsBacklogEdit(false);
    }
  };

  const updateBacklogItem = () => {
    try {
      axios
        .put(`/api/backlogitem/${backlogForm?._id}`, { ...backlogForm })
        .then((response) => {
          refreshBacklogItems();
          resetBackLogForm();
          setIsBacklogEdit(false);
        });
    } catch (e) {
      resetBackLogForm();
      setIsBacklogEdit(false);
    }
  };

  const deleteBackLogItem = (id) => {
    try {
      axios.delete(`/api/backlogitem/${id}`).then((response) => {
        refreshBacklogItems();
      });
    } catch (e) {}
  };

  const deleteCalendarItem = (id) => {
    try {
      axios.delete(`/api/calendaritem/${id}`).then((response) => {
        refreshCalendarItems();
      });
    } catch (e) {}
  };

  const refreshBacklogAndCalendar = () => {
    refreshBacklogItems();
    refreshCalendarItems();
  };

  useEffect(() => {
    refreshBacklogAndCalendar();
  }, [selectedTab]);

  let filteredCalendarItemsForToday = calendarItems?.filter((item) => {
    console.log(
      "CHECKING",
      getDateFormatted(new Date(item?.created)),
      getDateFormatted(selectedCalendarDate)
    );
    return (
      getDateFormatted(new Date(item?.created)) ==
      getDateFormatted(selectedCalendarDate)
    );
  });

  let totalEarnedToday = filteredCalendarItemsForToday?.reduce((acc, item) => {
    return acc + (item?.timeSpent / 15) * MONEY_FOR_15_MINUTES;
  }, 0);

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
          resetBackLogForm();
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
      </Modal>{" "}
      <Modal
        title={"Log Work"}
        open={showCalendarCreate}
        onOk={() => {
          createCalendarItem();
          setIsCalendarCreateFromBacklog(false);
          setShowCalendarCreate(false);
        }}
        onCancel={() => {
          setIsCalendarCreateFromBacklog(false);
          setShowCalendarCreate(false);
        }}
      >
        {!isCalendarCreateFromBacklog && (
          <Row style={{ marginBottom: "1rem" }}>
            <Select
              defaultValue={BACKLOG_TYPE_OPTIONS?.[0]?.value}
              value={calendarForm?.type}
              readOnly={isCalendarCreateFromBacklog}
              style={{ width: "100%" }}
              onChange={(value) => {
                setCalendarForm((old) => ({ ...old, type: value }));
              }}
              options={BACKLOG_TYPE_OPTIONS}
            />
          </Row>
        )}
        <Row style={{ marginBottom: "1rem" }}>
          <Input
            placeholder="Enter Title..."
            readOnly={isCalendarCreateFromBacklog}
            value={calendarForm?.desc}
            onChange={(e) => {
              setCalendarForm((old) => ({
                ...old,
                desc: e.target.value,
              }));
            }}
            size="medium"
          />
        </Row>
        <Row style={{ marginBottom: "1rem" }}>
          <Minus
            onClick={() => {
              if (calendarForm?.timeSpent > 15) {
                setCalendarForm((old) => ({
                  ...old,
                  timeSpent: calendarForm?.timeSpent - 15,
                }));
              }
            }}
          >
            <TbMinus />
          </Minus>
          <TimeData>{formatTimeSpent(calendarForm?.timeSpent ?? 15)}</TimeData>
          <Plus
            onClick={() => {
              setCalendarForm((old) => ({
                ...old,
                timeSpent: calendarForm?.timeSpent + 15,
              }));
            }}
          >
            <TbPlus />
          </Plus>
        </Row>
        <Row>
          <MoneyInfo>
            Rs{" "}
            {calendarForm?.timeSpent > 0
              ? (calendarForm?.timeSpent / 15) * MONEY_FOR_15_MINUTES
              : 0}
          </MoneyInfo>
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
                <TbPlus />
              </Icon>
              <Icon
                onClick={() => {
                  refreshBacklogItems();
                }}
              >
                <TbRefresh />
              </Icon>
            </TRight>
          </BacklogTop>
        )}
        {selectedTab == TAB_CALENDAR && (
          <CalendarTop>
            <TLeft>Calendar</TLeft>
            <TRight>
              <Icon
                onClick={() => {
                  setShowCalendarCreate(true);
                }}
              >
                <TbPlus />
              </Icon>
              <Icon
                onClick={() => {
                  refreshCalendarItems();
                }}
              >
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
                    <BSTag color={COLOR_GREEN}>
                      <BSTagInnerMoney color={COLOR_GREEN}>
                        {backlog?.reward}
                      </BSTagInnerMoney>
                    </BSTag>
                    <Popconfirm
                      title="Actions"
                      description="Select Action on Backlog Item?"
                      onConfirm={() => {
                        setBacklogForm(backlog);
                        setIsBacklogEdit(true);
                        setShowBackLogCreate(true);
                      }}
                      onCancel={() => {
                        deleteBackLogItem(backlog?._id);
                      }}
                      okText="Edit"
                      cancelText="Delete"
                    >
                      <BSLeft></BSLeft>
                    </Popconfirm>
                    <BSRight
                      onClick={() => {
                        setShowCalendarCreate(true);
                        setIsCalendarCreateFromBacklog(true);
                        setCalendarForm({ ...backlog, timeSpent: 15 });
                      }}
                    >
                      <BSTitle>{backlog?.title}</BSTitle>
                      <BSDesc>{backlog?.desc}</BSDesc>
                    </BSRight>
                    <BSTag
                      color={getColorForStatus(backlog?.status)}
                      onClick={() => {
                        updateStatusForBacklog(backlog);
                      }}
                    >
                      <BSTagInner>{backlog?.status}</BSTagInner>
                    </BSTag>
                  </BacklogSingle>
                );
              })}
          </BacklogContent>
        )}
        {selectedTab == TAB_CALENDAR && (
          <CalendarContent>
            <CalendarDateChange>
              <CalendarLeft
                onClick={() => {
                  setSelectedCalendarDate((old) => {
                    let newDate = new Date();
                    newDate.setDate(old.getDate() - 1);
                    return newDate;
                  });
                }}
              >
                <TbArrowLeftSquareFilled />
              </CalendarLeft>
              <CalendarMiddle>
                <CalMiddleTop>
                  {getRelativeDateString(selectedCalendarDate)}
                </CalMiddleTop>
                <CalMiddleBottom>
                  {getDateFormattedName(selectedCalendarDate)}
                </CalMiddleBottom>
              </CalendarMiddle>
              <CalendarRight
                onClick={() => {
                  setSelectedCalendarDate((old) => {
                    let newDate = new Date();
                    newDate.setDate(old.getDate() + 1);
                    return newDate;
                  });
                }}
              >
                <TbArrowRightSquareFilled />
              </CalendarRight>
            </CalendarDateChange>
            <CalendarItemsContainer>
              {calendarLoading && (
                <Spin
                  indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
                />
              )}
              {!calendarLoading &&
                filteredCalendarItemsForToday?.length == 0 && (
                  <span style={{ padding: "1rem" }}>No Calendar !</span>
                )}
              {!calendarLoading &&
                filteredCalendarItemsForToday?.length > 0 &&
                filteredCalendarItemsForToday?.map((calendar) => {
                  return (
                    <BacklogSingle>
                      <Popconfirm
                        title="Actions"
                        description="Select Action on Calendar Item?"
                        onConfirm={() => {
                          deleteCalendarItem(calendar?._id);
                        }}
                        onCancel={() => {}}
                        okText="Delete"
                        cancelText="Cancel"
                      >
                        <BSLeft></BSLeft>
                      </Popconfirm>
                      <BSRight onClick={() => {}}>
                        <BSTitle>{calendar?.title}</BSTitle>
                        <BSDesc>{calendar?.desc}</BSDesc>
                      </BSRight>
                      <BSTag color={COLOR_GREEN} onClick={() => {}}>
                        <BSTagInner>
                          {calendar?.timeSpent > 0
                            ? (calendar?.timeSpent / 15) * MONEY_FOR_15_MINUTES
                            : 0}
                        </BSTagInner>
                      </BSTag>
                    </BacklogSingle>
                  );
                })}
            </CalendarItemsContainer>
            <TotalToday>
              <span style={{ fontSize: "1rem" }}>Earned Today</span>
              <span>Rs {totalEarnedToday}</span>
            </TotalToday>
          </CalendarContent>
        )}
      </Content>
      {/* Bottom Section Start */}
      <Bottom>
        <BItem
          selected={selectedTab == TAB_BACKLOG}
          onClick={() => setSelectedTab(TAB_BACKLOG)}
        >
          <span style={{ fontSize: "1.25rem" }}>
            <TbDeviceDesktopAnalytics />
          </span>
          <span style={{ fontSize: ".8rem" }}>Backlog</span>
        </BItem>
        <BItem
          selected={selectedTab == TAB_CALENDAR}
          onClick={() => setSelectedTab(TAB_CALENDAR)}
        >
          <span style={{ fontSize: "1.25rem" }}>
            <TbCalendarMonthFilled />
          </span>
          <span style={{ fontSize: ".8rem" }}>Calendar</span>
        </BItem>
      </Bottom>
    </Container>
  );
}

const CalMiddleTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  margin-bottom: 4px;
  opacity: 0.5;
`;

const CalMiddleBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
`;

const CalendarLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  &:active {
    color: ${COLOR_ACCENT};
  }
`;

const CalendarMiddle = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  transform: translateY(-0.25rem);
  flex: 1;
`;

const CalendarRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;

  &:active {
    color: ${COLOR_ACCENT};
  }
`;

const TotalToday = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-size: 2rem;
  background-color: ${COLOR_GREEN};
  color: ${generateDarkTextColorForLightBg(COLOR_GREEN, 50)};
  width: 100%;
  padding: 0.5rem 1rem;
`;

const CalendarDateChange = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  width: 100%;
`;

const TimeData = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex: 2;
`;

const Minus = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  font-size: 2rem;
`;

const Plus = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  font-size: 2rem;
`;

const CalendarItemMoney = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${COLOR_GREEN};
  width: 100px;
  flex: 0.5;
  font-size: 1.5rem;
  color: ${generateDarkTextColorForLightBg(COLOR_GREEN, 50)};
  height: ${`${ICON_HEIGHT}px`};
`;

const MoneyInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  width: 100%;
  font-size: 2rem;
  color: ${COLOR_GREEN};
`;

const BSTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 0.5rem;
  font-size: 0.9rem;
  height: ${`${ICON_HEIGHT / 2}px`};
`;

const BSDesc = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 0.5rem;
  font-size: 0.9rem;
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

const BSTag = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  justify-content: center;
  height: ${`${ICON_HEIGHT}px`};
  background-color: ${(props) => props.color};
  color: ${(props) => generateDarkTextColorForLightBg(props.color, 50)};
`;

const BSTagInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(-90deg);
  width: 30px;
`;

const BSTagInnerMoney = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(-90deg);
  width: 20px;
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
  min-height: calc(100vh - 160px);
  max-height: calc(100vh - 160px);
  overflow: scroll;
  width: 100%;
`;

const CalendarContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
  min-height: calc(100vh - 160px);
  max-height: calc(100vh - 160px);
`;

const CalendarItemsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  overflow: scroll;
  width: 100%;
  min-height: 67.5vh;
  max-height: 67.5vh;
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
