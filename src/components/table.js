import { useState } from "react";
import { writeBatch, doc } from "firebase/firestore";
import { db } from "../utils/firebase";
const Table = ({ tasks, setSelectedLists, setTasks }) => {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [batch, setBatch] = useState(writeBatch(db));
  const [filteredTasks, setFilteredTasks] = useState(tasks);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }

    const sortedTasks = [...tasks].sort((a, b) => {
      if (a[column] < b[column]) return sortDirection === "asc" ? -1 : 1;
      if (a[column] > b[column]) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    setTasks(sortedTasks);
  };

  const handleCellEdit = (taskId, column, value) => {
    setEditingCell({ taskId, column });
    setEditValue(value);
  };

  const handleEditSave = () => {
    const updatedTasks = tasks.map((task) =>
      task.id === editingCell.taskId
        ? { ...task, [editingCell.column]: editValue }
        : task
    );
    setTasks(updatedTasks);

    // Add to batch
    setBatch((prev) => [
      ...prev,
      { taskId: editingCell.taskId, [editingCell.column]: editValue },
    ]);

    setEditingCell(null);
    setEditValue("");

    // Commit batch after 5 seconds of inactivity or when editing another task
    setTimeout(() => {
      commitBatch();
    }, 5000);
  };

  const commitBatch = async () => {
    if (batch.length > 0) {
      // Commit the batch
      await batch.commit();
      setBatch([]);
    }
  };
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          {[
            "name",
            "category",
            "deadline",
            "dependencies",
            "duration",
            "plannedDate",
            "priority",
            "reoccurence",
            "status",
            "wantedDate",
          ].map((column) => (
            <th
              key={column}
              className="border p-2 cursor-pointer"
              onClick={() => handleSort(column)}
            >
              {column.charAt(0).toUpperCase() + column.slice(1)}
              {sortColumn === column && (sortDirection === "asc" ? " ▲" : " ▼")}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task.id}>
            {[
              "name",
              "category",
              "deadline",
              "dependencies",
              "duration",
              "plannedDate",
              "priority",
              "reoccurence",
              "status",
              "wantedDate",
            ].map((column) => (
              <td
                key={`${task.id}-${column}`}
                className="border p-2"
                onClick={() =>
                  handleCellEdit(task.id, column, task.data[column])
                }
              >
                {editingCell?.taskId === task.id &&
                editingCell?.column === column ? (
                  <input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={handleEditSave}
                    autoFocus
                  />
                ) : (
                  task.data[column]
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
