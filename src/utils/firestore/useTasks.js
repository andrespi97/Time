import { useState, useEffect } from "react";
import { db } from "../firebase"; // Ajusta la ruta según tu configuración
import { collection, getDocs } from "firebase/firestore";
import { auth } from "../firebase"; // Asegúrate de importar auth para obtener el UID

export const useTasks = () => {
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lists, setLists] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "calendars"));
        const userUid = auth.currentUser?.uid; // Obtener el UID del usuario autenticado

        if (!userUid) {
          throw new Error("No user is authenticated");
        }

        console.log("User UID:", userUid); // Verifica si UID se obtiene correctamente

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

    fetchTasks();
  }, []); // Dependencias vacías para que se ejecute solo una vez al montar el componente

  return { tareas, loading, error, lists };
};
