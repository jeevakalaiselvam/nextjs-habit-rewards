import styled from "styled-components";
import { WALLET_OPTIONS } from "../helpers/iconHelper";
import { formatIndianNumber } from "../helpers/moneyHelper";
import { generateDarkTextColorForLightBg } from "../helpers/colorHelper";
import { FaIndianRupeeSign } from "react-icons/fa6";

export default function Wallets() {
  return (
    <Container>
      {WALLET_OPTIONS?.map((wallet) => {
        return (
          <WallerContainer color={wallet?.color}>
            <Name>{wallet?.name?.toUpperCase()}</Name>
            <Icon>{wallet?.icon}</Icon>
            <Amount color={generateDarkTextColorForLightBg(wallet?.color)}>
              <span
                style={{ fontSize: "1.5rem", transform: "translateY(2px)" }}
              >
                <FaIndianRupeeSign />
              </span>
              {formatIndianNumber(100)}
            </Amount>
          </WallerContainer>
        );
      })}
    </Container>
  );
}

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

const Amount = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  padding: 1rem;
  font-size: 2rem;
  font-weight: bold;
  color: ${(props) => props.color};
`;

const Name = styled.div`
  display: flex;
  align-items: center;
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
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  min-height: 80vh;
  overflow: scroll;
  margin-top: 1rem;
  max-height: 80vh;
  padding: 1rem 1rem 1rem 1rem;
`;
