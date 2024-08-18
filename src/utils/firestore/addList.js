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

const AddList = () => {
  const [nombre, setNombre] = useState("");
  const [color, setColor] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  //añadir calendario
  const addList = async (event) => {
    event.preventDefault();
    try {
      const docRef = await addDoc(collection(db, "calendars", "lists"), {
        nombre: nombre,
        color: color,
        uid: auth.currentUser?.uid,
      });
      console.log("Document written with ID: ", docRef.id);
      setIsModalOpen(false); // Cerrar el modal después de agregar
      setNombre("");
      setColor("");
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
      <button onClick={() => setIsModalOpen(true)}>Añadir calendario</button>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Añadir Nuevo Calendario</h2>
            <form onSubmit={addList}>
              <div>
                <label>
                  Nombre:
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
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
                    required
                  />
                </label>
              </div>
              <div>
                <button type="submit">Add</button>
                <button type="button" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddList;
