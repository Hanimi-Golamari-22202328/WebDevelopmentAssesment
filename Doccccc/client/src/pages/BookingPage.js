import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Select, DatePicker, message } from "antd";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import "../styles/booking.css";

const { Option } = Select;

const BookingPage = () => {
    const { user } = useSelector((state) => state.user);
    const params = useParams();
    const [doctors, setDoctors] = useState({});
    const [date, setDate] = useState();
    const [time, setTime] = useState();
    const [isAvailable, setIsAvailable] = useState(false);
    const [notes, setNotes] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const getUserData = async () => {
        try {
            const res = await axios.post(
                "/api/v1/doctor/getDoctorById",
                { doctorId: params.doctorId },
                {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                }
            );
            if (res.data.success) {
                setDoctors(res.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleAvailability = async () => {
        try {
            if (!date || !time) {
                return message.error("Date & Time Required");
            }
            dispatch(showLoading());
            const res = await axios.post(
                "/api/v1/user/booking-availbility",
                { doctorId: params.doctorId, date, time },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            dispatch(hideLoading());
            if (res.data.success) {
                setIsAvailable(true);
                message.success(res.data.message);
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log(error);
        }
    };

    const handleBooking = async () => {
        try {
            if (!date || !time) {
                return message.error("Date & Time Required");
            }
            dispatch(showLoading());
            const res = await axios.post(
                "/api/v1/user/book-appointment",
                {
                    doctorId: params.doctorId,
                    userId: user._id,
                    doctorInfo: doctors,
                    userInfo: user,
                    date: date,
                    time: time,
                    problem: notes,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            dispatch(hideLoading());
            if (res.data.success) {
                message.success(res.data.message);
                navigate("/appointments");
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log(error);
        }
    };

    const getAvailableTimes = () => {
        const startTime = moment(doctors.timings && doctors.timings[0], "HH:mm");
        const endTime = moment(doctors.timings && doctors.timings[1], "HH:mm");
        const step = 30;
        const times = [];

        let currentTime = startTime;
        while (currentTime.isBefore(endTime)) {
            times.push(currentTime.format("HH:mm"));
            currentTime = currentTime.add(step, "minutes");
        }

        return times;
    };

    const availableTimes = getAvailableTimes();

    useEffect(() => {
        getUserData();
        //eslint-disable-next-line
    }, []);

    return (
        <Layout>
            <div className="booking-container">
                {doctors && (
                    <div>
                        <h3>Booking Page</h3>
                        <div className="doctor-info">
                            <h4>Dr. {doctors.firstName} {doctors.lastName}</h4>
                            <h4>Fees: {doctors.feesPerCunsaltation}</h4>
                            <h4>Timings: {doctors.timings && doctors.timings[0]} - {doctors.timings && doctors.timings[1]}</h4>
                        </div>
                        <div className="booking-form">
                            <DatePicker
                                className="m-2"
                                format="DD-MM-YYYY"
                                onChange={(values) => {
                                    setIsAvailable(false);
                                    setDate(values.format("DD-MM-YYYY"));
                                }}
                            />
                            <Select
                                className="mt-2"
                                placeholder="Select Time"
                                onChange={(value) => {
                                    setIsAvailable(false);
                                    setTime(value);
                                }}
                            >
                                {availableTimes.map((time) => (
                                    <Option key={time} value={time}>
                                        {time}
                                    </Option>
                                ))}
                            </Select>
                            <textarea
                                className="mt-2"
                                placeholder="Describe your problem (Optional)"
                                maxLength={100}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                            <div className="button-container">
                                <button className="btn" onClick={handleAvailability}>
                                    Check Availability
                                </button>
                                <button className="btn" onClick={handleBooking}>
                                    Book Now (Pay Later)
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default BookingPage;
