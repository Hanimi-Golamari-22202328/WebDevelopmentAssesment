import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/DoctorList.css"; // Import CSS file

const DoctorList = ({ doctor }) => {
    const navigate = useNavigate();

    return (
        <div className="dashboard-card" onClick={() => navigate(`/doctor/book-appointment/${doctor._id}`)}>
            <div className="dashboard-header">
                <h2 className="doctor-name">Dr. {doctor.firstName} {doctor.lastName}</h2>
            </div>
            <div className="dashboard-details">
                <p><strong>Specialization:</strong> {doctor.specialization}</p>
                <p><strong>Experience:</strong> {doctor.experience}</p>
                <p><strong>Fees Per Consultation:</strong> {doctor.feesPerCunsaltation}</p>
                <p><strong>Timings:</strong> {doctor.timings[0]} - {doctor.timings[1]}</p>
            </div>
        </div>
    );
};

export default DoctorList;
