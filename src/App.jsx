import { Home } from "./Components/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./Components/Navbar";
import { EmployeeLogin } from "./Components/EmployeeLogin";
import { AdminLogin } from "./Components/AdminLogin";
import { LeaveRequest } from "./Components/LeaveRequest";
import { ReviewRequest } from "./Components/ReviewRequest";
import AdminPanel from "./Components/AdminPanel";
import { ApproverLogin } from "./Components/ApproverLogin";
import { ApproverPanel } from "./Components/ApproverPanel";
import { EmployeeReview } from "./Components/EmpReview";
import { EmployeePanel } from "./Components/EmployeePanel";
import { Footer } from "./Components/Footer";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/employee-login" element={<EmployeeLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/approver-login" element={<ApproverLogin />} />
          <Route path="/leave-request" element={<LeaveRequest />} />
          <Route path="/review-request" element={<ReviewRequest />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
          <Route path="/employee-review" element={<EmployeeReview />} />
          <Route path="/approver-panel" element={<ApproverPanel />} />
          <Route path="/employee-panel" element={<EmployeePanel />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
