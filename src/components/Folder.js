import React from 'react';
import './Folder.css';

const Folder = ({ folder, onItemClick }) => {
  return (
    <div className="folder">
      <h3>{folder.name}</h3>
      <div className="folder-content">
        {folder.items.map((item) => (
          <button key={item.id} onClick={() => onItemClick(item)}>
            <img src={item.icon} alt={item.name} />
            <p>{item.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Folder;
