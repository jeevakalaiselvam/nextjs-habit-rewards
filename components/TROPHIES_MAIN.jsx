import styled from "styled-components";
import ACH_CARD from "./ACH_CARD";
import { Popover } from "antd";

export default function TROPHIES_MAIN({ sortedGames }) {
  let allAchs = [];

  sortedGames?.forEach((game) => {
    game?.achievements?.forEach((ach) => {
      if (ach?.achieved == 1 || ach?.achievedByLearning) {
        allAchs?.push(ach);
      }
    });
  });

  allAchs = allAchs?.sort((ach1, ach2) => ach2?.unlocktime - ach1?.unlocktime);

  return (
    <Games>
      <Games2Line>
        {allAchs?.map((ach, index) => {
          let desc1 = ach?.hiddenDesc;
          let desc2 = ach?.description;
          let desc3 = ach?.hiddenDesc?.split("Hidden achievement:")?.[1];

          return (
            <Popover
              placement="bottom"
              content={
                <ACH_CARD
                  ach={ach}
                  desc1={desc1}
                  desc2={desc2}
                  desc3={desc3}
                  index={index}
                  hideCompletion
                  longer={"500"}
                />
              }
              title=""
              styles={{
                content: {
                  backgroundColor: "transparent",
                  boxShadow: "none",
                },
                body: {
                  padding: 0, // Removes default internal spacing
                },
              }}
            >
              <AchIcon
                icon={ach?.icon}
                onClick={() => {
                  if (window !== "undefined") {
                    const searchQuery = `${
                      ach?.displayName
                    } achievement ${encodeURIComponent(ach?.gameName)} `;
                    window.open(
                      `https://www.google.com/search?q=${searchQuery}`
                    );

                    // window.open(`https://www.youtube.com/results?search_query=${searchQuery}`);
                  }
                }}
              ></AchIcon>
            </Popover>
          );
        })}
      </Games2Line>
    </Games>
  );
}

const AchIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 68px;
  height: 68px;
  background: ${(props) => `url(${props?.icon})`};
  background-size: contain;
  background-repeat: no-repeat;
  margin: 0.5rem;
  cursor: pointer;
`;

const Games2Line = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: wrap;
  width: 100%;
  max-height: 91vh;
  overflow: scroll;
`;

const Games = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 98%;
  color: #fefefe;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;
