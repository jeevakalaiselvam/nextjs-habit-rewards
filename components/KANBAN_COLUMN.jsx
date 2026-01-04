import React from "react";
import styled from "styled-components";
import ACH_CARD from "./ACH_CARD";
import { useDrop } from "react-dnd";
import { moveAchievement } from "../store/store";
import { useDispatch } from "react-redux";
import axios from "axios";

export default function KANBAN_COLUMN({
  index,
  category,
  currentAchievements,
  gameId,
  setShowingAll,
  showingAll,
  setLearntAchs,
  learntAchs,
}) {
  const dispatch = useDispatch();

  const [, drop] = useDrop(() => ({
    accept: "ACH_CARD",
    drop: (item) => {
      if (category === "COMPLETED") {
        let achToMarkLearnt = item.ach;
        try {
          axios
            .post("/api/learnt", {
              achName: `${achToMarkLearnt?.gameId}-${achToMarkLearnt?.name}`,
            })
            .then((response) => {
              let data = response.data;
              console.log("RESPONSE BACK", data);
              setLearntAchs(data);
            });
        } catch (e) {}
      } else {
        dispatch(
          moveAchievement(gameId, item.ach.name, item.fromLane, category)
        );
      }
    },
  }));

  return (
    <KanbanSingle ref={drop}>
      <KanbanTitle
        index={index}
        onClick={() => {
          if (category == "ALL") {
            setShowingAll((old) => !old);
          }
        }}
      >
        {category}: {currentAchievements?.length}
      </KanbanTitle>
      <KanbanData>
        {currentAchievements?.map((ach, index) => {
          let desc1 = ach?.hiddenDesc;
          let desc2 = ach?.description;
          let desc3 = ach?.hiddenDesc?.split("Hidden achievement:")?.[1];
          return (
            <ACH_CARD
              ach={ach}
              index={index}
              desc1={desc1}
              desc2={desc2}
              desc3={desc3}
              lane={category}
            />
          );
        })}
      </KanbanData>
    </KanbanSingle>
  );
}

const KanbanTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  padding: 0rem 0.25rem;
  width: 100%;
  color: rgb(131, 134, 138);
  font-weight: bold;
`;

const KanbanData = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  max-height: 72vh;
  min-height: 72vh;
  width: 100%;
  overflow: scroll;
  color: #717171;
`;

const KanbanSingle = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  margin: 0.25rem 1rem;
  flex: 1;
`;

const Seperator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  content: "";
  height: 40px;
  background: #000000;
  opacity: 0.25;
  width: 1px;
  margin: ${(props) => (props.padding ? `0rem ${props.padding}` : `0rem 1rem`)};
  top: calc(50% - 20px);
`;
