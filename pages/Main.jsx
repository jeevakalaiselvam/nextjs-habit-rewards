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
import { FaPlus, FaPlusCircle } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import { Col, Input, Modal, Row, Select, Spin } from "antd";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import { getColorForType } from "../helpers/taskHelper";
import { TbPlaylistAdd, TbRefresh, TbRefreshDot } from "react-icons/tb";
import { LoadingOutlined } from "@ant-design/icons";

const allUsers = [
  { value: "Jeeva", label: "Jeeva" },
  { value: "Iraveen", label: "Iraveen" },
  { value: "Harish", label: "Harish" },
  { value: "Muskan", label: "Muskan" },
  { value: "Janani", label: "Janani" },
  { value: "Vendor", label: "Vendor" },
];

export default function Atom() {
  const [loading, setLoading] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [selectedAssignee, setSelectedAssignee] = useState("Jeeva");
  const [tasks, setTasks] = useState([]);
  const [taskData, setTaskData] = useState({
    type: "Task",
    title: "",
    description: "",
    assignee: "Jeeva",
    status: "New",
    money: 1000,
  });

  const saveTask = () => {
    try {
      axios.post("/api/jeevatask", { ...taskData }).then((response) => {
        refreshTasks();
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

  useEffect(() => {
    refreshTasks();
  }, []);

  const onlySelectedAssigneeTasks = tasks?.filter(
    (task) => task?.assignee == selectedAssignee
  );

  let userCountMapper = {};

  allUsers?.forEach((user) => {
    userCountMapper[user?.value] = 0;
  });

  tasks?.forEach((task) => {
    userCountMapper[task?.assignee] = userCountMapper[task?.assignee] + 1;
  });

  console.log(userCountMapper);

  let countMappedOptions = allUsers?.map((user) => ({
    ...user,
    label: `${user?.label} - ${userCountMapper?.[user?.value]}`,
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

  return (
    <Container>
      {showCreateTask && (
        <Modal
          title="Create Task"
          open={showCreateTask}
          onOk={() => {
            saveTask();
            setShowCreateTask(false);
          }}
          onCancel={() => {
            setShowCreateTask(false);
          }}
        >
          <Row>
            <span style={{ margin: ".5rem" }}>Type:</span>
          </Row>
          <Row>
            <Select
              defaultValue="Task"
              value={taskData?.type}
              style={{ width: "100%" }}
              onChange={(value) => {
                setTaskData((old) => ({ ...old, type: value }));
              }}
              options={[
                { value: "Task", label: "Task" },
                { value: "Issue", label: "Issue" },
                { value: "Inspire", label: "Inspire" },
                { value: "Call", label: "Call" },
                { value: "Team", label: "Team" },
              ]}
            />
          </Row>
          <Row>
            <span style={{ margin: ".5rem" }}>Status:</span>
          </Row>
          <Row>
            <Select
              value={taskData?.status}
              defaultValue="New"
              style={{ width: "100%" }}
              onChange={(value) => {
                setTaskData((old) => ({ ...old, status: value }));
              }}
              options={[
                { value: "New", label: "New" },
                { value: "In Progress", label: "In Progress" },
                { value: "Wait", label: "Wait" },
                { value: "Done", label: "Done" },
              ]}
            />
          </Row>
          <Row>
            <span style={{ margin: ".5rem" }}>Assignee:</span>
          </Row>
          <Row>
            <Select
              defaultValue="Jeeva"
              value={taskData?.assignee}
              style={{ width: "100%" }}
              onChange={(value) => {
                setTaskData((old) => ({ ...old, assignee: value }));
              }}
              options={allUsers}
            />
          </Row>
          <Row>
            <span style={{ margin: ".5rem" }}>Title:</span>
          </Row>
          <Row>
            <Input
              placeholder="Enter Title..."
              value={taskData?.title}
              size="medium"
              onChange={(e) =>
                setTaskData((old) => ({ ...old, title: e.target.value }))
              }
            />
          </Row>
          <Row>
            <span style={{ margin: ".5rem" }}>Description:</span>
          </Row>
          <Row>
            <TextArea
              rows={4}
              placeholder="Enter Description..."
              value={taskData?.description}
              size="medium"
              onChange={(e) =>
                setTaskData((old) => ({ ...old, description: e.target.value }))
              }
            />
          </Row>
        </Modal>
      )}
      <Header>
        <HIcon></HIcon>
        <HLeft>Work Tracker</HLeft>
        <HRight>
          <IconH style={{ fontSize: "1.5rem", marginRight: "1rem" }}>
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
      <Top>
        <Today>
          <span style={{ padding: ".25rem" }}>Today</span>
          <span style={{ color: COLOR_GREEN }}>{totalEarnedToday} Rs</span>
        </Today>
        <Total>
          <span style={{ padding: ".25rem" }}>Total</span>
          <span style={{ color: COLOR_GREEN }}>{totalEarned} Rs</span>
        </Total>
      </Top>
      <Content>
        {loading && (
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        )}
        {!loading &&
          onlySelectedAssigneeTasks?.map((task) => {
            return (
              <TaskCard>
                <Money color={COLOR_GREEN}>
                  <MoneyInner>{task?.money ?? 1000} Rs</MoneyInner>
                </Money>
                <Data>
                  <Title>{task?.title}</Title>
                  <Description>{task?.description}</Description>
                </Data>
                <Tag color={getColorForType(task?.type)}>
                  <TagInner>{task?.type}</TagInner>
                </Tag>
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
    </Container>
  );
}

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

const TaskCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0rem 1rem;
  width: 100%;
  background-color: ${COLOR_BACKGROUND};
  height: 80px;
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
  height: 80px;
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
  height: 80px;
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

const BItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  flex: 1;
  color: ${(props) => (props.active ? COLOR_ACCENT : COLOR_GREY)};
  cursor: pointer;
`;

const Bottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
  width: 100%;
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
