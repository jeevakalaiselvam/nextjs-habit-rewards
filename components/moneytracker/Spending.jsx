import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { PieChart, Pie, Cell } from "recharts";
import { capitalizeFirstLetter } from "../helpers/stringHelper";
import { formatIndianNumber } from "../helpers/moneyHelper";
import { FaCaretDown, FaRupeeSign } from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";
import {
  generateDarkTextColorForLightBg,
  generateSimilarColor,
} from "../helpers/colorHelper";
import { ICON_CATEGORY, ICON_COLORS } from "../helpers/iconHelper";
import {
  DatePicker,
  Dropdown,
  message,
  Popconfirm,
  Popover,
  Space,
  Spin,
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { itemsFamily, itemsPersonal, itemsType, itemsWallet } from "./Entry";
import dayjs from "dayjs";
import { getFifteenth } from "../helpers/dateHelper";

export default function Spending({
  showEntry,
  selectedDate,
  forceRefreshExpense,
}) {
  const [loading, setLoading] = useState(true);
  const [selectedTier1, setSelectedTier1] = useState("Family");
  const [allSpendings, setAllSpendings] = useState([]);
  const [newValueForSpending, setNewValueForSpending] = useState({});
  const [spendingIdToUpdate, setSpendingIdToUpdate] = useState({
    amount: "0",
    recurring: "false",
    date: getFifteenth(selectedDate),
    category: "",
    type: "personal",
  });

  const refreshSpendings = () => {
    setLoading(true);
    axios
      .get("/api/spend")
      .then((response) => {
        setAllSpendings(response?.data);
        setLoading(false);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    refreshSpendings();
  }, [showEntry, forceRefreshExpense]);

  const now = new Date(selectedDate);

  const thisMonthSpendings = allSpendings.filter((s) => {
    const spendingDate = new Date(s.date);
    console.log(
      new Date(spendingDate).getFullYear() === new Date(now).getFullYear()
    );
    return (
      new Date(spendingDate).getFullYear() === new Date(now).getFullYear() &&
      new Date(spendingDate).getMonth() === new Date(now).getMonth() &&
      s?.type == selectedTier1
    );
  });

  let allCategoriesThisMonth = [];

  thisMonthSpendings?.forEach((spend) => {
    allCategoriesThisMonth = [
      ...new Set([...allCategoriesThisMonth, spend?.category]),
    ];
  });

  const CATEGORY_COLORS = {};

  allCategoriesThisMonth?.forEach((category) => {
    CATEGORY_COLORS[category] = generateSimilarColor();
  });

  const totalSpending = thisMonthSpendings?.reduce(
    (acc, spend) => acc + Number(spend?.amount),
    0
  );

  const data = thisMonthSpendings?.map((spending) => {
    return {
      name: spending?.category,
      value: (spending?.amount / totalSpending) * 100,
    };
  });

  const deleteSpending = (spendingId) => {
    axios
      .delete(`/api/spend/${spendingId}`)
      .then((response) => {
        refreshSpendings();
      })
      .catch((error) => {});
  };

  const updateSpendingValue = () => {
    let values = { ...newValueForSpending };
    axios
      .put(`/api/spend/${newValueForSpending?._id}`, { ...values })
      .then((response) => {
        message.info("Expense updated !");
        refreshSpendings();
      })
      .catch((error) => {
        message.error("Error while saving Expense !");
      });
  };

  let itemsToTarget = itemsPersonal;

  if (newValueForSpending?.type == "Personal") {
    itemsToTarget = itemsPersonal;
  }

  if (newValueForSpending?.type == "Family") {
    itemsToTarget = itemsFamily;
  }

  if (newValueForSpending?.type == "Investment") {
    itemsToTarget = itemsWallet;
  }

  const handleMenuClick = (e) => {
    setNewValueForSpending((old) => ({ ...old, category: String(e.key) }));
  };

  const handleMenuClickType = (e) => {
    setNewValueForSpending((old) => ({ ...old, type: String(e.key) }));
  };

  const menu = {
    items: itemsToTarget,
    onClick: handleMenuClick,
  };

  const menuType = {
    items: itemsType,
    onClick: handleMenuClickType,
  };

  if (loading) {
    return (
      <Container>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
      </Container>
    );
  } else {
    return (
      <Container>
        <MainTop>
          <Options>
            <Option
              selected={selectedTier1 == "Family"}
              onClick={() => setSelectedTier1("Family")}
            >
              Family
              {selectedTier1 == "Family" && <SelectedDot></SelectedDot>}
            </Option>
            <Option
              selected={selectedTier1 == "Personal"}
              onClick={() => setSelectedTier1("Personal")}
            >
              Personal
              {selectedTier1 == "Personal" && <SelectedDot></SelectedDot>}
            </Option>{" "}
            <Option
              selected={selectedTier1 == "Investment"}
              onClick={() => setSelectedTier1("Investment")}
            >
              Investment
              {selectedTier1 == "Investment" && <SelectedDot></SelectedDot>}
            </Option>
          </Options>
        </MainTop>
        <Top>
          <LeftTop>
            <Total>
              <TTop>Spent</TTop>
              <TBottom>
                <span
                  style={{ fontSize: "1rem", transform: "translateY(2px)" }}
                >
                  <FaIndianRupeeSign />
                </span>
                <span style={{ fontSize: "1.25rem" }}>
                  {formatIndianNumber(totalSpending)}
                </span>
              </TBottom>
            </Total>
            <PieChart width={175} height={175}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={70}
                fill="#8884d8"
                paddingAngle={0}
                stroke={"none"}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={ICON_COLORS[entry?.name]} />
                ))}
              </Pie>
            </PieChart>
          </LeftTop>
          <RightTop>
            {allCategoriesThisMonth?.map((category) => {
              const percentage =
                (allSpendings
                  ?.filter((spend) => spend?.category == category)
                  ?.reduce((acc, spend) => acc + Number(spend?.amount), 0) /
                  totalSpending) *
                100;
              return (
                <CatItem>
                  <CatIcon color={ICON_COLORS[category]}></CatIcon>
                  <CatName>{capitalizeFirstLetter(category)}</CatName>
                  <CatPercent>{percentage.toFixed(0)}%</CatPercent>
                </CatItem>
              );
            })}
          </RightTop>
        </Top>
        <Bottom>
          <BTitle>All Spendings</BTitle>
          <AllSpending>
            {thisMonthSpendings
              ?.filter((spending) => {
                console.log({ spending, category: spending?.category });
                return spending?.type == selectedTier1;
              })
              ?.map((spending) => {
                const timesThisMonth = 1;
                return (
                  <SpendCard>
                    <Left color={ICON_COLORS[spending?.category]}>
                      <Popconfirm
                        title="Delete the task"
                        description="Are you sure to delete this task?"
                        onConfirm={() => {
                          deleteSpending(spending?._id);
                        }}
                        onCancel={() => {}}
                        okText="Yes"
                        cancelText="No"
                      >
                        {ICON_CATEGORY[spending?.category]}
                      </Popconfirm>
                    </Left>
                    <Middle>
                      <MTop>{capitalizeFirstLetter(spending?.category)}</MTop>
                      <MBottom>
                        {timesThisMonth > 1
                          ? `${timesThisMonth} payments`
                          : `${timesThisMonth} payment`}
                      </MBottom>
                    </Middle>
                    <Popover
                      placement="bottom"
                      content={
                        <Amount>
                          <span>
                            <input
                              inputMode="numeric"
                              type="number"
                              value={newValueForSpending?.amount}
                              onChange={(e) => {
                                setNewValueForSpending((old) => ({
                                  ...old,
                                  amount: e.target.value,
                                }));
                              }}
                            />
                          </span>

                          <FormContainer>
                            <AddAmount>
                              <Title>Type</Title>
                              <AmountInputDropdown2>
                                <Dropdown
                                  trigger={["click"]}
                                  overlayStyle={{ minWidth: "80%" }}
                                  menu={menuType}
                                  overlayClassName="full-width-dropdown"
                                >
                                  <Space>
                                    <span
                                      style={{
                                        fontSize: "1rem",
                                        color: "#ACAEB2",
                                      }}
                                    >
                                      {newValueForSpending.type
                                        ? capitalizeFirstLetter(
                                            newValueForSpending.type
                                          )
                                        : "Select Type"}
                                    </span>
                                    <Caret>
                                      <FaCaretDown />
                                    </Caret>
                                  </Space>
                                </Dropdown>
                              </AmountInputDropdown2>
                              <Title>Expense</Title>
                              <AmountInputDropdown>
                                <Dropdown
                                  trigger={["click"]}
                                  overlayStyle={{ minWidth: "80%" }}
                                  menu={menu}
                                  overlayClassName="full-width-dropdown"
                                  on
                                >
                                  <Space>
                                    <span
                                      style={{
                                        fontSize: "1rem",
                                        color: "#ACAEB2",
                                      }}
                                    >
                                      {newValueForSpending?.category
                                        ? capitalizeFirstLetter(
                                            newValueForSpending?.category
                                          )
                                        : "Select Category"}
                                    </span>
                                    <Caret>
                                      <FaCaretDown />
                                    </Caret>
                                  </Space>
                                </Dropdown>
                              </AmountInputDropdown>

                              <Title>Date</Title>
                              <MonthSelection>
                                <DatePicker
                                  style={{
                                    width: "100%",
                                    backgroundColor: "#1f2125",
                                    padding: "0.5rem 1rem",
                                    outline: "none",
                                    border: "none",
                                  }}
                                  format="DD-MM-YYYY"
                                  inputReadOnly
                                  value={dayjs(newValueForSpending?.date)}
                                  picker="date"
                                  onChange={(e) => {
                                    setNewValueForSpending((old) => ({
                                      ...old,
                                      date: new Date(dayjs(e))?.toString(),
                                    }));
                                  }}
                                  onFocus={(e) => e.preventDefault()}
                                />
                              </MonthSelection>
                            </AddAmount>
                          </FormContainer>
                          <SaveButton
                            onClick={() => {
                              updateSpendingValue();
                            }}
                          >
                            UPDATE
                          </SaveButton>
                        </Amount>
                      }
                      title={`Update Spending?`}
                    >
                      <Right
                        onClick={() => {
                          setNewValueForSpending(spending);
                        }}
                      >
                        <span
                          style={{
                            fontSize: ".8rem",
                            transform: "translateY(1px)",
                          }}
                        >
                          <FaIndianRupeeSign />
                        </span>
                        <span style={{ fontSize: ".95rem" }}>
                          {formatIndianNumber(spending?.amount)}
                        </span>
                      </Right>
                    </Popover>
                  </SpendCard>
                );
              })}
          </AllSpending>
        </Bottom>
      </Container>
    );
  }
}

const Amount = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  font-size: 2rem;
  font-weight: bold;
  width: 200px;

  & input {
    width: 200px;
    height: 30px;
    outline: none;
    border: none;
    background-color: ${(props) => props.color};
    padding: 0.25rem;
    font-size: 1rem;
    color: #333;
  }
`;

const SaveButton = styled.div`
  display: flex;
  align-items: center;
  height: 30px;
  width: 100%;
  font-size: 1.25rem;
  flex-direction: column;
  color: #fefefe;
  background-color: #53b5d9;

  &:active {
    color: #fefefe;
    background-color: #3b96b7;
  }
`;

const MTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const MBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.5rem;
  flex: 1;
  font-size: 0.9rem;
  color: #6c6d6f;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2rem;
  width: 45px;
  height: 45px;
  font-size: 1.75rem;
  background-color: #faf2e6;
  color: ${(props) => props.color};
`;

const Middle = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  padding: 0.5rem 1rem;
  flex: 1;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #404448;
  padding: 0.2rem 0.5rem;
  border-radius: 16px;
`;

const SpendCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.5rem 1rem;
  background-color: #1f2125;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
`;

const MainTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const SelectedDot = styled.div`
  display: flex;
  align-items: center;
  width: 5px;
  height: 5px;
  border-radius: 8px;
  background-color: #53b5d9;
  position: absolute;
  bottom: -1rem;
  left: 51%;
  justify-content: center;
`;

const Options = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0rem 1rem;
`;

const Option = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  color: ${(props) => (props?.selected ? "#53B5D9" : "#959595")};
  position: relative;
`;

const TTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #606060;
  margin-bottom: 0.5rem;
`;

const TBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Total = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 50%;
  flex-direction: column;
  transform: translate(-50%, -50%);
  top: 50%;
`;

const CatIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 15px;
  height: 15px;
  border-radius: 1rem;
  border: ${(props) => `4px solid ${props.color}`};
`;

const CatName = styled.div`
  display: flex;
  padding: 0rem 0rem 0rem 0.5rem;
  align-items: center;
  justify-content: flex-start;
  font-size: 0.9rem;
  min-width: 70px;
`;

const CatPercent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  font-size: 0.9rem;
  color: #8f8f8f;
`;

const CatItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom: 0.5rem;
`;

const LeftTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  position: relative;
`;

const RightTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  flex: 1;
  padding: 0 0.25rem 0 1rem;
`;

const AllSpending = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
  max-height: 45vh;
  overflow: scroll;
  padding: 1rem 0rem;

  overflow: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Edge */
  }
`;

const BTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  font-size: 1.1rem;
  padding-left: 0rem;
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 95%;
  padding: 1rem 0;
`;

const Bottom = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  flex: 1;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  min-height: 80vh;
  flex-direction: column;
  max-height: 80vh;
  padding-top: 2rem;
  position: relative;
  padding: 2rem 1rem 1rem 1rem;
`;

const MonthSelection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom: 1rem;
  padding: 1rem 0rem 0rem 0rem;
`;

const Caret = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateY(-1px);
`;

const AddAmount = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 100%;
  flex-direction: column;
  margin-top: 0.5rem;
`;

const Rupees = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  flex: 1;
  top: 37.5%;
  left: 1rem;
  color: #acaeb2;
`;

const AmountInputDropdown = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
  width: 100%;
  font-size: 1.1rem;
  position: relative;
  background-color: #1f2125;
  padding: 0.5rem 1rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const AmountInputDropdown2 = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
  width: 100%;
  font-size: 1.1rem;
  position: relative;
  background-color: #1f2125;
  padding: 0.5rem 1rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const AmountInput = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  width: 100%;
  font-size: 1.5rem;
  position: relative;

  & input {
    margin-top: 1rem;
    margin-bottom: 1rem;
    background-color: #1f2125;
    color: #fefefe;
    border: none;
    padding: 1rem 1rem 1rem 3rem;
    outline: none;
  }
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: flex-start;
  font-size: 1rem;
  width: 100%;
`;

const FormContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
`;
