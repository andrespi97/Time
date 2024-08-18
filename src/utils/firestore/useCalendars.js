//obtener tareas tiempo real

import { useState, useEffect } from "react";
import { doc, collection, onSnapshot, where, query } from "firebase/firestore";
import { db } from "../firebase";

export const useCalendars = ({ auth }) => {
  const [calendars, setCalendars] = useState([]);
  const [calendarIds, setCalendarIds] = useState([]);
  const [lists, setLists] = useState([]);
  const [tasks, setTasks] = useState([]);
  //implementar estados de carga y erorr
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  const userUid = auth ? auth.currentUser?.uid : "noUserDetected";
  console.log("useCalendars");
  console.log(auth.currentUser?.uid);

  // recoger calendarios creados por el usuario autenticado
  useEffect(() => {
    // Iniciar la suscripción al snapshot
    const q = query(collection(db, "calendars"), where("uid", "==", userUid));
    const unsub = onSnapshot(q, (querySnapshot) => {
      const updatedCalendars = [];
      setCalendars([]);
      querySnapshot.forEach((doc) => {
        updatedCalendars.push(doc.data());
      });
      setCalendars((prevCalendars) => [...prevCalendars, ...updatedCalendars]);
    });
    // Cleanup: desuscribir cuando el componente se desmonta
    return () => unsub();
  }, []); // Dependencias vacías para que se ejecute una vez al montar

  return { calendars };
};
