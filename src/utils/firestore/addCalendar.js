import {
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase"; // Asegúrate de importar auth para obtener el UID
import { useState } from "react";

const AddCalendar = () => {
  const [nombre, setNombre] = useState("");
  const [color, setColor] = useState("");
  //user autenticado siempre

  //añadir calendario
  const addCalendar = async (event) => {
    event.preventDefault();
    try {
      const docRef = await addDoc(collection(db, "calendars"), {
        nombre: nombre,
        color: color,
        uid: auth.currentUser?.uid,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  const delCalendar = async (event) => {
    event.preventDefault();
    try {
      const docRef = await await deleteDoc(doc(db, "calendars", "test"));
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  const updCalendar = async (event) => {
    event.preventDefault();
    const washingtonRef = doc(db, "calendars", "r0BQ85XtLRqJgCvlvj9Z");
    await updateDoc(washingtonRef, {
      name: "trabajo",
    });
  };
  return (
    <div>
      <form onSubmit={updCalendar}>
        <div>
          <label>
            Nombre:
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Color:
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </label>
        </div>
        <button type="submit">crear calendario</button>
      </form>
    </div>
  );
};
export default AddCalendar;
