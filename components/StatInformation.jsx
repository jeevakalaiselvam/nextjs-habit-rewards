import React from "react";
import styled from "styled-components";
import CustomPieChart from "./CustomPieChart";
import {
  COLOR_BRONZE,
  COLOR_GOLD,
  COLOR_PLATINUM,
  COLOR_SILVER,
  COLOR_SILVER2,
} from "../helpers/colorHelper";
import { getAchsBasedOnRarity } from "../helpers/trophyHelper";

export default function StatInformation({ games }) {
  const { ultrarare, veryrare, rare, uncommon, common } =
    getAchsBasedOnRarity(games);

  let completed = 0;
  let allCompletion = 0;
  let unearned = 0;
  let platinumA = 0;
  let goldA = 0;
  let silverA = 0;
  let bronzeA = 0;
  let platinum = 0;
  let gold = 0;
  let silver = 0;
  let bronze = 0;
  let total = 0;

  games?.forEach((game) => {
    game?.achievements?.forEach((ach) => {
      if (ach?.achieved == 0) {
        unearned++;
        if (ach?.color == "Platinum") {
          platinumA++;
        }
        if (ach?.color == "Gold") {
          goldA++;
        }
        if (ach?.color == "Silver") {
          silverA++;
        }
        if (ach?.color == "Bronze") {
          bronzeA++;
        }
      } else {
        if (ach?.color == "Platinum") {
          platinum++;
          total++;
        }
        if (ach?.color == "Gold") {
          gold++;
          total++;
        }
        if (ach?.color == "Silver") {
          silver++;
          total++;
        }
        if (ach?.color == "Bronze") {
          bronze++;
          total++;
        }
      }
    });

    let exceptPlatinum = game?.achievements?.filter(
      (item) => item?.color !== "Platinum"
    );

    let completed = exceptPlatinum?.filter(
      (item) => item?.achieved == 1
    )?.length;
    let completion = (completed == 0 ? 0 : (completed / total) * 100)?.toFixed(
      2
    );
    allCompletion = allCompletion + completion;
    if (total == completed) {
      completed = completed + 1;
    }
  });

  let gamesData = [
    {
      id: 0,
      label: "Steam",
      value: games?.length,
      color: "#0088FE",
    },
  ];

  let trophyData = [
    {
      id: 0,
      label: "Platinum",
      value: platinum,
      color: COLOR_PLATINUM,
    },
    {
      id: 1,
      label: "Gold",
      value: gold,
      color: COLOR_GOLD,
    },
    {
      id: 2,
      label: "Silver",
      value: silver,
      color: COLOR_SILVER,
    },
    {
      id: 3,
      label: "Bronze",
      value: bronze,
      color: COLOR_BRONZE,
    },
  ];

  let trophyDataPoints = [
    {
      id: 0,
      label: "Steam",
      value: platinum * 300,
      color: COLOR_PLATINUM,
    },
    {
      id: 1,
      label: "Gold",
      value: gold * 90,
      color: COLOR_GOLD,
    },
    {
      id: 2,
      label: "Silver",
      value: silver * 30,
      color: COLOR_SILVER2,
    },
    {
      id: 3,
      label: "Bronze",
      value: bronze * 15,
      color: COLOR_BRONZE,
    },
  ];

  return (
    <StatWrapper>
      <StatWrapperInner>
        <CustomPieChart
          data={gamesData}
          center={"Games"}
          centerCount={games?.length}
        />
        <CustomPieChart
          data={trophyData}
          center={"Trophies"}
          centerCount={platinum + gold + silver + bronze}
        />{" "}
        <CustomPieChart
          data={trophyDataPoints}
          center={"Points"}
          centerCount={platinum * 300 + gold * 90 + silver * 30 + bronze * 15}
        />
      </StatWrapperInner>
      <StatWrapperInner>
        <CustomPieChart
          data={trophyDataPoints}
          center={"Points"}
          centerCount={games?.length}
        />
        <CustomPieChart
          data={[
            {
              label: "Steam",
              value: games?.length,
              color: "#0088FE",
            },
          ]}
          center={"Games"}
          centerCount={games?.length}
        />{" "}
        <CustomPieChart
          data={[
            {
              label: "Steam",
              value: games?.length,
              color: "#0088FE",
            },
          ]}
          center={"Games"}
          centerCount={games?.length}
        />
      </StatWrapperInner>
    </StatWrapper>
  );
}

const StatWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
`;

const StatWrapperInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`;
