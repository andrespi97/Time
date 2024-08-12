import ToDoList from "./components/todolist";

function App() {
  const tasks = [
    {
      status: "in progress",
      name: "Task 1",
      startDate: new Date("2024-08-01"),
      deadline: new Date("2024-08-10"),
      duration: 10,
      listOrigin: "List A",
    },
    // Añade más tareas aquí
  ];

  return (
    <div className="bg-gray-100 flex items-center justify-center h-screen bg-libreta">
      <ToDoList tasks={tasks} />
    </div>
  );
}

export default App;
