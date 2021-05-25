import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./common/style.css";
import Game from "./game";
import Friends from "./friends";
import Dashboard from "./dashboard";
import Loading from "./common/loading";
import Leaderboard from "./leaderboard";
import Matches from "./matches";

// establish socket connection
// const socket = io("http://localhost:8081"); // web-socket - development
const socket = io(); // web-socket

function MainApp() {
  // states
  const [name, setname] = useState(null);
  const [ready, setready] = useState(false);
  const [id, setid] = useState(null);
  const [isvalid, setisvalid] = useState(true);
  const [users_count, setusers_count] = useState(0);

  // extra variables
  var uname;
  window.localStorage.setItem("users_count", "0"); // stores locally the number of users connected to server

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected");
    });
    socket.on("disconnect", (reason) => {
      console.log("Disconnected");
    });
    socket.on("reconnect_attempt", () => {
      console.log("Reconnecting...");
    });
    socket.on("user-status", (data) => {
      if (data === -1) {
        // to prevent having same username in a game
        setisvalid(false);
        // console.log("Same name user");
      } else {
        setid(data);
        setisvalid(true);
      }
      // Returns the id of the user which is basically
      // says if user is player X or player Y or Spectator
    });
    setready(true); // Loads the main UI
  }, []);

  const connect2server = (e) => {
    uname = document.getElementById("username").value;
    if (uname.trim() !== "") {
      setname(uname); // Take the username entered by the user
      socket.emit("join", uname); // add new users to server variable
    } else {
      alert("Invalid Username!!"); // if user entered null string or only spaces as input
    }
  };

  return (
    <div>
      {!ready && <Loading />}
      {ready && (
        <div className="body">
          <div className="header">tic tac toe</div>
          {(name === null || isvalid === false) && (
            <TakeUserName handler={connect2server} valid={isvalid} />
          )}
          {id !== null && (
            <div className="row">
              <div className="col-4">
                <Dashboard name={name} uid={id} socket={socket} />
                <div className="border-line"></div>
                <Matches socket={socket} />
              </div>
              <div className="col-4">
                <Game uid={id} socket={socket} />
              </div>
              <div className="col-4">
                <Friends socket={socket} />
                <div className="border-line"></div>
                <Leaderboard name={name} socket={socket} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TakeUserName(props) {
  return (
    <div className="input-box">
      <input id="username" placeholder="username" />
      <button type="submit" onClick={props.handler}>
        submit
      </button>
      {props.valid === false && (
        <div className="game-msg-box">
          {" "}
          User with this username has already joined in!!{" "}
        </div>
      )}
    </div>
  );
}

export default MainApp;
