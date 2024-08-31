import React, { useState, useEffect, useCallback, useMemo } from "react";
import { doc, updateDoc } from "firebase/firestore";
import debounce from "lodash/debounce";

const TaskTable = ({
  initialTasks,
  db,
  listOfTask,
  calendarOfList,
  selectedLists,
}) => {
  const [tasks, setTasks] = useState(() =>
    initialTasks.map((task) => ({
      ...task.data,
      id: task.id,
    }))
  );
  const [loadingTasks, setLoadingTasks] = useState({});

  useEffect(() => {
    setTasks(
      initialTasks.map((task) => ({
        ...task.data,
        id: task.id,
      }))
    );
  }, [initialTasks]);

  const columns = useMemo(
    () => [
      { field: "status", header: "Status", width: "w-48" },
      { field: "name", header: "Name", noWrap: true, width: "w-80" },
      { field: "deadline", header: "Deadline", noWrap: true, width: "w-40" },
      {
        field: "plannedDate",
        header: "Planned Date",
        noWrap: true,
        width: "w-40",
      },
      {
        field: "wantedDate",
        header: "Wanted Date",
        noWrap: true,
        width: "w-40",
      },
      { field: "duration", header: "Duration" },
      { field: "reoccurence", header: "Re...", width: "w-5" },
      { field: "priority", header: "Priority" },
      { field: "category", header: "Cat..." },
      { field: "dependencies", header: "Dep..." },
    ],
    []
  );

  const updateFirestore = useCallback(
    debounce(async (taskId, field, value) => {
      setLoadingTasks((prev) => ({ ...prev, [taskId]: true }));
      const lista = listOfTask(taskId, selectedLists);
      const calendario = calendarOfList(lista);

      if (calendario && lista) {
        try {
          const taskRef = doc(
            db,
            "calendars",
            calendario,
            "lists",
            lista,
            "tasks",
            taskId
          );

          await updateDoc(taskRef, { [field]: value });
          console.log("Document successfully updated!");
        } catch (error) {
          console.error("Error updating document: ", error);
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task.id === taskId ? { ...task, [field]: task[field] } : task
            )
          );
        } finally {
          setLoadingTasks((prev) => ({ ...prev, [taskId]: false }));
        }
      }
    }, 500),
    [db, selectedLists, listOfTask, calendarOfList]
  );

  const handleCellChange = (taskId, field, value) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, [field]: value } : task
      )
    );

    updateFirestore(taskId, field, value);
  };

  const renderCell = (task, column) => {
    const value = task[column.field];

    const inputClasses =
      "w-full bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1";
    const selectClasses =
      "w-full bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500";

    switch (column.field) {
      case "status":
        return (
          <select
            value={value}
            onChange={(e) =>
              handleCellChange(task.id, column.field, e.target.value)
            }
            className={selectClasses}
          >
            <option value="Done">Done</option>
            <option value="Not started">Not started</option>
            <option value="In progress">In progress</option>
          </select>
        );
      case "priority":
        return (
          <select
            value={value}
            onChange={(e) =>
              handleCellChange(task.id, column.field, e.target.value)
            }
            className={selectClasses}
          >
            <option value="Have to do">Have to do</option>
            <option value="Should do">Should do</option>
            <option value="Want to do">Want to do</option>
          </select>
        );
      case "deadline":
      case "plannedDate":
      case "wantedDate":
        return (
          <input
            type="date"
            value={formatDate(value)}
            onChange={(e) =>
              handleCellChange(task.id, column.field, e.target.value)
            }
            className={inputClasses}
          />
        );
      case "duration":
        return (
          <input
            type="number"
            value={value ? value.replace("h", "") : "0"}
            onChange={(e) => {
              const newValue = `${e.target.value}h`;
              handleCellChange(task.id, column.field, newValue);
            }}
            className={inputClasses}
          />
        );
      // return `${value || 0} h`;
      default:
        return (
          <input
            type="text"
            value={value || ""}
            onChange={(e) =>
              handleCellChange(task.id, column.field, e.target.value)
            }
            className={inputClasses}
          />
        );
    }
  };
  // Función para convertir el valor al formato yyyy-MM-dd
  function formatDate(dateStr) {
    if (!dateStr) return "";

    // Verificar si la fecha ya está en formato yyyy-MM-dd
    if (dateStr.includes("-")) {
      return dateStr;
    }

    const [day, month, year] = dateStr.split("/");

    // Asegurarse de que los componentes de la fecha sean válidos
    if (day && month && year) {
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }

    return ""; // Retorna una cadena vacía si el formato es incorrecto
  }
  return (
    <div className="flex  ml-4 mr-4 mt-4 p-4 bg-white shadow-2xl shadow-black rounded-lg overflow-hidden w-full">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse table-auto">
          <thead>
            <tr className="bg-blue-100">
              {columns.map((column) => (
                <th
                  key={column.field}
                  className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider "
                >
                  <h5 className="leading-5 text-blue-950">{column.header}</h5>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td
                    key={`${task.id}-${column.field}`}
                    className={`px-4 py-2 ${
                      column.noWrap ? "whitespace-nowrap" : "whitespace-normal"
                    }${column.width ? ` ${column.width}` : ""}`}
                  >
                    {renderCell(task, column)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskTable;
