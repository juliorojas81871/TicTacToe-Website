import React from "react";
import "./style.css";

function Loading() {
  return (
    <div className="body">
      <div className="loading">
        <div className="dot1"></div>
        <div className="dot2"></div>
        <div className="dot3"></div>
        <div className="dot4"></div>
      </div>
      <div className="loading-quote">Loading</div>
    </div>
  );
}

export default Loading;
