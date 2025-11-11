import CustNavBar from "./components/CustNavBar";

export default function CustProfile() {
    return (
        <div>
            <CustNavBar />
            <div style={{padding: "20px"}}>
                <h1>Profile Page</h1>
                <p>Patient info will be displayed and editable here.</p>
            </div>
        </div>
    );
}