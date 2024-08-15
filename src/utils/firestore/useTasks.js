import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase"; // Asegúrate de importar auth para obtener el UID

export const useTasks = () => {
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lists, setLists] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        // Si el usuario está autenticado, carga las tareas
        fetchTasks(user.uid);
      } else {
        // Si el usuario no está autenticado, limpia las tareas
        setTareas([]);
        setLists([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchTasks = async (userUid) => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "calendars"));

      const tasksArray = [];
      const listsArray = [];

      querySnapshot.docs.forEach((doc) => {
        const calendarData = doc.data();

        if (
          calendarData.owner?.toString().trim() === userUid.toString().trim()
        ) {
          calendarData.lists.forEach((list) => {
            listsArray.push(list); // Almacena las listas
            if (list.tasks) {
              tasksArray.push(
                ...list.tasks.map((task) => ({
                  id: task.id,
                  name: task.name,
                  status: task.status,
                  listId: list.id, // Agrega ID de lista a cada tarea
                }))
              );
            }
          });
        }
      });
      setLists(listsArray);
      setTareas(tasksArray);
    } catch (err) {
      setError(err.message || "Failed to fetch tasks");
      console.error("Error fetching tasks:", err); // Log de errores
    } finally {
      setLoading(false);
    }
  };

  return { tareas, loading, error, lists };
};
