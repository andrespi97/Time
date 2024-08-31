import React from "react";

const ViewMenu = ({ setView }) => {
  return (
    <div className="flex flex-col h-1/2 justify-end">
      <ul className="space-y-2 font-medium">
        <li>
          <a
            href="#"
            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <span className="flex-1 text-center whitespace-nowrap">
              <span className="pi pi-sign-out mr-3" />
              <button
                value="tasktable"
                onClick={(e) => setView(e.currentTarget.value)}
                className="w-32 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                aria-label="Switch to Planner View"
              >
                ToDoList
              </button>
            </span>
          </a>
        </li>
        <li>
          <a
            href="#"
            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <span className="flex-1 text-center whitespace-nowrap">
              <span className="pi pi-sign-out mr-3" />
              <button
                value="planner"
                onClick={(e) => setView(e.currentTarget.value)}
                className="w-32 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                aria-label="Switch to Planner View"
              >
                Planner
              </button>
            </span>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default ViewMenu;
