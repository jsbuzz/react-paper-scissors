import { defineEventType } from "../react-signal/event-hive/event-type";
import { basicEvent } from "../react-signal/event-hive/event";
import { Hand } from "../Hand";
import { READ_ONLY_CLONE } from "../react-signal/event-hive/dependencies/read-only";

export const HandEvent = defineEventType(
  {
    hand: Hand,
    player: String,
  },
  READ_ONLY_CLONE
);

export const RoundEvent = defineEventType({
  message: String,
  winner: String,
});

export const CountDownEvent = defineEventType({
  count: Number,
});

export const StartRound = basicEvent("Game:StartRound");
export const EndRound = basicEvent("Game:EndRound");
export const CountDown = CountDownEvent.withAlias("Game:CountDown");

export const ChooseHand = HandEvent.withAlias("Game:ChooseHand");
export const RoundResult = RoundEvent.withAlias("Game:RoundResult");
