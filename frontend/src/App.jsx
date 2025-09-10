import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "@descope/react-sdk";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Results from "./pages/Results";
import "./App.css";
import CallbackAgent from "./pages/CallbackAgent";
import ConnectButton from "./pages/test";

function App() {
  const project_Id = import.meta.env.VITE_PROJECT_ID;

  return (
    <AuthProvider projectId={project_Id}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/results" element={<Results />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/callback/agent_a" element={<CallbackAgent />} />
          <Route path="/connect" element={<ConnectButton />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
