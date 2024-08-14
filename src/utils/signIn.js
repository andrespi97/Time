import React, { useState } from "react";
import { auth } from "./firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from "firebase/auth";

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const register = async () => {
    setLoading(true);
    setError("");
    const email = "andrespi97@hotmail.com";
    const password = "testing";
    if (!email || !password) {
      alert("Por favor, ingresa un correo electrónico y una contraseña.");
      setLoading(false);
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("Usuario registrado:", user);
    } catch (error) {
      const errorMessage = error.message;
      console.error("Error de registro:", errorMessage);
      setError("Error al registrar: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    setError("");
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      console.log("Usuario autenticado:", user);
    } catch (error) {
      const errorMessage = error.message;
      console.error("Error de autenticación con Google:", errorMessage);
      setError("Error al iniciar sesión con Google: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={register}>Regístrate con Email y Contraseña</button>
      <button onClick={signInWithGoogle}>Conéctate con Google</button>
    </div>
  );
};

export default SignIn;
