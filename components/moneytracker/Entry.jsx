import { DownOutlined, SettingOutlined } from "@ant-design/icons";
import { DatePicker, Dropdown, message, Space } from "antd";
import { useState } from "react";
import { BiSolidMoviePlay } from "react-icons/bi";
import {
  FaCaretDown,
  FaFemale,
  FaGamepad,
  FaGlobe,
  FaMale,
  FaMoneyBillAlt,
  FaShoppingCart,
  FaWallet,
} from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { IoFastFood, IoWallet, IoWalletSharp } from "react-icons/io5";
import styled from "styled-components";
import { capitalizeFirstLetter } from "../helpers/stringHelper";
import { RiDeviceFill } from "react-icons/ri";
import { TbDeviceDesktopFilled } from "react-icons/tb";
import axios from "axios";
import {
  MdFamilyRestroom,
  MdLocalGroceryStore,
  MdOutlineElectricalServices,
} from "react-icons/md";
import { BsFillCreditCard2FrontFill } from "react-icons/bs";
import { HiMiniHome } from "react-icons/hi2";
import {
  GROCERY_OPTIONS,
  ICON_CATEGORY,
  ICON_COLORS,
  WALLET_OPTIONS,
} from "../helpers/iconHelper";
import dayjs from "dayjs";
import { getFifteenth } from "../helpers/dateHelper";

export const itemsPersonal = [
  {
    key: "1",
    label: <div style={{ width: "100%" }}>All Categories</div>,
    disabled: true,
  },
  {
    type: "divider",
  },
  {
    key: "Games",
    label: "Games",
    icon: (
      <span
        style={{ transform: "translateY(2px)", color: ICON_COLORS["Games"] }}
      >
        {ICON_CATEGORY?.["Games"]}
      </span>
    ),
    extra: "⌘G",
  },
  {
    key: "Movies",
    label: "Movies",
    icon: (
      <span
        style={{ transform: "translateY(2px)", color: ICON_COLORS["Movies"] }}
      >
        {ICON_CATEGORY?.["Movies"]}
      </span>
    ),
    extra: "⌘M",
  },
  {
    key: "Food",
    label: "Food",
    icon: (
      <span
        style={{ transform: "translateY(2px)", color: ICON_COLORS["Food"] }}
      >
        {ICON_CATEGORY?.["Food"]}
      </span>
    ),
    extra: "⌘F",
  },
  {
    key: "Clothing",
    label: "Clothing",
    icon: (
      <span
        style={{
          transform: "translateY(2px)",
          color: ICON_COLORS["Clothing"],
        }}
      >
        {ICON_CATEGORY?.["Clothing"]}
      </span>
    ),
    extra: "⌘F",
  },
  {
    key: "Gadget",
    label: "Gadget",
    icon: (
      <span
        style={{ transform: "translateY(2px)", color: ICON_COLORS["Gadget"] }}
      >
        {ICON_CATEGORY?.["Gadget"]}
      </span>
    ),
    extra: "⌘F",
  },
  {
    key: "Gift",
    label: "Gift",
    icon: (
      <span
        style={{ transform: "translateY(2px)", color: ICON_COLORS["Gift"] }}
      >
        {ICON_CATEGORY?.["Gift"]}
      </span>
    ),
    extra: "⌘G",
  },
  {
    key: "Subscription",
    label: "Subscription",
    icon: (
      <span
        style={{
          transform: "translateY(2px)",
          color: ICON_COLORS["Subscription"],
        }}
      >
        {ICON_CATEGORY?.["Subscription"]}
      </span>
    ),
    extra: "⌘S",
  },
  {
    key: "Fuel",
    label: "Fuel",
    icon: (
      <span
        style={{ transform: "translateY(2px)", color: ICON_COLORS["Fuel"] }}
      >
        {ICON_CATEGORY?.["Fuel"]}
      </span>
    ),
    extra: "⌘F",
  },
  {
    key: "Achu",
    label: "Achu",
    icon: (
      <span
        style={{ transform: "translateY(2px)", color: ICON_COLORS["Achu"] }}
      >
        {ICON_CATEGORY?.["Achu"]}
      </span>
    ),
    extra: "⌘F",
  },
  {
    key: "Mom",
    label: "Mom",
    icon: (
      <span style={{ transform: "translateY(2px)", color: ICON_COLORS["Mom"] }}>
        {ICON_CATEGORY?.["Mom"]}
      </span>
    ),
    extra: "⌘M",
  },
  {
    key: "Dad",
    label: "Dad",
    icon: (
      <span style={{ transform: "translateY(2px)", color: ICON_COLORS["Dad"] }}>
        {ICON_CATEGORY?.["Dad"]}
      </span>
    ),
    extra: "⌘D",
  },
  {
    key: "Mutual Funds",
    label: "Mutual Funds",
    icon: (
      <span style={{ transform: "translateY(2px)", color: ICON_COLORS["Dad"] }}>
        {ICON_CATEGORY?.["Mutual Funds"]}
      </span>
    ),
    extra: "⌘M",
  },
  {
    key: "Stocks",
    label: "Stocks",
    icon: (
      <span style={{ transform: "translateY(2px)", color: ICON_COLORS["Dad"] }}>
        {ICON_CATEGORY?.["Stocks"]}
      </span>
    ),
    extra: "⌘S",
  },
  {
    key: "Gold",
    label: "Gold",
    icon: (
      <span
        style={{ transform: "translateY(2px)", color: ICON_COLORS["Gold"] }}
      >
        {ICON_CATEGORY?.["Gold"]}
      </span>
    ),
    extra: "⌘G",
  },
];

export const itemsFamily = [
  {
    key: "1",
    label: <div style={{ width: "100%" }}>All Categories</div>,
    disabled: true,
  },
  {
    type: "divider",
  },
  {
    key: "Grocery",
    label: "Grocery",
    icon: (
      <span
        style={{
          transform: "translateY(2px)",
          color: ICON_COLORS["Grocery"],
        }}
      >
        {ICON_CATEGORY?.["Grocery"]}
      </span>
    ),
    extra: "⌘G",
  },
  {
    key: "Mom",
    label: "Mom",
    icon: (
      <span style={{ transform: "translateY(2px)", color: ICON_COLORS["Mom"] }}>
        {ICON_CATEGORY?.["Mom"]}
      </span>
    ),
    extra: "⌘M",
  },
  {
    key: "Dad",
    label: "Dad",
    icon: (
      <span style={{ transform: "translateY(2px)", color: ICON_COLORS["Dad"] }}>
        {ICON_CATEGORY?.["Dad"]}
      </span>
    ),
    extra: "⌘D",
  },
  {
    key: "Sindhu",
    label: "Sindhu",
    icon: (
      <span
        style={{ transform: "translateY(2px)", color: ICON_COLORS["Sindhu"] }}
      >
        {ICON_CATEGORY?.["Sindhu"]}
      </span>
    ),
    extra: "⌘S",
  },
  {
    key: "Jeeva",
    label: "Jeeva",
    icon: (
      <span
        style={{ transform: "translateY(2px)", color: ICON_COLORS["Jeeva"] }}
      >
        {ICON_CATEGORY?.["Jeeva"]}
      </span>
    ),
    extra: "⌘J",
  },
  {
    key: "Achu",
    label: "Achu",
    icon: (
      <span
        style={{ transform: "translateY(2px)", color: ICON_COLORS["Achu"] }}
      >
        {ICON_CATEGORY?.["Achu"]}
      </span>
    ),
    extra: "⌘A",
  },
  {
    key: "Loan",
    label: "Loan",
    icon: (
      <span
        style={{ transform: "translateY(2px)", color: ICON_COLORS["Loan"] }}
      >
        {ICON_CATEGORY?.["Loan"]}
      </span>
    ),
    extra: "⌘K",
  },
  {
    key: "Credit",
    label: "Credit",
    icon: (
      <span
        style={{ transform: "translateY(2px)", color: ICON_COLORS["Credit"] }}
      >
        {ICON_CATEGORY?.["Credit"]}
      </span>
    ),
    extra: "⌘C",
  },
  {
    key: "House",
    label: "House",
    icon: (
      <span
        style={{ transform: "translateY(2px)", color: ICON_COLORS["House"] }}
      >
        {ICON_CATEGORY?.["House"]}
      </span>
    ),
    extra: "⌘H",
  },
  {
    key: "Car",
    label: "Car",
    icon: (
      <span style={{ transform: "translateY(2px)", color: ICON_COLORS["Car"] }}>
        {ICON_CATEGORY?.["Car"]}
      </span>
    ),
    extra: "⌘H",
  },
  {
    key: "Electricity",
    label: "Electricity",
    icon: (
      <span
        style={{
          transform: "translateY(2px)",
          color: ICON_COLORS["Electricity"],
        }}
      >
        {ICON_CATEGORY?.["Electricity"]}
      </span>
    ),
    extra: "⌘H",
  },
  {
    key: "Internet",
    label: "Internet",
    icon: (
      <span
        style={{
          transform: "translateY(2px)",
          color: ICON_COLORS["Internet"],
        }}
      >
        {ICON_CATEGORY?.["Internet"]}
      </span>
    ),
    extra: "⌘I",
  },
];

export const itemsWallet = [
  {
    key: "111",
    label: <div style={{ width: "100%" }}>All Wallets</div>,
    disabled: true,
  },
  ...WALLET_OPTIONS?.map((wallet) => {
    return {
      key: wallet?.id,
      label: wallet?.name,
      icon: (
        <span
          style={{
            transform: "translateY(2px)",
            color: wallet?.color,
          }}
        >
          {wallet?.icon}
        </span>
      ),
      extra: `⌘${wallet?.name?.slice(0, 1)?.toUpperCase()}`,
    };
  }),
];

export const itemsGrocery = [
  {
    key: "1111",
    label: <div style={{ width: "100%" }}>All Grocery</div>,
    disabled: true,
  },
  ...GROCERY_OPTIONS?.map((grocery) => {
    return {
      key: grocery?.id,
      label: grocery?.name,
      icon: (
        <span
          style={{
            transform: "translateY(2px)",
            color: grocery?.color,
          }}
        >
          {grocery?.icon}
        </span>
      ),
      extra: `⌘${grocery?.name?.slice(0, 1)?.toUpperCase()}`,
    };
  }),
];

export const itemsType = [
  {
    key: "11",
    label: <div style={{ width: "100%" }}>All Types</div>,
    disabled: true,
  },
  {
    key: "Personal",
    label: "Personal",
    icon: (
      <span
        style={{
          transform: "translateY(2px)",
          color: ICON_COLORS["Personal"],
        }}
      >
        {<IoWallet />}
      </span>
    ),
    extra: "⌘P",
  },
  {
    key: "Family",
    label: "Family",
    icon: (
      <span
        style={{
          transform: "translateY(2px)",
          color: ICON_COLORS["Family"],
        }}
      >
        {<FaGlobe />}
      </span>
    ),
    extra: "⌘F",
  },
  {
    key: "Grocery",
    label: "Grocery",
    icon: (
      <span
        style={{
          transform: "translateY(2px)",
          color: ICON_COLORS["Grocery"],
        }}
      >
        {<MdLocalGroceryStore />}
      </span>
    ),
    extra: "⌘G",
  },
  {
    key: "Investment",
    label: "Investment",
    icon: (
      <span
        style={{
          transform: "translateY(2px)",
          color: ICON_COLORS["Investment"],
        }}
      >
        {<FaWallet />}
      </span>
    ),
    extra: "⌘W",
  },
];

export default function Entry({ setShowEntry, refreshExpense, selectedDate }) {
  const [selectedEntry, setSelectedEntry] = useState("expense");

  const [values, setValues] = useState({
    amount: "0",
    recurring: "false",
    date: getFifteenth(selectedDate),
    category: "",
    type: "Personal",
  });

  const saveAmount = () => {
    axios
      .post("/api/spend", { ...values })
      .then((response) => {
        message.info("Expense saved !");
        setShowEntry(false);
        refreshExpense();
      })
      .catch((error) => {
        alert(JSON.stringify(error));
        message.error("Error while saving Expense !");
      });
  };

  let itemsToTarget = itemsPersonal;

  if (values?.type == "Personal") {
    itemsToTarget = itemsPersonal;
  }

  if (values?.type == "Family") {
    itemsToTarget = itemsFamily;
  }

  if (values?.type == "Investment") {
    itemsToTarget = itemsWallet;
  }

  if (values?.type == "Grocery") {
    itemsToTarget = itemsGrocery;
  }

  const handleMenuClick = (e) => {
    setValues((old) => ({ ...old, category: String(e.key) }));
  };

  const handleMenuClickType = (e) => {
    setValues((old) => ({ ...old, type: String(e.key) }));
  };

  const menu = {
    items: itemsToTarget,
    onClick: handleMenuClick,
  };

  const menuType = {
    items: itemsType,
    onClick: handleMenuClickType,
  };

  return (
    <Container>
      {
        <Options>
          <Option
            selected={selectedEntry == "expense"}
            onClick={() => {
              setValues((old) => ({ ...old, recurring: "false" }));
              setSelectedEntry("expense");
            }}
          >
            Single Expense
            {selectedEntry == "expense" && <SelectedDot></SelectedDot>}
          </Option>
          <Option
            selected={selectedEntry == "recurring"}
            onClick={() => {
              setValues((old) => ({ ...old, recurring: "true" }));
              setSelectedEntry("recurring");
            }}
          >
            Recurring Expense
            {selectedEntry == "recurring" && <SelectedDot></SelectedDot>}
          </Option>
        </Options>
      }
      <EntryForm>
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
                  <span style={{ fontSize: "1rem", color: "#ACAEB2" }}>
                    {values?.type
                      ? capitalizeFirstLetter(values?.type)
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
                  <span style={{ fontSize: "1rem", color: "#ACAEB2" }}>
                    {values?.category
                      ? capitalizeFirstLetter(values?.category)
                      : "Select Category"}
                  </span>
                  <Caret>
                    <FaCaretDown />
                  </Caret>
                </Space>
              </Dropdown>
            </AmountInputDropdown>
            <Title>Info</Title>
            <AmountInputDropdown>
              <input
                type="text"
                value={values?.title}
                onChange={(e) => {
                  setValues((old) => ({
                    ...old,
                    title: String(e.target.value),
                  }));
                }}
              />
            </AmountInputDropdown>
            <Title>Expense</Title>
            <AmountInput>
              <Rupees>
                <FaIndianRupeeSign />
              </Rupees>
              <input
                type="number"
                inputMode="numeric"
                value={values?.amount}
                onChange={(e) => {
                  setValues((old) => ({
                    ...old,
                    amount: String(e.target.value),
                  }));
                }}
              />
            </AmountInput>

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
                value={dayjs(values?.date)}
                picker="date"
                onChange={(e) => {
                  setValues((old) => ({ ...old, date: dayjs(e) }));
                }}
                onFocus={(e) => e.preventDefault()}
              />
            </MonthSelection>
            <SaveButton onClick={() => saveAmount()}>Save</SaveButton>
          </AddAmount>
        </FormContainer>
      </EntryForm>
    </Container>
  );
}

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
`;

const SaveButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fefefe;
  background-color: #2a7af1;
  margin: 1rem 1rem;
  border-radius: 8px;
  padding: 1rem 1rem;
  min-width: 95%;

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

  & input {
    background-color: #1f2125;
    color: #fefefe;
    border: none;
    outline: none;
  }
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
  padding: 1rem;
`;

const EntryForm = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  padding: 1rem;
`;

const SelectedDot = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 5px;
  height: 5px;
  border-radius: 8px;
  background-color: #53b5d9;
  position: absolute;
  bottom: -1rem;
  left: 50%;
`;

const Options = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1rem;
`;

const Option = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  color: ${(props) => (props?.selected ? "#53B5D9" : "#959595")};
  position: relative;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
`;
