import React from "react";
import styled from "styled-components";
import CustomPieChart from "./CustomPieChart";
import {
  COLOR_0_20,
  COLOR_20_40,
  COLOR_40_60,
  COLOR_60_80,
  COLOR_80_100,
  COLOR_BRONZE,
  COLOR_COMMON,
  COLOR_GOLD,
  COLOR_PLATINUM,
  COLOR_RANK_A,
  COLOR_RANK_B,
  COLOR_RANK_C,
  COLOR_RANK_D,
  COLOR_RANK_E,
  COLOR_RANK_F,
  COLOR_RANK_S,
  COLOR_RARE,
  COLOR_SILVER,
  COLOR_SILVER2,
  COLOR_ULTRA_RARE,
  COLOR_UNCOMMON,
  COLOR_VERY_RARE,
} from "../helpers/colorHelper";
import { getAchsBasedOnRarity } from "../helpers/trophyHelper";

export default function StatInformation({ games }) {
  const {
    ultrarare,
    veryrare,
    rare,
    uncommon,
    common,
    averageRarity,
    avg_80_100,
    avg_60_80,
    avg_40_60,
    avg_20_40,
    avg_0_20,
    averationCompletion,
    srank,
    arank,
    brank,
    crank,
    drank,
    erank,
    frank,
    averageRank,
  } = getAchsBasedOnRarity(games);

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
  let rarityDataPoints = [
    {
      id: 0,
      label: "Ultra Rare",
      value: ultrarare?.length,
      color: COLOR_ULTRA_RARE,
    },
    {
      id: 1,
      label: "Very Rare",
      value: veryrare?.length,
      color: COLOR_VERY_RARE,
    },
    {
      id: 2,
      label: "Rare",
      value: rare?.length,
      color: COLOR_RARE,
    },
    {
      id: 3,
      label: "Uncommon",
      value: uncommon?.length,
      color: COLOR_UNCOMMON,
    },
    {
      id: 4,
      label: "Common",
      value: common?.length,
      color: COLOR_COMMON,
    },
  ];

  let averageDataPoints = [
    {
      id: 0,
      label: "80% - 100%",
      value: avg_80_100,
      color: COLOR_80_100,
    },
    {
      id: 1,
      label: "60% - 80%",
      value: avg_60_80,
      color: COLOR_60_80,
    },
    {
      id: 2,
      label: "40% - 60%",
      value: avg_40_60,
      color: COLOR_40_60,
    },
    {
      id: 3,
      label: "20% - 40%",
      value: avg_20_40,
      color: COLOR_20_40,
    },
    {
      id: 4,
      label: "0% - 20%",
      value: avg_0_20,
      color: COLOR_0_20,
    },
  ];

  let rankDataPoints = [
    {
      id: 0,
      label: "S",
      value: srank,
      color: COLOR_RANK_S,
    },
    {
      id: 1,
      label: "A",
      value: arank,
      color: COLOR_RANK_A,
    },
    {
      id: 2,
      label: "B",
      value: brank,
      color: COLOR_RANK_B,
    },
    {
      id: 3,
      label: "C",
      value: crank,
      color: COLOR_RANK_C,
    },
    {
      id: 4,
      label: "D",
      value: drank,
      color: COLOR_RANK_D,
    },
    {
      id: 5,
      label: "E",
      value: erank,
      color: COLOR_RANK_E,
    },
    {
      id: 6,
      label: "F",
      value: frank,
      color: COLOR_RANK_F,
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
          data={rarityDataPoints}
          center={"Rarity"}
          centerCount={`${averageRarity} %`}
        />
        <CustomPieChart
          data={averageDataPoints}
          center={"Average"}
          centerCount={averationCompletion}
        />{" "}
        <CustomPieChart
          data={rankDataPoints}
          center={"Average"}
          centerCount={averageRank}
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
  width: 1350px;
`;

const StatWrapperInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`;
