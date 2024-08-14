import React, { useState } from "react";
import { auth } from "./firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

const AuthPage = () => {
  const [isSignIn, setIsSignIn] = useState(true); // Controlar si se está en la página de inicio de sesión o registro
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isSignIn) {
        // Iniciar sesión
        await signInWithEmailAndPassword(auth, email, password).then(
          (userCredential) => {
            // Signed up
            const user = userCredential.user;
            console.log("Usuario autenticado: " + user);
            // ...
          }
        );
        console.log("Usuario autenticado");
      } else {
        // Registrar
        await createUserWithEmailAndPassword(auth, email, password).then(
          (userCredential) => {
            // Signed up
            const user = userCredential.user;
            console.log(user);
            // ...
          }
        );
        console.log("Usuario registrado");
      }

      setEmail(""); // Limpiar campos
      setPassword("");
    } catch (error) {
      const errorMessage = error.message;
      console.error("Error:", errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      console.log("Usuario autenticado con Google");
    } catch (error) {
      const errorMessage = error.message;
      console.error("Error de autenticación con Google:", errorMessage);
      setError(errorMessage);
    }
  };

  return (
    <div className="auth-container">
      <h2>{isSignIn ? "Sign In" : "Register"}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <fieldset>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </fieldset>
        <fieldset>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </fieldset>
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : isSignIn ? "Sign In" : "Register"}
        </button>
      </form>
      <button onClick={handleGoogleSignIn} disabled={loading}>
        Sign In with Google
      </button>
      <button onClick={() => setIsSignIn(!isSignIn)}>
        {isSignIn
          ? "Need an account? Register"
          : "Already have an account? Sign In"}
      </button>
    </div>
  );
};

export default AuthPage;
