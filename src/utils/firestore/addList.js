import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useState } from "react";
import "primeicons/primeicons.css";
import { Button } from "primereact/button";
const AddList = ({ auth, calendars }) => {
  const [nombre, setNombre] = useState("");
  const [color, setColor] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCalendar, setSelectedCalendar] = useState();

  const addList = async (event) => {
    event.preventDefault();
    if (!selectedCalendar) {
      console.error("No calendar selected");
      return;
    }
    try {
      const calendarDoc = doc(db, "calendars", selectedCalendar);
      await addDoc(collection(calendarDoc, "lists"), {
        nombre: nombre,
        color: color,
        uid: auth.currentUser?.uid,
      });
      await updateDoc(calendarDoc, {
        lastUpdate: new Date(),
      });
      setIsModalOpen(false);
      setNombre("");
      setColor("");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        icon=""
        rounded
        text
        severity="success"
        aria-label="Add List"
      >
        Add List
      </Button>
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Añadir nueva lista</h2>
            <form onSubmit={addList}>
              <div>
                <label>
                  Calendario:
                  <select
                    value={selectedCalendar}
                    onChange={(e) => setSelectedCalendar(e.target.value)}
                    required
                  >
                    <option value={""} select="selected">
                      Select a Calendar
                    </option>
                    {calendars.map((calendar) => (
                      <option key={calendar.id} value={calendar.id}>
                        {calendar.data.nombre}
                        {calendar.id}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
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
    </>
  );
};

export default AddList;
