export const data = {
  calendars: [
    {
      id: "1",
      name: "Work",
      color: "#f0f0f0",
      lists: [
        {
          id: "1",
          name: "Project A",
          color: "#e0e0e0",
          tasks: [
            {
              id: "1",
              status: "in progress",
              name: "Task 1",
              startDate: "2024-08-01",
              deadline: "2024-08-07",
              duration: 7,
              listName: "Project A",
              reoccur: "daily",
              priority: "high",
              wantedDone: "2024-08-07",
              category: "development",
              dependencies: ["Task 2", "Task 3"],
            },
            // Más tareas si es necesario
          ],
        },
      ],
    },
    {
      id: "2",
      name: "Personal",
      color: "#d0f0d0",
      lists: [
        {
          id: "2",
          name: "Grocery List",
          color: "#c0f0c0",
          tasks: [
            {
              id: "2",
              status: "not started",
              name: "Buy Milk",
              startDate: "2024-08-02",
              deadline: "2024-08-05",
              duration: 3,
              listName: "Grocery List",
              reoccur: "none",
              priority: "medium",
              wantedDone: "2024-08-05",
              category: "chores",
              dependencies: "",
            },
            {
              id: "3",
              status: "completed",
              name: "Buy Bread",
              startDate: "2024-08-01",
              deadline: "2024-08-02",
              duration: 1,
              listName: "Grocery List",
              reoccur: "none",
              priority: "low",
              wantedDone: "2024-08-02",
              category: "chores",
              dependencies: ["abs", "abc"],
            },
          ],
        },
      ],
    },
  ],
};
