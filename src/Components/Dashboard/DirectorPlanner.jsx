import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useData } from "../ContextApi/Context";
import multiMonthPlugin from "@fullcalendar/multimonth";
import axiosInstance from "../axios";
import { ToastContainer, toast } from "react-toastify";
import ConfirmModal from "../Symbols/ConfirmModal";
import Spinner from "../Symbols/Spinner";
import { MobileTimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

function DirectorPlanner() {
  const [activeState, setActiveState] = useState(true);
  const [locationData, setLocationData] = useState([]);
  const [userRecord, setUserRecord] = useState([]);
  const [callDataApi, setCallDataApi] = useState(false);
  const { userName, email } = useData();
  const [loadVisible, setLoadVisible] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [btnText, setBtnText] = useState("Add Record");
  const [directorData, setDirectorData] = useState({
    location: "",
    description: "",
  });
  const [endTimeError, setEndTimeError] = useState("");

  const [showYearCalender, setShowYearCalender] = useState(false);

  const date = new Date();
  const today = date.toISOString().split("T")[0];

  useEffect(() => {
    if (window.innerWidth < 500) {
      setShowYearCalender(true);
    }
  }, []);

  useEffect(() => {
    if (!activeState) {
      setLoadVisible(true);
      axiosInstance.get("/directorRequest.php").then((response) => {
        if (response.data.status === 1) {
          setLoadVisible(false);
          const data = response.data.data;
          const locationData = data?.map((item) => ({
            title: `
              <b>Name:</b> ${item.name}<br/>
              <b>Date:</b> ${new Date(item.startDate).toLocaleDateString(
                "en-US",
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }
              )} - ${new Date(item.endDate).toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })} <br/>
              ${
                item.startTime !== null
                  ? `<b>Time:</b> ${item.startTime} - ${item.endTime}<br/>`
                  : ""
              }
              <b>Address:</b> ${item.location}<br/>
              ${
                item.description
                  ? `<b>Description:</b> ${item.description}`
                  : ""
              }
            `,
            start: item.startDate,
            end: new Date(
              new Date(item.endDate).getTime() + 24 * 60 * 60 * 1000
            )
              .toISOString()
              .split("T")[0],
            color: `${item.requestColor || "rgb(193, 255, 177)"}`,
          }));

          setLocationData(locationData);
        } else {
          setLoadVisible(false);
          setLocationData([]);
          toast.error("Failed to fetch data");
        }
      });
    } else {
      setLoadVisible(true);
      axiosInstance
        .get("/directorRequest.php", { params: { email } })
        .then((response) => {
          if (response.data.status === 1) {
            setLoadVisible(false);
            setUserRecord(response.data.data.reverse());
          } else {
            toast.error("Failed to fetch data");
          }
        });
    }
  }, [activeState, callDataApi, email]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoadVisible(true);
    const formData = new FormData(e.target);

    formData.append("name", userName);
    formData.append("email", email);

    if (startTime) {
      if (!endTime) {
        setEndTimeError("Please add end time");
        return setLoadVisible(false);
      }
      // else {
      //   if (endTime?.isAfter(startTime)) {
      //   } else {
      //     setEndTimeError("Please enter valid time");
      //     setLoadVisible(false);
      //     return;
      //   }
      // }
    }

    if (btnText === "Update Record") {
      formData.append("requestId", userRecord.find((item) => item.Id).Id);
      axiosInstance
        .post("/directorRequest.php", formData)
        .then((response) => {
          if (response.data.status === 1) {
            toast.success("Location updated successfully");
            e.target.reset();
            setCallDataApi((prev) => !prev);
            setStartDate("");
            setEndDate("");
            setStartTime(null);
            setEndTime(null);
            setDirectorData({
              location: "",
              description: "",
            });
            setBtnText("Add Record");
          } else {
            toast.error("Failed to update record");
          }
        })
        .catch((error) => {
          toast.error("Error updating record");
          console.error("Error updating location:", error);
        })
        .finally(() => {
          setLoadVisible(false);
        });
    } else {
      axiosInstance
        .post("/directorRequest.php", formData)
        .then((response) => {
          if (response.data.status === 1) {
            toast.success("Location added successfully");
            e.target.reset();
            setCallDataApi((prev) => !prev);
            setStartDate("");
            setEndDate("");
            setStartTime(null);
            setEndTime(null);
            setDirectorData({
              location: "",
              description: "",
            });
          } else {
            toast.error("Failed to add record");
          }
        })
        .catch((error) => {
          toast.error("Error adding record");
          console.error("Error adding location:", error);
        })
        .finally(() => {
          setLoadVisible(false);
          setEndTimeError("");
        });
    }
  };

  const handleCancel = async (requestId) => {
    try {
      setLoadVisible(true);
      const response = await axiosInstance.delete("/directorRequest.php", {
        params: { requestId },
      });
      if (response.data.status === 1) {
        setLoadVisible(false);
        toast.success("Request deleted successfully");
        setCallDataApi((prev) => !prev);
        setStartDate("");
        setEndDate("");
        setStartTime(null);
        setEndTime(null);
        setDirectorData({
          location: "",
          description: "",
        });
        setBtnText("Add Record");
      } else {
        toast.error(response.data.message || "Failed to delete request");
      }
    } catch (error) {
      toast.error("Error deleting request");
      console.error("Error deleting leave request:", error);
    }
  };

  const updateRecord = (requestId) => {
    window.scrollTo(270, 270);
    setBtnText("Update Record");
    const record = userRecord.find((item) => item.Id === requestId);
    if (record) {
      setDirectorData({
        location: record.location,
        description: record.description,
      });
      setStartDate(record.startDate);
      setEndDate(record.endDate);
      setStartTime(
        record.startTime ? dayjs(record.startTime, "hh:mm A") : null
      );
      setEndTime(record.endTime ? dayjs(record.endTime, "hh:mm A") : null);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="directPlanner">
        <Spinner loadVisible={loadVisible} />
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
        <div className="head mt-2">
          <div className="row">
            <div className="col-sm-5 col-12 text-center text-sm-start">
              <h2>Planner</h2>
            </div>
            <div className="col-sm-7 col-12 text-sm-end text-center mt-3 mt-sm-0">
              <span
                className={`tab ${activeState ? "active" : ""}`}
                onClick={() => {
                  setActiveState(true);
                }}
              >
                Add Location
              </span>
              <span
                className={`tab ${!activeState ? "active" : ""}`}
                onClick={() => {
                  setActiveState(false);
                }}
              >
                Calendar
              </span>
            </div>
          </div>
        </div>
        <hr />
        <div className="row mt-5">
          {activeState && (
            <>
              <div className="col-12 col-sm-12 form">
                <form onSubmit={handleSubmit}>
                  <h4 className="mb-3">Enter Location Record</h4>
                  <div className="mb-3">
                    <label className="form-label">
                      Enter your Location<span>*</span>
                    </label>
                    <input
                      className="form-control"
                      name="location"
                      type="text"
                      placeholder="Enter Location"
                      value={directorData.location}
                      onChange={(e) => {
                        setDirectorData((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }));
                      }}
                      required
                    />
                  </div>
                  <div className="row mb-3">
                    <div className="col-12 col-sm-6 mb-3 mb-sm-0">
                      <label className="form-label">
                        First Day at Location<span>*</span>
                      </label>
                      <input
                        className="form-control"
                        type="Date"
                        name="startDate"
                        value={startDate}
                        min={today}
                        onChange={(e) => {
                          setStartDate(e.target.value);
                          setEndDate("");
                        }}
                        required
                      />
                    </div>
                    <div className="col-12 col-sm-6">
                      <label className="form-label">
                        Last Day at Location<span>*</span>
                      </label>
                      <input
                        className="form-control"
                        type="Date"
                        name="endDate"
                        value={endDate}
                        min={startDate}
                        onChange={(e) => {
                          setEndDate(e.target.value);
                        }}
                        disabled={!startDate}
                        required
                      />
                    </div>
                  </div>
                  <div className="row mb-3 setTime">
                    <div className="col-12 col-sm-6">
                      <label className="form-label">Start Time</label>
                      <br />
                      <MobileTimePicker
                        className="w-100"
                        value={startTime}
                        name="startTime"
                        openTo="hours"
                        onChange={(newValue) => {
                          setStartTime(newValue);
                        }}
                        disabled={!endDate}
                      />
                    </div>
                    <div className="col-12 col-sm-6 mt-3 mt-sm-0">
                      <label className="form-label">End Time</label>
                      <MobileTimePicker
                        className="w-100"
                        name="endTime"
                        value={endTime}
                        onChange={(newValue) => {
                          setEndTime(newValue);
                          setEndTimeError("");
                        }}
                        readOnly={!startTime}
                      />
                      {endTimeError && (
                        <p className="text-danger ms-3 mt-1">{endTimeError}</p>
                      )}
                    </div>
                  </div>

                  <div className="col-12">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="1"
                      name="description"
                      placeholder="Enter Description"
                      value={directorData.description}
                      maxLength={120}
                      onChange={(e) => {
                        setDirectorData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }));
                      }}
                    />
                  </div>
                  <button
                    className="btn btn-danger mt-4 p-2 w-100"
                    type="submit"
                  >
                    {btnText}
                  </button>
                </form>
              </div>
              <div className="head mt-5">
                <h2 className="mb-3">All Requests</h2>
                <hr />
                <div className="table-responsive">
                  <table className="table table-custom table-planner table-sm mt-3">
                    <thead>
                      <tr>
                        <th>Location</th>
                        <th>Post Date</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Description</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(userRecord) && userRecord.length > 0 ? (
                        userRecord.map((data, index) => (
                          <tr key={index}>
                            <td>{data.location?.substring(0, 15)}</td>
                            <td>
                              {new Date(data.postDate).toLocaleDateString(
                                "en-US",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                }
                              )}
                            </td>
                            <td>
                              {new Date(data.startDate).toLocaleDateString(
                                "en-US",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                }
                              )}
                            </td>
                            <td>
                              {new Date(data.endDate).toLocaleDateString(
                                "en-US",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                }
                              )}
                            </td>
                            <td>
                              {data.startTime === null
                                ? "N / A"
                                : data.startTime}
                            </td>
                            <td>
                              {data.endTime === null ? "N / A" : data.endTime}
                            </td>
                            <td>
                              {data.description?.substring(0, 15) || "N / A"}
                            </td>

                            <td className="gap-2">
                              <i
                                className="fa-regular fa-pen-to-square text-success fs-5 px-2"
                                title="Edit"
                                onClick={() => {
                                  updateRecord(data.Id);
                                }}
                              />
                              <ConfirmModal
                                modalIcon="fa-trash"
                                modalId={index}
                                modalDesc="Are you sure you want to delete the record?"
                                deleteRecord={() => handleCancel(data.Id)}
                              />
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5">No Request Added</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
          {!activeState && (
            <div className="Calender col-sm-12">
              <FullCalendar
                plugins={[dayGridPlugin, listPlugin, multiMonthPlugin]}
                initialView={
                  showYearCalender ? "multiMonthYear" : "dayGridMonth"
                }
                headerToolbar={{
                  start: "prev,next,today",
                  center: "title",
                  end: showYearCalender
                    ? ""
                    : "dayGridMonth,multiMonthYear,listWeek",
                }}
                events={locationData}
                eventContent={(arg) => (
                  <div
                    className="fc-event"
                    style={{
                      borderLeft: "2px solid red",
                      padding: "5px",
                      color: "black",
                      whiteSpace: "normal",
                      overflow: "visible",
                      height: "auto",
                    }}
                    dangerouslySetInnerHTML={{ __html: arg.event.title }}
                  />
                )}
              />
            </div>
          )}
        </div>
      </div>
    </LocalizationProvider>
  );
}

export default DirectorPlanner;
