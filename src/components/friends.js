import React, { useState, useEffect } from "react";
import "./common/style.css";

function Friends(props) {
  const [users, setusers] = useState([]);

  useEffect(() => {
    props.socket.emit("users-list", "update-users");
    props.socket.on("users", (data) => {
      // get the list of users connected to server
      window.localStorage["users_count"] = data.length;
      setusers(data);
    });
  }, []);

  return (
    <div className="users-box">
      <div className="title">FRIENDS WATCHING</div>
      <div className="user-list">
        {users.map((user) => {
          return <Friend name={user} />;
        })}
      </div>
    </div>
  );
}

function Friend(props) {
  return <div className="friend-row">{props.name}</div>;
}

export default Friends;
