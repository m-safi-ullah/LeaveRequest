import React, { useState, useEffect } from "react";
import loginImg from "../Images/loginImg.jpg";
import { useNavigate } from "react-router-dom";
import Spinner from "./Symbols/Spinner";
import axios from "axios";
import Modal from "./Symbols/Modal";

export const EmployeeLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loadVisible, setloadVisible] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  const employeeDatafromapi = async (event) => {
    event.preventDefault();
    setloadVisible(true);
    setIsModalVisible(false);

    const response = await axios.post(
      `${window.location.origin}/api/checkCredentials.php`,
      {
        username: username,
        password: password,
      },
      {
        params: {
          portal: "Employee",
        },
      }
    );
    setloadVisible(false);

    if (response.data.message === "Successfully.") {
      localStorage.setItem("Catering Employee Username", username);
      localStorage.setItem("Catering Employee Password", password);
      navigate("/leave-request");
      const name = response.data.data.Name.split(" ")[0];
      localStorage.setItem("Catering Employee Name", name);
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
      <Spinner loadVisible={loadVisible} />
      <div className="container my-5">
        <div className="row ">
          <div className="col-sm-6 text-center m-auto">
            <img src={loginImg} className="LoginImg" alt="LoginImg" />
          </div>
          <div className="col-sm-6 login m-auto">
            <h1>Employee Login</h1>
            <div className="my-4">
              <form onSubmit={employeeDatafromapi}>
                <label className="form-label">Employee Email</label>
                <input
                  type="email"
                  id="username"
                  name="username"
                  value={username}
                  placeholder="Enter email"
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
                  placeholder="Enter password"
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
