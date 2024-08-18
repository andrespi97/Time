//obtener tareas tiempo real

import { useState, useEffect } from "react";
import { doc, collection, onSnapshot, where, query } from "firebase/firestore";
import { db, auth } from "../firebase";

export const useCalendars = ({ user }) => {
  const [calendars, setCalendars] = useState([]);
  const [calendarIds, setCalendarIds] = useState([]);
  const [lists, setLists] = useState([]);
  const [tasks, setTasks] = useState([]);
  const userUid = user ? user.uid : " ";

  // recoger calendarios creados por el usuario autenticado
  useEffect(() => {
    // Iniciar la suscripción al snapshot
    const q = query(collection(db, "calendars"), where("uid", "==", userUid));
    const unsub = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setCalendars(...calendars, doc.data());
        console.log("Current data: ", querySnapshot.data());
      });
    });
    // Cleanup: desuscribir cuando el componente se desmonta
    return () => unsub();
  }, [userUid]); // Dependencias vacías para que se ejecute una vez al montar

  return { calendars };
};
