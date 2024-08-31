import React, { useEffect } from "react";
import { useCalendars } from "../utils/firestore/useCalendars";
import AddList from "../utils/firestore/addList";
import AddTask from "../utils/firestore/addTask";
import LogOut from "../utils/logout";

import { ToggleButton } from "primereact/togglebutton";

const Sidebar = ({
  auth,
  tasks,
  setTasks,
  selectedLists,
  setSelectedLists,
}) => {
  const { calendars } = useCalendars({ auth });

  useEffect(() => {
    const fetchTasks = () => {
      try {
        const updatedTasks = selectedLists.reduce((acc, list) => {
          // Combina las tareas de todas las listas seleccionadas
          return [...acc, ...list.tasks];
        }, []);

        // Filtra tareas duplicadas por ID
        const uniqueTasks = updatedTasks.filter(
          (task, index, self) =>
            index === self.findIndex((t) => t.id === task.id)
        );

        setTasks(uniqueTasks);
      } catch (error) {
        console.error("Error fetching tasks: ", error);
      }
    };

    fetchTasks();
  }, [selectedLists, setTasks]);

  const handleCheckboxChange = (list) => {
    setSelectedLists((prev) => {
      const isSelected = prev.some((selected) => selected.id === list.id);
      if (isSelected) {
        return prev.filter((selected) => selected.id !== list.id);
      } else {
        return [...prev, list];
      }
    });
  };

  return (
    <div className="">
      <button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <aside
        id="default-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li>
              <a className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <span
                  className="pi pi-list-check"
                  style={{ fontSize: "2.488rem" }}
                ></span>
                {/* listas */}
                <span className="inline-flex items-center justify-center px-2 ms-3  text-gray-800  rounded-full  dark:text-gray-300">
                  <h2 className="mb-1">Lists</h2>
                </span>
              </a>
            </li>

            {calendars.map((calendar) =>
              calendar.lists.map((list) => (
                <li key={list.id} className="flex mb-1 w-full">
                  {/* este div es prime react */}
                  <div className="card flex justify-content-center w-full">
                    <ToggleButton
                      onLabel={list.data.nombre}
                      offLabel={list.data.nombre}
                      onIcon="pi pi-check"
                      offIcon="pi pi-times"
                      checked={selectedLists.some(
                        (selected) => selected.id === list.id
                      )}
                      onChange={() => handleCheckboxChange(list)}
                      className="w-9rem truncate w-full"
                    />
                  </div>
                </li>
              ))
            )}

            <li>
              <a
                href="#"
                className="flex items-center  p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <span className="flex-1 text-center whitespace-nowrap ">
                  <span className="pi pi-folder-plus mr-2" />
                  <AddList auth={auth} calendars={calendars} />
                </span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center justify-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <span className="flex-1 text-center whitespace-nowrap">
                  <span className="pi pi-file-plus mr-2" />
                  <AddTask
                    auth={auth}
                    calendars={calendars}
                    setTasks={setTasks}
                    tasks={tasks}
                  />
                </span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <svg
                  className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 18"
                >
                  <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">example</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <span className="flex-1 text-center whitespace-nowrap">
                  <span className="pi pi-sign-out mr-3" />
                  <LogOut auth={auth} />
                </span>
              </a>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
