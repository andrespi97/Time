import AddCalendar from "../utils/firestore/addCalendar";
import LogOut from "../utils/logout";
import { calendars, useCalendars } from "../utils/firestore/useCalendars";
import AddList from "../utils/firestore/addList";
import AddTask from "../utils/firestore/addTask";
const Dashboard = ({ auth }) => {
  const { calendars } = useCalendars({ auth });
  return (
    <div>
      <AddList auth={auth} calendars={calendars} />
      <AddCalendar auth={auth} />
      <AddTask auth={auth} calendars={calendars} />
      <LogOut auth={auth} />
    </div>
  );
};
export default Dashboard;
