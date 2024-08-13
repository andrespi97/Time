import React from "react";
import Task from "./task";

const List = ({ list }) => {
  return (
    <div style={{ backgroundColor: list.color }}>
      <h3>{list.name}</h3>
      {list.tasks.map((task) => (
        <Task key={task.id} task={task} />
      ))}
    </div>
  );
};

export default List;
