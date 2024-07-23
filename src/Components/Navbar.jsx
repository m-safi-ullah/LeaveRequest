import { Link } from "react-router-dom";
import logo from "../Images/logo1.png";
import Cookies from "js-cookie";
import { useData } from "./ContextApi/Context";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const { userName, role, setToken, setRole, token, setUserName, setEmail } =
    useData();
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("token");
    setToken(null);
    setRole("");
    setUserName("");
    setEmail("");
    navigate("/login");
  };

  const FirstName = userName ? userName.split(" ")[0] : "";

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
              {!token ? (
                <Link className="nav-link" to="/login">
                  <li className="nav-item btn btn-danger w-100">Login</li>
                </Link>
              ) : (
                <li className="nav-item dropdown">
                  <Link
                    className="nav-link dropdown-toggle"
                    to="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Hi, {FirstName}
                  </Link>
                  <ul className="dropdown-menu">
                    <li>
                      <Link className="dropdown-item" to="/dashboard">
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    {role === "Employee" && (
                      <>
                        <li>
                          <Link className="dropdown-item" to="/leave-request">
                            Request a Leave
                          </Link>
                        </li>
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                      </>
                    )}
                    <li>
                      <Link
                        className="dropdown-item"
                        onClick={() => handleLogout()}
                      >
                        Logout
                      </Link>
                    </li>
                  </ul>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};
