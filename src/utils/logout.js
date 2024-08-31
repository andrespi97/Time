import { signOut } from "firebase/auth";

const LogOut = ({ auth }) => {
  const logOut = async () => {
    signOut(auth)
      .then(() => {
        alert("LoggedOut.");
        // Sign-out successful.
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.error("Error logout:", errorMessage);
        alert(errorMessage);
      });
  };
  return (
    <>
      <button
        onClick={logOut}
        className="w-32 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Log Out
      </button>
    </>
  );
};
export default LogOut;
