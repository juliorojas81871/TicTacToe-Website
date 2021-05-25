import React, { useState, useEffect, useReducer } from "react";
import "./common/style.css";

// Assigns the user as Player or Spectator
const Marking = (ID) => {
  if (ID === 1) return "X";
  else if (ID === 2) return "O";
  else return null;
};

var hault = false,
  restarted = false;

function Game(props) {
  const [mark, setmark] = useState(Marking(props.uid)); // Mark that the user can mark on game board on click
  const [mat, setmat] = useState(Array(9).fill(null)); // initial game state
  const [started, setstarted] = useState(false); // check for start of the game i.e if users count is more than 2
  const [last_move_by, setlast_move_by] = useState("O"); // Determines whose turn currently it is

  const resetAll = async () => {
    await setmat(Array(9).fill(null)); // [null, null, ...]
    setlast_move_by("O");
    restarted = true;
    hault = false;
  };

  setInterval(() => {
    // to check if to start the game or not
    if (window.localStorage["users_count"] >= 2 && !started) {
      setstarted(true);
    }
  }, 1000);

  useEffect(() => {
    props.socket.on("game-play", (data) => {
      // executed when other player clicks
      setmat(data); // update the game state (Matrix) i.e the array of size 9
      let m = mark === "X" ? "O" : "X";
      setlast_move_by(m); // update whose turn is currently
    });
    props.socket.on("gamemode", (mode) => {
      // Haults the game when the game is over and wait till restart is clicked
      if (mode === "H") {
        hault = true;
      } else {
        resetAll();
      }
    });
  }, []);

  const handle_click = (e) => {
    // executed Local Player first
    if (
      mark === null ||
      started === false ||
      last_move_by === mark ||
      hault === true
    )
      return;
    let pos = e.target.id; // get the position clicked
    if (mat[pos] === null) {
      let ar = mat;
      ar[pos] = mark;
      setmat(ar); // update game state (matrix) game-board
      props.socket.emit("my-move", ar); // update the player move to all clients
      setlast_move_by(mark);
      let won = calculateWinner(ar); // check if this move leads to a win
      if (won) {
        props.socket.emit("winner", won); // if this player wins update score
        props.socket.emit("game-state", "GO"); // update game mode : GO = Game Over
        hault = true;
      }
    } else console.log("ALready selected");
  };

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    for (let i = 0; i < 9; i++) {
      if (squares[i] === null) return null;
    }
    return "D";
  }

  return (
    <div>
      <div className="board">
        <Square pos={0} val={mat[0]} click_handler={handle_click} />
        <Square pos={1} val={mat[1]} click_handler={handle_click} />
        <Square pos={2} val={mat[2]} click_handler={handle_click} />
        <Square pos={3} val={mat[3]} click_handler={handle_click} />
        <Square pos={4} val={mat[4]} click_handler={handle_click} />
        <Square pos={5} val={mat[5]} click_handler={handle_click} />
        <Square pos={6} val={mat[6]} click_handler={handle_click} />
        <Square pos={7} val={mat[7]} click_handler={handle_click} />
        <Square pos={8} val={mat[8]} click_handler={handle_click} />
      </div>
      {last_move_by === "O" ? (
        <MsgBox display={"Player X Turn"} />
      ) : (
        <MsgBox display={"Player O Turn"} />
      )}
    </div>
  );
}

function Square(props) {
  return (
    <div>
      <button id={props.pos} className="cell" onClick={props.click_handler}>
        {props.val}
      </button>
    </div>
  );
}

function MsgBox(props) {
  return <div className="game-msg-box">{props.display}</div>;
}

export default Game;
