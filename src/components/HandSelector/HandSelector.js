import React from "react";
import { Rock, Paper, Scissors, Lizard, Spock } from "../../Hand";
import { ChooseHand, StartRound } from "../../namespace/events";
import { useNamespace, useSelector } from "../../react-signal/hooks";

const handCoords = [
  { hand: Rock, coords: "175, 75, 60" },
  { hand: Paper, coords: "275, 155, 60" },
  { hand: Scissors, coords: "240, 275, 60" },
  { hand: Lizard, coords: "110, 275, 60" },
  { hand: Spock, coords: "75, 155, 60" },
];

export const inGameSelector = ({ sheldonState }) => sheldonState === "thinking";

export const HandSelector = () => {
  const { trigger } = useNamespace();
  const inGame = useSelector(inGameSelector);

  const onImageClick = () => inGame || trigger(StartRound);
  return (
    <div className="hand-selector" onClick={onImageClick}>
      <img
        className="hand-map"
        alt="start game"
        src="/sheldon/rock_paper_scissors_lizard_spock.jpg"
        title="start!"
        useMap="#hand-map"
      />

      <map name="hand-map">
        {handCoords.map(({ hand, coords }) => {
          return (
            <area
              key={hand.name}
              alt={hand.name}
              title={hand.name}
              shape="circle"
              coords={coords}
              onClick={() => {
                inGame && trigger(ChooseHand.with(hand, "player"));
              }}
            />
          );
        })}
      </map>
    </div>
  );
};
