import AddCalendar from "../utils/firestore/addCalendar";
import LogOut from "../utils/logout";
import { calendars, useCalendars } from "../utils/firestore/useCalendars";
const Dashboard = ({ auth }) => {
  console.log("dashboard");

  console.log(auth.currentUser?.uid);

  const { calendars } = useCalendars({ auth });
  console.log(calendars);

  return (
    <div>
      <AddCalendar auth={auth} />
      <LogOut auth={auth} />
    </div>
  );
};
export default Dashboard;
