import { useState, useEffect } from "react";
import {
  doc,
  collection,
  onSnapshot,
  where,
  query,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";

export const useCalendars = ({ auth }) => {
  const [calendars, setCalendars] = useState([]);
  const userUid = auth ? auth.currentUser?.uid : "noUserDetected";

  // recoger calendarios creados por el usuario autenticado
  useEffect(() => {
    // Iniciar la suscripción al snapshot de calendarios con el uid del creador
    const q = query(collection(db, "calendars"), where("uid", "==", userUid));
    const unsub = onSnapshot(q, async (querySnapshot) => {
      const updatedCalendars = [];

      // Limpiar el estado de calendarios antes de la actualización
      setCalendars([]);

      // Iterar en cada documento de calendars
      for (const doc of querySnapshot.docs) {
        // Obtener la colección "lists" de cada documento de calendario
        const listsQuery = query(collection(db, "calendars", doc.id, "lists"));
        const listsSnap = await getDocs(listsQuery);

        // Array para agregar las listas al calendario
        const lists = [];

        // Iterar en cada documento de la colección "lists"
        for (const listDoc of listsSnap.docs) {
          // Obtener la colección "tasks" dentro de cada lista
          const tasksQuery = query(
            collection(db, "calendars", doc.id, "lists", listDoc.id, "tasks")
          );
          const tasksSnap = await getDocs(tasksQuery);

          // Array para agregar las tareas a cada lista
          const tasks = [];

          // Iterar en cada documento de la colección "tasks"
          tasksSnap.forEach((taskDoc) => {
            tasks.push({
              id: taskDoc.id,
              data: taskDoc.data(),
            });
          });

          // Agregar la lista con sus tareas al array de listas
          lists.push({
            id: listDoc.id,
            data: listDoc.data(),
            tasks: tasks, // Agregamos las tareas a la lista
          });
        }

        // Crear el objeto calendario con la propiedad "lists"
        const calendar = {
          id: doc.id,
          data: doc.data(),
          lists: lists,
        };

        // Agregar el calendario actualizado al array de calendarios
        updatedCalendars.push(calendar);
      }

      // Actualizar el estado de los calendarios con los nuevos datos
      setCalendars((calendarios) => [...calendarios, ...updatedCalendars]);
    });

    // Cleanup: desuscribir cuando el componente se desmonta
    return () => unsub();
  }, [userUid]); // Ejecutar nuevamente si cambia el UID del usuario

  return { calendars };
};
