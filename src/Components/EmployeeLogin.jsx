import React, { useState, useEffect } from "react";
import loginImg from "../Images/loginImg.jpg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "./Modal";

export const EmployeeLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  const employeeLogin = async (event) => {
    event.preventDefault();
    const response = await axios.post("http://localhost/api/empLogin.php", {
      username: username,
      password: password,
    });

    if (response.data.message === "Successfully.") {
      localStorage.setItem("Catering Employee Username", username);
      localStorage.setItem("Catering Employee Password", password);
      navigate("/leave-request");
    } else {
      setIsModalVisible(true);
    }
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem("Catering Employee Username");
    const storedPassword = localStorage.getItem("Catering Employee Password");

    if (storedUsername && storedPassword) {
      navigate("/leave-request");
    }
  }, [navigate]);

  return (
    <div>
      <Modal
        show={isModalVisible}
        bgColor={"bg-danger"}
        TitleMsg={"Failed"}
        ModalDesc={"Login Failed! Please enter correct username and password"}
      />
      <div className="container my-5">
        <div className="row ">
          <div className="col-sm-6 text-center m-auto">
            <img src={loginImg} className="LoginImg" alt="LoginImg" />
          </div>
          <div className="col-sm-6 login m-auto">
            <h1>Employee Login</h1>
            <div className="my-4">
              <form onSubmit={employeeLogin}>
                <label className="form-label">Employee Email</label>
                <input
                  type="email"
                  id="username"
                  name="username"
                  value={username}
                  placeholder="Enter Email"
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-control"
                  aria-describedby="passwordHelpBlock"
                />
                <label htmlFor="password" className="form-label mt-2">
                  Employee Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  placeholder="Enter Password"
                  onChange={(e) => setPassword(e.target.value)}
                  name="password"
                  className="form-control"
                  aria-describedby="passwordHelpBlock"
                />
                <button
                  type="submit"
                  id="login"
                  className="btn btn-danger my-4 w-50"
                >
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
