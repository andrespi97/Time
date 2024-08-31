import React, { useState } from "react";
import Sidebar from "./sidebar";
import TaskTable from "./taskTable";
import Planner from "./planner";
const Todolist = ({
  auth,
  tasks,
  setTasks,
  db,
  listOfTask,
  calendarOfList,
  setView,
  view,
}) => {
  const [selectedLists, setSelectedLists] = useState([]);
  let viewComponent;
  switch (view) {
    case "planner":
      viewComponent = (
        <Planner
          tasks={tasks}
          setTasks={setTasks}
          calendarOfList={calendarOfList}
          listOfTask={listOfTask}
        />
      );
      break;
    default:
      viewComponent = (
        <TaskTable
          initialTasks={tasks}
          db={db}
          listOfTask={listOfTask}
          calendarOfList={calendarOfList}
          selectedLists={selectedLists}
        />
      );
      break;
  }

  return (
    <>
      <>
        <Sidebar
          auth={auth}
          tasks={tasks}
          setTasks={setTasks}
          selectedLists={selectedLists}
          setSelectedLists={setSelectedLists}
          setView={setView}
          view={view}
        />
        {viewComponent}
      </>
    </>
  );
};
export default Todolist;
