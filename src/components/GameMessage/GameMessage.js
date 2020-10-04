import React, { useState } from "react";
import { CountDown, EndRound, RoundResult } from "../../namespace/events";
import { useListeners } from "../../react-signal/hooks";

export const GameMessage = () => {
  const defaultMessage =
    "Do you want to play Rock Paper Scissors Lizard Spock?";
  const [message, setMessage] = useState(defaultMessage);
  useListeners(
    RoundResult,
    ({ message }) => setMessage(message),

    CountDown,
    ({ count }) => setMessage(`Choose a hand in ${count}`),

    EndRound,
    () => setMessage(defaultMessage)
  );

  return <h1>{message}</h1>;
};
