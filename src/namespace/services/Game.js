import { Hand } from "../../Hand";
import Service from "../../react-signal/Service";
import {
  ChooseHand,
  CountDown,
  EndRound,
  RoundResult,
  StartRound,
} from "../events";

const timeUnit = 800;

class Game extends Service {
  endRoundTimer = null;

  listen() {
    this.namespace().listen(StartRound, () => this.startRound());
  }

  startRound() {
    if (this.endRoundTimer) {
      clearTimeout(this.endRoundTimer);
      this.endRoundTimer = null;
    }

    this.namespace().trigger(CountDown.with(3));
    setTimeout(() => this.namespace().trigger(CountDown.with(2)), 1 * timeUnit);
    setTimeout(() => this.namespace().trigger(CountDown.with(1)), 2 * timeUnit);
    setTimeout(() => {
      const sheldonHand = Hand.draw();
      this.namespace().trigger(ChooseHand.with(sheldonHand, "sheldon"));

      const { playerHand } = this.namespace().state;
      const { winner, message } = this.getRoundResult(playerHand, sheldonHand);

      this.namespace().trigger(RoundResult.with(message, winner));
    }, 3 * timeUnit);

    this.endRoundTimer = setTimeout(
      () => this.namespace().trigger(EndRound),
      10 * timeUnit
    );
  }

  getRoundResult(playerHand, sheldonHand) {
    if (sheldonHand.beats(playerHand)) {
      return {
        message: "Sheldon wins! " + sheldonHand.beatString(playerHand),
        winner: "sheldon",
      };
    } else if (playerHand.name === sheldonHand.name) {
      return {
        message: "Huhh, that's a draw!",
        winner: "draw",
      };
    }

    return {
      message: "You won! " + playerHand.beatString(sheldonHand),
      winner: "player",
    };
  }
}

export default Game;
