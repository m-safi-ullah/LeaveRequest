import React, { useEffect, useState } from "react";
import axiosInstance from "./axios";
import Spinner from "./Symbols/Spinner";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Modal from "./Symbols/Modal";
import ConfirmModal from "./Symbols/ConfirmModal";
import Calender from "./Calender";
import { useData } from "./ContextApi/Context";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";

export default function Dashboard() {
  const token = Cookies.get("token");
  const { role, email, setEmail } = useData();
  const [activeTab, setActiveTab] = useState(
    role === "Admin" ? "#add-employees" : "#leave-requests"
  );
  const [loadVisible, setLoadVisible] = useState(false);
  const [approverData, setApproverData] = useState([]);
  const [empData, setEmpData] = useState([]);
  const [editEmployee, setEditEmployee] = useState("Add Employee");
  const [editApprover, setEditApprover] = useState("Add Approver");
  const [empId, setEmpId] = useState("");
  const [appId, setAppId] = useState("");
  const [statusSuccess, setStatusSuccess] = useState(false);
  const [leaveRequest, setLeaveRequest] = useState([]);
  const [successLeaveDel, setSuccessLeaveDel] = useState(false);
  const [calender, setCalender] = useState([]);
  const [updateMail, setUpdateMail] = useState(false);
  const [modal, setModal] = useState({
    isVisible: false,
    bg: "",
    title: "",
    description: "",
  });
  const [user, setUser] = useState({
    password: "",
    confirmPassword: "",
  });
  const [updateEmployee, setUpdateEmployee] = useState({
    Name: "",
    Email: "",
    Password: "",
  });
  const [updateApprover, setUpdateApprover] = useState({
    Name: "",
    Email: "",
    Password: "",
  });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [navigate, token, []]);

  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (hash) setActiveTab(hash);
    else {
      if (role) {
        navigate(role === "Admin" ? "#add-employees" : "#leave-requests");
      }
    }
  }, [location, navigate, role]);

  const handleTabClick = (hash) => {
    navigate(`#${hash}`);
  };

  const fetchData = async (portalType) => {
    try {
      if (portalType === "Approver" || portalType === "Employee") {
        setLoadVisible(true);
        const response = await axiosInstance.get(
          `/dataEmployeesLeaveApprovers.php`,
          {
            params: { portal: portalType },
          }
        );
        if (portalType === "Approver") {
          setApproverData(response.data.data.reverse());
        } else if (portalType === "Employee") {
          setEmpData(response.data.data.reverse());
        }
      } else if (portalType === "Calender") {
        const response = await axiosInstance.get(
          `/leaveRequestDatafromapi.php`,
          {
            params: { portal: "Calender" },
          }
        );
        if (response.data.data) {
          setCalender(response.data.data.reverse());
        }
      }
    } catch (error) {
      console.error(`Error fetching data for ${portalType}:`, error);
    } finally {
      setLoadVisible(false);
    }
  };

  // Get Employee Approver and Calender Record
  useEffect(() => {
    if (activeTab === "add-approvers") {
      fetchData("Approver");
    } else if (activeTab === "add-employees") {
      fetchData("Employee");
    } else if (activeTab === "calender") {
      fetchData("Calender");
    }
  }, [activeTab, statusSuccess]);

  // Insert ID to update record
  const updateRecord = (id, portal) => {
    window.scrollTo(0, 0);
    if (portal === "Employee") {
      setEditEmployee("Update");
      const getEmpData = empData.filter((data) => data.ID === id);
      setUpdateEmployee(getEmpData[0]);
      setEmpId(id);
    } else {
      setEditApprover("Update");
      const getAppData = approverData.filter((data) => data.ID === id);
      setUpdateApprover(getAppData[0]);
      setAppId(id);
    }
  };

  // Delete Employee and Approver Record
  const deleteRecord = async (id, portal) => {
    setModal({ isVisible: false });
    setStatusSuccess(false);
    try {
      setLoadVisible(true);
      await axiosInstance.delete(`/dataEmployeesLeaveApprovers.php`, {
        data: { ID: id },
        params: { portal: portal },
      });
      toast.success(
        portal === "Employee"
          ? "Employee Deleted Successfully"
          : "Approver Deleted Successfully"
      );
      if (portal === "Employee") {
        setEditEmployee("Add Employee");
      } else {
        setEditApprover("Add Approver");
      }
      setStatusSuccess(true);
    } catch (error) {
      setModal({
        isVisible: true,
        bg: "bg-danger",
        title: "Error",
        description: "Error deleting record",
      });
    } finally {
      setLoadVisible(false);
    }
  };

  // Insert or Update Emp and Approver Record
  const handleEmployeeAndApprover = (portal, e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    setStatusSuccess(false);
    setModal({ isVisible: false });

    const postData = async (portal, Manipulation) => {
      setLoadVisible(true);
      if (portal === "Employee" && Manipulation === "Update") {
        formData.append("empID", empId);
      } else if (portal === "Approver" && Manipulation === "Update") {
        formData.append("AppId", appId);
      }
      await axiosInstance
        .post(`/dataEmployeesLeaveApprovers.php`, formData, {
          params: {
            portal: portal,
            Manipulation: Manipulation,
          },
        })
        .then((response) => {
          try {
            if (response.data.message === "Successfully.") {
              toast.success(
                portal === "Employee"
                  ? Manipulation === "Insert"
                    ? "Employee Added Successfully"
                    : "Employee Updated Successfully"
                  : Manipulation === "Insert"
                  ? "Approver Added Successfully"
                  : "Approver Updated Successfully"
              );
              if (portal === "Employee") {
                setUpdateEmployee({
                  Name: "",
                  Email: "",
                  Password: "",
                });
                if (Manipulation === "Update") {
                  setEditEmployee("Add Employee");
                }
              } else {
                setUpdateApprover({
                  Name: "",
                  Email: "",
                  Password: "",
                });
                if (Manipulation === "Update") {
                  form.reset();
                  setEditApprover("Add Approver");
                }
              }
              setStatusSuccess(true);
              form.reset();
            } else if (
              response.data.message ===
              (portal === "Employee"
                ? "Employee already exist"
                : "Approver already exist")
            ) {
              setModal({
                isVisible: true,
                bg: "bg-danger",
                title: "Error",
                description:
                  portal === "Employee"
                    ? "Employee already exist"
                    : "Approver already exist",
              });
            }
          } catch (error) {
            console.error("Error adding/updating employee:", error);
          } finally {
            setLoadVisible(false);
          }
        });
    };

    if (portal === "Employee") {
      if (editEmployee === "Add Employee") {
        postData(portal, "Insert");
      } else {
        postData(portal, "Update");
      }
    }
    // Approver Portal
    else {
      if (editApprover === "Add Approver") {
        postData(portal, "Insert");
      } else {
        postData(portal, "Update");
      }
    }
  };

  const fetchLeaveRequests = async (role) => {
    try {
      setLoadVisible(true);
      const response = await axiosInstance.get(`/leaveRequestDatafromapi.php`, {
        params: {
          email,
          portal: role === "Approver" ? "Approver Request" : "Employee",
        },
      });
      if (response.data.data) {
        setLeaveRequest(response.data.data.reverse());
      }
    } catch (error) {
      console.error("Error fetching leave requests:", error);
    } finally {
      setLoadVisible(false);
    }
  };

  // Call Function to get leave Request
  useEffect(() => {
    if (
      (role === "Approver" || role === "Employee") &&
      activeTab === "leave-requests" &&
      email
    ) {
      fetchLeaveRequests(role);
    }
  }, [email, activeTab, successLeaveDel, role]);

  const handleCancel = async (emprequestId) => {
    setLoadVisible(true);
    setSuccessLeaveDel(false);
    try {
      const response = await axiosInstance.delete(
        `/leaveRequestDatafromapi.php`,
        {
          params: { emprequestId: emprequestId },
        }
      );
      setLoadVisible(false);
      if (response.data.message === "Successful") {
        toast.success("Request Deleted Successfully");
        setSuccessLeaveDel(true);
      }
    } catch (error) {
      console.error("Error deleting leave request:", error);
    }
  };

  const updateCredentials = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    setModal({ isVisible: false });
    try {
      if (user.password !== user.confirmPassword) {
        setTimeout(() => {
          setModal({
            isVisible: true,
            bg: "bg-warning",
            title: "Warning",
            description: "The Password and Confirm Password fields must match.",
          });
        }, 100);
      } else {
        setLoadVisible(true);
        const response = await axiosInstance.post(
          `/updateCredentials.php`,
          formData,
          {
            params: { portal: role },
          }
        );
        setLoadVisible(false);
        if (response.data.status === 1) {
          toast.success("Credentials updated successfully");
          form.reset();
          if (updateMail === true) {
            setEmail(formData.get("update-email"));
          }
        } else {
          setModal({
            isVisible: true,
            bg: "bg-danger",
            title: "Error",
            description: response.data.message,
          });
        }
      }
    } catch (error) {
      console.error("Error updating admin credentials:", error);
    }
  };

  return (
    <div className="Head-Tabs">
      {role && (
        <span>
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
          <Modal
            show={modal.isVisible}
            bgColor={modal.bg}
            TitleMsg={modal.title}
            ModalDesc={modal.description}
          />
          <Spinner loadVisible={loadVisible} />
          <div className="container Panel">
            <div className="row">
              <div className="col-12">
                <ul className="nav nav-tabs justify-content-center">
                  {(role === "Employee" || role === "Approver") && (
                    <li className="nav-item">
                      <button
                        className={`nav-link ${
                          activeTab === "leave-requests" ? "active" : ""
                        }`}
                        onClick={() => handleTabClick("leave-requests")}
                      >
                        Leave Requests
                      </button>
                    </li>
                  )}
                  {(role === "Admin" || role === "Approver") && (
                    <li className="nav-item">
                      <button
                        className={`nav-link ${
                          activeTab === "add-employees" ? "active" : ""
                        }`}
                        onClick={() => handleTabClick("add-employees")}
                      >
                        Add Employees
                      </button>
                    </li>
                  )}
                  {role === "Admin" && (
                    <li className="nav-item">
                      <button
                        className={`nav-link ${
                          activeTab === "add-approvers" ? "active" : ""
                        }`}
                        onClick={() => handleTabClick("add-approvers")}
                      >
                        Add Approvers
                      </button>
                    </li>
                  )}
                  {(role === "Approver" || role === "Employee") && (
                    <li className="nav-item">
                      <button
                        className={`nav-link ${
                          activeTab === "calender" ? "active" : ""
                        }`}
                        onClick={() => handleTabClick("calender")}
                      >
                        Calender
                      </button>
                    </li>
                  )}
                  <li className="nav-item">
                    <button
                      className={`nav-link ${
                        activeTab === "credentials" ? "active" : ""
                      }`}
                      onClick={() => handleTabClick("credentials")}
                    >
                      Credentials
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div>
            <div className="tab-content panelTabContent">
              {(role === "Employee" || role === "Approver") && (
                <div
                  className={`tab-pane fade tableBtnAction ${
                    activeTab === "leave-requests" ? "show active" : ""
                  }`}
                  id="leave-requests"
                >
                  <div className="head mt-4">
                    <h2 className="mb-3">Leave Requests</h2>
                  </div>
                  <hr />
                  <div className="head mt-4">
                    {role === "Approver" && (
                      <div className="table-responsive">
                        <table className="table table-custom table-sm  mt-3">
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
                                  <td>
                                    {new Date(
                                      data.RequestDate
                                    ).toLocaleDateString("en-US", {
                                      day: "numeric",
                                      month: "long",
                                      year: "numeric",
                                    })}
                                  </td>
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
                                        >
                                          <i
                                            className="fa-solid fa-eye text-success fs-5 px-2"
                                            title="View"
                                          ></i>
                                        </Link>
                                        {new Date() -
                                          new Date(data.RequestDate) >=
                                          30 * 24 * 60 * 60 * 1000 && (
                                          <ConfirmModal
                                            modalIcon="fa-trash"
                                            modalId={index}
                                            modalDesc="Are you sure you want to delete the record?"
                                            deleteRecord={() =>
                                              handleCancel(data.EmployeeID)
                                            }
                                          />
                                        )}
                                      </>
                                    ) : (
                                      <Link
                                        to={`/review-request?requestId=${data.EmployeeID}`}
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
                    )}
                    {role === "Employee" && (
                      <div className="table-responsive">
                        <table className="table table-custom table-sm">
                          <thead>
                            <tr>
                              <th>Approver</th>
                              <th>Date</th>
                              <th>Evaluation Status</th>
                              <th>Request Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Array.isArray(leaveRequest) &&
                            leaveRequest.length > 0 ? (
                              leaveRequest.map((data, index) => (
                                <tr key={index}>
                                  <td>{data.LeaveApprover}</td>
                                  <td>
                                    {new Date(
                                      data.RequestDate
                                    ).toLocaleDateString("en-US", {
                                      day: "numeric",
                                      month: "long",
                                      year: "numeric",
                                    })}
                                  </td>

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
                                          to={`/review-request?requestId=${data.EmployeeID}`}
                                        >
                                          <i
                                            className="fa-solid fa-eye text-success fs-5 px-2"
                                            title="View"
                                          ></i>
                                        </Link>
                                        <ConfirmModal
                                          modalIcon="fa-xmark"
                                          modalId={index}
                                          modalDesc="Are you sure you want to cancel the request?"
                                          deleteRecord={() =>
                                            handleCancel(data.EmployeeID)
                                          }
                                        />
                                      </>
                                    ) : (
                                      <Link
                                        to={`/review-request?requestId=${data.EmployeeID}`}
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
                                <td colSpan="5">
                                  No requests found.{" "}
                                  <Link to="/leave-request">Click here</Link> to
                                  apply for leave.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {(role === "Admin" || role === "Approver") && (
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
                    onSubmit={(e) => handleEmployeeAndApprover("Employee", e)}
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
                        value={updateEmployee.Name}
                        onChange={(e) =>
                          setUpdateEmployee({
                            ...updateEmployee,
                            Name: e.target.value,
                          })
                        }
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
                        value={updateEmployee.Email}
                        onChange={(e) =>
                          setUpdateEmployee({
                            ...updateEmployee,
                            Email: e.target.value,
                          })
                        }
                        className="form-control"
                        placeholder="Enter email"
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">
                        Password
                        {editEmployee === "Update" ? "" : <span>*</span>}
                      </label>
                      <input
                        type="text"
                        name="empPassword"
                        className="form-control"
                        onChange={(e) =>
                          setUpdateEmployee({
                            ...updateEmployee,
                            Password: e.target.value,
                          })
                        }
                        placeholder={
                          editEmployee === "Update"
                            ? "Password will be old if not change"
                            : "Enter Password"
                        }
                        required={editEmployee === "Update" ? false : true}
                      />
                    </div>
                    <div className="col-12 mt-4">
                      <button
                        type="submit"
                        className="btn btn-danger p-2 w-100"
                      >
                        {editEmployee}
                      </button>
                    </div>
                  </form>
                  {empData && empData.length > 0 && (
                    <div className="head mt-5">
                      <h2>Edit Employee Data</h2>
                      <div className="table-responsive">
                        <table className="table table-custom table-sm  mt-3">
                          <thead>
                            <tr>
                              <th>Employee Name</th>
                              <th>Employee Email</th>
                              {role !== "Approver" && <th>Actions</th>}
                            </tr>
                          </thead>
                          <tbody>
                            {empData.map((data, index) => (
                              <tr key={index}>
                                <td>{data.Name}</td>
                                <td>{data.Email}</td>
                                {role !== "Approver" && (
                                  <td>
                                    <i
                                      className="fa-regular fa-pen-to-square text-success fs-5 px-2"
                                      title="Edit"
                                      onClick={() => {
                                        updateRecord(data.ID, "Employee");
                                      }}
                                    ></i>

                                    <ConfirmModal
                                      modalIcon="fa-trash"
                                      modalId={data.ID}
                                      modalDesc="Are you sure you want to delete the record?"
                                      deleteRecord={() => {
                                        deleteRecord(data.ID, "Employee");
                                      }}
                                    />
                                  </td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {role === "Admin" && (
                <div
                  className={`tab-pane fade ${
                    activeTab === "add-approvers" ? "show active" : ""
                  }`}
                  id="add-approvers"
                >
                  <div className="head mt-4">
                    <h2 className="mb-3">Add Leave Approvers</h2>
                  </div>
                  <hr />
                  <form
                    className="row g-3 mt-1 leaveForm"
                    onSubmit={(e) => handleEmployeeAndApprover("Approver", e)}
                    encType="multipart/form-data"
                    id="approverForm"
                  >
                    <div className="col-md-4">
                      <label className="form-label">
                        Full Name<span>*</span>
                      </label>
                      <input
                        type="text"
                        name="AppName"
                        value={updateApprover.Name}
                        onChange={(e) =>
                          setUpdateApprover({
                            ...updateApprover,
                            Name: e.target.value,
                          })
                        }
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
                        name="AppEmail"
                        className="form-control"
                        value={updateApprover.Email}
                        onChange={(e) =>
                          setUpdateApprover({
                            ...updateApprover,
                            Email: e.target.value,
                          })
                        }
                        placeholder="Enter email"
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">
                        Password
                        {editApprover === "Update" ? "" : <span>*</span>}
                      </label>
                      <input
                        type="text"
                        name="AppPass"
                        className="form-control"
                        onChange={(e) =>
                          setUpdateApprover({
                            ...updateApprover,
                            Password: e.target.value,
                          })
                        }
                        placeholder={
                          editApprover === "Update"
                            ? "Password will be old if not change"
                            : "Enter Password"
                        }
                        required={editApprover === "Update" ? false : true}
                      />
                    </div>
                    <div className="col-12 mt-4">
                      <button
                        type="submit"
                        className="btn btn-danger p-2 w-100"
                      >
                        {editApprover}
                      </button>
                    </div>
                  </form>
                  {approverData && approverData.length > 0 && (
                    <div className="head mt-5">
                      <h2>Edit Approver Data</h2>
                      <div className="table-responsive">
                        <table className="table table-custom table-sm  mt-3">
                          <thead>
                            <tr>
                              <th>Approver Name</th>
                              <th>Approver Email</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {approverData.map((data, index) => (
                              <tr key={index}>
                                <td>{data.Name}</td>
                                <td>{data.Email}</td>
                                <td>
                                  <i
                                    className="fa-regular fa-pen-to-square text-success fs-5 px-2"
                                    title="Edit"
                                    onClick={() => {
                                      updateRecord(data.ID, "Approver");
                                    }}
                                  ></i>
                                  <ConfirmModal
                                    modalIcon="fa-trash"
                                    modalId={data.ID}
                                    modalDesc="Are you sure you want to delete the record?"
                                    deleteRecord={() => {
                                      deleteRecord(data.ID, "Approver");
                                    }}
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {(role === "Approver" || role === "Employee") && (
                <div
                  className={`tab-pane fade ${
                    activeTab === "calender" ? "show active" : ""
                  }`}
                  id="calender"
                >
                  <Calender data={calender} />
                </div>
              )}
              <div
                className={`tab-pane fade ${
                  activeTab === "credentials" ? "show active" : ""
                }`}
                id="credentials"
              >
                <span className="d-flex justify-content-between align-items-center w-100">
                  <div className="head mt-2">
                    <h2>Credentials</h2>
                  </div>
                  {role === "Admin" && (
                    <div className="form-check col-md-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="updateEmailCheckbox"
                        checked={updateMail}
                        onChange={() => setUpdateMail(!updateMail)}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="updateEmailCheckbox"
                      >
                        Update email
                      </label>
                    </div>
                  )}
                </span>
                <hr />
                <form
                  className="row g-3 mt-1 leaveForm"
                  onSubmit={updateCredentials}
                  id="credForm"
                  encType="multipart/form-data"
                >
                  <div className="col-md-3">
                    <label className="form-label">
                      Email
                      <span>*</span>
                    </label>
                    <input
                      type="text"
                      name="Email"
                      className="form-control"
                      placeholder="Enter email"
                      value={email}
                      readOnly
                    />
                  </div>
                  {!updateMail && (
                    <>
                      <div className="col-md-3">
                        <label className="form-label">
                          Current Password<span>*</span>
                        </label>
                        <input
                          type="password"
                          name="oldPassword"
                          className="form-control"
                          placeholder="Enter current password"
                          required
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">
                          New Password<span>*</span>
                        </label>
                        <input
                          type="password"
                          name="newPassword"
                          className="form-control"
                          placeholder="Enter new password"
                          onChange={(e) => {
                            setUser((prev) => ({
                              ...prev,
                              password: e.target.value,
                            }));
                          }}
                          required
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">
                          Confirm New Password<span>*</span>
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          className="form-control"
                          placeholder="Confirm password"
                          onChange={(e) => {
                            setUser((prev) => ({
                              ...prev,
                              confirmPassword: e.target.value,
                            }));
                          }}
                          required
                        />
                      </div>
                    </>
                  )}

                  {updateMail && (
                    <div className="col-md-3">
                      <label className="form-label">
                        New Email<span>*</span>
                      </label>
                      <input
                        type="email"
                        name="update-email"
                        className="form-control"
                        placeholder="Enter new email"
                        required
                      />
                    </div>
                  )}
                  <div className="col-12 mt-4">
                    <button type="submit" className="btn btn-danger p-2 w-100">
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </span>
      )}
    </div>
  );
}
