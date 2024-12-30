import { useContext, useEffect, useState } from "react";
import axios from "axios";
import search from "../assets/images/search.png";
import { AuthContext } from "../context/AuthContext";
// import FileUpload from "./FileUpload";
import Header from "./Header";
import Footer from "./Footer";
import Modal from "./Modal";
import Pagination from "./Pagination";
import Register from "./Register";
import { Link } from "react-router-dom";
import MemberList from "./MemberList";

const Dashboard = () => {
  const { authState } = useContext(AuthContext);
  const [userData, setUserData] = useState({});
  const [memberData, setMemberData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  // const [memberHierarchy, setMemberHierarchy] = useState([]);
  const [referralMembers, setReferralMembers] = useState([]); // Renamed to reflect referral members
  const [commissionDetails, setCommissionDetails] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    sNo: "",
    memberId: "",
    memberName: "",
    mobileNumber: "",
  });

  const openModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    console.log("authState details==>", authState);
    if (authState.isAuthenticated) {
      const token = authState.token; // Access token from authState.user.token
      const userId = authState.user.id;
      // Fetch member data
      console.log("Dashboard Auth token", authState.user.id);
      // Fetch user data from the backend
      axios
        .get(`http://localhost:5001/api/auth/user/${userId}`, {
          // Replace with your API endpoint
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the header
          },
        })
        .then((res) => {
          setUserData(res.data);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          // Handle error, maybe show an error message
        });
      console.log("user Data", userData);
      console.log("auth user role", authState.user.role);
      axios
        .get(`http://localhost:5001/api/auth/members/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            role: authState.user.role, // Send role in the request body
          },
        })
        .then((res) => setMemberData(res.data))
        .catch((error) => console.error("Error fetching member data", error));
      // Fetch referral transactions
      axios
        .get(`http://localhost:5001/api/auth/transactions/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => setTransactions(res.data))
        .catch((error) =>
          console.error("Error fetching referral transactions", error)
        );

      console.log("user Data", memberData);
      console.log("referral list", referralMembers);

      // Fetch referral members
      axios
        .get(`http://localhost:5001/api/auth/referral-members/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => setReferralMembers(res.data))
        .catch((error) =>
          console.error("Error fetching referral members", error)
        );

      // Fetch commission details
      axios
        .get(`http://localhost:5001/api/auth/commission-details/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => setCommissionDetails(res.data))
        .catch((error) =>
          console.error("Error fetching commission details", error)
        );
    } else {
      alert("Please log in to access the dashboard.");
    }
  }, [authState]);
  console.log("Member being passed:", memberData);

  // to get the initials of first name and last name
  const getInitials = (firstName, lastName) => {
    const firstInitial = firstName?.charAt(0).toUpperCase() || "";
    const lastInitial = lastName?.charAt(0).toUpperCase() || "";
    return firstInitial + lastInitial;
  };

  return (
    <div className="bg-light dashboard-cont">
      <Header />
      {authState.user && authState.user.role.toLowerCase() !== "admin" ? (
        <div className="container p-3 bg-white">
          <div className="container">
            <div className="d-flex align-items-center  p-3 rounded">
              {/* Logo Column */}
              <div className=" d-flex flex-column align-items-center justify-content-center me-3">
                <div className="user-avatar d-flex align-items-center justify-content-center">
                  {/* Dynamically displaying the initials */}
                  <h1>{getInitials(userData.firstName, userData.lastName)}</h1>
                </div>
              </div>

              {/* Text Column */}
              <div className="user-info">
                <h3 className="user-name">
                  {userData.firstName + " " + userData.lastName}
                </h3>
                <p className="user-role">{userData.role}</p>
              </div>
            </div>
          </div>

          <div className="container mt-2 mb-5">
            <h5 className="w-100 pb-3 border-bottom border-secondary">
              Member Portal
            </h5>

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
                    <td>{userData.id}</td>
                    <td>{userData.role}</td>
                    <td>{userData.firstName + " " + userData.lastName}</td>
                    <td>{userData.mobile}</td>
                    <td>{userData.email}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="container mt-2">
            <div className="row align-items-center">
              {/* Title and Controls */}
              <div className="mb-3 border-bottom border-secondary pb-3">
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
                    <div className="container">
                      {/* Add New Contact Button */}
                      <button onClick={openModal} className="btn btn-primary">
                        Add New Member
                      </button>
                      {/* Modal Component */}
                      <Modal showModal={showModal} onClose={closeModal}>
                        {/* Pass "secondary" role to Register component in modal */}
                        <Register
                          initialRole="secondary"
                          referralId={userData.id}
                          pageTitle="Add New Member"
                        />
                      </Modal>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="container mt-0">
            <div className="table-responsive data-table">
              <table className="table">
                <thead className="bg-lgreen text-white">
                  <tr>
                    <th scope="col">S.No</th>
                    <th scope="col">Member ID</th>
                    <th scope="col">Member Name</th>
                    <th scope="col">Mobile Number</th>
                    <th scope="col">Email</th>
                    <th scope="col">Status</th>
                    <th scope="col">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {memberData &&
                    memberData.map((member, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{member.id}</td>
                        <td>{member.firstName + " " + member.lastName}</td>
                        <td>{member.mobile}</td>
                        <td>{member.email}</td>
                        <td>
                          <span
                            className={`badge ${
                              member.status === "Active"
                                ? "bg-success"
                                : "bg-danger"
                            }`}
                          >
                            {member.status}
                          </span>
                        </td>
                        <td>
                          <Link to="/memberdetails" state={{ member }}>
                            <button className="btn btn-sm btn-info text-white">
                              Add Details / View
                            </button>
                          </Link>
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
            <h5 className="w-100 pb-3 border-bottom border-secondary mb-3">
              Member Portal
            </h5>
            <div className="shadow p-3 mb-5 bg-white rounded">
              <div className="row py-2 rounded">
                <div className="col-4">
                  <strong>Direct Member (10%)</strong>
                </div>
                <div className="col-4">
                  <strong>Indirect Member (5%)</strong>
                </div>
                <div className="col-4">
                  <strong>Total Referral Income</strong>
                </div>
              </div>
              <div className="row py-2 rounded">
                <div className="col-4">20900</div>
                <div className="col-4">2000</div>
                <div className="col-4">22900</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <MemberList />
        </div>
      )}
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Dashboard;
