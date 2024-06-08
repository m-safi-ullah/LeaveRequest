import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "./Symbols/Modal";
import Spinner from "./Symbols/Spinner";
import ConfirmModal from "./Symbols/ConfirmModal";

export const EmployeePanel = () => {
  const [EmployeeEmail, setEmployeeEmail] = useState("");
  const [EmployeePassword, setEmployeePassword] = useState("");
  const [ConfirmEmployeePassword, setConfirmEmployeePassword] = useState("");
  const [loadVisible, setloadVisible] = useState(false);
  const [leaveRequest, setLeaveRequest] = useState([]);
  const [modal, setModal] = useState({
    isVisible: false,
    bg: "",
    title: "",
    description: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("Catering Employee Username");
    const storedPassword = localStorage.getItem("Catering Employee Password");
    setEmployeeEmail(storedUsername);
    setEmployeePassword(storedPassword);

    if (!storedUsername && !storedPassword) {
      navigate("/employee-login");
    }
  }, [navigate]);

  // Update Employee Credentials
  const updateEmployee = async (e) => {
    e.preventDefault();
    setModal({ isVisible: false });

    if (EmployeePassword !== ConfirmEmployeePassword) {
      setTimeout(() => {
        setModal({
          isVisible: true,
          bg: "bg-warning",
          title: "Warning",
          description: "The Password and Confirm Password fields must match.",
        });
      }, 100);
    } else {
      try {
        setloadVisible(true);
        const response = await axios.post(
          `${window.location.origin}/api/updateCredentials.php`,
          { EmployeeEmail, EmployeePassword },
          {
            params: {
              portal: "Employee",
            },
          }
        );
        setloadVisible(false);
        if (response.data.message === "Successfully.") {
          setModal({
            isVisible: true,
            bg: "bg-success",
            title: "Success",
            description: "Employee Credentials Updated",
          });

          localStorage.setItem("Catering Employee Username", EmployeeEmail);
          localStorage.setItem("Catering Employee Password", EmployeePassword);
        }
      } catch (error) {
        console.error("Error updating Employee credentials:", error);
      }
    }
  };

  // Get Leave Request
  useEffect(() => {
    const fetchData = async () => {
      setloadVisible(true);
      const response = await axios.get(
        `${window.location.origin}/api/leaveRequestDatafromapi.php`,
        { params: { EmployeeEmail, portal: "Employee" } }
      );
      setLeaveRequest(response.data.data.reverse());
      setloadVisible(false);
    };
    if (EmployeeEmail) {
      fetchData();
    }
  }, [EmployeeEmail]);

  //   Delete Leave Request
  const handleCancel = (emprequestId) => {
    setloadVisible(true);
    axios
      .delete(`${window.location.origin}/api/leaveRequestDatafromapi.php`, {
        params: { emprequestId: emprequestId },
      })
      .then((response) => {
        setloadVisible(false);
        if (response.data.message === "Successful") {
          setModal({
            isVisible: true,
            bg: "bg-success",
            title: "Success",
            description: "Your Request has been Cancelled",
          });
        }
      });
  };

  return (
    <div className="LeaveRequest">
      <Spinner loadVisible={loadVisible} />
      <Modal
        show={modal.isVisible}
        bgColor={modal.bg}
        TitleMsg={modal.title}
        ModalDesc={modal.description}
      />
      <div className="container Panel">
        <div className="row">
          <div className="col-12">
            <div>
              <ul className="nav nav-tabs justify-content-center">
                <li className="nav-item">
                  <Link
                    className="nav-link active"
                    to="#leaveRequest"
                    data-bs-toggle="tab"
                  >
                    Leave Requests
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="#empCredentials"
                    data-bs-toggle="tab"
                  >
                    Credentials
                  </Link>
                </li>
              </ul>
              <div className="tab-content panelTabContent">
                <div id="leaveRequest" className="active tab-pane fade in show">
                  <div className="head mt-4">
                    <h2 className="mb-3">Leave Requests</h2>
                  </div>
                  <hr />
                  <div className="head mt-5">
                    <table className="employee-table overflow-auto">
                      <thead>
                        <tr>
                          <th>Approver</th>
                          <th>Date</th>
                          <th>Evaluation Status</th>
                          <th>Request Status</th>
                          <th>Request</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(leaveRequest) &&
                        leaveRequest.length > 0 ? (
                          leaveRequest.map((data, index) => (
                            <tr key={index}>
                              <td>{data.LeaveApprover}</td>
                              <td>{data.RequestDate}</td>
                              <td>
                                <button
                                  className={`btn ${
                                    data.leaveStatus === "Pending"
                                      ? "btn-secondary"
                                      : "btn-success"
                                  } py-0`}
                                >
                                  {data.leaveStatus}
                                </button>
                              </td>
                              <td>
                                <button
                                  className={`btn ${
                                    data.RequestStatus === "Declined"
                                      ? "btn-danger"
                                      : "btn-success"
                                  } py-0`}
                                >
                                  {data.RequestStatus}
                                </button>
                              </td>
                              <td>
                                {data.leaveStatus === "Pending" ? (
                                  <>
                                    <Link
                                      to={`/employee-review?requestId=${data.EmployeeID}`}
                                    >
                                      <i
                                        className="fa-solid fa-eye text-success fs-5 px-2"
                                        title="View"
                                      ></i>
                                    </Link>
                                    <ConfirmModal
                                      modalIcon="fa-xmark"
                                      modalId="2"
                                      modalDesc="Are you sure you want to cancel the request?"
                                      deleteRecord={() =>
                                        handleCancel(data.EmployeeID)
                                      }
                                    />
                                  </>
                                ) : (
                                  <Link
                                    to={`/employee-review?requestId=${data.EmployeeID}`}
                                  >
                                    <i
                                      className="fa-solid fa-eye text-success fs-5 px-2"
                                      title="View"
                                    ></i>
                                  </Link>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5}>No Request Found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div id="empCredentials" className="tab-pane fade">
                  <div className="head mt-4">
                    <h2 className="mb-3">Credentials</h2>
                  </div>
                  <hr />
                  <form
                    className="row g-3 mt-1 leaveForm"
                    onSubmit={updateEmployee}
                    encType="multipart/form-data"
                  >
                    <div className="col-md-4">
                      <label className="form-label">
                        Email<span>*</span>
                      </label>
                      <input
                        type="Email"
                        name="EmployeeEmail"
                        className="form-control"
                        placeholder="Enter email"
                        value={EmployeeEmail}
                        readOnly
                        disabled
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">
                        Password<span>*</span>
                      </label>
                      <input
                        type="password"
                        name="EmployeePass"
                        className="form-control"
                        placeholder="Enter password"
                        onChange={(e) => {
                          setEmployeePassword(e.target.value);
                        }}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">
                        Confirm<span>*</span>
                      </label>
                      <input
                        type="password"
                        name="EmployeePass"
                        className="form-control"
                        placeholder="Confirm password"
                        onChange={(e) => {
                          setConfirmEmployeePassword(e.target.value);
                        }}
                        required
                      />
                    </div>
                    <div className="col-12 mt-4">
                      <button
                        type="submit"
                        className="btn btn-danger p-2 w-100"
                      >
                        Update
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
