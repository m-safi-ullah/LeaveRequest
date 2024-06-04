import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import Spinner from "./Spinner";

export const EmployeePanel = () => {
  const [EmployeeEmail, setEmployeeEmail] = useState("");
  const [EmployeePassword, setEmployeePassword] = useState("");
  const [ConfirmEmployeePassword, setConfirmEmployeePassword] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [ModalDesc, setModalDesc] = useState("");
  const [loadVisible, setloadVisible] = useState(false);
  const [leaveRequest, setLeaveRequest] = useState([]);

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
    if (EmployeePassword !== ConfirmEmployeePassword) {
      alert("The Password and Confirm Password fields must match.");
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
          setIsModalVisible(true);
          setModalDesc("Employee Credentials Updated");
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
    if (confirm("Are you sure you want to delete.") === true) {
      setloadVisible(true);
      axios
        .delete(`${window.location.origin}/api/leaveRequestDatafromapi.php`, {
          params: { emprequestId: emprequestId },
        })
        .then((response) => {
          setloadVisible(false);
          if (response.data.message === "Successful") {
            setIsModalVisible(true);
            setModalDesc("Your Request has been Cancelled");
          }
        });
    }
  };

  return (
    <div className="LeaveRequest">
      <Spinner loadVisible={loadVisible} />
      <Modal
        show={isModalVisible}
        bgColor={"bg-success"}
        TitleMsg={"Success"}
        ModalDesc={ModalDesc}
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
                    <table border={1} className="employee-table overflow-auto">
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
                                      target="_blank"
                                    >
                                      <button className="btn btn-success">
                                        View
                                      </button>
                                    </Link>
                                    <button
                                      className="btn btn-danger mx-2"
                                      onClick={() =>
                                        handleCancel(data.EmployeeID)
                                      }
                                    >
                                      Cancel
                                    </button>
                                  </>
                                ) : (
                                  <Link
                                    to={`/employee-review?requestId=${data.EmployeeID}`}
                                  >
                                    <button className="btn btn-success">
                                      View
                                    </button>
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
