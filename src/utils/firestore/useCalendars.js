import { useState, useEffect } from "react";
import { collection, onSnapshot, where, query } from "firebase/firestore";
import { db } from "../firebase";

export const useCalendars = ({ auth }) => {
  const [calendars, setCalendars] = useState([]);
  const userUid = auth ? auth.currentUser?.uid : "noUserDetected";

  useEffect(() => {
    const calendarQuery = query(
      collection(db, "calendars"),
      where("uid", "==", userUid)
    );

    const unsubscribeCalendars = onSnapshot(
      calendarQuery,
      (calendarSnapshot) => {
        const updatedCalendars = calendarSnapshot.docs.map((calendarDoc) => {
          const calendarData = {
            id: calendarDoc.id,
            data: calendarDoc.data(),
            lists: [],
          };

          const listQuery = collection(
            db,
            "calendars",
            calendarDoc.id,
            "lists"
          );

          const unsubscribeLists = onSnapshot(listQuery, (listSnapshot) => {
            const updatedLists = listSnapshot.docs.map((listDoc) => {
              const listData = {
                id: listDoc.id,
                data: listDoc.data(),
                tasks: [],
              };

              const taskQuery = collection(
                db,
                "calendars",
                calendarDoc.id,
                "lists",
                listDoc.id,
                "tasks"
              );

              const unsubscribeTasks = onSnapshot(taskQuery, (taskSnapshot) => {
                const updatedTasks = taskSnapshot.docs.map((taskDoc) => ({
                  id: taskDoc.id,
                  data: taskDoc.data(),
                }));

                listData.tasks = updatedTasks;
                setCalendars((prevCalendars) => {
                  const updatedCalendars = prevCalendars.map((cal) => {
                    if (cal.id === calendarData.id) {
                      const updatedLists = cal.lists.map((list) =>
                        list.id === listData.id ? listData : list
                      );
                      return { ...cal, lists: updatedLists };
                    }
                    return cal;
                  });
                  return updatedCalendars;
                });
              });

              listData.unsubscribeTasks = unsubscribeTasks;
              return listData;
            });

            calendarData.lists = updatedLists;
            setCalendars((prevCalendars) => {
              const index = prevCalendars.findIndex(
                (cal) => cal.id === calendarData.id
              );
              if (index !== -1) {
                const newCalendars = [...prevCalendars];
                newCalendars[index] = calendarData;
                return newCalendars;
              } else {
                return [...prevCalendars, calendarData];
              }
            });
          });

          calendarData.unsubscribeLists = unsubscribeLists;
          return calendarData;
        });

        setCalendars(updatedCalendars);
      }
    );

    return () => {
      unsubscribeCalendars();
      calendars.forEach((calendar) => {
        calendar.unsubscribeLists();
        calendar.lists.forEach((list) => list.unsubscribeTasks());
      });
    };
  }, [userUid]);

  return { calendars };
};
