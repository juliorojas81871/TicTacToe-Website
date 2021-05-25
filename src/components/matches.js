import React, { useEffect, useState } from "react";
import "./common/style.css";

function Matches(props) {
  const [matches, setmatches] = useState(null);
  const [show, setshow] = useState(false);

  useEffect(() => {
    // to update the Previous matches if any change in database is made
    props.socket.emit("update-match-board", "update-leaderboad");
    props.socket.on("match-board", (data) => {
      data.sort((a, b) => {
        return b.time - a.time;
      }); // sort them
      setmatches(data);
    });
  }, []);

  // to toggle between the hide and show feature of this component
  const toggle = (e) => {
    setshow((state) => {
      return !state;
    });
  };

  return (
    <div>
      <div className="upper-head">
        <button className="LB-btn" onClick={toggle}>
          {" "}
          {show ? "Hide Previous Matches" : "Show Previous Matches"}{" "}
        </button>
      </div>
      {show && (
        <div className="ctable">
          <div className="table-title">
            <div className="ttitle-row"> PLAYER X </div>
            <div className="ttitle-row"> PLAYER O </div>
          </div>
          {matches !== null &&
            matches.map((match) => {
              return <Lrow playerx={match.playerx} playero={match.playero} />;
            })}
          {matches == null && <div> Loading... </div>}
        </div>
      )}
    </div>
  );
}

function Lrow(props) {
  return (
    <div className="Lrow">
      <>
        <div className="r-user"> {props.playerx} </div>
        <div className="r-user"> {props.playero} </div>
      </>
    </div>
  );
}

export default Matches;
