import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "./../components/Layout";
import { Row, Input, Card } from "antd"; // Import Card component from antd
import DoctorList from "../components/DoctorList";

const HomePage = () => {
    const [doctors, setDoctors] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const getUserData = async () => {
        try {
            const res = await axios.get("/api/v1/user/getAllDoctors", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            });
            if (res.data.success) {
                setDoctors(res.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getUserData();
    }, []);

    const filterDoctorsBySpecialization = () => {
        return doctors.filter((doctor) =>
            doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    return (
        <Layout>
            <h1 className="text-center">Find Your Doctor</h1> {/* Updated title */}
            <div className="searchbar">
                <Input
                    placeholder="Search by specialization"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: 250, marginLeft: 10, marginBottom: 20, height: 40 }} // Increased marginBottom for spacing
                />
            </div>
            <Row gutter={[16, 16]}> {/* Added gutter for spacing between cards */}
                {filterDoctorsBySpecialization().map((doctor) => (
                    <DoctorList key={doctor.id} doctor={doctor} />
                ))}
            </Row>
        </Layout>
    );
};

export default HomePage;
