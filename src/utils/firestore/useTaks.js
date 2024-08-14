import { useState, useEffect } from "react";
import { db } from "../firebase"; // Ajusta la ruta según tu configuración
import { collection, getDocs } from "firebase/firestore";

const useTasks = () => {
  const [tareas, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "tasks"));
        const tasksArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(tasksArray);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return { tareas, loading, error };
};

export default useTasks;
