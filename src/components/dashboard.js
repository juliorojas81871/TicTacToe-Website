import React, { useState, useEffect } from "react";
import "./common/style.css";

function giveStatus(id) {
  if (id === 1) return "Player X";
  else if (id === 2) return "Player O";
  else return "Spectator";
}

function Dashboard(props) {
  const [id, setid] = useState(props.uid);
  const [uname, setuname] = useState(props.name);
  const [status, setstatus] = useState(giveStatus(id));
  const [scoreX, setscoreX] = useState(0);
  const [scoreO, setscoreO] = useState(0);
  const [winner, setwinner] = useState(null);

  useEffect(() => {
    props.socket.on("score", (data) => {
      // update the score id someone wins
      if (data === "X") {
        setscoreX((state) => {
          return state + 1;
        });
        setwinner("PLAYER " + data + " WON!!!");
      } else if (data === "O") {
        setscoreO((state) => {
          return state + 1;
        });
        setwinner("PLAYER " + data + " WON!!!");
      } else {
        setwinner("MATCH WAS A DRAW");
      }
    });
    props.socket.on("gamemode", (mode) => {
      if (mode === "C") setwinner(null);
    });
  }, []);

  const restart = (e) => {
    // Restart the game if cicked
    console.log("restart");
    setwinner(null);
    props.socket.emit("game-state", "RG"); // RG = Restart Game
  };

  return (
    <div className="dashboard-box">
      <div className="inner-row">
        <div className="user-info">{uname}</div>
        <div className="status-msg-box">{status}</div>
      </div>
      <div className="score-box">
        <b>SCOREBOARD</b>
        <div className="player">
          {"Player X : "} {scoreX}
        </div>
        <div className="player">
          {"Player O : "} {scoreO}
        </div>
      </div>
      {winner && (
        <div className="winner-box">
          {winner}
          <button onClick={restart}>RESTART</button>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
