import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import "../../../src/assets/styles.css";
import useQuery from "../../hooks/useQuery";
import tableService from "../../services/tableService";
import {PATHS} from "../../constants/path";

const TablePage = () => {
  const { search } = useLocation();
  const {
    data: tableData,
    refetch: tableRefetch,
    loading: tableLoading,
    error: tableError,
  } = useQuery(tableService.getTables);
  const tables = tableData?.tables || [];

  const [notification, setNotification] = useState({ message: "", type: "" });

  useEffect(() => {
    tableRefetch(search);
  }, [search]);

  const [selectedTable, setSelectedTable] = useState(null);
  const [showReservedModal, setShowReservedModal] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const navigate = useNavigate();

  const handleClick = (table) => {
    // Set the selected table and tableID to the formData
    if (table.status === "available") {
      setSelectedTable(table);
      setFormData({
        ...formData,
        tableID: table.tableID, // Automatically set the tableID here
      });
      setModalShow(true);
    } else if (table.status === "reserved") {
      setSelectedTable(table);
      setShowReservedModal(true);
    }
  };

  const formatDate = (date) => {
    const pad = (num) => (num < 10 ? "0" + num : num);

    let hours = date.getHours();
    const minutes = pad(date.getMinutes());
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(hours)}:${minutes} ${period}`;
  };

  const [formData, setFormData] = useState({
    customer_name: "",
    phone_number: 1,
    number_of_guests: 1,
    date: formatDate(new Date()),
    note: "",
    tableID: null,
  });

  const handleChange = (field, value) => {
    if (typeof value === "number") {
      value = Number(value);
    }
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: "", type: "" });
    }, 3000); // Hide after 3 seconds
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.tableID) {
      handleNotification("Please select a table.", "error");
      return;
    }

    if (!formData.date) {
      handleNotification("Please select a date.", "error");
      return;
    }

    try {
      const response = await tableService.reservationTable(formData);
      setModalShow(false);
      await tableRefetch();
      handleNotification("Reservation successful!", "success");
      setFormData({
        customer_name: "",
        phone_number: 1,
        number_of_guests: 1,
        date: null,
        note: "",
        tableID: null,
      });
    } catch (error) {
      console.error("Error making reservation:", error);
      handleNotification("Error making reservation. Please try again later.", "error");
    }
  };

  const handleOpen = async () => {
    try {
      await tableService.openTable(selectedTable.tableID);
      setModalShow(false);
      navigate(`${PATHS.MENU}/${selectedTable.tableID}`);
      handleNotification("Table opened successfully", "success");
    } catch (error) {
      console.error("Error opening table:", error);
      handleNotification("Error opening table. Please try again later.", "error");
    }
  };

  const handleCancelTable = async (tableId) => {
    try {
      await tableService.cancleTable(tableId);
      setShowReservedModal(false);
      await tableRefetch();
      handleNotification("Cancelled successfully!", "success");
    } catch (error) {
      console.error("Error making a cancelled reservation table:", error);
      handleNotification("Error cancelling reservation. Please try again later.", "error");
    }
  };

  const items = [
    {
      label: <a target="_blank" rel="noopener noreferrer" href="#">Logout</a>,
      key: "0",
    },
  ];

  const onChange = (key) => {
    setActiveTab(key);
    if (key === "2") {
      const tabPane = document.getElementById("rc-tabs-0-panel-1");
      if (tabPane) {
        tabPane.style.display = "none";
      }
    }
    if (key === "1") {
      const tabPane = document.getElementById("rc-tabs-0-panel-1");
      if (tabPane) {
        tabPane.style.display = "block";
      }
    }
  };


  return (
      <div className="tablepage">
        <div className="tablepage__list">
          {tables && tables.map((table, index) => (
              <div
                  key={index}
                  className={`table-card ${table.status}`}
                  onClick={() => handleClick(table)}
              >
                <div className={`table-card__header ${table.status}`}>
                  {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
                </div>
                <div className="table-card__body">
                  <h5>Table {table.tableID}</h5>
                  <div>
                    {table.status === "reserved" ? (
                        <center>Detail information</center>
                    ) : table.status === "dining" ? (
                        <center>Table in dining</center>
                    ) : (
                        <center>Table is available</center>
                    )}
                  </div>
                </div>
              </div>
          ))}
        </div>

        {/* Reservation Modal */}
        <div className={`modal ${modalShow ? "show" : ""}`}>
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" onClick={() => setModalShow(false)}>&times;</button>
              <h4>Table Options</h4>
            </div>
            <div className="modal-body">
              <div className="tabs">
                <div className={`tab ${activeTab === "1" ? "active" : ""}`} onClick={() => onChange("1")}>Open Table
                </div>
                <div className={`tab ${activeTab === "2" ? "active" : ""}`} onClick={() => onChange("2")}>Reservation
                </div>
              </div>

              {activeTab === "1" && (
                  <button className="btn btn-primary" onClick={handleOpen}>Open Table</button>
              )}
              {activeTab === "2" && (
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label>Table Setter</label>
                      <input type="text" value={formData.customer_name}
                             onChange={(e) => handleChange("customer_name", e.target.value)} required/>
                    </div>
                    <div className="form-group">
                      <label>Phone number</label>
                      <input type="number" value={formData.phone_number}
                             onChange={(e) => handleChange("phone_number", e.target.value)} required/>
                    </div>
                    <div className="form-group">
                      <label>Quantity</label>
                      <input type="number" value={formData.number_of_guests}
                             onChange={(e) => handleChange("number_of_guests", e.target.value)} required/>
                    </div>
                    <div className="form-group">
                      <label>Date Reserve</label>
                      <input type="text" value={formData.date}
                             onChange={(e) => handleChange("date", e.target.value)} required/>
                    </div>
                    <div className="form-group">
                      <label>Note</label>
                      <textarea value={formData.note} onChange={(e) => handleChange("note", e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-primary">Reserve</button>
                  </form>
              )}
            </div>
          </div>
        </div>

        {/* Reserved Modal */}
        <div className={`modal ${showReservedModal ? "show" : ""}`}>
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" onClick={() => setShowReservedModal(false)}>&times;</button>
              <h4>Reserved Table Info</h4>
            </div>
            <div className="modal-body">
              {selectedTable && selectedTable.reservedInfo && (
                  <div className="info">
                    <table className="info-table">
                      <tbody>
                      <tr>
                        <td colSpan="2"><strong>Table setter</strong></td>
                        <td>{selectedTable.reservedInfo.customer_name}</td>
                      </tr>
                      <tr>
                        <td colSpan="2"><strong>Phone number</strong></td>
                        <td>{selectedTable.reservedInfo.phone_number}</td>
                      </tr>
                      <tr>
                        <td colSpan="2"><strong>Quantity</strong></td>
                        <td>{selectedTable.reservedInfo.number_of_guests}</td>
                      </tr>
                      <tr>
                        <td colSpan="2"><strong>Note</strong></td>
                        <td>{selectedTable.reservedInfo.note}</td>
                      </tr>
                      <tr>
                        <td colSpan="2"><strong>Reserved date</strong></td>
                        <td>{selectedTable.reservedInfo.date}</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
              )}
            </div>
            <div className="modal-footer">
              <button onClick={() => handleCancelTable(selectedTable.tableID)}>Cancel Reservation</button>
              <button onClick={() => handleOpen(selectedTable.tableID)}>Open table</button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default TablePage;
