import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";

export const AdminPanel = () => {
  const [adminEmail, setadminEmail] = useState("");
  const [adminPassword, setadminPassword] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [ModalDesc, setModalDesc] = useState("");
  const [approverData, setApproverData] = useState([]);
  const [empData, setEmpData] = useState([]);
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
      const response = await axios.post(
        `${window.location.origin}/api/addemployee.php`,
        formData
      );

      if (response.data.message === "Successfully.") {
        setIsModalVisible(true);
        setModalDesc("New Employee Added");
      }
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  // Add Approver
  const addApprover = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    try {
      const response = await axios.post(
        `${window.location.origin}/api/addapprover.php`,
        formData
      );

      if (response.data.message === "Successfully.") {
        setIsModalVisible(true);
        setModalDesc("New Leave Approver Added");
      }
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  // Update Admin Credentials
  const updateAdmin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${window.location.origin}/api/updateadmin.php`,
        { adminEmail, adminPassword }
      );

      if (response.data.message === "Successfully.") {
        setIsModalVisible(true);
        setModalDesc("Admin Credentials Updated");
        localStorage.setItem("Catering Admin Username", adminEmail);
        localStorage.setItem("Catering Admin Password", adminPassword);
      }
    } catch (error) {
      console.error("Error updating admin credentials:", error);
    }
  };

  // Get Employee Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${window.location.origin}/api/employeeDatafromapi.php`
        );
        setEmpData(response.data.data);
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
        const response = await axios.get(
          `${window.location.origin}/api/addapprover.php`
        );
        setApproverData(response.data.data);
      } catch (error) {
        console.error("Error fetching approvers:", error);
      }
    };

    fetchData();
  }, [navigate]);

  // Delete Emp Record
  const DelEmpRecord = async (empID) => {
    try {
      await axios.delete(
        `${window.location.origin}/api/employeeDatafromapi.php`,
        {
          data: { empID: empID },
        }
      );

      setIsModalVisible(true);
      setModalDesc("Record Deleted Successfully");
    } catch (error) {
      console.error("Error deleting record:", error);
      setIsModalVisible(true);
      setModalDesc("Error deleting record");
    }
  };

  // Delete Approver Record
  const DelAppRecord = async (appID) => {
    const response = await axios.delete(
      `${window.location.origin}/api/addapprover.php`,
      {
        data: { appID: appID },
      }
    );
    setIsModalVisible(true);
    setModalDesc("Record Deleted Successfully");
  };

  return (
    <div className="LeaveRequest">
      <Modal
        show={isModalVisible}
        bgColor={"bg-success"}
        TitleMsg={"Success"}
        ModalDesc={ModalDesc}
      />
      <div className="container AdminPanel">
        <div className="row">
          <div className="col-12">
            <div>
              <ul className="nav nav-tabs justify-content-center">
                <li className="nav-item">
                  <Link
                    className="nav-link active"
                    to="#employees"
                    data-bs-toggle="tab"
                  >
                    Employee
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="#approvers"
                    data-bs-toggle="tab"
                  >
                    Leave Approvers
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="#admin" data-bs-toggle="tab">
                    Admin
                  </Link>
                </li>
              </ul>
              <div className="tab-content">
                <div id="employees" className="active tab-pane fade in show">
                  <div className="head mt-4">
                    <h1 className="mb-3">Add New Employee</h1>
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
                    <h1>Edit Employee Data</h1>
                    <table border={1} className="employee-table">
                      <thead>
                        <tr>
                          <th>Employee Name</th>
                          <th>Employee Email</th>
                          <th>Employee Password</th>
                          <th>Delete Record</th>
                        </tr>
                      </thead>
                      <tbody>
                        {empData &&
                          empData.map((data, index) => (
                            <tr key={index}>
                              <td>{data.empName}</td>
                              <td>{data.empEmail}</td>
                              <td>{data.empPass}</td>
                              <td>
                                <button
                                  className="btn btn-danger"
                                  onClick={() => {
                                    DelEmpRecord(data.empID);
                                  }}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div id="approvers" className="tab-pane fade">
                  <div className="head mt-4">
                    <h1 className="mb-3">Add Leave Approvers</h1>
                  </div>
                  <hr />
                  <form
                    className="row g-3 mt-1 leaveForm"
                    onSubmit={addApprover}
                    encType="multipart/form-data"
                  >
                    <div className="col-md-6">
                      <label className="form-label">
                        Full Name<span>*</span>
                      </label>
                      <input
                        type="text"
                        name="AppName"
                        className="form-control"
                        placeholder="Enter full name"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">
                        Email<span>*</span>
                      </label>
                      <input
                        type="email"
                        name="AppEmail"
                        className="form-control"
                        placeholder="Enter email"
                        required
                      />
                    </div>
                    <div className="col-12 mt-4">
                      <button
                        type="submit"
                        className="btn btn-danger p-2 w-100"
                      >
                        Add Approver
                      </button>
                    </div>
                  </form>
                  <div className="head mt-5">
                    <h1>Edit Approver Data</h1>
                    <table border={1} className="employee-table">
                      <thead>
                        <tr>
                          <th>Approver Name</th>
                          <th>Approver Email</th>
                          <th>Delete Record</th>
                        </tr>
                      </thead>
                      <tbody>
                        {approverData &&
                          approverData.map((data, index) => (
                            <tr key={index}>
                              <td>{data.approverName}</td>
                              <td>{data.approverEmail}</td>
                              <td>
                                <button
                                  className="btn btn-danger"
                                  onClick={() => {
                                    DelAppRecord(data.approverID);
                                  }}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div id="admin" className="tab-pane fade">
                  <div className="head mt-4">
                    <h1 className="mb-3">Admin Panel</h1>
                  </div>
                  <hr />
                  <form
                    className="row g-3 mt-1 leaveForm"
                    onSubmit={updateAdmin}
                    encType="multipart/form-data"
                  >
                    <div className="col-md-6">
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
                    <div className="col-md-6">
                      <label className="form-label">
                        Passwords<span>*</span>
                      </label>
                      <input
                        type="text"
                        value={adminPassword}
                        name="adminPass"
                        className="form-control"
                        placeholder="Enter passwords"
                        onChange={(e) => {
                          setadminPassword(e.target.value);
                        }}
                        required
                      />
                    </div>
                    <div className="col-12 mt-4">
                      <button
                        type="submit"
                        className="btn btn-danger p-2 w-100"
                      >
                        Update Credentials
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
