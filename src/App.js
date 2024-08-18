import React, { useState, useEffect } from "react";
import { auth } from "./utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import AuthPage from "./utils/authPage";
import LogOut from "./utils/logout";
import { useTasks } from "./utils/firestore/useTasks";
import AddCalendar from "./utils/firestore/addCalendar";
import { useCalendars } from "./utils/firestore/useCalendars";
const App = () => {
  const [user, setUser] = useState(null); // Estado para almacenar el usuario autenticado
  const [filteredTasks, setFilteredTasks] = useState();
  const { tareas, loading, error, lists } = useTasks();
  const { calendars } = useCalendars(user);
  console.table(calendars);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  //actualiza tareas de la base de datos, si todo va bien
  useEffect(() => {
    if (!loading && tareas) {
      setFilteredTasks(tareas);
    }
  }, [tareas, loading]);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleStatusChange = (taskId, newStatus) => {
    setFilteredTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const filterTasks = (criterio) => {
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

    switch (criterio) {
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

  return (
    <>
      {user ? (
        <>
          <AddCalendar />
          <LogOut auth={auth} />
        </>
      ) : (
        <>
          <AuthPage />
        </>
      )}
    </>
  );
};

export default App;
