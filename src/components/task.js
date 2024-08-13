import React from "react";

const Task = ({ task }) => {
  return (
    <div>
      <h4>{task.name}</h4>
      <p>Status: {task.status}</p>
      <p>Start Date: {new Date(task.startDate).toLocaleDateString()}</p>
      <p>Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
      <p>Duration: {task.duration} days</p>
      <p>Priority: {task.priority}</p>
      <p>Category: {task.category}</p>
      <p>reoccur: {task.reoccur}</p>
      <p>wantedDone: {task.wantedDone}</p>
      <p>dependencies: {task.dependencies}</p>
    </div>
  );
};

export default Task;
