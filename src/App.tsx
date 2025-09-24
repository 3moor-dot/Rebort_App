import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LogIn/log_in";
import "./App.css";
import AgencyDashboard from "./components/Agency/dashboard";
import CreateDecition from "./components/Agency/create_decision";
import PendingDeclarations from "./components/Governor/pending_declarations";
import RespondedDeclarations from "./components/Governor/responded_declarations";
import GovernorDashboard from "./components/Governor/dashboard";
import AdminDashboard from "./components/Admain/dashboard";
import Decisions from "./components/Decision/decision";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        {/* Governor Dashboard مع Nested Routes */}
        <Route path="/governor-dashboard" element={<GovernorDashboard />}>
          <Route index element={<PendingDeclarations />} /> {/* default */}
          <Route path="pending-declarations" element={<PendingDeclarations />} />
          <Route path="responded-declarations" element={<RespondedDeclarations />} />
        </Route>

        {/* باقي الـ routes */}
        <Route path="/agency-dashboard" element={<AgencyDashboard />} />
        <Route path="/create-decition" element={<CreateDecition />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/decision/:id" element={<Decisions />} />
      </Routes>
    </Router>
  );
}

export default App;
