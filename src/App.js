import React, { useState, useEffect } from "react";
import { auth } from "./utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import TaskTable from "./components/taskTable";
import AuthPage from "./utils/authPage";
import LogOut from "./utils/logout";
import { useTasks } from "./utils/firestore/useTasks";
import Header from "./components/Header";
import ListSelector from "./components/listSelector";

const App = () => {
  const [selectedListIds, setSelectedListIds] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [user, setUser] = useState(null); // Estado para almacenar el usuario autenticado
  const { tareas, loading, error, lists } = useTasks();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading && tareas) {
      setFilteredTasks(tareas);
    }
  }, [tareas, loading]);

  useEffect(() => {
    if (tareas.length > 0) {
      // Filtra las tareas según las listas seleccionadas
      setFilteredTasks(
        selectedListIds.length > 0
          ? tareas.filter((task) => selectedListIds.includes(task.listId))
          : tareas
      );
    }
  }, [selectedListIds, tareas]);

  const handleStatusChange = (taskId, newStatus) => {
    setFilteredTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const filterTasks = (criteria) => {
    const now = new Date();
    let startOfWeek, endOfWeek, startOfNextWeek, endOfNextWeek;

    const startOfToday = new Date(now.setHours(0, 0, 0, 0));
    now.setDate(now.getDate() - now.getDay() + 1); // Ajustar al inicio de la semana
    startOfWeek = new Date(now.setHours(0, 0, 0, 0));
    endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    startOfNextWeek = new Date(endOfWeek);
    startOfNextWeek.setDate(endOfWeek.getDate() + 1);
    endOfNextWeek = new Date(startOfNextWeek);
    endOfNextWeek.setDate(endOfNextWeek.getDate() + 6);

    let filtered;

    switch (criteria) {
      case "today":
        filtered = filteredTasks.filter((task) => {
          const deadline = new Date(task.deadline);
          return deadline <= startOfToday; // Muestra hoy y anteriores
        });
        break;
      case "tomorrow":
        const startOfTomorrow = new Date(startOfToday);
        startOfTomorrow.setDate(startOfToday.getDate() + 1);
        filtered = filteredTasks.filter((task) => {
          const deadline = new Date(task.deadline);
          return deadline <= startOfTomorrow; // Muestra mañana y anteriores
        });
        break;
      case "withinWeek":
        filtered = filteredTasks.filter((task) => {
          const deadline = new Date(task.deadline);
          return deadline <= endOfWeek; // Muestra esta semana y anteriores
        });
        break;
      case "nextWeek":
        filtered = filteredTasks.filter((task) => {
          const deadline = new Date(task.deadline);
          return deadline >= startOfNextWeek && deadline <= endOfNextWeek; // Muestra solo la próxima semana
        });
        break;
      default:
        filtered = filteredTasks;
    }

    setFilteredTasks(filtered);
  };

  const handleSelectList = (id) => {
    setSelectedListIds((prev) => {
      const newSelection = prev.includes(id)
        ? prev.filter((listId) => listId !== id)
        : [...prev, id];
      return newSelection;
    });
  };

  const handleSelectAll = () => {
    setSelectedListIds(lists.map((list) => list.id));
  };

  const handleClearFilters = () => {
    setFilteredTasks(tareas); // quita filtros de tiempo
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {user ? (
        <>
          <Header
            onSelectAll={handleSelectAll}
            onClearFilters={handleClearFilters}
            onFilter={filterTasks}
          />
          <ListSelector
            lists={lists}
            selectedListIds={selectedListIds}
            onSelectList={handleSelectList}
          />
          <TaskTable
            tasks={filteredTasks}
            onStatusChange={handleStatusChange}
          />
          <LogOut auth={auth} />
        </>
      ) : (
        <AuthPage />
      )}
    </div>
  );
};

export default App;
