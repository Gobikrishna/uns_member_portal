import { useContext, useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Back from "../assets/images/back.png";
import search from "../assets/images/search.png";
import { AuthContext } from "../context/AuthContext";
// import FileUpload from "./FileUpload";
import Header from "./Header";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";
import Modal from "./Modal";
import MemberRegister from "./MemberRegister";
import formDataConfig from "./config/formDataConfig";

const MemberDetails = () => {
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();
  // State for the form data
  const [formData, setFormData] = useState(formDataConfig); // Initialize with imported config
  const [transactionData, setTransactionData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [isDisabled, setIsDisabled] = useState(true);
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState("");
  const [memberData, setMemberData] = useState([]);
  const [activeTab, setActiveTab] = useState("referral");

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMemberData, setFilteredMemberData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const member = location.state?.member; // Access the passed member data
  console.log("Location state:", location.state);

  // For Admin Panel
  const [formState, setFormState] = useState({});
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [errors, setErrors] = useState({});
  // Admin Panel End!

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

  // Get initial values if the user has pre-existing details
  useEffect(() => {
    if (authState.isAuthenticated) {
      const token = authState.token;
      if (!member) {
        // Redirect to the dashboard if member data is null or undefined
        navigate("/dashboard");
      } else {
        // Fetch user details
        axios
          .get(`http://localhost:5001/api/auth/user-details/${member?.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            setFormData(res.data.user_details);
          })
          .catch((error) => {
            console.error("Error fetching user details:", error);
          });
        axios
          .get(`http://localhost:5001/api/auth/members/${member.id}`, {
            // headers: { ...headers, Role: user.role },
            headers: {
              Authorization: `Bearer ${token}`,
              Role: member.role,
            },
          })
          .then((res) => {
            setMemberData(res.data);
            setFilteredMemberData(res.data);
          })
          .catch((error) => {
            console.error("Error fetching members data:", error);
            return { data: [] };
          });

        // Fetch referral transactions
        axios
          .get(
            `http://localhost:5001/api/auth/referral-transactions/${member.id}`,
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
          });
      }
    }
  }, [authState.isAuthenticated, member]);

  console.log("memberlists==>", memberData);
  // to open modal window
  const openModal = () => {
    setShowModal(true);
  };
  // edit button click
  const handleEditClick = () => {
    setIsDisabled(false); // Enable the form
  };

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1); // Go back to the previous route
    } else {
      navigate("/defaultRoute"); // Redirect to a default route
    }
  };

  console.log("userDetails==>", JSON.stringify(formData));

  // to get the initials of first name and last name
  const getInitials = (firstName, lastName) => {
    const firstInitial = firstName?.charAt(0).toUpperCase() || "";
    const lastInitial = lastName?.charAt(0).toUpperCase() || "";
    return firstInitial + lastInitial;
  };

  // Handle form submission
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsDisabled(true); // Disabled the form
    const userId = authState.user.id; // Assuming the user ID is in authState.user.id
    const userDetails = formData;
    // Make PUT request to update user details using axios
    axios
      .put(`http://localhost:5001/api/auth/update-details/${member.id}`, {
        user_details: userDetails,
      })
      .then((response) => {
        console.log("User details updated:", response.data);
        // Optionally, redirect or show success message
        setSuccessMessage("Details updated successfully!"); // Show success message
      })
      .catch((error) => {
        console.error("Error updating user details:", error);
        setSuccessMessage("Failed to update details."); // Show error message
      });
  };

  const handleDismissMessage = () => {
    setSuccessMessage(""); // Clear the message when user dismisses it
  };

  // Admin panel
  // Admin panel
  const getUserData = JSON.parse(localStorage.getItem("user"));
  console.log("localdata", getUserData?.role);
  // For transaction submission
  const [transactionFormState, setTransactionFormState] = useState({
    userId: member?.id || "",
    productName: "",
    amount: "",
  });

  const handleTransactionInputChange = (e) => {
    const { id, value } = e.target;

    setTransactionFormState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!transactionFormState.productName) {
      newErrors.productName = "Product name is required.";
    }
    if (
      !transactionFormState.amount ||
      isNaN(transactionFormState.amount) ||
      transactionFormState.amount <= 0
    ) {
      newErrors.amount = "Valid price is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTransactionSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    axios
      .post("http://localhost:5001/api/auth/hierarchical-commission", {
        transactionFormState,
      })
      .then((response) => {
        console.log("Transaction submitted:", response.data);
        setSuccessMessage("Transaction submitted successfully!");
        setTransactionFormState({
          userId: member.id,
          productName: "",
          amount: "",
        });
        setErrors({});
      })
      .catch((error) => {
        console.error("Error submitting transaction:", error);
        setSuccessMessage("Failed to submit transaction.");
      });
  };

  // Handle Referral Transaction Submission Flow
  const handleRefInputChange = (e, field) => {
    if (getUserData?.role !== "admin") return; // Check the role
    const { value } = e.target;

    setFormState((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleRadioChange = (e, memberId) => {
    if (getUserData?.role !== "admin") return; // Check the role
    setSelectedMemberId(memberId);
    setFormState({
      userId: memberId, // Initialize formState with the selected memberId
      productName: "",
      amount: "",
    });
    setErrors({}); // Clear errors when a new member is selected
  };

  const validateReferralForm = () => {
    if (getUserData?.role !== "admin") return false; // Check the role
    const errors = {};
    if (!formState.productName) {
      errors.productName = "Product name is required.";
    }
    if (!formState.amount || isNaN(formState.amount) || formState.amount <= 0) {
      errors.amount = "Valid amount is required.";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleReferralTransactionSubmit = (e) => {
    e.preventDefault();
    if (getUserData?.role !== "admin") return; // Check the role

    if (!selectedMemberId) {
      setErrors({ general: "Please select a member." });
      return;
    }

    if (!validateReferralForm()) {
      return;
    }

    console.log("Form State on Submit:", formState);

    axios
      .post(`http://localhost:5001/api/auth/hierarchical-commission`, {
        formState,
      })
      .then((response) => {
        console.log("User details updated:", response.data);
        setSuccessMessage("Details updated successfully!");
        setFormState({});
        setSelectedMemberId(null);
      })
      .catch((error) => {
        console.error("Error updating user details:", error);
        setSuccessMessage("Failed to update details.");
      });
  };

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

  // Display total commissions
  console.log(totalCommissionByPerson);

  // Admin Panel End!

  return (
    <div className="bg-light member-details">
      {/* Navigation Bar */}
      <Header />
      {/* Hero Section */}

      <div className="container mt-4 bg-white md-box p-4">
        <div className="">
          <div className=" my-2 cursor back-lnk" onClick={goBack}>
            &larr; Back to dashborad
          </div>
          <div className="d-flex align-items-center rounded">
            {/* Logo Column */}
            <div className=" d-flex flex-column align-items-center justify-content-center me-3">
              <div className="user-avatar d-flex align-items-center justify-content-center">
                {/* Dynamically displaying the initials */}
                <h1>
                  {getInitials(member?.firstName || "", member?.lastName || "")}
                </h1>
              </div>
            </div>

            {/* Text Column */}
            <div className="user-info">
              <h3 className="user-name">
                {member?.firstName && member?.lastName
                  ? `${member.firstName} ${member.lastName}`
                  : "No Name Provided"}
              </h3>
              <p className="user-role">{member?.role || "No Role Assigned"}</p>
            </div>
          </div>
        </div>

        <div>
          {/* Tab Links */}
          <div className="tab-links">
            <button
              className={activeTab === "referral" ? "active" : ""}
              onClick={() => setActiveTab("referral")}
            >
              Referral Details
            </button>
            <button
              className={activeTab === "transaction" ? "active" : ""}
              onClick={() => setActiveTab("transaction")}
            >
              Transaction
            </button>
          </div>

          <div className="d-flex"></div>

          {/* Tab Content */}
          {successMessage && (
            <div
              className="alert alert-success alert-dismissible fade show"
              role="alert"
            >
              {successMessage}
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={handleDismissMessage}
              ></button>
            </div>
          )}
          <div className="tab-content">
            {activeTab === "referral" && (
              <div>
                <div className="d-flex justify-content-between mb-4 pb-2 border-bottom">
                  <h4>Referral Details</h4>
                  <button onClick={handleEditClick} className="btn btn-primary">
                    Edit
                  </button>
                </div>
                <form onSubmit={handleSubmit}>
                  {/* First Section */}
                  <div className="memberfillform grid align-items-center flex-wrap gap-4 mb-4">
                    <div className="form-group">
                      <label className="form-label">
                        Mental Age (Practical, Home attached, Independent)
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="mental_age"
                        value={formData?.mental_age ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        Family Values (Open, Conservative, Orthodox)
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="family_values"
                        value={formData?.family_values ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        Traditions of Family (Community services, Gatherings,
                        House parties)
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="traditions_of_family"
                        value={formData?.traditions_of_family ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        Family Member Name - & Age
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="family_member_details"
                        value={formData?.family_member_details ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        Legacy of the Family (Business, Govt. Jobs, Settled
                        Abroad)
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="legacy_of_family"
                        value={formData?.legacy_of_family ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Emotional Range</label>
                      <input
                        className="form-control"
                        type="text"
                        name="emotional_range"
                        value={formData?.emotional_range ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        Thoughts about people
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="thoughts_about"
                        value={formData?.thoughts_about ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Conversation style</label>
                      <input
                        className="form-control"
                        type="text"
                        name="conversation_style"
                        value={formData?.conversation_style ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Working style</label>
                      <input
                        className="form-control"
                        type="text"
                        name="working_style"
                        value={formData?.working_style ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Spending Style</label>
                      <input
                        className="form-control"
                        type="text"
                        name="spending_style"
                        value={formData?.spending_style ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        Thoughts on Lifestyle
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="thoughts_on_lifestyle"
                        value={formData?.thoughts_on_lifestyle ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        Past Vacations and Family Holidays
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="past_vacations"
                        value={formData?.past_vacations ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        Physical Looks (Skin, Hair)
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="physical_looks"
                        value={formData?.physical_looks ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Disfigurements</label>
                      <input
                        className="form-control"
                        type="text"
                        name="disfigurements"
                        value={formData?.disfigurements ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        Internal Organs Health (Liver, Stomach, Digestion,
                        Mental Health, Respiration, Physical Movement)
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="internal_organs_health"
                        value={formData?.internal_organs_health ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Personality</label>
                      <input
                        className="form-control"
                        type="text"
                        name="personality"
                        value={formData?.personality ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Dressing</label>
                      <input
                        className="form-control"
                        type="text"
                        name="dressing"
                        value={formData?.dressing ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        Behaviour in Social Gatherings
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="behaviour_in_sg"
                        value={formData?.behaviour_in_sg ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Area of living</label>
                      <input
                        className="form-control"
                        type="text"
                        name="area_of_livig"
                        value={formData?.area_of_livig ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">How many transfers</label>
                      <input
                        className="form-control"
                        type="text"
                        name="how_many_transfer"
                        value={formData?.how_many_transfer ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Idea of Settlement</label>
                      <input
                        className="form-control"
                        type="text"
                        name="idea_of_settle"
                        value={formData?.idea_of_settle ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Areas of Interest</label>
                      <input
                        className="form-control"
                        type="text"
                        name="areas_of_interest"
                        value={formData?.areas_of_interest ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        Possession (Parental, Purchased)
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="possession"
                        value={formData?.possession ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        Future Travel Interests
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="future_travel"
                        value={formData?.future_travel ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        Marks during academic years
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="marks"
                        value={formData?.marks ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        Courses Apart from Formal Education
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="courses_apart"
                        value={formData?.courses_apart ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        Areas of Successful/ unsuccessful side hustles
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="areas_of_success"
                        value={formData?.areas_of_success ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        Activities involved apart from curriculum and success in
                        them
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="activities_involved"
                        value={formData?.activities_involved ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        Leadership position through life
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="leadership_position"
                        value={formData?.leadership_position ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Typing Speed</label>
                      <input
                        className="form-control"
                        type="text"
                        name="typing_speed"
                        value={formData?.typing_speed ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Interesting Subjects</label>
                      <input
                        className="form-control"
                        type="text"
                        name="interesting_subjects"
                        value={formData?.interesting_subjects ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Current occupation</label>
                      <input
                        className="form-control"
                        type="text"
                        name="current_occupation"
                        value={formData?.current_occupation ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        Interest in occupation
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="interest_in_occupation"
                        value={formData?.interest_in_occupation ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        Work designation (and from how long working in the same
                        designation?)
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="work_designation"
                        value={formData?.work_designation ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        Interaction with co-workers
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="interact_with_coworkers"
                        value={formData?.interact_with_coworkers ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        Nature of Job and Nature of Boss
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="nature_of_job"
                        value={formData?.nature_of_job ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        Relation with spouse/ Family/ Kids
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="relation_with"
                        value={formData?.relation_with ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        Issues in family (Health, Material, Personal Interest)
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="issues_in_family"
                        value={formData?.issues_in_family ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Circle of Friends</label>
                      <input
                        className="form-control"
                        type="text"
                        name="circle_of_frnds"
                        value={formData?.circle_of_frnds ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        Number of Relationships / Partners
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="number_of_partners"
                        value={formData?.number_of_partners ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Fluency in languages</label>
                      <input
                        className="form-control"
                        type="text"
                        name="fluency_in_lang"
                        value={formData?.fluency_in_lang ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        Interest in other languages
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="interest_in_other_lang"
                        value={formData?.interest_in_other_lang ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        Caste (inside religion)
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="caste"
                        value={formData?.caste ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        Faiths (believes in spirituality, god fearing,
                        practical)
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="faiths"
                        value={formData?.faiths ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        Beliefs (Shri Krishna, Shri Ram, Lord Shiva etc)
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="beliefs"
                        value={formData?.beliefs ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        No. of Cars, Bikes, EVs
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="no_of_cars"
                        value={formData?.no_of_cars ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        No. of Houses and Shops
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="no_of_house"
                        value={formData?.no_of_house ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Financial Literacy</label>
                      <input
                        className="form-control"
                        type="text"
                        name="financial_literacy"
                        value={formData?.financial_literacy ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        Views on Investments, Saving and Spends
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="views_on_invest"
                        value={formData?.views_on_invest ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        How many debts/ Loans
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="How_many_debts"
                        value={formData?.How_many_debts ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        Comfort with technology
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="comfort_with_tech"
                        value={formData?.comfort_with_tech ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        Electronic Devices (Number and Spends and usages)
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="electronic_devices"
                        value={formData?.electronic_devices ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        Appliances in use (Fridge, Washing Machine, ACs, Wifi,
                        Google Home)
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="appliances_in_use"
                        value={formData?.appliances_in_use ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        Technological Interests & wishes
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="technological_interests"
                        value={formData?.technological_interests ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        How frequently changes devices (mobile/ laptop)
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="how_often_chge_devices"
                        value={formData?.how_often_chge_devices ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        Usage of Traditional items
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="traditional_items"
                        value={formData?.traditional_items ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Types of Brands used</label>
                      <input
                        className="form-control"
                        type="text"
                        name="types_of_brands"
                        value={formData?.types_of_brands ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Volunteer Services</label>
                      <input
                        className="form-control"
                        type="text"
                        name="volunteer_services"
                        value={formData?.volunteer_services ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Fears</label>
                      <input
                        className="form-control"
                        type="text"
                        name="fears"
                        value={formData?.fears ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        Motivations and Drawbacks
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="motivations_drawbacks"
                        value={formData?.motivations_drawbacks ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        What do they do in their free time?
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="free_time"
                        value={formData?.free_time ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        Daily/Weekly/Monthly Outings
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="outings"
                        value={formData?.outings ?? ""}
                        onChange={handleInputChange}
                        disabled={isDisabled} // Control the disabled state
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="text-center my-4">
                    <button type="submit" className="btn btn-primary">
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            )}
            {activeTab === "transaction" && (
              <div className="transaction-box">
                <h4>Transaction</h4>
                <div>
                  {/* Member Details */}
                  <div className="d-flex">
                    <div className="me-2 pe-4 shadwo p-4 bg-white">
                      <div>
                        <strong>Member ID:</strong> {member?.id}
                      </div>
                      <div>
                        <strong>Member Name:</strong> {member?.firstName}
                      </div>
                      <div>
                        <strong>Role:</strong> {member?.role}
                      </div>
                      <div>
                        <strong>Mobile:</strong> {member?.mobile}
                      </div>
                    </div>
                    <div className="pe-4 shadow p-4 bg-white">
                      {getUserData?.role && getUserData?.role === "admin" && (
                        <form onSubmit={handleTransactionSubmit}>
                          <input
                            type="hidden"
                            name="selectedMember"
                            value={transactionFormState.selectedMember}
                          />
                          <div className="mb-2">
                            <label htmlFor="productName">Product Name:</label>
                            <input
                              type="text"
                              id="productName"
                              value={transactionFormState.productName}
                              onChange={handleTransactionInputChange}
                            />
                            {errors.productName && (
                              <span className="text-danger">
                                {errors.productName}
                              </span>
                            )}
                          </div>
                          <div className="mb-2">
                            <label htmlFor="amount">Price:</label>
                            <input
                              type="text"
                              id="amount"
                              value={transactionFormState.amount}
                              onChange={handleTransactionInputChange}
                            />
                            {errors.amount && (
                              <span className="text-danger">
                                {errors.amount}
                              </span>
                            )}
                          </div>
                          <div>
                            <button
                              type="submit"
                              className="btn btn-primary w-100"
                            >
                              Submit
                            </button>
                          </div>
                          {successMessage && (
                            <div
                              className={`text-${
                                successMessage.includes("successfully")
                                  ? "success"
                                  : "danger"
                              } mt-3`}
                            >
                              {successMessage}
                            </div>
                          )}
                        </form>
                      )}
                    </div>
                  </div>
                  {/* Table */}
                  <div className="d-flex justify-content-between my-4 pb-2 border-bottom">
                    <h4>Product Details</h4>
                  </div>
                  {transactionData.length > 0 ? (
                    <table className="product-table product-table">
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
                              {Number(transaction.commissionEarned).toFixed(2)}
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
                  ) : (
                    <p>No transactions found.</p>
                  )}
                </div>

                {/* admin panel */}
                {getUserData?.role && getUserData?.role === "admin" && (
                  <div className="mt-2">
                    <div className="mb-3 pb-3 border-secondary">
                      <div className="d-flex justify-content-between my-4 pb-2 border-bottom">
                        <h4>Referral List</h4>
                      </div>
                      {successMessage && (
                        <div
                          className="alert alert-success alert-dismissible fade show"
                          role="alert"
                        >
                          {successMessage}
                          <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                            onClick={handleDismissMessage}
                          ></button>
                        </div>
                      )}
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
                    </div>
                    <div className="mt-0">
                      <div className="table-responsive data-table">
                        <form onSubmit={handleReferralTransactionSubmit}>
                          <table className="table">
                            <thead className="list-table">
                              <tr>
                                <th></th>
                                <th scope="col">Member ID</th>
                                <th scope="col">Member Name</th>
                                <th scope="col">Mobile Number</th>
                                <th scope="col">Product Name</th>
                                <th scope="col">Price</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              {currentItems.length > 0 ? (
                                currentItems.map((member) => (
                                  <tr key={member.id}>
                                    <td>
                                      <input
                                        type="radio"
                                        name="selectedMember"
                                        value={member.id}
                                        checked={selectedMemberId === member.id}
                                        onChange={(e) =>
                                          handleRadioChange(e, member.id)
                                        }
                                      />
                                    </td>
                                    <td>{member.id}</td>
                                    <td>{`${member.firstName} ${member.lastName}`}</td>
                                    <td>{member.mobile}</td>
                                    <td>
                                      <input
                                        type="text"
                                        value={
                                          selectedMemberId === member.id
                                            ? formState.productName || ""
                                            : ""
                                        }
                                        onChange={(e) =>
                                          handleRefInputChange(e, "productName")
                                        }
                                        disabled={
                                          selectedMemberId !== member.id
                                        }
                                      />
                                      {selectedMemberId === member.id &&
                                        errors.productName && (
                                          <span className="text-danger">
                                            {errors.productName}
                                          </span>
                                        )}
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        value={
                                          selectedMemberId === member.id
                                            ? formState.amount || ""
                                            : ""
                                        }
                                        onChange={(e) =>
                                          handleRefInputChange(e, "amount")
                                        }
                                        disabled={
                                          selectedMemberId !== member.id
                                        }
                                      />
                                      {selectedMemberId === member.id &&
                                        errors.amount && (
                                          <span className="text-danger">
                                            {errors.amount}
                                          </span>
                                        )}
                                    </td>
                                    <td>
                                      {selectedMemberId === member.id && (
                                        <button
                                          type="submit"
                                          className="btn btn-primary"
                                        >
                                          Submit
                                        </button>
                                      )}
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
                        </form>
                        {errors.general && (
                          <div className="text-danger mt-3">
                            {errors.general}
                          </div>
                        )}
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
                                  onClick={() =>
                                    handlePageChange(pageIndex + 1)
                                  }
                                >
                                  {pageIndex + 1}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MemberDetails;
