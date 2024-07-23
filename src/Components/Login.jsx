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
          `${window.location.origin}/api/checkCredentials.php`,
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
          <div className="col-sm-6 login m-auto">
            <h1>{portal} Login</h1>

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
                <label htmlFor="password" className="form-label mt-2">
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
                <div className="forgot-password mt-1">
                  <Link to="/forgot-password">Forgot Password?</Link>
                </div>
                <label htmlFor="password" className="form-label">
                  Portal
                </label>
                <br />
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input corsor-pointer"
                    type="radio"
                    name="Employee"
                    id="inlineRadio1"
                    onChange={() => {
                      setPortal("Employee");
                    }}
                    checked={portal === "Employee" ? true : false}
                  />
                  <label className="form-check-label" htmlFor="inlineRadio1">
                    Employee
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="Approver"
                    id="inlineRadio2"
                    onChange={() => {
                      setPortal("Approver");
                    }}
                    checked={portal === "Approver" ? true : false}
                  />
                  <label className="form-check-label" htmlFor="inlineRadio2">
                    Approver
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="Admin"
                    onChange={() => {
                      setPortal("Admin");
                    }}
                    id="inlineRadio3"
                    checked={portal === "Admin" ? true : false}
                  />
                  <label className="form-check-label" htmlFor="inlineRadio3">
                    Admin
                  </label>
                </div>
                <div className="col-md-6 col-12">
                  <button type="submit" className="btn btn-danger my-4 w-100">
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
