import React from "react";

export const Score = ({ player, playerScore, sheldonScore }) => (
  <div className="score">
    {player === "sheldon" ? sheldonScore : playerScore}
  </div>
);

export const mapStateToProps = ({ playerScore, sheldonScore }) => ({
  playerScore,
  sheldonScore,
});
