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
import MemberRegister from "./MemberRegister";

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

  const [transactionData, setTransactionData] = useState([]);

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
  // Calculate total commission for each `commissionTo`
  const totalCommissionByPerson = transactionData.reduce((acc, transaction) => {
    const commissionTo = transaction.commissionTo;

    // Ensure commissionEarned is treated as a number
    const commissionEarned = Number(transaction.commissionEarned) || 0;

    if (!acc[commissionTo]) {
      acc[commissionTo] = 0; // Initialize if not already present
    }

    acc[commissionTo] += commissionEarned; // Add the commission earned
    return acc;
  }, {});
  const fetchData = async () => {
    const { token, user } = authState;
    const userId = user?.id;

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

        // axios
        //   .get(`http://localhost:5001/api/auth/commission-details/${userId}`, {
        //     headers,
        //   })
        //   .catch((error) => {
        //     console.error("Error fetching commission details:", error);
        //     return { data: [] };
        //   }),
        // Fetch referral transactions
        axios
          .get(
            `http://localhost:5001/api/auth/referral-transactions/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            setTransactionData(res.data.transactions); // Update state for transactions
          })
          .catch((error) => {
            console.error("Error fetching referral transactions:", error);
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

  // check member
  const member = memberData.length > 0 ? memberData[0] : null;
  if (member) {
    console.log("member", member);
  } else {
    console.log("No member data found.");
  }

  return (
    <div className="bg-light dashboard-cont">
      <Header />
      {authState.user && authState.user.role.toLowerCase() !== "admin" ? (
        <div className="container p-3 bg-white md-box">
          <div className="mt-2 mb-5">
            <h5 className="w-100 pb-3 border-secondary">Member Portal</h5>
            <div className="row g-3">
              <div className="col-12 col-md-6 col-lg-4">
                <div className="card bg-light h-100">
                  <div className="card-header">
                    <h6 className="mb-0">Member Information</h6>
                  </div>
                  <div className="card-body ">
                    <div className="mb-3">
                      <strong>Member ID:</strong> {userData.id}
                    </div>
                    <div className="mb-3">
                      <strong>Role:</strong> {userData.role}
                    </div>
                    <div className="mb-3">
                      <strong>Full Name:</strong>{" "}
                      {`${userData.firstName} ${userData.lastName}`}
                    </div>
                    <div className="mb-3">
                      <strong>Phone Number:</strong> {userData.mobile}
                    </div>
                    <div className="mb-3">
                      <strong>Email:</strong> {userData.email}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6 col-lg-8">
                <div className="card h-100">
                  <div className="card-header bg-light">
                    <h6 className="mb-0">Commission Details</h6>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      {Object.entries(totalCommissionByPerson).map(
                        ([personId, totalCommission]) => {
                          return personId === String(userData?.id) ? (
                            <strong key={personId}>
                              Total Earnings:{" "}
                              <span>{totalCommission.toFixed(2)}</span>
                            </strong>
                          ) : null;
                        }
                      )}
                    </div>

                    {transactionData.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table table-bordered table-striped">
                          <thead>
                            <tr>
                              <th>User ID</th>
                              <th>Referred By</th>
                              <th>Product Name</th>
                              <th>Amount</th>
                              <th>Commission Earned</th>
                              <th>Created At</th>
                            </tr>
                          </thead>
                          <tbody>
                            {transactionData.map((transaction) => (
                              <tr key={transaction.id}>
                                <td>{transaction.userId}</td>
                                <td>{transaction.referredBy}</td>
                                <td>{transaction.productName}</td>
                                <td>{Number(transaction.amount).toFixed(2)}</td>
                                <td>
                                  {Number(transaction.commissionEarned).toFixed(
                                    2
                                  )}
                                </td>
                                <td>
                                  {new Date(
                                    transaction.createdAt
                                  ).toLocaleDateString("en-GB")}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p>No transactions found.</p>
                    )}
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
                {/* <Register referralId={userData.id} pageTitle="Add New Member" /> */}
                <MemberRegister
                  referralId={userData.id}
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
                    <th scope="col">Member ID</th>
                    <th scope="col">Member Name</th>
                    <th scope="col">Member Role</th>
                    <th scope="col">Mobile Number</th>
                    <th scope="col">Email</th>
                    <th scope="col">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((member, index) => (
                      <tr key={index}>
                        <td>{member.id}</td>
                        <td>{`${member.firstName} ${member.lastName}`}</td>
                        <td>{member.role}</td>
                        <td>{member.mobile}</td>
                        <td>{member.email}</td>
                        <td>
                          <Link to="/memberdetails" state={{ member }}>
                            <button className="btn btn-sm btn-primary">
                              Add Details / View
                            </button>
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
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
                {/* Previous Button */}
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                </li>

                {/* Page Numbers */}
                {(() => {
                  const maxVisiblePages = 8; // Limit to 10 page numbers
                  let startPage = Math.max(
                    1,
                    currentPage - Math.floor(maxVisiblePages / 2)
                  );
                  let endPage = Math.min(
                    totalPages,
                    startPage + maxVisiblePages - 1
                  );

                  // Adjust startPage if the total pages are less than maxVisiblePages
                  if (endPage - startPage < maxVisiblePages - 1) {
                    startPage = Math.max(1, endPage - maxVisiblePages + 1);
                  }

                  return [...Array(endPage - startPage + 1)].map(
                    (_, pageIndex) => {
                      const pageNumber = startPage + pageIndex;
                      return (
                        <li
                          key={pageNumber}
                          className={`page-item ${
                            currentPage === pageNumber ? "active" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(pageNumber)}
                          >
                            {pageNumber}
                          </button>
                        </li>
                      );
                    }
                  );
                })()}

                {/* Next Button */}
                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      ) : (
        <>welcome</>
      )}
      <Footer />
    </div>
  );
};

export default Dashboard;
