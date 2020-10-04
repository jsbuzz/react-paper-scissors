import React, { useState } from "react";
import { StartRound, ChooseHand, EndRound } from "../../namespace/events";
import { useListeners } from "../../react-signal/hooks";

export const Hand = ({ player }) => {
  const [handName, setHandname] = useState("");
  const myHand = (p) => p === player;

  useListeners(
    StartRound,
    EndRound,
    () => setHandname(""),

    ChooseHand,
    ({ hand, player }) => myHand(player) && setHandname(hand.name)
  );

  return <div className="hand-title">{handName}</div>;
};
