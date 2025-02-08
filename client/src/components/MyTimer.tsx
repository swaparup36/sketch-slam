import React from 'react';
import { useTimer } from 'react-timer-hook';

type MyTimerProps = {
  expiryTimestamp: Date;
};

const MyTimer: React.FC<MyTimerProps> = ({ expiryTimestamp }) => {
  const {
    seconds,
    minutes,
  } = useTimer({ expiryTimestamp, onExpire: () => console.warn('onExpire called') });

  return (
    <>
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
    </>
  );
};

export default MyTimer;