import { Button, Calendar, Radio } from 'antd';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import UserCalendar from './UserCalendar';
import UserCreate from './UserCreate';
import UserHabits from './UserHabits';
import UserHabitLog from './UserDaily';
import {
  HiOutlineArrowNarrowLeft,
  HiOutlineArrowNarrowRight,
  HiShieldCheck,
} from 'react-icons/hi';
import moment from 'moment';
import UserHabitRewards from './UserRewards';
import {
  COLOR_ACCENT,
  COLOR_BACKGROUND,
  COLOR_SUCCESS,
} from './helpers/colorHelper';
import UserTrend from './UserTrend';
import { getRelativeDate } from './helpers/constantHelper';
import axios from 'axios';

export default function User({
  createMode,
  setCreateMode,
  user,
  setTodayAmount,
}) {
  const [payouts, setPayouts] = useState([]);
  const [activeItem, setActiveItem] = useState('habits');
  const [currentDate, setCurrentDate] = useState(
    moment(new Date()).format('YYYY-MM-DD')
  );

  const formattedDate = currentDate.split('-').reverse().join('-');

  const daysText =
    getRelativeDate(formattedDate) +
    ` - ${new Date(currentDate).toLocaleString('en-US', { weekday: 'long' })}`;
  const istoday = daysText == 'Today';

  useEffect(() => {
    refreshPayoutStatus();
  }, [currentDate]);

  let allPayoutsDatesForUser = payouts
    ?.filter((payout) => payout?.user == user)
    ?.map((payout) => payout?.time);

  let isPayoutDoneForUserToday = allPayoutsDatesForUser?.includes(currentDate);

  const refreshPayoutStatus = () => {
    axios
      .get('/api/payout')
      .then((response) => {
        let payouts = response?.data;
        setPayouts(payouts);
      })
      .catch((err) => {
        setPayouts([]);
      });
  };

  return (
    <Container>
      <DateLeftRight>
        <Left
          onClick={() => {
            let newDate = new Date(currentDate);
            newDate.setDate(newDate.getDate() - 1);
            setCurrentDate((old) =>
              moment(new Date(newDate)).format('YYYY-MM-DD')
            );
          }}
        >
          <Button
            color="primary"
            variant="solid"
            style={{ border: 'none', outline: 'none' }}
          >
            <HiOutlineArrowNarrowLeft />
          </Button>
        </Left>
        <Middle>
          <Top>{formattedDate}</Top>
          <Bottom>
            <span style={{ opacity: 0.5, padding: '.5rem 0rem .2rem 0rem' }}>
              {daysText}
            </span>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isPayoutDoneForUserToday ? (
                <HiShieldCheck
                  style={{ color: COLOR_SUCCESS, marginLeft: '.25rem' }}
                />
              ) : (
                ''
              )}
            </span>
          </Bottom>
        </Middle>
        <Right
          onClick={() => {
            let newDate = new Date(currentDate);
            newDate.setDate(newDate.getDate() + 1);
            setCurrentDate((old) =>
              moment(new Date(newDate)).format('YYYY-MM-DD')
            );
          }}
        >
          <Button color="primary" variant="solid">
            <HiOutlineArrowNarrowRight />
          </Button>
        </Right>
      </DateLeftRight>
      {!createMode && (
        <OptionContainer>
          <Radio.Group
            size="large"
            value={activeItem}
            style={{ width: '102%' }}
            onChange={(e) => {
              setActiveItem(e.target.value);
              setCreateMode(false);
            }}
          >
            <Radio.Button
              value="rewards"
              style={{ width: '25%', textAlign: 'center' }}
            >
              Rewards
            </Radio.Button>
            <Radio.Button
              value="habitlog"
              style={{ width: '25%', textAlign: 'center' }}
            >
              Daily
            </Radio.Button>
            <Radio.Button
              value="habits"
              style={{ width: '25%', textAlign: 'center' }}
            >
              Habits
            </Radio.Button>
            <Radio.Button
              value="history"
              style={{ width: '25%', textAlign: 'center' }}
            >
              Streaks
            </Radio.Button>
          </Radio.Group>
        </OptionContainer>
      )}
      <SelectedContainer>
        {createMode && (
          <UserCreate
            setActiveItem={setActiveItem}
            setCreateMode={setCreateMode}
            user={user}
          />
        )}
        {activeItem == 'calendar' && !createMode && (
          <UserCalendar user={user} />
        )}
        {activeItem == 'habits' && !createMode && (
          <UserHabits
            setActiveItem={setActiveItem}
            currentDate={currentDate}
            user={user}
            setTodayAmount={setTodayAmount}
          />
        )}

        {activeItem == 'habitlog' && !createMode && (
          <UserHabitLog
            setActiveItem={setActiveItem}
            currentDate={currentDate}
            user={user}
            setTodayAmount={setTodayAmount}
          />
        )}
        {activeItem == 'rewards' && !createMode && (
          <UserHabitRewards
            setActiveItem={setActiveItem}
            currentDate={currentDate}
            user={user}
            refreshPayoutStatus={refreshPayoutStatus}
            setTodayAmount={setTodayAmount}
          />
        )}
        {activeItem == 'history' && !createMode && (
          <UserTrend
            setActiveItem={setActiveItem}
            currentDate={currentDate}
            user={user}
          />
        )}
      </SelectedContainer>
    </Container>
  );
}

const Left = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Middle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  flex: 1;
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Bottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DateLeftRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 110%;
  color: #fefefe;
  padding: 0.25rem 1rem 1rem 1rem;
`;

const OptionContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
`;

const SelectedContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  min-height: 70vh;
  max-height: 70vh;
  background-color: ${COLOR_BACKGROUND};
`;
