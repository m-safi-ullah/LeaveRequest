import React, { useEffect, useState } from "react";
import Modal from "./Symbols/Modal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "./Symbols/Spinner";
import loginImg from "../Images/loginImg.jpg";

export const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loadVisible, setloadVisible] = useState(false);
  const navigate = useNavigate();

  const adminLogin = async (event) => {
    event.preventDefault();
    setloadVisible(true);
    setIsModalVisible(false);
    await axios
      .post(
        `${window.location.origin}/api/checkCredentials.php`,
        {
          username: username,
          password: password,
        },
        {
          params: {
            portal: "Admin",
          },
        }
      )
      .then((response) => {
        setloadVisible(false);
        if (response.data.message === "Successfully.") {
          localStorage.setItem("Catering Admin Username", username);
          localStorage.setItem("Catering Admin Password", password);
          const name = response.data.data.Name.split(" ")[0];
          localStorage.setItem("Catering Admin Name", name);
          navigate("/admin-panel");
        } else {
          setIsModalVisible(true);
        }
      });
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem("Catering Admin Username");
    const storedPassword = localStorage.getItem("Catering Admin Password");

    if (storedUsername && storedPassword) {
      navigate("/admin-panel");
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
            <h1>Admin Login</h1>
            <div className="my-4">
              <form onSubmit={adminLogin}>
                <label htmlFor="username" className="form-label">
                  Admin Username or Email
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={username}
                  placeholder="Enter username or email"
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-control"
                  aria-describedby="passwordHelpBlock"
                />
                <label htmlFor="password" className="form-label mt-2">
                  Admin Password
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
                <button type="submit" className="btn btn-danger my-4 w-50">
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
