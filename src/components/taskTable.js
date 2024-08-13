import React from "react";

// Componente para mostrar una fila de la tabla de tareas
const TaskRow = ({ task }) => {
  // Asegúrate de que las fechas se conviertan a objetos Date si no lo son
  const startDate = new Date(task.startDate);
  const deadline = new Date(task.deadline);
  const wantedDone = new Date(task.wantedDone);
  const dependencies = Array.isArray(task.dependencies)
    ? task.dependencies
    : [task.dependencies]; // Convertir a array si no es uno

  return (
    <tr>
      <td className="p-4 border border-gray-300">{task.id}</td>
      <td className="p-4 border border-gray-300">{task.status}</td>
      <td className="p-4 border border-gray-300">{task.name}</td>
      <td className="p-4 border border-gray-300">{startDate.toDateString()}</td>
      <td className="p-4 border border-gray-300">{deadline.toDateString()}</td>
      <td className="p-4 border border-gray-300">{task.duration}</td>
      <td className="p-4 border border-gray-300">{task.listName}</td>
      <td className="p-4 border border-gray-300">
        {task.reoccur ? "Yes" : "No"}
      </td>
      <td className="p-4 border border-gray-300">{task.priority}</td>
      <td className="p-4 border border-gray-300">
        {wantedDone.toDateString()}
      </td>
      <td className="p-4 border border-gray-300">{task.category}</td>
      <td className="p-4 border border-gray-300">{dependencies.join(", ")}</td>
    </tr>
  );
};

// Componente principal que renderiza la tabla de tareas
const TaskTable = ({ tasks }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="p-4 border-b border-gray-300">ID</th>
            <th className="p-4 border-b border-gray-300">Status</th>
            <th className="p-4 border-b border-gray-300">Name</th>
            <th className="p-4 border-b border-gray-300">Start Date</th>
            <th className="p-4 border-b border-gray-300">Deadline</th>
            <th className="p-4 border-b border-gray-300">Duration</th>
            <th className="p-4 border-b border-gray-300">List Name</th>
            <th className="p-4 border-b border-gray-300">Reoccur</th>
            <th className="p-4 border-b border-gray-300">Priority</th>
            <th className="p-4 border-b border-gray-300">Wanted Done</th>
            <th className="p-4 border-b border-gray-300">Category</th>
            <th className="p-4 border-b border-gray-300">Dependencies</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <TaskRow key={task.id} task={task} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
