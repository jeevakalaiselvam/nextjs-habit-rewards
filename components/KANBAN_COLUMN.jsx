import React from "react";
import styled from "styled-components";
import ACH_CARD from "./ACH_CARD";
import { useDrop } from "react-dnd";
import { moveAchievement } from "../store/store";
import { useDispatch } from "react-redux";

export default function KANBAN_COLUMN({
  index,
  category,
  currentAchievements,
  gameId,
}) {
  const dispatch = useDispatch();

  const [, drop] = useDrop(() => ({
    accept: "ACH_CARD",
    drop: (item) => {
      if (category === "ALL" || category === "COMPLETED") return; // Don't drop here
      dispatch(moveAchievement(gameId, item.ach.name, item.fromLane, category));
    },
  }));

  return (
    <KanbanSingle ref={drop}>
      <KanbanTitle index={index}>{category}</KanbanTitle>
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
  flex-direction: column;
  background-color: #336291;
  padding: 0rem 0.25rem;
  width: 100%;
  color: #fefefe;
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
  background-color: #e7e7e7;
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
