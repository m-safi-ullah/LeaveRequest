import React, { useState, useEffect } from "react";
import Modal from "./Symbols/Modal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "./Symbols/Spinner";
import loginImg from "../Images/loginImg.png";
import Cookies from "js-cookie";
import { useData } from "./ContextApi/Context";
import { Link } from "react-router-dom";

export default function Login() {
  const { token, setToken } = useData();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loadVisible, setloadVisible] = useState(false);
  const [portal, setPortal] = useState("Employee");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate, token, []]);

  const login = async (event) => {
    event.preventDefault();
    setloadVisible(true);
    setIsModalVisible(false);
    try {
      await axios
        .post(
          `https://ciho.com.au/api/checkCredentials.php`,
          {
            username: username,
            password: password,
          },
          {
            params: {
              portal: portal,
            },
          }
        )
        .then((response) => {
          if (response.data.status === 1) {
            navigate("/dashboard");

            const now = new Date().getTime() / 1000;
            const expiresDays = (response.data.expire - now) / (60 * 60 * 24);

            Cookies.set("token", response.data.token, {
              expires: expiresDays,
              path: "/",
              secure: true,
              sameSite: "Lax",
            });
            setToken(response.data.token);
          } else {
            setIsModalVisible(true);
          }
        });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setloadVisible(false);
    }
  };

  return (
    <div>
      <Modal
        show={isModalVisible}
        bgColor={"bg-danger"}
        TitleMsg={"Failed"}
        ModalDesc={"Login Failed! Please enter correct username and password"}
      />
      <Spinner loadVisible={loadVisible} />
      <div className="container my-5">
        <div className="row ">
          <div className="col-sm-6 text-center m-auto">
            <img src={loginImg} className="LoginImg" alt="LoginImg" />
          </div>
          <div className="col-sm-6 login p-3 p-sm-5 m-auto">
            <h1>Login</h1>

            <div className="my-4">
              <form onSubmit={login}>
                <label htmlFor="username" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  id="username"
                  name="username"
                  value={username}
                  placeholder="Enter email"
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-control"
                  required
                />
                <label htmlFor="password" className="form-label mt-4">
                  Password
                </label>
                <input
                  className="form-control"
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  placeholder="Enter password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label htmlFor="password" className="form-label mt-4">
                  Select Portal
                </label>
                <br />
                <div className="mt-2 d-flex flex-wrap gap-2">
                  <span
                    className={
                      portal === "Employee" ? "activeportal" : "portal"
                    }
                    name="Employee"
                    onClick={() => {
                      setPortal("Employee");
                    }}
                  >
                    Employee
                  </span>
                  <span
                    className={
                      portal === "Approver" ? "activeportal" : "portal"
                    }
                    name="Approver"
                    onClick={() => {
                      setPortal("Approver");
                    }}
                  >
                    Approver
                  </span>
                  <span
                    className={
                      portal === "Director" ? "activeportal" : "portal"
                    }
                    name="Director"
                    onClick={() => {
                      setPortal("Director");
                    }}
                  >
                    Operations
                  </span>
                  <span
                    className={portal === "Admin" ? "activeportal" : "portal"}
                    name="Admin"
                    onClick={() => {
                      setPortal("Admin");
                    }}
                  >
                    Admin
                  </span>
                </div>
                <div className="col-12 mt-4">
                  <button
                    type="submit"
                    className="btn btn-danger mt-2 p-2 w-100"
                  >
                    Login
                  </button>
                </div>
                <p className="mt-2">
                  Having trouble logging in?{" "}
                  <Link to="/forgot-password" className="underline">
                    Forgot Password
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
