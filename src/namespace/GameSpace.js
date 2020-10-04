import { EmptyHand } from "../Hand";
import { READ_ONLY_CLONE } from "../react-signal/event-hive/dependencies/read-only";
import {
  NameSpace,
  InitState,
  set,
} from "../react-signal/event-hive/namespace";
import { StartRound, ChooseHand, RoundResult, EndRound } from "./events";

const GameSpace = NameSpace.schema(
  () => ({
    sheldonState: [
      InitState,
      EndRound,
      set("ready"),

      StartRound,
      set("thinking"),

      RoundResult,
      () => ({ winner }) => {
        if (winner === "draw") {
          return "ready";
        }

        return winner === "sheldon" ? "wins" : "looses";
      },
    ],

    playerHand: [
      InitState,
      StartRound,
      set(EmptyHand),

      ChooseHand,
      (playerHand) => ({ hand, player }) =>
        player === "player" ? hand : playerHand,
    ],
    playerScore: [
      InitState,
      set(0),

      RoundResult,
      (playerScore) => ({ winner }) =>
        winner === "player" ? 1 + playerScore : playerScore,
    ],

    sheldonScore: [
      InitState,
      set(0),

      RoundResult,
      (sheldonScore) => ({ winner }) =>
        winner === "sheldon" ? 1 + sheldonScore : sheldonScore,
    ],
  }),
  true,
  READ_ONLY_CLONE
);

window.GameSpace = GameSpace;

export default GameSpace;
