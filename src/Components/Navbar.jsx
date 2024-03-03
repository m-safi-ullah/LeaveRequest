import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import logo from "../Images/logo1.png";

export const Navbar = () => {
  const navigate = useNavigate();

  const [adminBtnStyle, setAdminBtnStyle] = useState({ display: "flex" });
  const [employeeBtnStyle, setEmployeeBtnStyle] = useState({ display: "flex" });
  const [adminStyle, setAdminStyle] = useState();
  const [employeeStyle, setEmployeeStyle] = useState();

  useEffect(
    () => {
      const AdminUsername = localStorage.getItem("Catering Admin Username");
      const AdminPassword = localStorage.getItem("Catering Admin Password");

      const EmployeeUsername = localStorage.getItem(
        "Catering Employee Username"
      );
      const EmployeePassword = localStorage.getItem(
        "Catering Employee Password"
      );
      if (AdminUsername && AdminPassword) {
        setAdminBtnStyle({ display: "none" });
        setAdminStyle({ display: "flex" });
      } else {
        setAdminBtnStyle({ display: "flex" });
        setAdminStyle({ display: "none" });
      }
      if (EmployeeUsername && EmployeePassword) {
        setEmployeeBtnStyle({ display: "none" });
        setEmployeeStyle({ display: "flex" });
      } else {
        setEmployeeBtnStyle({ display: "flex" });
        setEmployeeStyle({ display: "none" });
      }
    },
    [navigate],
    [navigate]
  );

  const adminLink = () => {
    localStorage.removeItem("Catering Admin Username");
    localStorage.removeItem("Catering Admin Password");
    navigate("/");
    location.reload();
  };
  const employeeLink = () => {
    localStorage.removeItem("Catering Employee Username");
    localStorage.removeItem("Catering Employee Password");
    navigate("/");
    location.reload();
  };

  return (
    <div className="header">
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          <Link className="navbar-brand rowLogo" to="/">
            <img src={logo} className="logo" />
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
              <span style={employeeBtnStyle}>
                <Link className="nav-link" to="/employee-login">
                  <li className="nav-item btn btn-outline-danger">
                    Employee Login
                  </li>
                </Link>
              </span>
              <li className="nav-item dropdown" style={employeeStyle}>
                <Link
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Hi, Employee
                </Link>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to="/leave-request">
                      Request a Leave
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <Link className="dropdown-item" onClick={employeeLink}>
                      Logout
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Admin */}
              <span style={adminBtnStyle}>
                <Link className="nav-link" to="/admin-login">
                  <li className="nav-item btn btn-danger">Admin logins</li>
                </Link>
              </span>
              <li className="nav-item dropdown" style={adminStyle}>
                <Link
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Hi, Admin
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
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};
