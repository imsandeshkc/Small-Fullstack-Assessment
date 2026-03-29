import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  return (
    <Routes>
      <Route
        path="/"
        element={
          token ? <Navigate to="/dashboard" /> : <Login setToken={setToken} />
        }
      />
      <Route
        path="/register"
        element={
          token ? (
            <Navigate to="/dashboard" />
          ) : (
            <Register setToken={setToken} />
          )
        }
      />
      <Route
        path="/dashboard"
        element={
          token ? <Dashboard setToken={setToken} /> : <Navigate to="/" />
        }
      />
    </Routes>
  );
}

export default App;