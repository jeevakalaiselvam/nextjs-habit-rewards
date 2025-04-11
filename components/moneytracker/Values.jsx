import axios from "axios";
import { useEffect, useState } from "react";
import { FaRupeeSign } from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { HiChartPie, HiCurrencyRupee } from "react-icons/hi";
import styled from "styled-components";
import {
  getDateInFormatDMY,
  getFormattedDateWords,
} from "../helpers/dateHelper";

export default function Values() {
  const [newPackage, setNewPackage] = useState(null);
  const [allPackages, setAllPackages] = useState([]);

  const savePackage = () => {
    axios
      .post("/api/package", {
        amountYearly: newPackage,
        date: getDateInFormatDMY(),
      })
      .then((response) => {
        refreshPackages();
      })
      .catch((error) => {});
  };

  const refreshPackages = () => {
    axios
      .get("/api/package")
      .then((response) => {
        const data = response?.data;
        setAllPackages(data);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    refreshPackages();
  }, []);

  return (
    <Container>
      <AddAmount>
        <Title>Add Package</Title>
        <AmountInput>
          <Rupees>
            <FaIndianRupeeSign />
          </Rupees>
          <input
            type="number"
            inputMode="numeric"
            value={newPackage}
            onChange={(e) => {
              setNewPackage(e.target.value);
            }}
          />
        </AmountInput>
        <SaveButton onClick={() => savePackage()}>
          Proceed to Add Package
        </SaveButton>
      </AddAmount>
      <DisplayAmounts>
        <Topbar></Topbar>
        <TitleNaming>
          <IconName>Recent Changes</IconName>
          <IconSettings></IconSettings>
        </TitleNaming>
        <PackageContainer>
          {allPackages?.map((packageSingle) => {
            return (
              <SinglePackage>
                <Image>
                  <HiChartPie />
                </Image>
                <DetailsRow>
                  <Details1>Package Change</Details1>
                  <Details2>
                    {getFormattedDateWords(packageSingle?.date)}
                  </Details2>
                </DetailsRow>
                <Money>
                  {packageSingle?.amountYearly} <FaIndianRupeeSign />
                </Money>
              </SinglePackage>
            );
          })}
        </PackageContainer>
      </DisplayAmounts>
    </Container>
  );
}

const Image = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  font-size: 2rem;
  color: #673fac;
  margin-right: 1rem;
`;

const Money = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
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
  font-size: 1.1rem;
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
  padding: 1rem 2rem;
  width: 100%;
`;

const PackageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
`;

const TitleNaming = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1rem;
  margin-top: 1rem;
`;

const IconName = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  font-size: 1.25rem;
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
  width: 110%;
  background-color: #1f2125;
  border-radius: 2rem 2rem 0 0;
  flex-direction: column;
  min-height: 50vh;
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
  top: 55%;
  left: 1rem;
  color: #fbfcfe;
`;

const AmountInput = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  font-size: 1.5rem;
  position: relative;

  & input {
    margin-top: 2rem;
    background-color: #1f2125;
    color: #8f9094;
    border: none;
    padding: 1rem 1rem 1rem 3rem;
    outline: none;
  }
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: center;
  font-size: 1.5rem;
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
  min-width: 100%;
  flex-direction: column;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  min-height: 73vh;
  flex-direction: column;
  max-height: 73vh;
`;
