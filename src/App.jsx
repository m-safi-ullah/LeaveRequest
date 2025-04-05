import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./Components/Navbar";
import AuthenticateToken from "./Components/ContextApi/AuthenticateToken";
import AuthGuard from "./Components/ContextApi/AuthGuard";
import { Footer } from "./Components/Footer";
import Home from "./Components/Home";
import LeaveRequest from "./Components/LeaveRequest";
import ReviewRequest from "./Components/ReviewRequest";
import Login from "./Components/Login";
import ForgotPassword from "./Components/ForgotPassword";
import Dashboard from "./Components/Dashboard";
import NotFound404 from "./Components/NotFound404";

function App() {
  return (
    <Router>
      <Navbar />
      <AuthenticateToken />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/review-request" element={<ReviewRequest />} />
        <Route
          path="/dashboard"
          element={
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          }
        />
        <Route path="/leave-request" element={<LeaveRequest />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<NotFound404 />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
