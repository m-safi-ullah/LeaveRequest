import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import Spinner from "./Spinner";

export const ApproverPanel = () => {
  const [ApproverEmail, setApproverEmail] = useState("");
  const [ApproverPassword, setApproverPassword] = useState("");
  const [ConfirmApproverPassword, setConfirmApproverPassword] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [ModalDesc, setModalDesc] = useState("");
  const [loadVisible, setloadVisible] = useState(false);
  const [empData, setEmpData] = useState([]);
  const [leaveRequest, setLeaveRequest] = useState([]);
  const [LoginAlert, setLoginAlert] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("Catering Approver Username");
    const storedPassword = localStorage.getItem("Catering Approver Password");
    setApproverEmail(storedUsername);
    setApproverPassword(storedPassword);

    if (!storedUsername && !storedPassword) {
      navigate("/approver-login");
    }
    if (storedPassword === "Catering123") {
      setLoginAlert(true);
    }
  }, [navigate]);

  // Update Approver Credentials
  const updateApprover = async (e) => {
    e.preventDefault();
    if (ApproverPassword !== ConfirmApproverPassword) {
      alert("The Password and Confirm Password fields must match.");
    } else {
      try {
        setloadVisible(true);
        const response = await axios.post(
          `${window.location.origin}/api/updateCredentials.php`,
          { ApproverEmail, ApproverPassword },
          {
            params: {
              portal: "Approver",
            },
          }
        );
        setloadVisible(false);
        if (response.data.message === "Successfully.") {
          setIsModalVisible(true);
          setModalDesc("Credentials Updated Successfully");
          localStorage.setItem("Catering Approver Username", ApproverEmail);
          localStorage.setItem("Catering Approver Password", ApproverPassword);
        }
      } catch (error) {
        console.error("Error updating Approver credentials:", error);
      }
    }
  };

  // Add New Employee
  const addEmployee = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    try {
      setloadVisible(true);
      const response = await axios.post(
        `${window.location.origin}/api/dataEmployeesLeaveApprovers.php`,
        formData,
        {
          params: {
            portal: "Employee",
            Manipulation: "Insert",
          },
        }
      );
      setloadVisible(false);
      if (response.data.message === "Successfully.") {
        setIsModalVisible(true);
        setModalDesc("New Employee Added");
      }
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  // Get Employee Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setloadVisible(true);
        const response = await axios.get(
          `${window.location.origin}/api/dataEmployeesLeaveApprovers.php`,
          {
            params: { portal: "Employee Data" },
          }
        );
        setloadVisible(false);
        setEmpData(response.data.data.reverse());
      } catch (error) {
        console.error("Error fetching approvers:", error);
      }
    };

    fetchData();
  }, [navigate]);

  // Delete Emp Data
  const DelEmpRecord = async (empID) => {
    try {
      if (confirm("Are you sure you want to delete.") === true) {
        setloadVisible(true);
        await axios.delete(
          `${window.location.origin}/api/dataEmployeesLeaveApprovers.php`,
          {
            data: { empID: empID },
            params: { portal: "Employee" },
          }
        );
        setloadVisible(false);
        setIsModalVisible(true);
        setModalDesc("Employee Deleted Successfully");
      }
    } catch (error) {
      console.error("Error deleting record:", error);
      setIsModalVisible(true);
      setModalDesc("Error deleting record");
    }
  };

  // Get Leave Request
  useEffect(() => {
    const fetchData = async () => {
      setloadVisible(true);
      const response = await axios.get(
        `${window.location.origin}/api/leaveRequestDatafromapi.php`,
        { params: { ApproverEmail, portal: "Approver Mail" } }
      );
      setLeaveRequest(response.data.data.reverse());
      setloadVisible(false);
    };
    if (ApproverEmail) {
      fetchData();
    }
  }, [ApproverEmail]);

  // Delete Leave Request
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
            setModalDesc("Request Deleted Successfully");
          }
        });
    }
  };

  return (
    <div className="LeaveRequest">
      {LoginAlert && (
        <div className="alert alert-info" role="alert">
          Please update your password by clicking on the Credentials tab.
        </div>
      )}
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
                    to="#request"
                    data-bs-toggle="tab"
                  >
                    Leave Requests
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link "
                    to="#employees"
                    data-bs-toggle="tab"
                  >
                    Add Employees
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="#Approver"
                    data-bs-toggle="tab"
                  >
                    Credentials
                  </Link>
                </li>
              </ul>
              <div className="tab-content panelTabContent">
                <div id="employees" className="tab-pane fade ">
                  <div className="head mt-4">
                    <h2 className="mb-3">Add New Employee</h2>
                  </div>
                  <hr />
                  <form
                    className="row g-3 mt-1 leaveForm"
                    onSubmit={addEmployee}
                    id="addEmployee"
                    encType="multipart/form-data"
                  >
                    <div className="col-md-4">
                      <label className="form-label">
                        Full Name<span>*</span>
                      </label>
                      <input
                        type="text"
                        name="empName"
                        className="form-control"
                        placeholder="Enter full name"
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">
                        Email<span>*</span>
                      </label>
                      <input
                        type="email"
                        name="empEmail"
                        className="form-control"
                        placeholder="Enter email"
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">
                        Passwords<span>*</span>
                      </label>
                      <input
                        type="text"
                        name="empPassword"
                        className="form-control"
                        placeholder="Enter password"
                        required
                      />
                    </div>
                    <div className="col-12 mt-4">
                      <button
                        type="submit"
                        className="btn btn-danger p-2 w-100"
                      >
                        Add Employee
                      </button>
                    </div>
                  </form>
                  <div className="head mt-5">
                    <h2>View Employee Data</h2>
                    <table border={1} className="employee-table overflow-auto">
                      <thead>
                        <tr>
                          <th>Employee Name</th>
                          <th>Employee Email</th>
                          <th>Delete Record</th>
                        </tr>
                      </thead>
                      <tbody>
                        {empData && empData.length > 0 ? (
                          empData.map((data, index) => (
                            <tr key={index}>
                              <td>{data.Name}</td>
                              <td>{data.Email}</td>
                              <td>
                                <button
                                  className="btn btn-danger"
                                  onClick={() => {
                                    DelEmpRecord(data.ID);
                                  }}
                                >
                                  Delete
                                </button>
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
                <div id="request" className="active tab-pane fade in show">
                  <div className="head mt-4">
                    <h2 className="mb-3">Leave Requests</h2>
                  </div>
                  <hr />
                  <div className="head mt-5">
                    <table border={1} className="employee-table overflow-auto">
                      <thead>
                        <tr>
                          <th>Requester Name</th>
                          <th>Requester Email</th>
                          <th>Date</th>
                          <th>Status</th>
                          <th>View Request</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(leaveRequest) &&
                        leaveRequest.length > 0 ? (
                          leaveRequest.map((data, index) => (
                            <tr key={index}>
                              <td>{data.FirstName}</td>
                              <td>{data.Email}</td>
                              <td>{data.RequestDate}</td>
                              <td>
                                {data.leaveStatus === "Pending" ? (
                                  <button
                                    className="btn btn-secondary py-0"
                                    readOnly
                                  >
                                    {data.leaveStatus}
                                  </button>
                                ) : (
                                  <button
                                    className="btn btn-success py-0"
                                    readOnly
                                  >
                                    {data.leaveStatus}
                                  </button>
                                )}
                              </td>
                              <td className="gap-2">
                                {data.leaveStatus === "Completed" ? (
                                  <>
                                    <Link
                                      to={`/review-request?requestId=${data.EmployeeID}`}
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
                                      Delete
                                    </button>
                                  </>
                                ) : (
                                  <Link
                                    to={`/review-request?requestId=${data.EmployeeID}`}
                                    target="_blank"
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
                            <td colSpan="5">No Request Found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div id="Approver" className="tab-pane fade">
                  <div className="head mt-4">
                    <h2 className="mb-3">Credentials</h2>
                  </div>
                  <hr />
                  <form
                    className="row g-3 mt-1 leaveForm"
                    onSubmit={updateApprover}
                    encType="multipart/form-data"
                  >
                    <div className="col-md-4">
                      <label className="form-label">
                        Email<span>*</span>
                      </label>
                      <input
                        type="Email"
                        name="ApproverEmail"
                        className="form-control"
                        placeholder="Enter email"
                        value={ApproverEmail}
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
                        name="ApproverPass"
                        className="form-control"
                        placeholder="Enter password"
                        onChange={(e) => {
                          setApproverPassword(e.target.value);
                        }}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">
                        Confirm Password<span>*</span>
                      </label>
                      <input
                        type="password"
                        name="ApproverPass"
                        className="form-control"
                        placeholder="Confirm password"
                        onChange={(e) => {
                          setConfirmApproverPassword(e.target.value);
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
