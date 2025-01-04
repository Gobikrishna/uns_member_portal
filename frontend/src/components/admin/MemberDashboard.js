import { useContext, useEffect, useState, useMemo } from "react";
import axios from "axios";
import search from "../../assets/images/search.png";
import Header from "../Header";
import Footer from "../Footer";
import Modal from "../Modal";
import { Link, useLocation } from "react-router-dom";
import MemberRegister from "../MemberRegister";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
const MemberDashboard = () => {
  const { authState } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  // State variables
  const [userData, setUserData] = useState(null);
  const [memberData, setMemberData] = useState([]);
  const [filteredMemberData, setFilteredMemberData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [referralMembers, setReferralMembers] = useState([]);
  const [commissionDetails, setCommissionDetails] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal control
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  // Search functionality
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setFilteredMemberData(
      query
        ? memberData?.filter((member) =>
            member.mobile?.toString().includes(query)
          ) || []
        : memberData || []
    );
  };

  // Pagination logic
  const paginateData = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredMemberData.slice(indexOfFirstItem, indexOfLastItem);
  };

  const currentItems = paginateData();
  const totalPages = useMemo(
    () => Math.ceil(filteredMemberData.length / itemsPerPage),
    [filteredMemberData.length, itemsPerPage]
  );

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // Fetch data on component mount or authentication change
  useEffect(() => {
    if (location.state?.memberData) {
      setUserData(location.state.memberData);
      sessionStorage.setItem(
        "adminuseraccess",
        JSON.stringify(location.state.memberData)
      );
    }

    if (authState.isAuthenticated) {
      fetchData().catch((error) =>
        console.error("Error fetching data in useEffect:", error)
      );
    } else {
      console.warn("User is not authenticated.");
    }
  }, [authState, location.state]);

  const fetchData = async () => {
    const { token } = authState;
    let adminUserAccess = sessionStorage.getItem("adminuseraccess");

    // Parse the adminUserAccess correctly before using it
    adminUserAccess = adminUserAccess ? JSON.parse(adminUserAccess) : null;

    if (userData == null && adminUserAccess) {
      setUserData(adminUserAccess);
    }

    const userId = userData?.id || adminUserAccess?.id;
    const userRole = userData?.role || adminUserAccess?.role;

    if (!userId) return; // Ensure we have a valid userId

    const headers = { Authorization: `Bearer ${token}` };

    try {
      const apiCalls = [
        axios
          .get(`http://localhost:5001/api/auth/user/${userId}`, { headers })
          .catch((error) => {
            console.error("Error fetching user data:", error);
            return { data: null };
          }),

        axios
          .get(`http://localhost:5001/api/auth/members/${userId}`, {
            headers: { ...headers, Role: userRole },
          })
          .catch((error) => {
            console.error("Error fetching members data:", error);
            return { data: [] };
          }),

        axios
          .get(`http://localhost:5001/api/auth/transactions/${userId}`, {
            headers,
          })
          .catch((error) => {
            console.error("Error fetching transactions data:", error);
            return { data: [] };
          }),

        axios
          .get(`http://localhost:5001/api/auth/referral-members/${userId}`, {
            headers,
          })
          .catch((error) => {
            console.error("Error fetching referral members data:", error);
            return { data: [] };
          }),

        axios
          .get(`http://localhost:5001/api/auth/commission-details/${userId}`, {
            headers,
          })
          .catch((error) => {
            console.error("Error fetching commission details:", error);
            return { data: [] };
          }),
      ];

      const [userRes, memberRes, transactionRes, referralRes, commissionRes] =
        await Promise.all(apiCalls);

      if (userRes?.data) setUserData(userRes.data);
      if (memberRes?.data) {
        setMemberData(memberRes.data);
        setFilteredMemberData(memberRes.data);
      }
      if (transactionRes?.data) setTransactions(transactionRes.data);
      if (referralRes?.data) setReferralMembers(referralRes.data);
      if (commissionRes?.data) setCommissionDetails(commissionRes.data);
    } catch (error) {
      console.error("Error handling API calls in fetchData:", error);
    }
  };
  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1); // Go back to the previous route
    } else {
      navigate("/defaultRoute"); // Redirect to a default route
    }
  };
  // Generate initials for display
  const getInitials = (firstName = "", lastName = "") =>
    `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;

  const displayUserName =
    userData?.firstName && userData?.lastName
      ? `${userData.firstName} ${userData.lastName}`
      : "Unknown User";

  // Check member data
  const member = memberData.length > 0 ? memberData[0] : null;
  if (member) {
    console.log("member", member);
  } else {
    console.log("No member data found.");
  }

  return (
    <div className="bg-light dashboard-cont">
      <Header />
      {authState.user && authState.user.role.toLowerCase() === "admin" ? (
        <div className="container p-3 bg-white md-box">
          <div className=" my-2 cursor back-lnk" onClick={goBack}>
            &larr; Back to dashborad
          </div>
          <div className="mt-2 mb-5">
            <h5 className="w-100 pb-3 border-secondary">Member Portal</h5>
            <div className="d-flex gap-3 ">
              <div className="card bg-light">
                <div className="card-header">
                  <h6 className="mb-0">Member Information</h6>
                </div>
                <div className="card-body ">
                  <div className="mb-3">
                    <strong>Member ID:</strong> {userData?.id || "N/A"}
                  </div>
                  <div className="mb-3">
                    <strong>Role:</strong> {userData?.role || "N/A"}
                  </div>
                  <div className="mb-3">
                    <strong>Full Name:</strong> {displayUserName}
                  </div>
                  <div className="mb-3">
                    <strong>Phone Number:</strong> {userData?.mobile || "N/A"}
                  </div>
                  <div className="mb-3">
                    <strong>Email:</strong> {userData?.email || "N/A"}
                  </div>
                </div>
              </div>
              <div className="card ">
                <div className="card-header bg-light">
                  <h6 className="mb-0">Commission Details</h6>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <strong>Day Earnings:</strong> 1000
                  </div>
                  <div className="mb-3">
                    <strong>Total Earnings:</strong> 5000
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-2">
            <div className="mb-3 pb-3 border-secondary">
              <h5 className="m-0 pt-2">Referral Contact List</h5>
              <div className="d-flex gap-3">
                <div className="input-group flex-grow-2 mt-4">
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
                <div className="mt-4">
                  <button onClick={openModal} className="btn btn-primary">
                    Add New Member
                  </button>
                </div>
              </div>
              <Modal showModal={showModal} onClose={closeModal}>
                <MemberRegister
                  referralId={userData?.id}
                  pageTitle="Add New Member"
                />
              </Modal>
            </div>
          </div>

          <div className="mt-0">
            <div className="table-responsive data-table">
              <table className="table">
                <thead className="list-table">
                  <tr>
                    <th scope="col">S.No</th>
                    <th scope="col">Member ID</th>
                    <th scope="col">Member Name</th>
                    <th scope="col">Member Role</th>
                    <th scope="col">Mobile Number</th>
                    <th scope="col">Email</th>
                    {member && member.role !== "referred" && (
                      <th scope="col">Details</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((member, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{member.id}</td>
                        <td>{`${member?.firstName} ${member?.lastName}`}</td>
                        <td>{member?.role}</td>
                        <td>{member?.mobile}</td>
                        <td>{member?.email}</td>
                        {member.role !== "referred" && (
                          <td>
                            <Link to="/memberdetails" state={{ member }}>
                              <button className="btn btn-sm btn-primary">
                                Add Details / View
                              </button>
                            </Link>
                          </td>
                        )}
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
        </div>
      ) : (
        <>Welcome</>
      )}
      <Footer />
    </div>
  );
};

export default MemberDashboard;