import React from "react";
import "./DesktopIcon.css";

const DesktopIcon = ({ name, icon, onDoubleClick }) => {
  return (
    <div className="desktop-icon" onDoubleClick={onDoubleClick}>
      <div className="icon">{icon}</div>
      <div className="icon-text">{name}</div>
    </div>
  );
};

export default DesktopIcon;