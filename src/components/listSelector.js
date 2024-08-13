import React from "react";

const ListSelector = ({ lists, selectedListIds, onSelectList }) => {
  return (
    <div>
      {lists.map((list) => (
        <div key={list.id}>
          <input
            type="checkbox"
            id={`list-${list.id}`}
            checked={selectedListIds.includes(list.id)}
            onChange={() => onSelectList(list.id)}
          />
          <label htmlFor={`list-${list.id}`}>{list.name}</label>
        </div>
      ))}
    </div>
  );
};

export default ListSelector;
