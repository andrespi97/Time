import { collection, doc, updateDoc, setDoc } from "firebase/firestore";
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
      const deadlineTimestamp = new Date(deadline).getTime();
      const plannedDateTimestamp = new Date(plannedDate).getTime();
      const wantedDateTimestamp = new Date(wantedDate).getTime();
      await setDoc(tarea, {
        status,
        name,
        deadline: deadlineTimestamp,
        plannedDate: plannedDateTimestamp,
        duration,
        reoccurence,
        priority,
        wantedDate: wantedDateTimestamp,
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
            deadline: deadlineTimestamp,
            plannedDate: plannedDateTimestamp,
            duration,
            reoccurence,
            priority,
            wantedDate: wantedDateTimestamp,
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
        rounded
        text
        severity="success"
        aria-label="Add Task"
      >
        Add Task
      </Button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center w-screen bg-gray-600 bg-opacity-20">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
              Añadir nueva tarea
            </h2>
            <form onSubmit={addTask}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Calendario:
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lista:
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={selectedList}
                    onChange={(e) => setSelectedList(e.target.value)}
                    required
                  >
                    <option value="">Selecciona una Lista</option>
                    {lists.length > 0 ? (
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

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre:
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </label>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado:
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    required
                  />
                </label>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha límite:
                  <input
                    type="date"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                  />
                </label>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha planificada:
                  <input
                    type="date"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={plannedDate}
                    onChange={(e) => setPlannedDate(e.target.value)}
                  />
                </label>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duración:
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </label>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Repetición:
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={reoccurence}
                    onChange={(e) => setReoccurence(e.target.value)}
                  />
                </label>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prioridad:
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  />
                </label>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha deseada:
                  <input
                    type="date"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={wantedDate}
                    onChange={(e) => setWantedDate(e.target.value)}
                  />
                </label>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría:
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </label>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dependencias:
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={dependencies}
                    onChange={(e) => setDependencies(e.target.value)}
                  />
                </label>
              </div>
              <div className="mb-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-300 text-white rounded-md hover:bg-green-400 transition ease-out"
                >
                  Añadir
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition ease-out"
                  onClick={() => setIsModalOpen(false)}
                >
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
