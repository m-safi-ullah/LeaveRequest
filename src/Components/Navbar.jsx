import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../Images/logo1.png";

export const Navbar = () => {
  const navigate = useNavigate();

  const [adminLogin, setAdminLogin] = useState(true);
  const [empLogin, setEmpLogin] = useState(true);
  const [appLogin, setAppLogin] = useState(true);

  const [AdminName, setAdminName] = useState("");
  const [EmployeeName, setEmployeeName] = useState("");
  const [ApproverName, setApproverName] = useState("");

  useEffect(() => {
    const AdminUsername = localStorage.getItem("Catering Admin Username");
    const AdminPassword = localStorage.getItem("Catering Admin Password");
    const ApproverUsername = localStorage.getItem("Catering Approver Username");
    const ApproverPassword = localStorage.getItem("Catering Approver Password");
    const EmployeeUsername = localStorage.getItem("Catering Employee Username");
    const EmployeePassword = localStorage.getItem("Catering Employee Password");

    setAdminName(localStorage.getItem("Catering Admin Name"));
    setApproverName(localStorage.getItem("Catering Approver Name"));
    setEmployeeName(localStorage.getItem("Catering Employee Name"));

    if (AdminUsername && AdminPassword) {
      setTimeout(() => {
        localStorage.removeItem("Catering Admin Username");
        localStorage.removeItem("Catering Admin Password");
        localStorage.removeItem("Catering Admin Name");
        navigate("/admin-login");
        window.location.reload();
      }, 1800000);
      setAdminLogin(false);
    } else {
      setAdminLogin(true);
    }

    if (ApproverUsername && ApproverPassword) {
      setTimeout(() => {
        localStorage.removeItem("Catering Approver Username");
        localStorage.removeItem("Catering Approver Password");
        localStorage.removeItem("Catering Approver Name");
        navigate("/approver-login");
        window.location.reload();
      }, 1800000);
      setAppLogin(false);
    } else {
      setAppLogin(true);
    }

    if (EmployeeUsername && EmployeePassword) {
      setTimeout(() => {
        localStorage.removeItem("Catering Employee Username");
        localStorage.removeItem("Catering Employee Password");
        localStorage.removeItem("Catering Employee Name");
        navigate("/approver-login");
        window.location.reload();
      }, 1800000);
      setEmpLogin(false);
    } else {
      setEmpLogin(true);
    }
  }, [navigate]);

  const adminLink = () => {
    localStorage.removeItem("Catering Admin Username");
    localStorage.removeItem("Catering Admin Password");
    localStorage.removeItem("Catering Admin Name");
    navigate("/admin-login");
    window.location.reload();
  };

  const approverLink = () => {
    localStorage.removeItem("Catering Approver Username");
    localStorage.removeItem("Catering Approver Password");
    localStorage.removeItem("Catering Approver Name");
    navigate("/approver-login");
    window.location.reload();
  };

  const employeeLink = () => {
    localStorage.removeItem("Catering Employee Username");
    localStorage.removeItem("Catering Employee Password");
    localStorage.removeItem("Catering Employee Name");
    navigate("/approver-login");
    window.location.reload();
  };

  return (
    <div className="header">
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          <Link className="navbar-brand logoWidth" to="/">
            <img src={logo} className="logo" alt="Company Logo" />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse flex-column align-items-end"
            id="navbarNavDropdown"
          >
            <ul className="navbar-nav gap-1">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/">
                  Home
                </Link>
              </li>

              {/* Employee */}
              {adminLogin && (
                <div className="m-auto">
                  {empLogin && (
                    <Link className="nav-link " to="/employee-login">
                      <li className="nav-item btn btn-outline-danger">
                        Employee Login
                      </li>
                    </Link>
                  )}
                  {!empLogin && (
                    <li className="nav-item dropdown">
                      <Link
                        className="nav-link dropdown-toggle"
                        to="#"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Hi, {EmployeeName}
                      </Link>
                      <ul className="dropdown-menu">
                        <li>
                          <Link className="dropdown-item" to="/employee-panel">
                            Employee Panel
                          </Link>
                        </li>
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/leave-request">
                            Request a Leave
                          </Link>
                        </li>
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                        <li>
                          <Link
                            className="dropdown-item"
                            onClick={employeeLink}
                          >
                            Logout
                          </Link>
                        </li>
                      </ul>
                    </li>
                  )}
                </div>
              )}

              {/* Approvers */}
              {adminLogin && (
                <div className="m-auto">
                  {appLogin && (
                    <Link className="nav-link" to="/approver-login">
                      <li className="nav-item btn btn-danger">
                        Approver Login
                      </li>
                    </Link>
                  )}
                  {!appLogin && (
                    <li className="nav-item dropdown">
                      <Link
                        className="nav-link dropdown-toggle"
                        to="#"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Hi, {ApproverName}
                      </Link>
                      <ul className="dropdown-menu">
                        <li>
                          <Link className="dropdown-item" to="/approver-panel">
                            Approver Panel
                          </Link>
                        </li>
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                        <li>
                          <Link
                            className="dropdown-item"
                            onClick={approverLink}
                          >
                            Logout
                          </Link>
                        </li>
                      </ul>
                    </li>
                  )}
                </div>
              )}

              {/*Admin */}
              {appLogin && empLogin && (
                <div className="m-auto">
                  {adminLogin && (
                    <Link className="nav-link m-auto" to="/admin-login">
                      <li className="nav-item btn btn-danger">
                        <i className="fa-solid fa-user-tie"></i>
                      </li>
                    </Link>
                  )}
                  {!adminLogin && (
                    <li className="nav-item dropdown">
                      <Link
                        className="nav-link dropdown-toggle"
                        to="#"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Hi, {AdminName}
                      </Link>
                      <ul className="dropdown-menu">
                        <li>
                          <Link className="dropdown-item" to="/admin-panel">
                            Admin Panel
                          </Link>
                        </li>
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                        <li>
                          <Link className="dropdown-item" onClick={adminLink}>
                            Logout
                          </Link>
                        </li>
                      </ul>
                    </li>
                  )}
                </div>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};
