import React, { useEffect, useState } from "react";
import axiosInstance from "./axios";
import Spinner from "./Symbols/Spinner";
import Modal from "./Symbols/Modal";
import { Link, useNavigate } from "react-router-dom";
import { useData } from "./ContextApi/Context";
import Cookies from "js-cookie";

export default function LeaveRequest() {
  const { email, role } = useData();
  const token = Cookies.get("token");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [approvers, setApprovers] = useState([]);
  const [loadVisible, setloadVisible] = useState(false);
  const [LoginAlert, setLoginAlert] = useState(false);
  const [halfDayCheck, setHalfDayCheck] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!token || role != "Employee") {
      navigate("/login");
    }
  }, [navigate, []]);

  const date = new Date();
  date.setDate(date.getDate() - 7);
  const today = date.toISOString().split("T")[0];

  const UploadDocumentImg = (e) => {
    e.target.files[0];
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          `/dataEmployeesLeaveApprovers.php`,
          {
            params: { portal: "Approver" },
          }
        );
        if (response.data && response.data.data) {
          setApprovers(response.data.data);
        } else {
          setApprovers([]);
          console.error("No data received:", response);
        }
      } catch (error) {
        console.error("Error fetching approvers:", error);
        setApprovers([]);
      }
    };

    fetchData();
  }, []);

  const requestLeave = async (e) => {
    setIsModalVisible(false);
    const finalEndDate = halfDayCheck ? startDate : endDate;
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    formData.set("LDate", finalEndDate);
    setloadVisible(true);
    await axiosInstance
      .post(`/leaveRequestDatafromapi.php`, formData)
      .then((response) => {
        if (response.data.status === 1) {
          setloadVisible(false);
          setIsModalVisible(true);
          form.reset();
          setStartDate("");
          setHalfDayCheck("");
          setEndDate("");
        } else {
          setloadVisible(true);
        }
      });
  };

  function calculateWorkdays(startDate, endDate) {
    let count = 0;
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
        count++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (count > 1) {
      return count + " Days";
    } else {
      return count + " Day";
    }
  }

  useEffect(() => {
    if (halfDayCheck) {
      setEndDate("");
    }
  }, [halfDayCheck]);

  return (
    <div className="Head-Tabs">
      {LoginAlert && (
        <div className="alert alert-info" role="alert">
          Please update your password by clicking{" "}
          <Link to="/employee-panel#credentials"> here</Link>.
        </div>
      )}
      <Spinner loadVisible={loadVisible} />
      <Modal
        show={isModalVisible}
        bgColor={"bg-success"}
        TitleMsg={"Success"}
        ModalDesc={
          "Your leave request has been successfully submitted. We have received your information and will review it shortly."
        }
      />
      <div className="head">
        <h1 className="mb-3">Leave Application Form</h1>
        <p className="mb-3">
          Please fill out the form with all the necessary information. We will
          contact you shortly regarding the status of your leave request.
        </p>
      </div>
      <hr />

      <form
        className="row g-3 mt-1 leaveForm"
        onSubmit={requestLeave}
        encType="multipart/form-data"
      >
        <div className="col-md-6">
          <label className="form-label">
            First Name<span>*</span>
          </label>
          <input
            type="text"
            name="FirstName"
            className="form-control"
            placeholder="Enter first name"
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">
            Last Name<span>*</span>
          </label>
          <input
            type="text"
            name="LastName"
            className="form-control"
            placeholder="Enter last name"
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">
            Email<span>*</span>
          </label>
          <input
            type="email"
            name="Email"
            value={email}
            readOnly
            className="form-control"
            placeholder="Enter email"
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">
            Leave Type<span>*</span>
          </label>
          <select className="form-select" name="LeaveType">
            <option value="Annual Leave">Annual Leave</option>
            <option value="Sick Leave">Sick Leave</option>
            <option value="Carers Leave">Carers Leave</option>
            <option value="Compassionate Leave">Compassionate Leave</option>
            <option value="Unpaid Leave">Unpaid Leave</option>
            <option value="Long Service Leave">Long Service Leave</option>
            <option value="Domestic Violence Leave">
              Domestic Violence Leave
            </option>
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">
            First Day of Absence<span>*</span>
          </label>
          <input
            type="date"
            name="FDate"
            className="form-control"
            value={startDate}
            min={today}
            onChange={(e) => {
              setStartDate(e.target.value);
            }}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">
            Last Day of Absence<span>*</span>
          </label>
          <div className="d-flex">
            <div className="col-8">
              <input
                type="date"
                className="form-control"
                name="LDate"
                min={startDate}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={!startDate || halfDayCheck}
                required
              />
            </div>
            <div className="form-check ms-3 col-4 m-auto">
              <input
                className="form-check-input"
                type="checkbox"
                checked={halfDayCheck}
                onChange={() => setHalfDayCheck(!halfDayCheck)}
                disabled={!startDate}
              />
              <label className="form-check-label">Half Day Leave</label>
            </div>
          </div>
        </div>

        {startDate && (endDate || halfDayCheck) && (
          <div className="col-12">
            <label className="form-label">No. of days requested</label>
            <input
              type="text"
              readOnly
              name="TDate"
              className="form-control"
              placeholder="Automatically populated upon date selection."
              value={
                endDate
                  ? `${calculateWorkdays(
                      new Date(startDate),
                      new Date(endDate)
                    )}`
                  : halfDayCheck
                  ? "Half Day"
                  : ""
              }
            />
          </div>
        )}

        <div className="col-md-6">
          <label className="form-label">
            Leave Approver<span>*</span>
          </label>
          <select className="form-select" name="LeaveApprover">
            {approvers.length > 0 ? (
              approvers.map((element, index) => (
                <option key={index} value={element.Email}>
                  {element.Name}
                </option>
              ))
            ) : (
              <option value="">No approvers available</option>
            )}
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label">Attach Documents</label>
          <input
            type="file"
            onChange={UploadDocumentImg}
            className="form-control"
            name="DocumentImg"
          />
        </div>
        <div className="col-12">
          <label className="form-label">Comments/Notes</label>
          <textarea
            className="form-control"
            rows="3"
            placeholder="e.g., note for Manager or Payroll."
            name="Comments"
          />
        </div>
        <div className="col-12 mt-4">
          <button type="submit" className="btn btn-danger p-2 w-100">
            Submit Request
          </button>
        </div>
      </form>
    </div>
  );
}
