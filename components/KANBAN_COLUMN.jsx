import styled from 'styled-components';
import ACH_CARD from './ACH_CARD';
import { useDrop } from 'react-dnd';
import { moveAchievement } from '../store/store';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { useState } from 'react';
import { Progress } from 'antd';
import ACH_CARD_BOTTOM from './ACH_CARD_BOTTOM';
import ACH_CARD_ICONS from './ACH_CARD_ICONS';

export default function KANBAN_COLUMN({
  index,
  category,
  currentAchievements,
  gameId,
  setShowingAll,
  setLearntAchs,
}) {
  const dispatch = useDispatch();
  const [markingAll, setMarkingAll] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [total, setTotal] = useState(0);

  const [, drop] = useDrop(() => ({
    accept: 'ACH_CARD',
    drop: (item) => {
      if (category === 'COMPLETED') {
        let achToMarkLearnt = item.ach;
        try {
          axios
            .post('/api/learnt', {
              achName: `${achToMarkLearnt?.gameId}-${achToMarkLearnt?.name}`,
            })
            .then((response) => {
              let data = response.data;
              console.log('RESPONSE BACK', data);
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

  const markAllCompleteOneByOne = async (achs) => {
    if (!achs || achs.length === 0) return;

    setMarkingAll(true);
    // 1. Initialize progress
    setCompleted(0);
    setTotal(achs.length);

    try {
      // 2. Map your items to an array of Axios promises
      const requests = achs.map((ach) =>
        axios
          .post('/api/learnt', {
            achName: `${ach?.gameId}-${ach?.name}`,
          })
          .then((response) => {
            // Increment progress as each one finishes
            setCompleted((prev) => prev + 1);
            setLearntAchs(response.data);
            return response.data; // Return the data for Promise.all
          })
      );

      // 3. Wait for EVERY request to resolve
      const results = await Promise.all(requests);

      // 4. Handle the final state once finished
      // 'results' is an array of all response.data objects.
      // We take the last one to match your original logic.
      const finalData = results[results.length - 1];
      setLearntAchs(finalData);

      // Optional: Reset progress after a short delay so the user sees 100%
      setCompleted(0);
      setTotal(0);
      setMarkingAll(false);
    } catch (error) {
      console.error('One or more requests failed', error);
    }
  };

  const populateHiddenDescriptions = (ach) => {
    console.log(ach);
    try {
      axios.get(`/api/hidden/${ach?.gameId}`).then((response) => {
        console.log(response);
      });
    } catch (e) {}
  };

  return (
    <KanbanSingle ref={drop}>
      <KanbanTitle
        index={index}
        onClick={() => {
          if (category == 'ALL') {
            setShowingAll((old) => !old);
          }
        }}
      >
        {category}: {currentAchievements?.length}
        {false && category == 'NOT COMPLETED' && !markingAll && (
          <KanbanMarkCompleteAll
            onClick={() => {
              markAllCompleteOneByOne(currentAchievements);
            }}
          >
            Mark All Complete
          </KanbanMarkCompleteAll>
        )}
        {false && category == 'NOT COMPLETED' && !markingAll && (
          <KanbanFindHidden
            onClick={() => {
              populateHiddenDescriptions(currentAchievements?.[0]);
            }}
          >
            Populate Hidden
          </KanbanFindHidden>
        )}
        {markingAll && (
          <KanbanMarkCompleteAllProgress>
            <Progress
              trailColor="#525252"
              percent={((completed / total) * 100).toFixed(1)}
              size={'small'}
              status="active"
            />
          </KanbanMarkCompleteAllProgress>
        )}
      </KanbanTitle>

      {category == 'NOT COMPLETED' && (
        <KanbanData>
          <KanbanData22>
            {currentAchievements?.map((ach, index) => {
              let desc1 = ach?.hiddenDesc;
              let desc2 = ach?.description;
              let desc3 = ach?.hiddenDesc?.split('Hidden achievement:')?.[1];
              return (
                <ACH_CARD
                  ach={ach}
                  index={index}
                  desc1={desc1}
                  desc2={desc2}
                  desc3={desc3}
                  lane={category}
                  setLearntAchs={setLearntAchs}
                />
              );
            })}
          </KanbanData22>
        </KanbanData>
      )}
      {category != 'NOT COMPLETED' && (
        <KanbanData2
          nothing={currentAchievements?.length == 0}
          unlockedLength={currentAchievements?.length}
        >
          <KanbanData22>
            {currentAchievements?.map((ach, index) => {
              let desc1 = ach?.hiddenDesc;
              let desc2 = ach?.description;
              let desc3 = ach?.hiddenDesc?.split('Hidden achievement:')?.[1];
              return (
                <ACH_CARD_ICONS
                  ach={ach}
                  index={index}
                  desc1={desc1}
                  desc2={desc2}
                  desc3={desc3}
                  lane={category}
                />
              );
            })}
          </KanbanData22>
        </KanbanData2>
      )}
    </KanbanSingle>
  );
}

const KanbanMarkCompleteAllProgress = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 400px;
  height: 30px;
  right: 0;
  top: 0;
  font-size: 0.75rem;
  transform: translateY(2px);
  padding: 2px 8px;
  color: #fefefe;
`;

const KanbanFindHidden = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 0;
  top: 0;
  font-size: 0.75rem;
  transform: translateY(2px);
  padding: 2px 8px;

  &:hover {
    color: #fefefe;
    background-color: #111923;
    padding: 2px 8px;
  }
`;

const KanbanMarkCompleteAll = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 0;
  top: 0;
  font-size: 0.75rem;
  transform: translateY(2px);
  padding: 2px 8px;

  &:hover {
    color: #fefefe;
    background-color: #111923;
    padding: 2px 8px;
  }
`;

const KanbanTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  padding: 0.25rem 0.25rem;
  width: 100%;
  color: rgb(131, 134, 138);
  font-weight: bold;
  position: relative;
`;

const KanbanData = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  max-height: 94vh;
  min-height: 94vh;
  width: 100%;
  overflow: scroll;
  color: #717171;
`;

const KanbanData22 = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: wrap;
  max-height: 94vh;
  width: 100%;
  overflow: scroll;
  color: #717171;
`;

const KanbanData2 = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  max-height: 94vh;
  min-height: 94vh;
  width: 100%;
  color: #717171;
`;

const KanbanSingle = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  margin: 0rem 1rem;
  flex: 1;
`;
