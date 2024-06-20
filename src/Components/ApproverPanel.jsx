import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Modal from "./Symbols/Modal";
import ConfirmModal from "./Symbols/ConfirmModal";
import Spinner from "./Symbols/Spinner";
import Calender from "./Calender";
export const ApproverPanel = () => {
  const [ApproverEmail, setApproverEmail] = useState("");
  const [ApproverPassword, setApproverPassword] = useState("");
  const [ConfirmApproverPassword, setConfirmApproverPassword] = useState("");
  const [calender, setCalender] = useState([]);
  const [loadVisible, setloadVisible] = useState(false);
  const [empData, setEmpData] = useState([]);
  const [leaveRequest, setLeaveRequest] = useState([]);
  const [LoginAlert, setLoginAlert] = useState(false);
  const [activeTab, setActiveTab] = useState("leave-requests");

  const [modal, setModal] = useState({
    isVisible: false,
    bg: "",
    title: "",
    description: "",
  });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (hash) setActiveTab(hash);
    else navigate("#leave-requests", { replace: true });
  }, [location, navigate]);

  const handleNavigate = (hash) => {
    navigate(`#${hash}`);
  };

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
    setModal({ isVisible: false });
    if (ApproverPassword !== ConfirmApproverPassword) {
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
          { ApproverEmail, ApproverPassword },
          {
            params: {
              portal: "Approver",
            },
          }
        );
        setloadVisible(false);
        if (response.data.message === "Successfully.") {
          setModal({
            isVisible: true,
            bg: "bg-success",
            title: "Success",
            description: "Credentials Updated Successfully",
          });

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
        setModal({
          isVisible: true,
          bg: "bg-success",
          title: "Success",
          description: "New Employee Added Successfully",
        });
      }
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  // Delete Emp Data
  const DelEmpRecord = async (empID) => {
    try {
      setloadVisible(true);
      await axios.delete(
        `${window.location.origin}/api/dataEmployeesLeaveApprovers.php`,
        {
          data: { empID: empID },
          params: { portal: "Employee" },
        }
      );
      setloadVisible(false);
      setModal({
        isVisible: true,
        bg: "bg-success",
        title: "Success",
        description: "Employee Deleted Successfully",
      });
    } catch (error) {
      console.error("Error deleting record:", error);
      setModal({
        isVisible: true,
        bg: "bg-danger",
        title: "Error",
        description: "Error deleting record",
      });
    }
  };

  // Get Employee and Calender Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setloadVisible(true);
        if (activeTab === "add-employees") {
          const response = await axios.get(
            `${window.location.origin}/api/dataEmployeesLeaveApprovers.php`,
            { params: { portal: "Employee Data" } }
          );
          setEmpData(response.data.data.reverse());
        }
        if (activeTab === "calender") {
          const response = await axios.get(
            `${window.location.origin}/api/leaveRequestDatafromapi.php`,
            { params: { Calender: "Calender" } }
          );
          setCalender(response.data.data.reverse());
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setloadVisible(false);
      }
    };

    if (activeTab === "add-employees" || activeTab === "calender") {
      fetchData();
    }
  }, [activeTab, navigate]);

  // Get Leave Request
  useEffect(() => {
    const fetchData = async () => {
      try {
        setloadVisible(true);
        const response = await axios.get(
          `${window.location.origin}/api/leaveRequestDatafromapi.php`,
          { params: { ApproverEmail, portal: "Approver Request" } }
        );
        setLeaveRequest(response.data.data.reverse());
      } catch (error) {
        console.error("Error fetching leave requests:", error);
      } finally {
        setloadVisible(false);
      }
    };

    if (activeTab === "leave-requests" && ApproverEmail) {
      fetchData();
    }
  }, [ApproverEmail, activeTab]);

  // Delete Leave Request
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
            description: "Request Deleted Successfully",
          });
        }
      });
  };

  return (
    <div className="LeaveRequest">
      {LoginAlert && (
        <div className="alert alert-info" role="alert">
          Please update your password by clicking{" "}
          <Link to="/approver-panel#credentials"> here</Link>.
        </div>
      )}
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
                  <button
                    className={`nav-link ${
                      activeTab === "leave-requests" ? "active" : ""
                    }`}
                    onClick={() => handleNavigate("leave-requests")}
                  >
                    Leave Requests
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeTab === "add-employees" ? "active" : ""
                    }`}
                    onClick={() => handleNavigate("add-employees")}
                  >
                    Add Employees
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeTab === "calender" ? "active" : ""
                    }`}
                    onClick={() => handleNavigate("calender")}
                  >
                    Calendar
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeTab === "credentials" ? "active" : ""
                    }`}
                    onClick={() => handleNavigate("credentials")}
                  >
                    Credentials
                  </button>
                </li>
              </ul>
              <div className="tab-content panelTabContent">
                <div
                  className={`tab-pane fade ${
                    activeTab === "leave-requests" ? "show active" : ""
                  }`}
                  id="leave-requests"
                >
                  <div className="head mt-4">
                    <h2 className="mb-3">Leave Requests</h2>
                  </div>
                  <hr />
                  <div className="head mt-5">
                    <table className="employee-table overflow-auto">
                      <thead>
                        <tr>
                          <th>Requester Name</th>
                          <th>Requester Email</th>
                          <th>Date</th>
                          <th>Status</th>
                          <th>Actions</th>
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
                                      <i
                                        className="fa-solid fa-eye text-success fs-5 px-2"
                                        title="View"
                                      ></i>
                                    </Link>

                                    <ConfirmModal
                                      modalIcon="fa-trash"
                                      modalId={index}
                                      modalDesc="Are you sure you want to delete the record?"
                                      deleteRecord={() =>
                                        handleCancel(data.EmployeeID)
                                      }
                                    />
                                  </>
                                ) : (
                                  <Link
                                    to={`/review-request?requestId=${data.EmployeeID}`}
                                    target="_blank"
                                  >
                                    <i
                                      className="fa-regular fa-eye text-success fs-5 px-2"
                                      title="View"
                                    ></i>
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
                <div
                  className={`tab-pane fade ${
                    activeTab === "add-employees" ? "show active" : ""
                  }`}
                  id="add-employees"
                >
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
                    <table className="employee-table overflow-auto">
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
                                <ConfirmModal
                                  modalIcon="fa-trash"
                                  modalId={data.ID}
                                  modalDesc="Are you sure you want to delete the record?"
                                  deleteRecord={() => {
                                    DelEmpRecord(data.ID);
                                  }}
                                />
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
                <div
                  className={`tab-pane fade ${
                    activeTab === "calender" ? "show active" : ""
                  }`}
                  id="calender"
                >
                  <Calender data={calender} />
                </div>
                <div
                  className={`tab-pane fade ${
                    activeTab === "credentials" ? "show active" : ""
                  }`}
                  id="credentials"
                >
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
