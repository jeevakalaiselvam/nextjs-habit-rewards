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
  ICON_CATEGORY,
  ICON_COLORS,
  WALLET_OPTIONS,
} from "../helpers/iconHelper";
import dayjs from "dayjs";

export default function Entry({ setShowEntry }) {
  const [selectedEntry, setSelectedEntry] = useState("expense");

  const [values, setValues] = useState({
    amount: "0",
    recurring: "false",
    date: new Date()?.toString(),
    category: "",
    type: "personal",
  });

  const itemsPersonal = [
    {
      key: "1",
      label: <div style={{ width: "100%" }}>All Categories</div>,
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      key: "games",
      label: "Games",
      icon: (
        <span
          style={{ transform: "translateY(2px)", color: ICON_COLORS["games"] }}
        >
          {ICON_CATEGORY?.["games"]}
        </span>
      ),
      extra: "⌘G",
    },
    {
      key: "movies",
      label: "Movies",
      icon: (
        <span
          style={{ transform: "translateY(2px)", color: ICON_COLORS["movies"] }}
        >
          {ICON_CATEGORY?.["movies"]}
        </span>
      ),
      extra: "⌘M",
    },
    {
      key: "food",
      label: "Food",
      icon: (
        <span
          style={{ transform: "translateY(2px)", color: ICON_COLORS["food"] }}
        >
          {ICON_CATEGORY?.["food"]}
        </span>
      ),
      extra: "⌘F",
    },
    {
      key: "clothing",
      label: "Clothing",
      icon: (
        <span
          style={{
            transform: "translateY(2px)",
            color: ICON_COLORS["clothing"],
          }}
        >
          {ICON_CATEGORY?.["clothing"]}
        </span>
      ),
      extra: "⌘F",
    },
    {
      key: "gadget",
      label: "Gadget",
      icon: (
        <span
          style={{ transform: "translateY(2px)", color: ICON_COLORS["gadget"] }}
        >
          {ICON_CATEGORY?.["gadget"]}
        </span>
      ),
      extra: "⌘F",
    },
    {
      key: "gift",
      label: "Gift",
      icon: (
        <span
          style={{ transform: "translateY(2px)", color: ICON_COLORS["gift"] }}
        >
          {ICON_CATEGORY?.["gift"]}
        </span>
      ),
      extra: "⌘G",
    },
    {
      key: "subscription",
      label: "Subscription",
      icon: (
        <span
          style={{
            transform: "translateY(2px)",
            color: ICON_COLORS["subscription"],
          }}
        >
          {ICON_CATEGORY?.["subscription"]}
        </span>
      ),
      extra: "⌘S",
    },
    {
      key: "fuel",
      label: "Fuel",
      icon: (
        <span
          style={{ transform: "translateY(2px)", color: ICON_COLORS["fuel"] }}
        >
          {ICON_CATEGORY?.["fuel"]}
        </span>
      ),
      extra: "⌘F",
    },
  ];

  const itemsFamily = [
    {
      key: "1",
      label: <div style={{ width: "100%" }}>All Categories</div>,
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      key: "grocery",
      label: "Grocery",
      icon: (
        <span
          style={{
            transform: "translateY(2px)",
            color: ICON_COLORS["grocery"],
          }}
        >
          {ICON_CATEGORY?.["grocery"]}
        </span>
      ),
      extra: "⌘G",
    },
    {
      key: "mom",
      label: "Mom",
      icon: (
        <span
          style={{ transform: "translateY(2px)", color: ICON_COLORS["mom"] }}
        >
          {ICON_CATEGORY?.["mom"]}
        </span>
      ),
      extra: "⌘M",
    },
    {
      key: "dad",
      label: "Dad",
      icon: (
        <span
          style={{ transform: "translateY(2px)", color: ICON_COLORS["dad"] }}
        >
          {ICON_CATEGORY?.["dad"]}
        </span>
      ),
      extra: "⌘D",
    },
    {
      key: "loan",
      label: "Loan",
      icon: (
        <span
          style={{ transform: "translateY(2px)", color: ICON_COLORS["loan"] }}
        >
          {ICON_CATEGORY?.["loan"]}
        </span>
      ),
      extra: "⌘K",
    },
    {
      key: "credit",
      label: "Credit",
      icon: (
        <span
          style={{ transform: "translateY(2px)", color: ICON_COLORS["credit"] }}
        >
          {ICON_CATEGORY?.["credit"]}
        </span>
      ),
      extra: "⌘C",
    },
    {
      key: "house",
      label: "House",
      icon: (
        <span
          style={{ transform: "translateY(2px)", color: ICON_COLORS["house"] }}
        >
          {ICON_CATEGORY?.["house"]}
        </span>
      ),
      extra: "⌘H",
    },
    {
      key: "car",
      label: "Car",
      icon: (
        <span
          style={{ transform: "translateY(2px)", color: ICON_COLORS["car"] }}
        >
          {ICON_CATEGORY?.["car"]}
        </span>
      ),
      extra: "⌘H",
    },
    {
      key: "electricity",
      label: "Electricity",
      icon: (
        <span
          style={{
            transform: "translateY(2px)",
            color: ICON_COLORS["electricity"],
          }}
        >
          {ICON_CATEGORY?.["electricity"]}
        </span>
      ),
      extra: "⌘H",
    },
  ];

  const itemsType = [
    {
      key: "11",
      label: <div style={{ width: "100%" }}>All Types</div>,
      disabled: true,
    },
    {
      key: "personal",
      label: "Personal",
      icon: <IoWallet />,
      extra: "⌘P",
    },
    {
      key: "family",
      label: "Family",
      icon: <FaGlobe />,
      extra: "⌘F",
    },
    {
      key: "wallet",
      label: "Wallet",
      icon: <FaWallet />,
      extra: "⌘W",
    },
  ];

  const itemsWallet = [
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

  const saveAmount = () => {
    axios
      .post("/api/spend", { ...values })
      .then((response) => {
        message.info("Expense saved !");
        setShowEntry(false);
      })
      .catch((error) => {
        alert(JSON.stringify(error));
        message.error("Error while saving Expense !");
      });
  };

  const handleMenuClick = (e) => {
    setValues((old) => ({ ...old, category: String(e.key) }));
  };

  const handleMenuClickType = (e) => {
    setValues((old) => ({ ...old, type: String(e.key) }));
  };

  let itemsToTarget = itemsPersonal;

  if (values?.type == "personal") {
    itemsToTarget = itemsPersonal;
  }

  if (values?.type == "family") {
    itemsToTarget = itemsFamily;
  }

  if (values?.type == "wallet") {
    itemsToTarget = itemsWallet;
  }

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
