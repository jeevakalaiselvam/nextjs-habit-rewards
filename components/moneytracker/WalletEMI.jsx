import { FaIndianRupeeSign } from "react-icons/fa6";
import styled from "styled-components";
import { formatIndianNumber } from "../helpers/moneyHelper";
import { useEffect, useState } from "react";
import axios from "axios";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

export default function WalletEMI() {
  const [loading, setLoading] = useState(false);
  const [wallets, setWallets] = useState([]);
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
    refreshWallet();
  }, []);

  useEffect(() => {
    refreshSpendings();
  }, []);

  const allWalletsSpendings = allSpendings?.filter((spend) => {
    return spend?.type == "Investment";
  });

  let sum = 0;
  let walletSum = 0;
  let spendingInvestmentSum = 0;

  walletSum = wallets?.reduce((acc, wallet) => acc + Number(wallet?.wallet), 0);
  spendingInvestmentSum = allWalletsSpendings?.reduce(
    (acc, spend) => acc + Number(spend?.amount),
    0
  );

  sum = walletSum + spendingInvestmentSum;

  let totalValue = sum;
  let perMonthMin = ((6 / 100) * totalValue) / 12;
  let perMonthMax = ((12 / 100) * totalValue) / 12;
  let perMonthExtreme = ((18 / 100) * totalValue) / 12;
  let topTickerMessage = "Month";

  let MIN = 60000;
  let MAX = 90000;
  let EXTREME = 120000;

  let perMonthMinEstimate = sum / MIN;
  let perMonthMaxEstimate = sum / MAX;
  let perMonthExtremeEstimate = sum / EXTREME;
  let topTickerMessageEstimate = "Months";

  if (loading) {
    <Container>
      <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
    </Container>;
  } else {
    return (
      <Container>
        <AmountInfo>
          <SubTitle>Total Value</SubTitle>
          <MainTitle ifSelectedDateIsCurrentMonth={true}>
            <span style={{ fontSize: "2.25rem", transform: "translateY(3px)" }}>
              <FaIndianRupeeSign />
            </span>
            {formatIndianNumber(totalValue)}
          </MainTitle>
          <Ticker>
            <span
              style={{
                minWidth: "70px",
                textAlign: "center",
                color: "#FEFEFE",
              }}
            >
              Minimum
            </span>
            <span style={{ minWidth: "50px", textAlign: "center" }}>-</span>
            <PerMonth>
              <span style={{ minWidth: "70px", textAlign: "center" }}>
                <span
                  style={{
                    fontSize: ".9rem",
                    transform: "translateY(2px)",
                  }}
                >
                  <FaIndianRupeeSign />
                </span>
                {perMonthMin ? perMonthMin?.toFixed(0) : 0}
              </span>
              <span style={{ minWidth: "15px", textAlign: "center" }}>/</span>
              <span style={{ minWidth: "50px", textAlign: "center" }}>
                {topTickerMessage}
              </span>
            </PerMonth>
          </Ticker>{" "}
          <Ticker>
            <span
              style={{
                minWidth: "70px",
                textAlign: "center",
                color: "#FEFEFE",
              }}
            >
              Maximum
            </span>
            <span style={{ minWidth: "50px", textAlign: "center" }}>-</span>
            <PerMonth>
              <span style={{ minWidth: "70px", textAlign: "center" }}>
                <span
                  style={{
                    fontSize: ".9rem",
                    transform: "translateY(2px)",
                  }}
                >
                  <FaIndianRupeeSign />
                </span>
                {perMonthMax ? perMonthMax?.toFixed(0) : 0}
              </span>
              <span style={{ minWidth: "15px", textAlign: "center" }}>/</span>
              <span style={{ minWidth: "50px", textAlign: "center" }}>
                {topTickerMessage}
              </span>
            </PerMonth>
          </Ticker>
          <Ticker>
            <span
              style={{
                minWidth: "70px",
                textAlign: "center",
                color: "#FEFEFE",
              }}
            >
              Extreme
            </span>
            <span style={{ minWidth: "50px", textAlign: "center" }}>-</span>
            <PerMonth>
              <span style={{ minWidth: "70px", textAlign: "center" }}>
                <span
                  style={{
                    fontSize: ".9rem",
                    transform: "translateY(2px)",
                  }}
                >
                  <FaIndianRupeeSign />
                </span>
                {perMonthExtreme ? perMonthExtreme?.toFixed(0) : 0}
              </span>
              <span style={{ minWidth: "15px", textAlign: "center" }}>/</span>
              <span style={{ minWidth: "50px", textAlign: "center" }}>
                {topTickerMessage}
              </span>
            </PerMonth>
          </Ticker>
        </AmountInfo>
        <AmountInfo>
          <SubTitle>EMI Calculator</SubTitle>
          <Ticker>
            <span
              style={{
                minWidth: "70px",
                textAlign: "center",
                color: "#FEFEFE",
              }}
            >
              <span
                style={{
                  fontSize: ".9rem",
                  transform: "translateY(2px)",
                }}
              >
                <FaIndianRupeeSign />
              </span>
              {MIN}
            </span>
            <span style={{ minWidth: "50px", textAlign: "center" }}>-</span>
            <PerMonthGreen>
              <span style={{ minWidth: "40px", textAlign: "center" }}>
                {perMonthMinEstimate ? perMonthMinEstimate?.toFixed(0) : 0}
              </span>
              <span style={{ minWidth: "50px", textAlign: "left" }}>
                {topTickerMessageEstimate}
              </span>
            </PerMonthGreen>
          </Ticker>{" "}
          <Ticker>
            <span
              style={{
                minWidth: "70px",
                textAlign: "center",
                color: "#FEFEFE",
              }}
            >
              <span
                style={{
                  fontSize: ".9rem",
                  transform: "translateY(2px)",
                }}
              >
                <FaIndianRupeeSign />
              </span>
              {MAX}
            </span>
            <span style={{ minWidth: "50px", textAlign: "center" }}>-</span>
            <PerMonthGreen>
              <span style={{ minWidth: "40px", textAlign: "center" }}>
                {perMonthMaxEstimate ? perMonthMaxEstimate?.toFixed(0) : 0}
              </span>
              <span style={{ minWidth: "50px", textAlign: "left" }}>
                {topTickerMessageEstimate}
              </span>
            </PerMonthGreen>
          </Ticker>
          <Ticker>
            <span
              style={{
                minWidth: "70px",
                textAlign: "center",
                color: "#FEFEFE",
              }}
            >
              <span
                style={{
                  fontSize: ".9rem",
                  transform: "translateY(2px)",
                }}
              >
                <FaIndianRupeeSign />
              </span>
              {EXTREME}
            </span>
            <span style={{ minWidth: "50px", textAlign: "center" }}>-</span>
            <PerMonthGreen>
              <span style={{ minWidth: "40px", textAlign: "center" }}>
                {perMonthExtremeEstimate
                  ? perMonthExtremeEstimate?.toFixed(0)
                  : 0}
              </span>
              <span style={{ minWidth: "50px", textAlign: "left" }}>
                {topTickerMessageEstimate}
              </span>
            </PerMonthGreen>
          </Ticker>
        </AmountInfo>
      </Container>
    );
  }
}

const PerMonth = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;
`;

const PerMonthGreen = styled.div`
  display: flex;
  align-items: center;
  color: #04b488;
  justify-content: center;
  min-width: 120px;
`;

const Ticker = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #929498;
  @keyframes blink-smooth {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }
  padding: 0.5rem 0rem 0.5rem 0rem;
`;

const SubTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4f4f4f;
  transform: translateX(6px);
  padding: 1rem;
  font-size: 1.5rem;
`;

const SubTitleInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4f4f4f;
  transform: translateX(6px);
  padding: 1rem;
  font-size: 1.5rem;
`;

const MainTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  margin-bottom: 0.5rem;
  color: ${(props) =>
    props.ifSelectedDateIsCurrentMonth ? "#04b488" : "#53B5D9"};
`;

const AmountInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-width: 100%;
  flex: 1;
  flex-direction: column;

  transform: translateX(-2px);
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  min-height: 60vh;
  max-height: 60vh;
`;
