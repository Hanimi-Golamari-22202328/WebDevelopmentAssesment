import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { message, Badge } from "antd";
import { adminMenu, userMenu, doctorMenu } from "../Data/data";


const Layout = ({ children }) => {
    const { user } = useSelector((state) => state.user);
    const location = useLocation();
    const navigate = useNavigate();

    // Logout function
    const handleLogout = () => {
        localStorage.clear();
        message.success("Logout Successfully");
        navigate("/login");
    };

    // Doctor menu
    const doctorMenu = [
        {
            name: "Home",
            path: "/",
            icon: "fa-solid fa-house",
        },
        {
            name: "Appointments",
            path: "/doctor-appointments",
            icon: "fa-solid fa-list",
        },
        {
            name: "Profile",
            path: `/doctor/profile/${user?._id}`,
            icon: "fa-solid fa-user",
        },
    ];

    // Rendering menu list
    const SidebarMenu = user?.isAdmin ? adminMenu : user?.isDoctor ? doctorMenu : userMenu;

    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            <div style={{ width: "220px", backgroundColor: "#001529", color: "#fff", padding: "20px", boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)" }}>
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                    <h6>Appointment</h6>
                    <hr style={{ borderColor: "#1890ff" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    {SidebarMenu.map((menu) => {
                        const isActive = location.pathname === menu.path;
                        return (
                            <div className={`menu-item ${isActive && "active"}`} style={{ display: "flex", alignItems: "center", padding: "10px", transition: "background-color 0.3s" }}>
                                <i className={menu.icon} style={{ marginRight: "10px" }}></i>
                                <Link to={menu.path} style={{ color: "inherit", textDecoration: "none" }}>{menu.name}</Link>
                            </div>
                        );
                    })}
                    <div className={`menu-item `} onClick={handleLogout} style={{ display: "flex", alignItems: "center", padding: "10px", transition: "background-color 0.3s", cursor: "pointer" }}>
                        <i className="fa-solid fa-right-from-bracket" style={{ marginRight: "10px" }}></i>
                        <Link to="/login" style={{ color: "inherit", textDecoration: "none" }}>Logout</Link>
                    </div>
                </div>
            </div>
            <div style={{ flex: "1", padding: "20px", backgroundColor: "#fff", marginLeft: "20px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", borderRadius: "5px" }}>
                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", backgroundColor: "#fff", padding: "15px 20px", borderRadius: "5px", boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <Badge count={user && user.notifcation.length} onClick={() => { navigate('/notification') }} style={{ marginRight: "20px" }}>
                            <i className="fa-solid fa-bell"></i>
                        </Badge>
                        <Link to="/profile" style={{ color: "#1890ff", fontSize: "1.2rem", textDecoration: "none" }}>{user?.name}</Link>
                    </div>
                </div>
                <div className="body">{children}</div>
            </div>
        </div>
    );
};

export default Layout;
