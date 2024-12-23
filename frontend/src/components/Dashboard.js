import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import FileUpload from "./FileUpload";

const Dashboard = () => {
  const { authState } = useContext(AuthContext);
  const [memberData, setMemberData] = useState({});
  const [transactions, setTransactions] = useState([]);
  // const [memberHierarchy, setMemberHierarchy] = useState([]);
  const [referralMembers, setReferralMembers] = useState([]); // Renamed to reflect referral members
  const [commissionDetails, setCommissionDetails] = useState([]);

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
    <div>
      <h1>Welcome, {memberData.firstName}</h1>
      <p>{memberData.role}</p>
      <FileUpload />
      {/* Referral Income */}
      <h2>Referral Income</h2>
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction.id}>
            {transaction.referralPerson} earned {transaction.referralIncome} on{" "}
            {new Date(transaction.transactionDate).toLocaleDateString()}
          </li>
        ))}
      </ul>

      {/* Referral Members */}
      <h2>Referral Members</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>MemberID</th>
            <th>MemberFirstName</th>
            <th>MemberLastName</th>
            <th>MemberEmail</th>
            <th>ReferralCode</th>
            <th>ReferralRole</th>
            <th>Level</th>
          </tr>
        </thead>
        <tbody>
          {referralMembers.map((member) => (
            <tr key={member.MemberID}>
              <td>{member.MemberID}</td>
              <td>{member.MemberFirstName}</td>
              <td>{member.MemberLastName}</td>
              <td>{member.MemberEmail}</td>
              <td>{member.ReferralCode}</td>
              <td>{member.MemberRole}</td>
              <td>{member.Level}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Commission Details */}
      <h2>Commission Details</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Primary Member</th>
            <th>Secondary Member</th>
            <th>Product</th>
            <th>Product Price</th>
            <th>Commission Earned</th>
          </tr>
        </thead>
        <tbody>
          {commissionDetails.map((detail, index) => (
            <tr key={index}>
              <td>{detail.PrimaryMember}</td>
              <td>{detail.SecondaryMember}</td>
              <td>{detail.Product}</td>
              <td>
                {isNaN(detail.ProductPrice) || detail.ProductPrice === null
                  ? "N/A"
                  : `$${Number(detail.ProductPrice).toFixed(2)}`}
              </td>
              <td>
                {isNaN(detail.Commission) || detail.Commission === null
                  ? "N/A"
                  : `$${Number(detail.Commission).toFixed(2)}`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
