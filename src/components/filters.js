const [filteredTasks, setFilteredTasks] = useState();
const handleStatusChange = (taskId, newStatus) => {
  setFilteredTasks((prevTasks) =>
    prevTasks.map((task) =>
      task.id === taskId ? { ...task, status: newStatus } : task
    )
  );
};

const filterTasks = (criterio) => {
  const now = new Date();
  let startOfWeek, endOfWeek, startOfNextWeek, endOfNextWeek;

  const startOfToday = new Date(now.setHours(0, 0, 0, 0));
  now.setDate(now.getDate() - now.getDay() + 1); // Ajustar al inicio de la semana
  startOfWeek = new Date(now.setHours(0, 0, 0, 0));
  endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  startOfNextWeek = new Date(endOfWeek);
  startOfNextWeek.setDate(endOfWeek.getDate() + 1);
  endOfNextWeek = new Date(startOfNextWeek);
  endOfNextWeek.setDate(endOfNextWeek.getDate() + 6);

  let filtered;

  switch (criterio) {
    case "today":
      filtered = filteredTasks.filter((task) => {
        const deadline = new Date(task.deadline);
        return deadline <= startOfToday; // Muestra hoy y anteriores
      });
      break;
    case "tomorrow":
      const startOfTomorrow = new Date(startOfToday);
      startOfTomorrow.setDate(startOfToday.getDate() + 1);
      filtered = filteredTasks.filter((task) => {
        const deadline = new Date(task.deadline);
        return deadline <= startOfTomorrow; // Muestra mañana y anteriores
      });
      break;
    case "withinWeek":
      filtered = filteredTasks.filter((task) => {
        const deadline = new Date(task.deadline);
        return deadline <= endOfWeek; // Muestra esta semana y anteriores
      });
      break;
    case "nextWeek":
      filtered = filteredTasks.filter((task) => {
        const deadline = new Date(task.deadline);
        return deadline >= startOfNextWeek && deadline <= endOfNextWeek; // Muestra solo la próxima semana
      });
      break;
    default:
      filtered = filteredTasks;
  }
  setFilteredTasks(filtered);
};
