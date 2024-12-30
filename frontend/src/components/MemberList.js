import React from "react";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const MemberList = () => {
  const { authState } = useContext(AuthContext);
  const [userData, setUserData] = useState([]); // Initialize as an array

  useEffect(() => {
    console.log("authState details==>", authState);
    if (authState.isAuthenticated) {
      const token = authState.token; // Access token from authState

      // Fetch user data from the backend
      axios
        .get(`http://localhost:5001/api/auth/primaryuser`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the header
          },
        })
        .then((res) => {
          console.log("API Response:", res.data);
          // Ensure `users` is an array
          const users = Array.isArray(res.data)
            ? res.data
            : res.data.users || [];
          setUserData(users);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setUserData([]); // Set to an empty array on error
        });
    }
  }, [authState]);

  console.log("Primary user Data", userData);

  // Helper function to get initials
  const getInitials = (firstName, lastName) => {
    const firstInitial = firstName?.charAt(0).toUpperCase() || "";
    const lastInitial = lastName?.charAt(0).toUpperCase() || "";
    return firstInitial + lastInitial;
  };

  return (
    <div className="container mt-2 mb-5">
      <div className="d-flex flex-column me-3">
        <div className="user-avatar d-flex align-items-center justify-content-center">
          {/* Dynamically displaying the initials */}
          <h1>
            {getInitials(authState.user.firstName, authState.user.lastName)}
          </h1>
        </div>
      </div>

      <h5 className="w-100 pb-3 border-bottom border-secondary">
        {authState.user.role}
      </h5>

      <div className="table-responsive data-table">
        <table className="table">
          <thead className="bg-lgreen text-white">
            <tr>
              <th scope="col">S.No</th>
              <th scope="col">Member ID</th>
              <th scope="col">Member Name</th>
              <th scope="col">Mobile Number</th>
              <th scope="col">Email</th>
              <th scope="col">Details</th>
            </tr>
          </thead>
          <tbody>
            {userData.length > 0 ? (
              userData.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.id}</td>
                  <td>{user.firstName + " " + user.lastName}</td>
                  <td>{user.mobile}</td>
                  <td>{user.email}</td>
                  <td>
                    <Link to="/memberdetails" state={{ user }}>
                      <button className="btn btn-sm btn-info text-white">
                        View List
                      </button>
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No users available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MemberList;
