import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import FileUpload from "./FileUpload";
import Header from "./Header";
import Footer from "./Footer";
import search from "../assets/images/search.png";
import Pagination from "./pagination";

const Dashboard = () => {
  const { authState } = useContext(AuthContext);
  const [memberData, setMemberData] = useState({});
  const [transactions, setTransactions] = useState([]);
  // const [memberHierarchy, setMemberHierarchy] = useState([]);
  const [referralMembers, setReferralMembers] = useState([]); // Renamed to reflect referral members
  const [commissionDetails, setCommissionDetails] = useState([]);

  const member = {
    id: "12345",
    role: "Prime Member",
    fullName: "Kalyana Raman TR",
    phoneNumber: "+91 9876543210",
    email: "kalyana.raman@example.com",
  };

  const members = [
    {
      id: "12345",
      name: "Kalyana Raman TR",
      mobile: "+91 9876543210",
      role: "Prime Member",
      status: "Active",
    },
    {
      id: "67890",
      name: "Arun Kumar",
      mobile: "+91 9123456789",
      role: "Basic Member",
      status: "Inactive",
    },
  ];

  useEffect(() => {
    console.log("authState details==>", authState);
    if (authState.isAuthenticated) {
      // Fetch member data
      axios
        .get(`http://localhost:5001/api/auth/members/${authState.userId}`)
        .then((res) => setMemberData(res.data))
        .catch((error) => console.error("Error fetching member data", error));
      // Fetch referral transactions
      axios
        .get(`http://localhost:5001/api/auth/transactions/${authState.userId}`)
        .then((res) => setTransactions(res.data))
        .catch((error) =>
          console.error("Error fetching referral transactions", error)
        );
      console.log(referralMembers);
      // Fetch referral members (updated to reflect new endpoint)
      // axios
      //   .get(
      //     `http://localhost:5001/api/auth/referral-members/${authState.userId}`
      //   )
      //   .then((res) => setReferralMembers(res.data)) // Use referralMembers state here
      //   .catch((error) =>
      //     console.error("Error fetching referral members", error)
      //   );

      // // Fetch commission details
      // axios
      //   .get(
      //     `http://localhost:5001/api/auth/commission-details/${authState.userId}`
      //   )
      //   .then((res) => setCommissionDetails(res.data))
      //   .catch((error) =>
      //     console.error("Error fetching commission details", error)
      //   );
      // Fetch referral members
      axios
        .get(
          `http://localhost:5001/api/auth/referral-members/${authState.userId}`
        )
        .then((res) => setReferralMembers(res.data))
        .catch((error) =>
          console.error("Error fetching referral members", error)
        );

      // Fetch commission details
      axios
        .get(
          `http://localhost:5001/api/auth/commission-details/${authState.userId}`
        )
        .then((res) => setCommissionDetails(res.data))
        .catch((error) =>
          console.error("Error fetching commission details", error)
        );
    } else {
      alert("Please log in to access the dashboard.");
    }
  }, [authState, referralMembers]);

  // return (
  //   <div>
  //     <h1>Welcome, {memberData.firstName}</h1>
  //     <h2>Referral Income</h2>
  //     <ul>
  //       {transactions.map((transaction) => (
  //         <li key={transaction.id}>
  //           {transaction.referralPerson} earned {transaction.referralIncome} on{" "}
  //           {transaction.transactionDate}
  //         </li>
  //       ))}
  //     </ul>
  //     <div></div>
  //   </div>
  // );
  return (
    <div className="bg-light">
      <Header />
      <div className="container p-3 bg-white">
      <div className="container">
      <div className="d-flex align-items-center  p-3 rounded">
  {/* Logo Column */}
  <div className=" d-flex flex-column align-items-center justify-content-center me-3">
    <div className="user-avatar d-flex align-items-center justify-content-center">
      <h1>KR</h1>
    </div>
  </div>

  {/* Text Column */}
  <div className="user-info">
    <h3 className="user-name">{member.fullName}</h3>
    <p className="user-role">Prime Member</p>
  </div>
</div>
      </div>


      
      

      <div className="container mt-2 mb-5">
  <h5 className="w-100 pb-3 border-bottom border-secondary">Member Portal</h5>

  {/* Table Wrapper for Responsiveness */}
  <div className="table-responsive">
    <table className="table">
      <thead className="bg-light">
        <tr>
          <th scope="col">Member ID</th>
          <th scope="col">Role</th>
          <th scope="col">Full Name</th>
          <th scope="col">Phone Number</th>
          <th scope="col">Email</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{member.id}</td>
          <td>{member.role}</td>
          <td>{member.fullName}</td>
          <td>{member.mobile}</td>
          <td>{member.email}</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>


<div className="container mt-2">
  <div className="row align-items-center">
    {/* Title and Controls */}
    <div className="mb-3 border-bottom border-secondary pb-2">
      <div className="d-flex flex-wrap align-items-center gap-3">
        {/* Title */}
        <h5 className="m-0 pt-2">Referral Contact List</h5>

        {/* Search Input */}
        <div className="input-group flex-grow-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search Mobile Number"
          />
          <span className="input-group-text">
            <img src={search} alt="search icon" />
          </span>
        </div>

        {/* Button */}
        <div>
          <button className="btn btn-primary">Add New Contact</button>
        </div>
      </div>
    </div>
  </div>
</div>


<div className="container mt-0">
  <div className="table-responsive">
    <table className="table">
      <thead className="bg-success text-white">
        <tr>
          <th scope="col">S.No</th>
          <th scope="col">Member ID</th>
          <th scope="col">Member Name</th>
          <th scope="col">Mobile Number</th>
          <th scope="col">Role</th>
          <th scope="col">Status</th>
          <th scope="col">Details</th>
        </tr>
      </thead>
      <tbody>
        {members.map((member, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{member.id}</td>
            <td>{member.name}</td>
            <td>{member.mobile}</td>
            <td>{member.role}</td>
            <td>
              <span
                className={`badge ${
                  member.status === "Active" ? "bg-success" : "bg-danger"
                }`}
              >
                {member.status}
              </span>
            </td>
            <td>
              <button className="btn btn-sm btn-info text-white">
                Add Details / View
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

    <Pagination />
    
      {/* Commission Details */}
      <div className="container mb-5 mt-5">
        <h5 className="w-100 pb-3 border-bottom border-secondary mb-3">Member Portal</h5>
        <div className="shadow p-3 mb-5 bg-white rounded">
            <div className="row py-2 rounded">
              <div className="col-4"><strong>Direct Member (10%)</strong></div>
              <div className="col-4"><strong>Indirect Member (5%)</strong></div>
              <div className="col-4"><strong>Total Referral Income</strong></div>
            </div>
            <div className="row py-2 rounded">
              <div className="col-4">20900</div>
              <div className="col-4">2000</div>
              <div className="col-4">22900</div>
            </div>
        </div>
      </div>
      
      
      </div>
      {/* Footer */}
     <Footer />
    </div>
  );
};

export default Dashboard;
