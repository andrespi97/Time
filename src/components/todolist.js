import React, { useState } from "react";

// Componente que representa una fila de la tabla
const TaskRow = ({ task }) => (
  <tr>
    <td className="p-2">{task.status}</td>
    <td className="p-2">{task.name}</td>
    <td className="p-2">{task.startDate.toDateString()}</td>
    <td className="p-2">{task.deadline.toDateString()}</td>
    <td className="p-2">{task.duration} days</td>
    <td className="p-2">{task.listOrigin}</td>
  </tr>
);

// Función para ordenar las tareas
const sortTasks = (tasks, sortBy, order) => {
  return [...tasks].sort((a, b) => {
    if (a[sortBy] < b[sortBy]) return order === "asc" ? -1 : 1;
    if (a[sortBy] > b[sortBy]) return order === "asc" ? 1 : -1;
    return 0;
  });
};

const ToDoList = ({ tasks }) => {
  const [sortBy, setSortBy] = useState("status"); // Columna por la que ordenar
  const [order, setOrder] = useState("asc"); // Orden ascendente o descendente

  const handleSort = (column) => {
    const newOrder = sortBy === column && order === "asc" ? "desc" : "asc";
    setSortBy(column);
    setOrder(newOrder);
  };

  const sortedTasks = sortTasks(tasks, sortBy, order);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th
              className="p-2 border-b cursor-pointer"
              onClick={() => handleSort("status")}
            >
              Status {sortBy === "status" ? (order === "asc" ? "" : "▼") : ""}
            </th>
            <th
              className="p-2 border-b cursor-pointer"
              onClick={() => handleSort("name")}
            >
              Name {sortBy === "name" ? (order === "asc" ? "▲" : "▼") : ""}
            </th>
            <th
              className="p-2 border-b cursor-pointer"
              onClick={() => handleSort("startDate")}
            >
              Start Date{" "}
              {sortBy === "startDate" ? (order === "asc" ? "▲" : "▼") : ""}
            </th>
            <th
              className="p-2 border-b cursor-pointer"
              onClick={() => handleSort("deadline")}
            >
              Deadline{" "}
              {sortBy === "deadline" ? (order === "asc" ? "▲" : "▼") : ""}
            </th>
            <th
              className="p-2 border-b cursor-pointer"
              onClick={() => handleSort("duration")}
            >
              Duration{" "}
              {sortBy === "duration" ? (order === "asc" ? "▲" : "▼") : ""}
            </th>
            <th
              className="p-2 border-b cursor-pointer"
              onClick={() => handleSort("listOrigin")}
            >
              List Origin{" "}
              {sortBy === "listOrigin" ? (order === "asc" ? "▲" : "▼") : ""}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedTasks.map((task, index) => (
            <TaskRow key={index} task={task} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ToDoList;
