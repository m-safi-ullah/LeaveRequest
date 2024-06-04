import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";

export const AdminPanel = () => {
  const [adminEmail, setadminEmail] = useState("");
  const [adminPassword, setadminPassword] = useState("");
  const [ConfirmAdminPassword, setConfirmAdminPassword] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [ModalDesc, setModalDesc] = useState("");
  const [approverData, setApproverData] = useState([]);
  const [loadVisible, setloadVisible] = useState(false);
  const [empData, setEmpData] = useState([]);
  const [EditEmployee, setEditEmployee] = useState("Add Employee");
  const [EditApprover, setEditApprover] = useState("Add Approver");
  const [updateEmployee, setUpdateEmployee] = useState({});
  const [updateApprover, setUpdateApprover] = useState({});
  const [EmpId, setEmpId] = useState("");
  const [AppId, setAppId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("Catering Admin Username");
    const storedPassword = localStorage.getItem("Catering Admin Password");
    setadminEmail(storedUsername);
    setadminPassword(storedPassword);

    if (!storedUsername && !storedPassword) {
      navigate("/admin-login");
    }
  }, [navigate]);

  // Add New Employees
  const addEmployee = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    try {
      setloadVisible(true);
      if (EditEmployee === "Add Employee") {
        await axios
          .post(
            `${window.location.origin}/api/dataEmployeesLeaveApprovers.php`,
            formData,
            {
              params: {
                portal: "Employee",
                Manipulation: "Insert",
              },
            }
          )
          .then((response) => {
            if (response.data.message === "Successfully.") {
              setIsModalVisible(true);
              setModalDesc("New Employee Added");
            }
          });
        setloadVisible(false);
      } else {
        formData.append("empID", EmpId);
        await axios
          .post(
            `${window.location.origin}/api/dataEmployeesLeaveApprovers.php`,
            formData,
            {
              params: {
                portal: "Employee",
                Manipulation: "Update",
              },
            }
          )
          .then((response) => {
            setloadVisible(false);
            if (response.data.message === "Successfully.") {
              setIsModalVisible(true);
              setModalDesc("Record Updated Successfully");
            }
          });
      }
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  // Add New Approver
  const dataEmployeesLeaveApprovers = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    try {
      setloadVisible(true);
      if (EditApprover === "Add Approver") {
        await axios
          .post(
            `${window.location.origin}/api/dataEmployeesLeaveApprovers.php`,
            formData,
            {
              params: {
                portal: "Approver",
                Manipulation: "Insert",
              },
            }
          )
          .then((response) => {
            if (response.data.message === "Successfully.") {
              setIsModalVisible(true);
              setModalDesc("Approver Added Successfully");
            }
          });
      } else {
        formData.append("AppId", AppId);
        await axios
          .post(
            `${window.location.origin}/api/dataEmployeesLeaveApprovers.php`,
            formData,
            {
              params: {
                portal: "Approver",
                Manipulation: "Update",
              },
            }
          )
          .then((response) => {
            if (response.data.message === "Successfully.") {
              setIsModalVisible(true);
              setModalDesc("Record Updated Successfully");
            }
          });
      }
      setloadVisible(false);
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  // Update Admin Credentials
  const updateAdmin = async (e) => {
    e.preventDefault();
    if (adminPassword !== ConfirmAdminPassword) {
      alert("The Password and Confirm Password fields must match.");
    } else {
      try {
        setloadVisible(true);
        const response = await axios.post(
          `${window.location.origin}/api/updateCredentials.php`,
          { adminEmail, adminPassword },
          {
            params: {
              portal: "Admin",
            },
          }
        );
        setloadVisible(false);
        if (response.data.message === "Successfully.") {
          setIsModalVisible(true);
          setModalDesc("Credentials Updated Successfully");
          localStorage.setItem("Catering Admin Username", adminEmail);
          localStorage.setItem("Catering Admin Password", adminPassword);
        }
      } catch (error) {
        console.error("Error updating admin credentials:", error);
      }
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
            params: {
              portal: "Employee",
            },
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

  // Get Approver Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setloadVisible(true);
        const response = await axios.get(
          `${window.location.origin}/api/dataEmployeesLeaveApprovers.php`,
          {
            params: {
              portal: "Approver",
            },
          }
        );
        setloadVisible(false);
        setApproverData(response.data.data.reverse());
      } catch (error) {
        console.error("Error fetching approvers:", error);
      }
    };

    fetchData();
  }, [navigate]);

  // Delete Emp Record
  const DelEmpRecord = async (empID) => {
    try {
      if (confirm("Are you sure you want to delete.") === true) {
        await axios.delete(
          `${window.location.origin}/api/dataEmployeesLeaveApprovers.php`,
          {
            data: { empID: empID },
            params: { portal: "Employee" },
          }
        );

        setIsModalVisible(true);
        setModalDesc("Employee Deleted Successfully");
      }
    } catch (error) {
      console.error("Error deleting record:", error);
      setIsModalVisible(true);
      setModalDesc("Error deleting record");
    }
  };

  // Update Emp Record
  const UpdEmpRecord = (empID) => {
    setEditEmployee("Update");
    const getEmpData = empData.filter((data) => data.ID === empID);
    setUpdateEmployee(getEmpData[0]);
    setEmpId(empID);
  };

  // Delete Approver Record
  const DelAppRecord = async (appID) => {
    try {
      if (confirm("Are you sure you want to delete.") === true) {
        await axios.delete(
          `${window.location.origin}/api/dataEmployeesLeaveApprovers.php`,
          {
            data: { appID: appID },
            params: { portal: "Approver" },
          }
        );

        setIsModalVisible(true);
        setModalDesc("Approver Deleted Successfully");
      }
    } catch (error) {
      console.error("Error deleting record:", error);
      setIsModalVisible(true);
      setModalDesc("Error deleting record");
    }
  };

  // Update Approver Record
  const UpdAppRecord = (empID) => {
    setEditApprover("Update");
    const getAppData = approverData.filter((data) => data.ID === empID);
    setUpdateApprover(getAppData[0]);
    setAppId(empID);
  };
  return (
    <div className="LeaveRequest">
      <Modal
        show={isModalVisible}
        bgColor={"bg-success"}
        TitleMsg={"Success"}
        ModalDesc={ModalDesc}
      />
      <Spinner loadVisible={loadVisible} />
      <div className="container Panel">
        <div className="row">
          <div className="col-12">
            <ul className="nav nav-tabs justify-content-center">
              <li className="nav-item">
                <Link
                  className="nav-link active"
                  to="#employees"
                  data-bs-toggle="tab"
                >
                  Add Employees
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="#approvers" data-bs-toggle="tab">
                  Add Approvers
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="#admin" data-bs-toggle="tab">
                  Credentials
                </Link>
              </li>
            </ul>
            <div className="tab-content panelTabContent">
              <div id="employees" className="active tab-pane fade in show">
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
                      value={updateEmployee.Name}
                      onChange={(e) => {
                        setUpdateEmployee(e.target.value);
                      }}
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
                      className="form-control"
                      placeholder="Enter email"
                      onChange={(e) => {
                        setUpdateEmployee(e.target.value);
                      }}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">
                      Password<span>*</span>
                    </label>
                    <input
                      type="text"
                      name="empPassword"
                      className="form-control"
                      placeholder="Enter password"
                      value={updateEmployee.Password}
                      onChange={(e) => {
                        setUpdateEmployee(e.target.value);
                      }}
                      required
                    />
                  </div>
                  <div className="col-12 mt-4">
                    <button type="submit" className="btn btn-danger p-2 w-100">
                      {EditEmployee}
                    </button>
                  </div>
                </form>
                <div className="head mt-5">
                  <h2>Edit Employee Data</h2>
                  <table border={1} className="employee-table overflow-auto">
                    <thead>
                      <tr>
                        <th>Employee Name</th>
                        <th>Employee Email</th>
                        <th></th>
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
                                className="btn btn-success mx-2"
                                onClick={() => {
                                  UpdEmpRecord(data.ID);
                                }}
                              >
                                Edit
                              </button>
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
                          <td colSpan={4}>No Request Found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div id="approvers" className="tab-pane fade">
                <div className="head mt-4">
                  <h2 className="mb-3">Add Leave Approvers</h2>
                </div>
                <hr />
                <form
                  className="row g-3 mt-1 leaveForm"
                  onSubmit={dataEmployeesLeaveApprovers}
                  encType="multipart/form-data"
                >
                  <div className="col-md-4">
                    <label className="form-label">
                      Full Name<span>*</span>
                    </label>
                    <input
                      type="text"
                      name="AppName"
                      value={updateApprover.Name}
                      onChange={(e) => {
                        setUpdateApprover(e.target.value);
                      }}
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
                      onChange={(e) => {
                        setUpdateApprover(e.target.value);
                      }}
                      placeholder="Enter email"
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">
                      Password<span>*</span>
                    </label>
                    <input
                      type="text"
                      name="AppPass"
                      className="form-control"
                      value={updateApprover.Password}
                      onChange={(e) => {
                        setUpdateApprover(e.target.value);
                      }}
                      placeholder="Enter Password"
                      required
                    />
                  </div>
                  <div className="col-12 mt-4">
                    <button type="submit" className="btn btn-danger p-2 w-100">
                      {EditApprover}
                    </button>
                  </div>
                </form>
                <div className="head mt-5">
                  <h2>Edit Approver Data</h2>
                  <table border={1} className="employee-table overflow-auto">
                    <thead>
                      <tr>
                        <th>Approver Name</th>
                        <th>Approver Email</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {approverData && approverData.length > 0 ? (
                        approverData.map((data, index) => (
                          <tr key={index}>
                            <td>{data.Name}</td>
                            <td>{data.Email}</td>
                            <td>
                              <button
                                className="btn btn-success mx-2"
                                onClick={() => {
                                  UpdAppRecord(data.ID);
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger"
                                onClick={() => {
                                  DelAppRecord(data.ID);
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
              <div id="admin" className="tab-pane fade">
                <div className="head mt-4">
                  <h2 className="mb-3">Credentials</h2>
                </div>
                <hr />
                <form
                  className="row g-3 mt-1 leaveForm"
                  onSubmit={updateAdmin}
                  encType="multipart/form-data"
                >
                  <div className="col-md-4">
                    <label className="form-label">
                      Username or Email<span>*</span>
                    </label>
                    <input
                      type="text"
                      name="adminEmail"
                      className="form-control"
                      placeholder="Enter email"
                      value={adminEmail}
                      onChange={(e) => {
                        setadminEmail(e.target.value);
                      }}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">
                      Password<span>*</span>
                    </label>
                    <input
                      type="password"
                      name="adminPass"
                      className="form-control"
                      placeholder="Enter password"
                      onChange={(e) => {
                        setadminPassword(e.target.value);
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
                      name="adminPass"
                      className="form-control"
                      placeholder="Confirm password"
                      onChange={(e) => {
                        setConfirmAdminPassword(e.target.value);
                      }}
                      required
                    />
                  </div>
                  <div className="col-12 mt-4">
                    <button type="submit" className="btn btn-danger p-2 w-100">
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
  );
};
