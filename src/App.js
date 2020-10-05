import React from "react";
import NameSpace from "./react-signal/NameSpace";
import "./App.css";
import GameSpace from "./namespace/GameSpace";
import Sheldon from "./components/Sheldon";
import HandSelector from "./components/HandSelector";
import GameService from "./namespace/services/Game";
import Score from "./components/Score";
import GameMessage from "./components/GameMessage";
import Hand from "./components/Hand";

function App() {
  return (
    <div className="App">
      <NameSpace
        schema={GameSpace}
        name="GameSpace"
        services={[GameService]}
        debug
      >
        <GameMessage />

        <section id="stage">
          <div className="player" id="user">
            <Score player="player" />
            <div className="hands">
              <HandSelector />
            </div>
            <Hand player="player" />
          </div>
          <div className="player" id="sheldon">
            <Score player="sheldon" />
            <Sheldon />
            <Hand player="sheldon" />
          </div>
        </section>
      </NameSpace>
    </div>
  );
}

export default App;
