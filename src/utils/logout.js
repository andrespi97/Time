import { signOut } from "firebase/auth";
import { Button } from "react-aria-components";
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
      <Button onPress={logOut}>Log Out</Button>;
    </>
  );
};
export default LogOut;
