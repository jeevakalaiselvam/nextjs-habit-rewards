import styled from "styled-components";
import { WALLET_OPTIONS } from "../helpers/iconHelper";
import { formatIndianNumber } from "../helpers/moneyHelper";
import { generateDarkTextColorForLightBg } from "../helpers/colorHelper";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { useEffect, useState } from "react";
import axios from "axios";
import { LoadingOutlined } from "@ant-design/icons";
import { Popover, Spin } from "antd";
import { FaCheck, FaEdit } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

export default function Wallets() {
  const [walletValue, setWalletValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [wallets, setWallets] = useState([]);
  const [walletIdInEdit, setWalletIdInEdit] = useState("");
  const [allSpendings, setAllSpendings] = useState([]);

  const refreshWallet = () => {
    setLoading(true);
    axios
      .get("/api/wallet")
      .then((response) => {
        setWallets(response?.data);
        setLoading(false);
      })
      .catch((error) => {});
  };

  const saveWallet = () => {
    setLoading(true);
    axios
      .post("/api/wallet", { wallet: walletValue, id: walletIdInEdit })
      .then((response) => {
        refreshWallet();
        setLoading(false);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    refreshWallet();
  }, []);

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
  }, []);

  const allWalletsSpendings = allSpendings?.filter((spend) => {
    return spend?.type == "wallet";
  });

  if (loading) {
    <Container>
      <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
    </Container>;
  } else {
    return (
      <Container>
        {WALLET_OPTIONS?.map((wallet) => {
          let walletValueFromWeb = Number(
            wallets?.find((walletWeb) => {
              return walletWeb?.id == wallet?.id;
            })?.wallet ?? 0
          );

          let toAddWalletSpendings = allWalletsSpendings?.reduce(
            (acc, wSpending) =>
              acc + (wSpending?.category == wallet?.id)
                ? Number(wSpending?.amount)
                : 0,
            0
          );

          walletValueFromWeb = walletValueFromWeb + toAddWalletSpendings;

          console.log({ walletValueFromWeb });
          return (
            <WallerContainer color={wallet?.color}>
              <Name>{wallet?.name?.toUpperCase()}</Name>
              <Icon>{wallet?.icon}</Icon>
              {wallet?.id !== walletIdInEdit && (
                <AmountReadOnly
                  color={generateDarkTextColorForLightBg(wallet?.color)}
                >
                  <span
                    style={{ fontSize: "1.5rem", transform: "translateY(2px)" }}
                  >
                    <FaIndianRupeeSign />
                  </span>
                  {formatIndianNumber(walletValueFromWeb)}
                </AmountReadOnly>
              )}

              <Popover
                placement="rightBottom"
                content={
                  <Amount color={wallet?.color}>
                    <span>
                      <input
                        inputMode="numeric"
                        type="number"
                        value={walletValue}
                        onChange={(e) => setWalletValue(e.target.value)}
                      />
                    </span>
                    <SaveButton
                      color={wallet?.color}
                      onClick={() => {
                        saveWallet();
                        setWalletIdInEdit("");
                      }}
                    >
                      UPDATE
                    </SaveButton>
                  </Amount>
                }
                title={`${wallet?.name}`}
              >
                <Edit
                  color={generateDarkTextColorForLightBg(wallet?.color, 10)}
                  onClick={() => {
                    setWalletIdInEdit(wallet?.id);
                  }}
                >
                  EDIT
                </Edit>
              </Popover>
            </WallerContainer>
          );
        })}
      </Container>
    );
  }
}

const SaveButton = styled.div`
  display: flex;
  align-items: center;
  height: 30px;
  width: 100%;
  font-size: 1.25rem;
  flex-direction: column;
  background-color: ${(props) => props.color};
  color: ${(props) => generateDarkTextColorForLightBg(props.color)};

  &:active {
    background-color: ${(props) =>
      generateDarkTextColorForLightBg(props.color)};
    color: ${(props) => "#FEFEFE"};
  }
`;

const Edit = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  position: absolute;
  bottom: 1.5rem;
  left: 1rem;
  padding: 0.25rem;
  font-weight: bold;
  background-color: ${(props) => generateDarkTextColorForLightBg(props.color)};

  &:active {
    color: ${(props) => props.color};
  }
`;

const Icon = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  position: absolute;
  top: 0.75rem;
  right: 1rem;
  padding: 1rem;
  font-size: 2rem;
  font-weight: bold;
`;

const AmountReadOnly = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  font-size: 2rem;
  position: absolute;
  bottom: 0.5rem;
  right: 1rem;
  font-weight: bold;
  color: ${(props) => props.color};
`;

const Amount = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  font-size: 2rem;
  font-weight: bold;
  width: 200px;
  color: ${(props) => props.color};

  & input {
    width: 200px;
    height: 30px;
    outline: none;
    border: none;
    background-color: ${(props) => props.color};
    color: #fefefe;
    padding: 0.25rem;
    font-size: 1.5rem;
  }
`;

const Name = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 1rem;
  font-size: 1.5rem;
  font-weight: bold;
`;

const WallerContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  min-height: 150px;
  border-radius: 8px;
  background-color: ${(props) => props.color};
  margin-bottom: 1rem;
  position: relative;
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
  overflow: scroll;
  padding: 2rem 1rem 1rem 1rem;
`;
