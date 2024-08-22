import React, { useState, useEffect } from "react";
import { auth } from "./utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import AuthPage from "./utils/authPage";
import Dashboard2 from "./components/dashboard2";

const App = () => {
  const [user, setUser] = useState(null); // Estado para almacenar el usuario autenticado

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  //actualiza tareas de la base de datos, si todo va bien

  return (
    <>
      {user ? (
        <>
          <Dashboard2 auth={auth} />
        </>
      ) : (
        <>
          <AuthPage />
        </>
      )}
    </>
  );
};

export default App;
