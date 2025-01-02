import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const MemberList = () => {
  const { authState } = useContext(AuthContext);
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    if (authState.isAuthenticated) {
      const token = authState.token;

      const fetchData = async () => {
        try {
          const res = await axios.get(
            `http://localhost:5001/api/auth/primaryuser`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const users = Array.isArray(res.data)
            ? res.data
            : res.data.users || [];
          setUserData(users);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserData([]);
        }
      };

      // Fetch data initially
      fetchData();

      // Poll for updates every 10 seconds
      const intervalId = setInterval(fetchData, 10000);

      // Cleanup interval on component unmount
      return () => clearInterval(intervalId);
    }
  }, [authState]);

  return (
    <div className="memberlist-cont">
      <Header />
      <div className="container p-3 bg-white md-box min-vh-100">
        <div className="mt-2 mb-5">
          <h5 className="w-100 pb-3 border-bottom border-secondary">
            {authState.user.role}
          </h5>
          <div className="table-responsive data-table">
            <table className="table">
              <thead className="list-table">
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
                        <Link to="/dashboard" state={{ memberData: user }}>
                          <button className="btn btn-sm btn-primary">
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
      </div>
      <Footer />
    </div>
  );
};

export default MemberList;
