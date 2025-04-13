import styled from "styled-components";

export default function Wallets() {
  const allWallets = [
    { name: "Provident Fund", id: "providentfund", color: "#6A5ACD" }, // Slate Blue
    { name: "Liquid Fund", id: "liquidfund", color: "#00CED1" }, // Dark Turquoise
    { name: "Gold", id: "gold", color: "#FFD700" }, // Gold
    { name: "Mutual Funds", id: "mutualfunds", color: "#3CB371" }, // Medium Sea Green
    { name: "Stocks", id: "stocks", color: "#FF6347" }, // Tomato Red
    { name: "Bonds", id: "bonds", color: "#4682B4" }, // Steel Blue
  ];

  return (
    <Container>
      {allWallets?.map((wallet) => {
        return (
          <WallerContainer color={wallet?.color}>
            <Name>{wallet?.name?.toUpperCase()}</Name>
            <Amount></Amount>
          </WallerContainer>
        );
      })}
    </Container>
  );
}

const Amount = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  padding: 1rem;
  font-size: 1rem;
  font-weight: bold;
`;

const Name = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 1rem;
  font-size: 2rem;
  font-weight: bold;
`;

const WallerContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  min-height: 200px;
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
  max-height: 80vh;
  padding: 1rem 1rem 1rem 1rem;
`;
