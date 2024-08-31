import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useState } from "react";
import "primeicons/primeicons.css";
import { Button } from "primereact/button";

const AddList = ({ auth, calendars }) => {
  const [nombre, setNombre] = useState("");
  const [color, setColor] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCalendar, setSelectedCalendar] = useState(calendars);

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
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-32 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        text
        aria-label="Add List"
      >
        Add List
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center w-screen bg-gray-600 bg-opacity-20">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <h6 className="mb-4 text-gray-800">Añadir nueva lista</h6>
            <form onSubmit={addList}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Calendario:
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={selectedCalendar}
                    onChange={(e) => setSelectedCalendar(e.target.value)}
                    required
                  >
                    <option value={""} disabled>
                      Selecciona un calendario
                    </option>
                    {calendars.map((calendar) => (
                      <option
                        key={calendar.id}
                        value={calendar.id}
                        className="text-center"
                      >
                        {calendar.data.nombre}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre:
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-center"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </label>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color:
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-center"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    required
                  />
                </label>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Añadir
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
