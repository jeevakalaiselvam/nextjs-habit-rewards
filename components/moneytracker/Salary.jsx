import axios from "axios";
import { useEffect, useState } from "react";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { HiChartPie, HiOutlineDotsVertical, HiX } from "react-icons/hi";
import styled from "styled-components";
import dayjs from "dayjs";
import {
  formatDateToMonthYear,
  getDaysInMonth,
  getFirstDateOfCurrentMonth,
  getFirstDateOfMonth,
  getFormattedDateWords,
  isSameMonthUTCZGMT,
  utcToLocal,
} from "../helpers/dateHelper";
import { DatePicker } from "antd";
import { formatIndianNumber } from "../helpers/moneyHelper";
import { HiOutlineChevronDoubleUp } from "react-icons/hi2";
import { JEEVA_INCOME_PER_DAY } from "../helpers/configHelper";

export default function Salary({ selectedDate }) {
  const [addMode, setAddMode] = useState(false);
  const [salary, setNewSalary] = useState(null);
  const [title, setNewTitle] = useState(null);
  const [editId, setEditId] = useState("");
  const [date, setDate] = useState(null);
  const [salaries, setAllSalaries] = useState([]);
  const [optionOpenId, setOptionOpenId] = useState("");

  const saveSalary = () => {
    axios
      .post("/api/salary", {
        salary: salary,
        date: date,
        title: title,
      })
      .then((response) => {
        setAddMode(false);
        refreshSalary();
      })
      .catch((error) => {});
  };

  const refreshSalary = () => {
    setOptionOpenId("");
    setNewSalary("");
    setDate(getFirstDateOfCurrentMonth());
    axios
      .get("/api/salary")
      .then((response) => {
        const data = response?.data;
        setAllSalaries(data);
      })
      .catch((error) => {});
  };

  const editSalary = () => {
    axios
      .put(`/api/salary/${editId}`, {
        salary: salary,
        date: date,
        title: title,
      })
      .then((response) => {
        setEditId("");
        setAddMode(false);
        refreshSalary();
      })
      .catch((error) => {});
  };

  const iniateEditForSalary = (salary) => {
    setOptionOpenId("");
    setEditId(salary?._id);
    setNewSalary(salary?.salary);
    setNewTitle(salary?.title ?? "Salary Info");
    setDate(salary?.date);
  };

  const deleteSalary = (salaryId) => {
    setOptionOpenId("");
    axios
      .delete(`/api/salary/${salaryId}`)
      .then((response) => {
        refreshSalary();
      })
      .catch((error) => {});
  };

  useEffect(() => {
    refreshSalary();
  }, []);

  const currentMonthSalaries = salaries?.filter((salary) => {
    return isSameMonthUTCZGMT(salary?.date, selectedDate);
  });

  const totalInMonth = currentMonthSalaries?.reduce(
    (acc, item) => acc + Number(item?.salary),
    0
  );

  let jeevaIncome = 0;
  let totalDaysInMonth = getDaysInMonth(selectedDate);
  jeevaIncome = totalDaysInMonth * JEEVA_INCOME_PER_DAY;

  return (
    <Container>
      {addMode && (
        <AddAmount>
          <Title>
            Add Salary
            <CloseAdd onClick={() => setAddMode(false)}>
              <HiOutlineChevronDoubleUp />
            </CloseAdd>
          </Title>
          <AmountTitle>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setNewTitle(e.target.value);
              }}
            />
          </AmountTitle>
          <AmountInput>
            <Rupees>
              <FaIndianRupeeSign />
            </Rupees>
            <input
              type="number"
              inputMode="numeric"
              value={salary}
              onChange={(e) => {
                setNewSalary(e.target.value);
              }}
            />
          </AmountInput>
          <MonthSelection>
            <DatePicker
              style={{ width: "100%", backgroundColor: "#1f2125" }}
              format="MMMM, YYYY"
              inputReadOnly
              value={dayjs(date)}
              picker="month"
              onChange={(e) => {
                setDate(dayjs(e));
              }}
              onFocus={(e) => e.preventDefault()}
            />
          </MonthSelection>
          <SaveButton
            onClick={() => {
              if (editId) {
                editSalary();
              } else {
                saveSalary();
              }
            }}
          >
            {editId ? "Edit" : "Add"} Salary
          </SaveButton>
        </AddAmount>
      )}
      {!addMode && (
        <SaveButton
          onClick={() => {
            setAddMode(true);
          }}
        >
          Add Salary
        </SaveButton>
      )}
      <DisplayAmounts addMode={addMode}>
        <Topbar></Topbar>
        {!addMode && (
          <TotalInMonth>
            <MainLeft>
              <MainLInner>
                <SubTitle>Family Income</SubTitle>
                <MainTitle ifSelectedDateIsCurrentMonth={true}>
                  <span
                    style={{
                      fontSize: "1.5rem",
                      transform: "translateY(3px)",
                    }}
                  >
                    <FaIndianRupeeSign />
                  </span>
                  {formatIndianNumber(totalInMonth)}
                </MainTitle>
              </MainLInner>
            </MainLeft>
            <MainRight>
              <MainLInner>
                <SubTitle>Jeeva Income</SubTitle>
                <MainTitle ifSelectedDateIsCurrentMonth={true}>
                  <span
                    style={{
                      fontSize: "1.5rem",
                      transform: "translateY(3px)",
                    }}
                  >
                    <FaIndianRupeeSign />
                  </span>
                  {formatIndianNumber(jeevaIncome)}
                </MainTitle>
              </MainLInner>
            </MainRight>
          </TotalInMonth>
        )}
        <TitleNaming>
          <IconName>Month Salary</IconName>
          <IconSettings></IconSettings>
        </TitleNaming>
        <SalaryContainer addMode={addMode}>
          {currentMonthSalaries
            ?.sort((a, b) => new Date(b) - new Date(a))
            ?.map((singleSalary) => {
              return (
                <SinglePackage blink={editId == singleSalary?._id}>
                  <Image>
                    <FaIndianRupeeSign />
                  </Image>
                  <DetailsRow>
                    <Details1>{singleSalary?.title ?? "No Info"}</Details1>
                    {false && (
                      <Details2>
                        {formatDateToMonthYear(utcToLocal(singleSalary?.date))}
                      </Details2>
                    )}
                  </DetailsRow>
                  <Money>
                    {formatIndianNumber(singleSalary?.salary)}
                    <span
                      style={{
                        fontSize: ".9rem",
                        transform: "translateY(2px)",
                      }}
                    >
                      <FaIndianRupeeSign />
                    </span>
                  </Money>
                  <OptionsContainer>
                    <OptionTrigger
                      onClick={() => {
                        setAddMode(true);
                        if (optionOpenId == singleSalary?._id) {
                          setOptionOpenId("");
                        } else {
                          setOptionOpenId(singleSalary?._id);
                        }
                      }}
                    >
                      {optionOpenId == singleSalary?._id ? (
                        <HiX />
                      ) : (
                        <HiOutlineDotsVertical />
                      )}
                    </OptionTrigger>
                    {optionOpenId == singleSalary?._id && (
                      <OptionInner>
                        <OptionItem
                          onClick={() => {
                            iniateEditForSalary(singleSalary);
                          }}
                        >
                          Edit
                        </OptionItem>
                        <OptionItem
                          onClick={() => {
                            deleteSalary(singleSalary?._id);
                          }}
                        >
                          Delete
                        </OptionItem>
                      </OptionInner>
                    )}
                  </OptionsContainer>
                </SinglePackage>
              );
            })}
        </SalaryContainer>
      </DisplayAmounts>
    </Container>
  );
}

const MainLInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
`;

const MainLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const MainRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const SubTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4f4f4f;
  transform: translateX(6px);
  padding: 1rem;
  font-size: 1rem;
`;

const MainTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0rem 0rem 0.5rem 0rem;
  color: ${(props) =>
    props.ifSelectedDateIsCurrentMonth ? "#04b488" : "#53B5D9"};
`;

const TotalInMonth = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  width: 100%;
`;

const OptionItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1f2026;
  margin: 0.5rem 0.5rem 0rem 0.5rem;
  padding: 0.5rem;
  font-size: 1rem;
  width: 100%;

  &:active {
    background-color: #2a7af1;
  }
`;

const OptionInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  flex-direction: column;
  left: 0;
  transform: translateX(-105%);
  z-index: 10;
  width: 200px;
  padding: 0rem 0.5rem 0.5rem 0.5rem;
  background-color: #000000;
`;

const OptionTrigger = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8f9094;

  &:active {
    color: #2a7af1;
  }
`;

const OptionsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  margin-left: 1rem;
  font-size: 1.25rem;
  position: relative;
`;

const MonthSelection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1rem 0rem 0rem 0rem;
`;

const Image = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  font-size: 1rem;
  color: #04b488;
  margin-right: 1rem;
`;

const Money = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  color: #04b488;
`;

const DetailsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  flex: 1;
`;

const Details1 = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 30px;
  width: 100%;
  font-size: 1rem;
`;

const Details2 = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 20px;
  width: 100%;
  font-size: 0.8rem;
  color: #57585c;
`;

const SinglePackage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0.5rem;
  background-color: #1f2125;
  border-radius: 8px;
  margin: 0.5rem 0rem;
  width: 100%;
  animation: ${(props) =>
    props?.blink ? "blink-smooth 1s infinite linear" : ""};
  @keyframes blink-smooth {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }
`;

const SalaryContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
  max-height: ${(props) => (props?.addMode ? "80vh" : "55vh")};
  overflow: scroll;
  padding: 0rem 0rem;
`;

const TitleNaming = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0rem 0.25rem;
  margin: 0.5rem;
`;

const IconName = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
  font-size: 1.1rem;
`;

const IconSettings = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const Topbar = styled.div`
  display: flex;
  align-items: center;
  border-radius: 1rem;
  margin-top: 1rem;
  width: 100px;
  height: 4px;
  background-color: #3e4044;
  justify-content: center;
`;

const DisplayAmounts = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  border-radius: 2rem 2rem 0 0;
  flex-direction: column;
  min-height: ${(props) => (props?.addMode ? "40vh" : "50vh")};
`;

const SaveButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fefefe;
  background-color: #2a7af1;
  margin: 1rem 1rem 0rem 1rem;
  border-radius: 8px;
  padding: 1rem 1rem;
  min-width: 100%;

  &:active {
    transform: translate(-1px, 2px);
  }
`;

const Rupees = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  flex: 1;
  top: 49%;
  left: 1rem;
  color: #fbfcfe;
`;

const AmountTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  font-size: 1rem;
  position: relative;
  width: 100%;

  & input {
    margin-top: 2rem;
    width: 100%;
    background-color: #1f2125;
    color: #8f9094;
    border: none;
    padding: 0.5rem 1rem;
    outline: none;
  }
`;

const AmountInput = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  font-size: 1rem;
  position: relative;
  width: 100%;

  & input {
    width: 100%;
    margin-top: 1rem;
    background-color: #1f2125;
    color: #8f9094;
    border: none;
    padding: 0.5rem 1rem 0.5rem 3rem;
    outline: none;
  }
`;

const Main = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: center;
  font-size: 1.5rem;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: flex-start;
  font-size: 1rem;
  width: 100%;
  position: relative;
`;

const CloseAdd = styled.div`
  position: absolute;
  top: 50%;
  right: 0.5rem;
  transform: translateY(-40%);

  &:active {
    color: #2a7af1;
  }
`;

const Icon = styled.div`
  display: flex;
  align-items: center;
  font-size: 2rem;
  justify-content: center;
  background-color: #87558c;
  border-radius: 5rem;
`;

const AddAmount = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 90vw;
  flex-direction: column;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  min-height: 80vh;
  flex-direction: column;
  max-height: 80vh;
  padding: 1rem 1rem 1rem 1rem;
  position: relative;
`;
