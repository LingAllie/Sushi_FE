import React from "react";
import "../../../public/assets/css/notification.css"; // Add custom styles here

const Notification = ({ message, type, onClose }) => {
    return (
        <div className={`notification ${type}`}>
            <span>{message}</span>
            <button onClick={onClose} className="close-btn">&times;</button>
        </div>
    );
};

export default Notification;
