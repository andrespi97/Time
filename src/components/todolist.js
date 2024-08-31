import React, { useState } from "react";
import Sidebar from "./sidebar";
import TaskTable from "./taskTable";

const Todolist = ({
  auth,
  tasks,
  setTasks,
  db,
  listOfTask,
  calendarOfList,
}) => {
  const [selectedLists, setSelectedLists] = useState([]);
  return (
    <div className="w-screen">
      <Sidebar
        auth={auth}
        tasks={tasks}
        setTasks={setTasks}
        selectedLists={selectedLists}
        setSelectedLists={setSelectedLists}
      />
      <TaskTable
        initialTasks={tasks}
        db={db}
        listOfTask={listOfTask}
        calendarOfList={calendarOfList}
        selectedLists={selectedLists}
      />
    </div>
  );
};
export default Todolist;
