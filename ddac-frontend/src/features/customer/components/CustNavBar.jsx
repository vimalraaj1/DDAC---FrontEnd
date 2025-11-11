import { Link, useNavigate } from "react-router-dom";

export default function CustNavBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
      <Link to="/custDashboard" style={{ marginRight: "10px" }}>Dashboard</Link>
      <Link to="/appointments" style={{marginRight:"10px"}}>Appointments</Link>
      <Link to="/custProfile" style={{ marginRight: "10px" }}>Profile</Link>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
}
