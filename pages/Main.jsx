import styled from "styled-components";
import { HiDocumentReport, HiViewBoards } from "react-icons/hi";
import {
  COLOR_ACCENT,
  COLOR_BACKGROUND,
  COLOR_BACKGROUND_HEADER,
  COLOR_GREEN,
  COLOR_GREY,
  generateDarkTextColorForLightBg,
} from "../helpers/colorHelper";
import { useEffect, useState } from "react";
import { FaCaretRight, FaPlus, FaPlusCircle } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import { Button, Col, Input, Modal, Popconfirm, Row, Select, Spin } from "antd";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import { formatZTime, getColorForType } from "../helpers/taskHelper";
import {
  TbChartDonutFilled,
  TbPlaylistAdd,
  TbRefresh,
  TbRefreshDot,
} from "react-icons/tb";
import { LoadingOutlined } from "@ant-design/icons";
import { formatTimeStr } from "antd/es/statistic/utils";

const allUsers = [
  { value: "Jeeva", label: "Jeeva" },
  { value: "Iraveen", label: "Iraveen" },
  { value: "Harish", label: "Harish" },
  { value: "Muskan", label: "Muskan" },
  { value: "Janani", label: "Janani" },
  { value: "Vendor", label: "Vendor" },
];

const allPriority = [
  { value: "Priority 1", label: "Priority 1" },
  { value: "Priority 2", label: "Priority 2" },
];

export const STATUS_NEW = "New";
export const STATUS_INPROGRESS = "In Progress";
export const STATUS_DONE = "Done";
export const STATUS_WAIT = "Wait";

export default function Atom() {
  const [newLog, setNewLog] = useState("");
  const [activeTaskLogs, setActiveTaskLogs] = useState([]);
  const [status, setStatus] = useState(STATUS_NEW);
  const [activeTaskLogsLoading, setActiveTaskLogsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [selectedAssignee, setSelectedAssignee] = useState("Jeeva");
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskData, setTaskData] = useState({
    type: "Task",
    title: "",
    description: "",
    assignee: "Jeeva",
    priority: "Priority 2",
    status: STATUS_NEW,
    money: 1000,
  });
  const [edittaskData, setEditTaskData] = useState({
    type: "Task",
    title: "",
    description: "",
    assignee: "Jeeva",
    status: STATUS_NEW,
    priority: "Priority 2",
    money: 1000,
  });

  const saveTask = () => {
    try {
      axios.post("/api/jeevatask", { ...taskData }).then((response) => {
        refreshTasks();
      });
    } catch (error) {}
  };

  const editTask = (taskId) => {
    try {
      axios
        .put(`/api/jeevatask/${taskId}`, { ...edittaskData })
        .then((response) => {
          refreshTasks();
        });
    } catch (error) {}
  };

  const deleteTask = (taskId) => {
    try {
      axios.delete(`/api/jeevatask/${taskId}`).then((response) => {
        refreshTasks();
      });
    } catch (error) {}
  };

  const deleteLog = (logId) => {
    try {
      axios.delete(`/api/jeevacomment/${logId}`).then((response) => {
        refreshLogsForSelectedTask(selectedTask);
      });
    } catch (error) {}
  };

  const refreshTasks = () => {
    try {
      setLoading(true);
      axios.get("/api/jeevatask").then((response) => {
        const tasks = response?.data ?? [];
        setTasks(tasks);
        setLoading(false);
      });
    } catch (error) {
      setLoading(false);
    }
  };

  const refreshLogsForSelectedTask = (taskId) => {
    try {
      setActiveTaskLogsLoading(true);
      axios.get(`/api/jeevacomment/${taskId}`).then((response) => {
        const logs = response?.data ?? [];
        setActiveTaskLogs(logs);
        setActiveTaskLogsLoading(false);
      });
    } catch (error) {
      setActiveTaskLogsLoading(false);
    }
  };

  const saveNewLog = () => {
    try {
      axios
        .post(`/api/jeevacomment/${selectedTask}`, {
          comment: newLog,
          taskId: selectedTask,
        })
        .then((response) => {
          setNewLog("");
          refreshLogsForSelectedTask(selectedTask);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    refreshTasks();
  }, []);

  useEffect(() => {
    if (selectedTask) {
      refreshLogsForSelectedTask(selectedTask);
    }
  }, [selectedTask]);

  const onlySelectedAssigneeTasks = tasks
    ?.filter((task) => task?.assignee == selectedAssignee)
    ?.filter((task) => task?.status == status || status == "All");

  let userCountMapper = {};

  allUsers?.forEach((user) => {
    userCountMapper[user?.value] = [];
  });

  tasks
    ?.filter((task) => task?.status == status || status == "All")
    ?.forEach((task) => {
      userCountMapper[task?.assignee].push(task);
    });

  let countMappedOptions = allUsers?.map((user) => ({
    ...user,
    label: (
      <span style={{ width: "100%", display: "flex", justifyContent: "space" }}>
        <span style={{ padding: "0 1rem", flex: 1 }}>{user?.label}</span>
      </span>
    ),
  }));

  let totalEarned = tasks.reduce((acc, task) => {
    if (task?.isCompleted) {
      return acc + 1000;
    } else {
      return acc;
    }
  }, 0);

  let totalEarnedToday = tasks.reduce((acc, task) => {
    if (task?.isCompleted) {
      return acc + 1000;
    } else {
      return acc;
    }
  }, 0);

  let taskMain = showCreateTask ? taskData : edittaskData;
  let taskMainFn = showCreateTask ? setTaskData : setEditTaskData;

  let countMapperForUser = {};

  return (
    <Container>
      {showLogs && (
        <Modal
          title="View Logs"
          open={showLogs}
          footer={null}
          onCancel={() => {
            setShowLogs(false);
          }}
        >
          {!activeTaskLogsLoading && activeTaskLogs?.length !== 0 && (
            <LogsModal>
              <LogsView>
                {activeTaskLogs?.map((log) => {
                  return (
                    <LogEntry>
                      <Popconfirm
                        title="Delete Log"
                        description="Are you sure?"
                        onConfirm={() => {
                          deleteLog(log?._id);
                        }}
                        onCancel={() => {}}
                        okText="Delete"
                        cancelText="Cancel"
                      >
                        <LogTime>{formatZTime(log?.dateTime)}</LogTime>
                      </Popconfirm>
                      <LogData>{log?.comment}</LogData>
                    </LogEntry>
                  );
                })}
              </LogsView>
              <LogsAdd>
                <Input
                  placeholder="Add Logs..."
                  value={newLog}
                  onChange={(e) => setNewLog(e.target.value)}
                />
                <Button
                  style={{ width: "100%", marginTop: ".25rem" }}
                  onClick={() => {
                    saveNewLog();
                  }}
                >
                  SAVE
                </Button>
              </LogsAdd>
            </LogsModal>
          )}
          {!activeTaskLogsLoading && activeTaskLogs?.length == 0 && (
            <LogsModal>
              <LogsView>No Logs Present !</LogsView>
              <LogsAdd>
                <Input
                  placeholder="Add Logs..."
                  value={newLog}
                  onChange={(e) => setNewLog(e.target.value)}
                />
                <Button
                  style={{ width: "100%", marginTop: ".25rem" }}
                  onClick={() => {
                    saveNewLog();
                  }}
                >
                  SAVE
                </Button>
              </LogsAdd>
            </LogsModal>
          )}
          {activeTaskLogsLoading && (
            <LogsModal>
              <Spin
                indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
              />
            </LogsModal>
          )}
        </Modal>
      )}
      {(showCreateTask || isEditMode) && (
        <Modal
          title="Create Task"
          open={showCreateTask || isEditMode}
          onOk={() => {
            if (isEditMode) {
              editTask(edittaskData?._id);
            } else {
              saveTask();
            }
            setShowCreateTask(false);
            setEditMode(false);
          }}
          onCancel={() => {
            setShowCreateTask(false);
            setEditMode(false);
          }}
        >
          <Row style={{ marginBottom: "1rem" }}>
            <Select
              defaultValue="Task"
              value={taskMain?.type}
              style={{ width: "100%" }}
              onChange={(value) => {
                taskMainFn((old) => ({ ...old, type: value }));
              }}
              options={[
                { value: "Analysis", label: "Analysis" },
                { value: "Task", label: "Task" },
                { value: "Issue", label: "Issue" },
                { value: "Inspire", label: "Inspire" },
                { value: "Call", label: "Call" },
                { value: "Team", label: "Team" },
              ]}
            />
          </Row>
          <Row style={{ marginBottom: "1rem" }}>
            <Select
              defaultValue="Priority 2"
              value={taskMain?.priority}
              style={{ width: "100%" }}
              onChange={(value) => {
                taskMainFn((old) => ({ ...old, priority: value }));
              }}
              options={allPriority}
            />
          </Row>
          <Row style={{ marginBottom: "1rem" }}>
            <Select
              value={taskMain?.status}
              defaultValue={STATUS_NEW}
              style={{ width: "100%" }}
              onChange={(value) => {
                taskMainFn((old) => ({ ...old, status: value }));
              }}
              options={[
                { value: STATUS_NEW, label: STATUS_NEW },
                { value: STATUS_INPROGRESS, label: STATUS_INPROGRESS },
                { value: STATUS_WAIT, label: STATUS_WAIT },
                { value: STATUS_DONE, label: STATUS_DONE },
              ]}
            />
          </Row>
          <Row style={{ marginBottom: "1rem" }}>
            <Select
              defaultValue="Jeeva"
              value={taskMain?.assignee}
              style={{ width: "100%" }}
              onChange={(value) => {
                taskMainFn((old) => ({ ...old, assignee: value }));
              }}
              options={allUsers}
            />
          </Row>
          <Row style={{ marginBottom: "1rem" }}>
            <Input
              placeholder="Enter Title..."
              value={taskMain?.title}
              size="medium"
              onChange={(e) =>
                taskMainFn((old) => ({ ...old, title: e.target.value }))
              }
            />
          </Row>
          <Row style={{ marginBottom: "1rem" }}>
            <TextArea
              rows={4}
              placeholder="Enter Description..."
              value={taskMain?.description}
              size="medium"
              onChange={(e) =>
                taskMainFn((old) => ({ ...old, description: e.target.value }))
              }
            />
          </Row>
        </Modal>
      )}
      <Header>
        <HIcon></HIcon>
        <HLeft>
          <span style={{ color: COLOR_ACCENT, marginRight: "1rem" }}>
            {totalEarnedToday} Rs
          </span>
          <span style={{ color: COLOR_GREEN }}>{totalEarned} Rs</span>
        </HLeft>
        <HRight>
          <IconH
            style={{ fontSize: "1.5rem", marginRight: "1rem" }}
            onClick={() => setShowCreateTask(true)}
          >
            <TbPlaylistAdd />
          </IconH>{" "}
          <IconH
            style={{ fontSize: "1.25rem", marginRight: "1rem" }}
            onClick={() => {
              refreshTasks();
            }}
          >
            <TbRefreshDot />
          </IconH>
        </HRight>
      </Header>
      <Content>
        {loading && (
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        )}
        {!loading &&
          onlySelectedAssigneeTasks?.map((task) => {
            return (
              <TaskCard>
                <TaskCardTop>
                  <Popconfirm
                    title="Actions"
                    description="Select action on Task"
                    onConfirm={() => {
                      setEditMode(true);
                      setEditTaskData({ ...task });
                    }}
                    onCancel={() => {
                      deleteTask(task?._id);
                    }}
                    okText="Edit"
                    cancelText="Delete"
                  >
                    <Money color={COLOR_GREEN}>
                      <MoneyInner>{task?.money ?? 1000} Rs</MoneyInner>
                    </Money>
                  </Popconfirm>

                  <Data
                    onClick={() => {
                      setSelectedTask(task?.taskId);
                      setShowLogs(true);
                    }}
                  >
                    <Title>{task?.title}</Title>
                    <DocLink>{task?.taskId}</DocLink>
                    <Description>{task?.description}</Description>
                  </Data>
                  <Tag color={getColorForType(task?.type)}>
                    <TagInner>{task?.type}</TagInner>
                  </Tag>
                </TaskCardTop>
              </TaskCard>
            );
          })}
      </Content>
      <Bottom>
        <Select
          size="large"
          defaultValue="Jeeva"
          value={selectedAssignee}
          style={{ width: "100%" }}
          onChange={(value) => {
            setSelectedAssignee(value);
          }}
          options={countMappedOptions}
        />
      </Bottom>
      <BottomOptions>
        <BItem
          active={status == STATUS_NEW}
          onClick={() => setStatus(STATUS_NEW)}
        >
          <span style={{ marginBottom: ".5rem" }}>
            {userCountMapper?.[selectedAssignee]?.task?.reduce((acc, task) => {
              return acc + task?.status == STATUS_NEW ? 1 : 0;
            }, 0)}
          </span>
          <span style={{ fontSize: ".7rem" }}>New</span>
        </BItem>
        <BItem
          active={status == STATUS_INPROGRESS}
          onClick={() => setStatus(STATUS_INPROGRESS)}
        >
          <span style={{ marginBottom: ".5rem" }}>
            {userCountMapper?.[selectedAssignee]?.task?.reduce((acc, task) => {
              return acc + task?.status == STATUS_INPROGRESS ? 1 : 0;
            }, 0)}
          </span>
          <span style={{ fontSize: ".7rem" }}>In Progress</span>
        </BItem>
        <BItem
          active={status == STATUS_WAIT}
          onClick={() => setStatus(STATUS_WAIT)}
        >
          <span style={{ marginBottom: ".5rem" }}>
            {userCountMapper?.[selectedAssignee]?.task?.reduce((acc, task) => {
              return acc + task?.status == STATUS_WAIT ? 1 : 0;
            }, 0)}
          </span>
          <span style={{ fontSize: ".7rem" }}>Wait</span>
        </BItem>
        <BItem
          active={status == STATUS_DONE}
          onClick={() => setStatus(STATUS_DONE)}
        >
          <span style={{ marginBottom: ".5rem" }}>
            {userCountMapper?.[selectedAssignee]?.task?.reduce((acc, task) => {
              return acc + task?.status == STATUS_DONE ? 1 : 0;
            }, 0)}
          </span>
          <span style={{ fontSize: ".7rem" }}>Done</span>
        </BItem>
      </BottomOptions>
    </Container>
  );
}

const LogsModal = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 70vh;
  width: 100%;
  flex-direction: column;
`;

const LogTime = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  opacity: 0.5;
  font-size: 0.8rem;
`;

const LogData = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
`;

const LogEntry = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
`;

const LogsView = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  min-height: 50vh;
  max-height: 50vh;
  width: 100%;
  overflow: scroll;
`;

const LogsAdd = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex-direction: column;
`;

const BItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  flex: 1;
  color: ${(props) => (props.active ? COLOR_ACCENT : COLOR_GREY)};
  cursor: pointer;
`;

const IconH = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  &:active {
    color: ${COLOR_ACCENT};
  }
`;

const HIcon = styled.div`
  width: 40px;
  height: 40px;
  background: url("https://variety.com/wp-content/uploads/2024/06/Verizon-New-Logo.png?w=1000&h=667&crop=1");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
`;

const MoneyInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  position: absolute;
  left: -1.75rem;
  top: 50%;
  transform: translateY(-50%) rotate(-90deg);
  width: 80px;
`;

const Money = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 30px;
  height: 80px;
  background-color: ${(props) => props.color};
  color: ${(props) => generateDarkTextColorForLightBg(props.color, 50)};
`;

const TagInner2 = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Tag2 = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  background-color: ${(props) => props.color};
  color: ${(props) => generateDarkTextColorForLightBg(props.color, 50)};
`;

const TagInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(-90deg);
`;

const Tag = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 80px;
  background-color: ${(props) => props.color};
  color: ${(props) => generateDarkTextColorForLightBg(props.color, 50)};
`;

const Data = styled.div`
  display: flex;
  padding-left: 2rem;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 30px;
  font-size: 0.9rem;
`;

const Description = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 30px;
  opacity: 0.7;
  font-size: 0.9rem;
`;

const DocLink = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  opacity: 0.7;
  font-size: 0.9rem;
  color: ${COLOR_ACCENT};
`;

const TaskCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0.5rem 0rem;
  width: 100%;
  background-color: ${COLOR_BACKGROUND};
  height: 80px;
  cursor: pointer;
  flex-direction: column;
`;

const TaskCardTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0.5rem 0rem;
  width: 100%;
  background-color: ${COLOR_BACKGROUND};
  height: 80px;
  cursor: pointer;
`;

const TaskCardBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const Middle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex: 1;

  &:active {
    color: ${COLOR_ACCENT};
  }
`;

const Today = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  flex: 1;
  font-size: 0.9rem;
`;

const Total = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-direction: column;
  flex: 1;
  font-size: 0.9rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0.5rem;
  height: 60px;
  width: 100%;
  background-color: ${COLOR_BACKGROUND_HEADER};
`;

const HLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
  margin-left: 0.5rem;
`;

const HRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  width: 100%;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  flex: 1;
  width: 100%;
  padding: 0.25rem 0.5rem;
  max-height: 82vh;
  overflow: scroll;
`;

const Bottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom: 0.5rem;
`;

const BottomOptions = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
  width: 100%;
  padding-bottom: 1rem;
  background-color: ${COLOR_BACKGROUND_HEADER};
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
