import { collection, addDoc, doc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useState } from "react";
import { Button } from "primereact/button";
const AddTask = ({ auth, calendars, setTasks, tasks }) => {
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [plannedDate, setPlannedDate] = useState("");
  const [duration, setDuration] = useState("");
  const [reoccurence, setReoccurence] = useState("");
  const [priority, setPriority] = useState("");
  const [wantedDate, setWantedDate] = useState("");
  const [category, setCategory] = useState("");
  const [dependencies, setDependencies] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCalendar, setSelectedCalendar] = useState(
    calendars.length > 0 ? calendars[0].id : ""
  );
  const [selectedList, setSelectedList] = useState("");

  const addTask = async (event) => {
    event.preventDefault();
    if (!selectedCalendar || !selectedList) {
      console.error("No calendar or list selected");
      return;
    }

    try {
      const listDoc = doc(
        db,
        "calendars",
        selectedCalendar,
        "lists",
        selectedList
      );
      const tarea = doc(collection(listDoc, "tasks"));
      await setDoc(tarea, {
        status,
        name,
        deadline,
        plannedDate,
        duration,
        reoccurence,
        priority,
        wantedDate,
        category,
        dependencies,
        uid: auth.currentUser?.uid,
      });
      setTasks([
        ...tasks,
        {
          id: tarea.id,
          data: {
            status,
            name,
            deadline,
            plannedDate,
            duration,
            reoccurence,
            priority,
            wantedDate,
            category,
            dependencies,
          },
        },
      ]);
      const calDoc = doc(db, "calendars", selectedCalendar);
      await updateDoc(calDoc, {
        lastUpdate: new Date(),
      });
      setIsModalOpen(false);
      // Clear fields
      setStatus("");
      setName("");
      setDeadline("");
      setPlannedDate("");
      setDuration("");
      setReoccurence("");
      setPriority("");
      setWantedDate("");
      setCategory("");
      setDependencies("");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  function findItemById(array, id) {
    return array.find((item) => item.id === id);
  }

  const lists = selectedCalendar
    ? findItemById(calendars, selectedCalendar)?.lists || []
    : [];
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
        Add Task
      </Button>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Añadir nueva tarea</h2>
            <form onSubmit={addTask}>
              <div>
                <label>
                  Calendario:
                  <select
                    value={selectedCalendar}
                    onChange={(e) => setSelectedCalendar(e.target.value)}
                    required
                  >
                    <option value="">Selecciona un Calendario</option>
                    {calendars.map((calendar) => (
                      <option key={calendar.id} value={calendar.id}>
                        {calendar.data.nombre}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div>
                <label>
                  Lista:
                  <select
                    value={selectedList}
                    onChange={(e) => setSelectedList(e.target.value)}
                    required
                  >
                    <option value="">Selecciona una Lista</option>
                    {lists ? (
                      lists.map((list) => (
                        <option key={list.id} value={list.id}>
                          {list.data.nombre}
                        </option>
                      ))
                    ) : (
                      <option value="">No hay listas disponibles</option>
                    )}
                  </select>
                </label>
              </div>
              <div>
                <label>
                  Nombre:
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </label>
              </div>
              <div>
                <label>
                  Estado:
                  <input
                    type="text"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    required
                  />
                </label>
              </div>
              <div>
                <label>
                  Fecha límite:
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                  />
                </label>
              </div>
              <div>
                <label>
                  Fecha planificada:
                  <input
                    type="date"
                    value={plannedDate}
                    onChange={(e) => setPlannedDate(e.target.value)}
                  />
                </label>
              </div>
              <div>
                <label>
                  Duración:
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </label>
              </div>
              <div>
                <label>
                  Repetición:
                  <input
                    type="text"
                    value={reoccurence}
                    onChange={(e) => setReoccurence(e.target.value)}
                  />
                </label>
              </div>
              <div>
                <label>
                  Prioridad:
                  <input
                    type="text"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  />
                </label>
              </div>
              <div>
                <label>
                  Fecha deseada:
                  <input
                    type="date"
                    value={wantedDate}
                    onChange={(e) => setWantedDate(e.target.value)}
                  />
                </label>
              </div>
              <div>
                <label>
                  Categoría:
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </label>
              </div>
              <div>
                <label>
                  Dependencias:
                  <input
                    type="text"
                    value={dependencies}
                    onChange={(e) => setDependencies(e.target.value)}
                  />
                </label>
              </div>
              <div>
                <button type="submit">Añadir</button>
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

export default AddTask;
