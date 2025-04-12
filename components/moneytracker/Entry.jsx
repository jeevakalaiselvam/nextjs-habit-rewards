import { DownOutlined, SettingOutlined } from "@ant-design/icons";
import { Dropdown, message, Space } from "antd";
import { useState } from "react";
import { BiSolidMoviePlay } from "react-icons/bi";
import {
  FaCaretDown,
  FaGamepad,
  FaGlobe,
  FaShoppingCart,
} from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { IoFastFood, IoWallet, IoWalletSharp } from "react-icons/io5";
import styled from "styled-components";
import { capitalizeFirstLetter } from "../helpers/stringHelper";
import { RiDeviceFill } from "react-icons/ri";
import { TbDeviceDesktopFilled } from "react-icons/tb";
import axios from "axios";
import { MdFamilyRestroom } from "react-icons/md";

export default function Entry({ setShowEntry }) {
  const [selectedEntry, setSelectedEntry] = useState("expense");
  const [values, setValues] = useState({
    amount: "0",
    recurring: "false",
    date: new Date()?.toString(),
    category: "games",
    type: "personal",
  });

  const items = [
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
      icon: <FaGamepad />,
      extra: "⌘G",
    },
    {
      key: "movies",
      label: "Movies",
      icon: <BiSolidMoviePlay />,
      extra: "⌘M",
    },
    {
      key: "food",
      label: "Food",
      icon: <IoFastFood />,
      extra: "⌘F",
    },
    {
      key: "clothing",
      label: "Clothing",
      icon: <FaShoppingCart />,
      extra: "⌘F",
    },
    {
      key: "gadget",
      label: "Gadget",
      icon: <TbDeviceDesktopFilled />,
      extra: "⌘F",
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
  ];

  const saveAmount = () => {
    axios
      .post("/api/spend", { ...values, date: new Date()?.toString() })
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

  const menu = {
    items,
    onClick: handleMenuClick,
  };

  const menuType = {
    items: itemsType,
    onClick: handleMenuClickType,
  };

  return (
    <Container>
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
      <EntryForm>
        <FormContainer>
          <AddAmount>
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
            <SaveButton onClick={() => saveAmount()}>Save</SaveButton>
          </AddAmount>
        </FormContainer>
      </EntryForm>
    </Container>
  );
}

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
  padding: 1rem;
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
  padding: 1rem;
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
