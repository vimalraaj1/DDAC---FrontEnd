import CustNavBar from "./components/CustNavBar";

export default function CustDashboard() {
    return (
        <div>
            <CustNavBar/>

            <div style={{padding: "20px"}}>
                <h1>Welcome to the Customer Dashboard</h1>
                <p>To Implement:</p>
                    <div>
                        <li>Add Appoinments</li>
                        <li>View Bookings</li>
                        <li>Others</li>
                    </div>
            </div>
        </div>
    )
}