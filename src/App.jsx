import { Home } from "./Components/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { Navbar } from "./Components/Navbar";
import { EmployeeLogin } from "./Components/EmployeeLogin";
import { AdminLogin } from "./Components/AdminLogin";
import { LeaveRequest } from "./Components/LeaveRequest";
import { CheckRequest } from "./Components/CheckRequest";
import { AdminPanel } from "./Components/AdminPanel";
import { Tabs } from "./Components/Tabs";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/employee-login" element={<EmployeeLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/leave-request" element={<LeaveRequest />} />
          <Route path="/check-request" element={<CheckRequest />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
          <Route path="/tabs" element={<Tabs />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
