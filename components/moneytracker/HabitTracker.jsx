import axios from "axios";
import { useEffect, useState } from "react";
import { FaIndianRupeeSign } from "react-icons/fa6";
import Select from "react-select";
import styled from "styled-components";
import { generateDarkTextColorForLightBg } from "../helpers/colorHelper";
import { Popconfirm } from "antd";

export default function HabitTracker() {
  const [searchText, setSearchText] = useState("");
  const [allWorkings, setAllWorkings] = useState([]);
  const [showRealValue, setShowRealValue] = useState(false);

  const workItems = [
    { value: "feature30mins", label: "Feature Call 30 Mins", amount: 500 },
    { value: "feature60mins", label: "Feature Call 60 Mins", amount: 1000 },
    { value: "code30mins", label: "Coding 30 Minutes", amount: 500 },
    { value: "code60mins", label: "Coding 60 Minutes", amount: 1000 },
    { value: "team30mins", label: "Team 30 Minutes", amount: 500 },
    { value: "team60mins", label: "Team 60 Minutes", amount: 1000 },
  ];

  let searchWorkItems = workItems?.filter((workItem) =>
    workItem?.label?.toLowerCase()?.includes(searchText?.toLowerCase())
  );

  const addWorkItem = (workItem) => {
    axios
      .post("/api/workitem", {
        workItemId: workItem?.value,
        time: new Date()?.toString(),
      })
      .then((response) => {
        refreshWorkings();
      })
      .catch((error) => {});
  };

  const refreshWorkings = () => {
    axios
      .get("/api/workitem")
      .then((response) => {
        setAllWorkings(response?.data);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    refreshWorkings();
  }, []);

  useEffect(() => {
    let timer = setInterval(() => {
      setShowRealValue((old) => !old);
    }, 3000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Container>
      <SearchContainer>
        <input
          value={searchText}
          placeholder="Search..."
          onChange={(e) => setSearchText(e.target.value)}
        />
      </SearchContainer>
      <OptionContainer>
        {searchWorkItems?.map((workItem) => {
          const count = allWorkings?.filter(
            (inner) => workItem?.value == inner?.workItemId
          ).length;
          return (
            <WorkItem onClick={() => {}}>
              {true && (
                <Count>
                  <span>{count}</span>
                </Count>
              )}

              {false && (
                <Count>
                  <span
                    style={{ fontSize: ".9rem", transform: "translateY(1px)" }}
                  >
                    <FaIndianRupeeSign />
                  </span>{" "}
                  {workItem?.amount * count}
                </Count>
              )}
              <InnerBudge></InnerBudge>
              <Name>{workItem?.label}</Name>

              <Popconfirm
                title="Add Workitem?"
                description="Are you sure to add this workitem?"
                onConfirm={() => {
                  addWorkItem(workItem);
                }}
                onCancel={() => {}}
                okText="Yes"
                cancelText="No"
              >
                <Value>
                  <span
                    style={{ fontSize: ".9rem", transform: "translateY(1px)" }}
                  >
                    <FaIndianRupeeSign />
                  </span>{" "}
                  {workItem?.amount}
                </Value>
              </Popconfirm>
            </WorkItem>
          );
        })}
      </OptionContainer>
      <MoneyContainer></MoneyContainer>
    </Container>
  );
}

const MoneyContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  padding: 1rem;
`;

const Count = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #3e434a;
  margin-right: 1rem;
  border-radius: 4px;
  padding: 0.25rem;
`;

const InnerBudge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: -0.25rem;
  border-radius: 10px;
  top: 50%;
  width: 10px;
  background-color: #1f2125;
  transform: translateY(-50%);
  height: 20px;
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
`;

const Name = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex: 3;
`;

const ValueTotal = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  color: ${generateDarkTextColorForLightBg("#04b488", 40)};
  background-color: #04b488;
  padding: 0.25rem;
  animation: all 1s ease;
  border-radius: 4px;
`;

const Value = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 0.25rem;
  animation: all 1s ease;
  flex: 1;
  background-color: #2a7aed;
  color: #fefefe;
`;

const WorkItem = styled.div`
  padding: 1rem;
  display: flex;
  margin-bottom: 1rem;
  align-items: center;
  border-radius: 8px;
  justify-content: center;
  width: 90%;
  position: relative;
  background-color: #1f2125;

  &:active {
    background-color: #2a7aed;
    color: #fefefe;
  }

  &:active * {
    background-color: #2a7aed;
    color: #fefefe;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  min-width: 100vw;

  & input {
    width: 90%;
    margin-bottom: 1rem;
    background-color: #141414;
    color: #fefefe;
    border: none;
    font-size: 1.25rem;
    padding: 0.5rem 1rem;
    outline: none;
  }
`;

const OptionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  min-width: 100vw;
  overflow: scroll;
  min-height: 40vh;
  max-height: 40vh;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  min-width: 100vw;
  min-height: 80vh;
  max-height: 80vh;
  transform: translateY(-1rem);
  padding: 1rem;
`;
