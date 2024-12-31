import { useContext, useEffect, useState } from "react";
import axios from "axios";
import search from "../assets/images/search.png";
import { AuthContext } from "../context/AuthContext";
// import FileUpload from "./FileUpload";
import Header from "./Header";
import Footer from "./Footer";
import Modal from "./Modal";
// import Pagination from "./Pagination";
import Register from "./Register";
import { Link } from "react-router-dom";
import MemberList from "./MemberList";

const Dashboard = () => {
  const { authState } = useContext(AuthContext);
  const [userData, setUserData] = useState({});
  const [memberData, setMemberData] = useState([]);
  const [filteredMemberData, setFilteredMemberData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
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
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query) {
      const filtered = memberData.filter((member) =>
        member.mobile.toString().includes(query)
      );
      setFilteredMemberData(filtered);
    } else {
      setFilteredMemberData(memberData); // Reset to all members if search is cleared
    }
  };

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 1;
  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMemberData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredMemberData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  // Pagination logic ends here!

  useEffect(() => {
    console.log("authState details==>", authState);
    if (authState.isAuthenticated) {
      // Fetch member data
      console.log("Dashboard Auth token", authState.user.id);
      const fetchData = async () => {
        try {
          const { token, user } = authState; // Access token from authState.user.token
          const userId = user.id;
          const headers = { Authorization: `Bearer ${token}` };
          // Parallel API calls
          const [
            userRes,
            memberRes,
            transactionRes,
            referralRes,
            commissionRes,
          ] = await Promise.all([
            axios.get(`http://localhost:5001/api/auth/user/${userId}`, {
              headers,
            }),
            axios.get(`http://localhost:5001/api/auth/members/${userId}`, {
              headers: {
                ...headers, // Spread the default headers
                Role: user.role, // Add role header only for the members API
              },
            }),
            axios.get(`http://localhost:5001/api/auth/transactions/${userId}`, {
              headers,
            }),
            axios.get(
              `http://localhost:5001/api/auth/referral-members/${userId}`,
              { headers }
            ),
            axios.get(
              `http://localhost:5001/api/auth/commission-details/${userId}`,
              { headers }
            ),
          ]);

          setUserData(userRes.data);
          setMemberData(memberRes.data);
          setFilteredMemberData(memberRes.data); // Initialize filtered data
          setTransactions(transactionRes.data);
          setReferralMembers(referralRes.data);
          setCommissionDetails(commissionRes.data);
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        }
      };
      fetchData();
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
                      value={searchQuery}
                      onChange={handleSearch}
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
                          // initialRole="secondary"
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
                  {currentItems.length > 0 ? (
                    currentItems.map((member, index) => (
                      <tr key={index}>
                        <td>{indexOfFirstItem + index + 1}</td>
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
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No results found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* <Pagination /> */}

          {/* Pagination Controls */}
          <div className="d-flex justify-content-center mt-3">
            <nav>
              <ul className="pagination">
                {[...Array(totalPages)].map((_, pageIndex) => (
                  <li
                    key={pageIndex}
                    className={`page-item ${
                      currentPage === pageIndex + 1 ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(pageIndex + 1)}
                    >
                      {pageIndex + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

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
