import React, { useState, useEffect, useCallback, useMemo } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
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
      { field: "status", header: "Status" },
      { field: "name", header: "Name" },
      { field: "deadline", header: "Deadline" },
      { field: "plannedDate", header: "Planned Date" },
      { field: "duration", header: "Duration" },
      { field: "reoccurence", header: "Reoccurence" },
      { field: "priority", header: "Priority" },
      { field: "wantedDate", header: "Wanted Date" },
      { field: "category", header: "Category" },
      { field: "dependencies", header: "Dependencies" },
      { field: "uid", header: "UID" },
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
          // Revert the change in the local state if the update fails
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
    [db, selectedLists]
  );

  const onCellEditComplete = (e) => {
    let { rowData, newValue, field } = e;

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === rowData.id ? { ...task, [field]: newValue } : task
      )
    );

    updateFirestore(rowData.id, field, newValue);
  };

  const cellEditor = (options) => {
    if (options.field === "status") {
      return statusEditor(options);
    }
    return textEditor(options);
  };

  const textEditor = (options) => (
    <InputText
      type="text"
      value={options.value}
      onChange={(e) => options.editorCallback(e.target.value)}
    />
  );

  const statusEditor = (options) => (
    <Dropdown
      value={options.value}
      options={["Done", "Not started", "In progress"]}
      onChange={(e) => options.editorCallback(e.value)}
      placeholder="Select a Status"
      itemTemplate={(option) => (
        <Tag value={option} severity={getSeverity(option)}></Tag>
      )}
    />
  );

  const getSeverity = (value) => {
    switch (value) {
      case "Done":
        return "success";
      case "Not started":
        return "warning";
      case "In progress":
        return "info";
      default:
        return null;
    }
  };

  return (
    <div className="fixed top-0 right-0 w-full max-w-custom mx-auto">
      <DataTable value={tasks} editMode="cell" className="p-datatable-sm">
        {columns.map((col) => (
          <Column
            key={col.field}
            field={col.field}
            header={col.header}
            editor={(options) => cellEditor(options)}
            onCellEditComplete={onCellEditComplete}
            body={
              col.field === "status"
                ? (rowData) => {
                    return (
                      <Tag
                        value={rowData.status}
                        severity={getSeverity(rowData.status)}
                      />
                    );
                  }
                : undefined
            }
          />
        ))}
      </DataTable>
    </div>
  );
};

export default TaskTable;
