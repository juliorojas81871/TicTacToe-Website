import React, { useEffect, useState } from "react";
import "./common/style.css";

var leader_data = [];

function Leaderboard(props) {
  const [leaders, setleaders] = useState(null);
  const [show, setshow] = useState(false);

  useEffect(() => {
    // to update the leaderboard if any change in database is made
    props.socket.emit("update-leader-board", "update-leaderboad");
    props.socket.on("leader-board", (data) => {
      // console.log("data : ", data);
      data.sort((a, b) => {
        return b.score - a.score;
      }); // sort them
      setleaders(data);
      leader_data = data;
    });
  }, []);

  // to toggle between the hide and show feature of this component
  const toggle = (e) => {
    setshow((state) => {
      return !state;
    });
  };
  const filter = () => {
    let opt = document.getElementById("filter-option").value;
    // console.log("Typed : ", opt);
    let temp = [];
    leader_data.forEach((leader) => {
      if (leader.username.includes(opt)) temp.push(leader);
    });
    setleaders(temp);
  };

  return (
    <div>
      <div className="upper-head">
        <button className="LB-btn" onClick={toggle}>
          {" "}
          {show ? "Hide Leaderboard" : "Show Leaderboard"}{" "}
        </button>
        {show && (
          <input id="filter-option" placeholder="filter by" onChange={filter} />
        )}
      </div>
      {/* <button className="LB-btn" onClick={toggle}> {show?"Hide Leaderboard":"Show Leaderboard" }  </button> */}
      {show && (
        <div className="ctable">
          <div className="table-title">
            <div className="ttitle-row"> PLAYER </div>
            <div className="ttitle-row"> SCORE </div>
          </div>
          {leaders !== null &&
            leaders.map((ldr) => {
              return <Lrow leader={ldr} username={props.name} />;
            })}
          {leaders == null && <div> Loading... </div>}
        </div>
      )}
    </div>
  );
}

function Lrow(props) {
  return (
    <div className="Lrow">
      {props.leader.username !== props.username ? (
        <>
          <div className="r-user"> {props.leader.username} </div>
          <div className="r-user"> {props.leader.score} </div>
        </>
      ) : (
        <>
          <div className="r-user-highlighted"> {props.leader.username} </div>
          <div className="r-user-highlighted"> {props.leader.score} </div>
        </>
      )}
    </div>
  );
}

export default Leaderboard;
