import React, { useState, useEffect } from "react";
import loginImg from "../Images/loginImg.png";
import axios from "axios";
import Spinner from "./Symbols/Spinner";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useData } from "./ContextApi/Context";

export default function ForgotPassword() {
  const { token } = useData();
  const navigate = useNavigate();
  const [portal, setPortal] = useState("Employee");
  const [vEmail, setVEmail] = useState(false);
  const [vOTP, setVOTP] = useState(false);
  const [uCred, setUCred] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [modal, setModal] = useState({
    isVisible: false,
    bg: "",
    title: "",
    description: "",
  });
  const [loadVisible, setLoadVisible] = useState(false);
  const [cred, setCred] = useState({ password: "", confirmPass: "" });
  const api = `${window.location.origin}/api`;

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [navigate, token, []]);

  const verifyEmail = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setLoadVisible(true);
    axios
      .post(`${api}/resetPasswordApi.php`, formData, {
        params: {
          portal: portal,
          manipulation: "check-mail",
        },
      })
      .then((response) => {
        setLoadVisible(false);
        if (response.data.status === 1) {
          toast.success("OTP sent to your mail");
          setVEmail(true);
          setVOTP(true);
        } else {
          toast.error("No record found with this email");
        }
      });
  };

  const verifyOTP = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append("email", email);
    setLoadVisible(true);
    axios
      .post(`${api}/resetPasswordApi.php`, formData, {
        params: {
          portal: portal,
          manipulation: "verify-otp",
        },
      })
      .then((response) => {
        setLoadVisible(false);
        if (response.data.status === 1) {
          toast.success("OTP verified Successfully");
          setUCred(true);
          setVOTP(false);
        } else {
          toast.error("OTP is wrong");
        }
      });
  };

  const updateCred = (e) => {
    e.preventDefault();
    if (cred.password !== cred.confirmPass) {
      toast.warning("The New Password and Confirm Password fields must match.");
    } else {
      setLoadVisible(true);
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", cred.password);
      formData.append("otp", otp);
      axios
        .post(`${api}/resetPasswordApi.php`, formData, {
          params: {
            portal: portal,
            manipulation: "update-credentials",
          },
        })
        .then((response) => {
          setLoadVisible(false);
          if (response.data.status === 1) {
            toast.success("Credentials updated successfully.");
            setTimeout(() => {
              navigate("/login");
            }, 1500);
          } else {
            toast.error("Enter new and strong password.");
          }
        });
    }
  };

  return (
    <div>
      <ToastContainer
        position="top-center"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
      />
      <Spinner loadVisible={loadVisible} />
      <div className="container my-5">
        <div className="row">
          <div className="col-sm-6 text-center m-auto">
            <img src={loginImg} className="LoginImg" alt="Login Image" />
          </div>
          <div className="col-sm-6 login m-auto">
            <h1>Forgot Password?</h1>
            <div className="my-4">
              {!vEmail && (
                <form onSubmit={verifyEmail}>
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    className="form-control"
                    placeholder="Enter your email"
                    required
                  />
                  <label htmlFor="password" className="form-label mt-3">
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
                      id="inlineRadio3"
                      onChange={() => {
                        setPortal("Admin");
                      }}
                      checked={portal === "Admin" ? true : false}
                    />
                    <label className="form-check-label" htmlFor="inlineRadio3">
                      Admin
                    </label>
                  </div>
                  <button type="submit" className="btn btn-danger my-4 w-50">
                    Reset Password
                  </button>
                </form>
              )}

              {vOTP && (
                <form onSubmit={verifyOTP}>
                  <label htmlFor="username" className="form-label">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    id="OTP"
                    name="OTP"
                    className="form-control"
                    placeholder="Enter OTP Code"
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value);
                    }}
                    required
                  />
                  <button type="submit" className="btn btn-danger my-4 w-50">
                    Submit
                  </button>
                </form>
              )}

              {uCred && (
                <form onSubmit={updateCred}>
                  <label className="form-label">
                    New Password<span>*</span>
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    className="form-control"
                    placeholder="Enter new password"
                    value={cred.password}
                    onChange={(e) => {
                      setCred((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }));
                    }}
                    required
                  />

                  <label className="form-label mt-3">
                    Confirm New Password<span>*</span>
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-control"
                    placeholder="Confirm password"
                    value={cred.confirmPass}
                    onChange={(e) => {
                      setCred((prev) => ({
                        ...prev,
                        confirmPass: e.target.value,
                      }));
                    }}
                    required
                  />
                  <button type="submit" className="btn btn-danger my-4 w-50">
                    Update
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
