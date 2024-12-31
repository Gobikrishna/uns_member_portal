import { useContext, useEffect, useState, useMemo } from "react";
import axios from "axios";
import search from "../assets/images/search.png";
import { AuthContext } from "../context/AuthContext";
import Header from "./Header";
import Footer from "./Footer";
import Modal from "./Modal";
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
  const [referralMembers, setReferralMembers] = useState([]);
  const [commissionDetails, setCommissionDetails] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const paginateData = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    console.log("Paginating from:", indexOfFirstItem, "to:", indexOfLastItem);
    return filteredMemberData.slice(indexOfFirstItem, indexOfLastItem);
  };

  const currentItems = paginateData();

  const totalPages = useMemo(
    () => Math.ceil(filteredMemberData.length / itemsPerPage),
    [filteredMemberData.length, itemsPerPage]
  );

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  useEffect(() => {
    if (authState.isAuthenticated) {
      fetchData().catch((error) =>
        console.error("Error fetching data in useEffect:", error)
      );
    } else {
      console.warn("User is not authenticated.");
    }
  }, [authState]);

  const fetchData = async () => {
    const { token, user } = authState;
    const userId = user.id;
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const apiCalls = [
        axios
          .get(`http://localhost:5001/api/auth/user/${userId}`, {
            headers,
          })
          .catch((error) => {
            console.error("Error fetching user data:", error);
            return { data: null };
          }),

        axios
          .get(`http://localhost:5001/api/auth/members/${userId}`, {
            headers: { ...headers, Role: user.role },
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

      // Handle the successful data
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

  const getInitials = (firstName = "", lastName = "") =>
    `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;

  console.log("userData", userData);
  const displayUserName =
    userData?.firstName && userData?.lastName
      ? `${userData.firstName} ${userData.lastName}`
      : "Unknown User";

  return (
    <div className="bg-light dashboard-cont">
      <Header />
      {authState.user && authState.user.role.toLowerCase() !== "admin" ? (
        <div className="container p-3 bg-white">
          {userData && userData.firstName && userData.lastName ? (
            <div className="d-flex align-items-center p-3 rounded">
              <div className="d-flex flex-column align-items-center justify-content-center me-3">
                <div className="user-avatar d-flex align-items-center justify-content-center">
                  <h1>{getInitials(userData.firstName, userData.lastName)}</h1>
                </div>
              </div>
              <div className="user-info">
                <h3 className="user-name">{displayUserName}</h3>
                <p className="user-role">{userData.role}</p>
              </div>
            </div>
          ) : (
            <p>Loading user data...</p>
          )}

          <div className="mt-2 mb-5">
            <h5 className="w-100 pb-3 border-bottom border-secondary">
              Member Portal
            </h5>
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
                    <td>{`${userData.firstName} ${userData.lastName}`}</td>
                    <td>{userData.mobile}</td>
                    <td>{userData.email}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-2">
            <div className="row align-items-center mb-3 pb-3 border-bottom border-secondary">
              <h5 className="m-0 pt-2">Referral Contact List</h5>
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
              <button onClick={openModal} className="btn btn-primary">
                Add New Member
              </button>
              <Modal showModal={showModal} onClose={closeModal}>
                <Register referralId={userData.id} pageTitle="Add New Member" />
              </Modal>
            </div>
          </div>

          <div className="mt-0">
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
                        <td>{index + 1}</td>
                        <td>{member.id}</td>
                        <td>{`${member.firstName} ${member.lastName}`}</td>
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
        <MemberList />
      )}
      <Footer />
    </div>
  );
};

export default Dashboard;
