import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Back from "../assets/images/back.png";
import { AuthContext } from "../context/AuthContext";
// import FileUpload from "./FileUpload";
import Header from "./Header";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";

const MemberDetails = () => {
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [isDisabled, setIsDisabled] = useState(true);
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState("");
  const member = location.state?.member; // Access the passed member data
  console.log("Location state:", location.state);

  console.log("member details", member);
  const [activeTab, setActiveTab] = useState("referral");

  // State for the form data
  const [formData, setFormData] = useState({
    mental_age: "",
    family_values: "",
    traditions_of_family: "",
    family_member_details: "",
    legacy_of_family: "",
    emotional_range: "",
    thoughts_about: "",
    conversation_style: "",
    working_style: "",
    spending_style: "",
    thoughts_on_lifestyle: "",
    past_vacations: "",
    physical_looks: "",
    disfigurements: "",
    internal_organs_health: "",
    personality: "",
    dressing: "",
    behaviour_in_sg: "",
    area_of_livig: "",
    how_many_transfer: "",
    idea_of_settle: "",
    areas_of_interest: "",
    possession: "",
    future_travel: "",
    marks: "",
    courses_apart: "",
    areas_of_success: "",
    activities_involved: "",
    leadership_position: "",
    typing_speed: "",
    interesting_subjects: "",
    current_occupation: "",
    interest_in_occupation: "",
    work_designation: "",
    interact_with_coworkers: "",
    nature_of_job: "",
    relation_with: "",
    issues_in_family: "",
    circle_of_frnds: "",
    number_of_partners: "",
    fluency_in_lang: "",
    interest_in_other_lang: "",
    caste: "",
    faiths: "",
    beliefs: "",
    no_of_cars: "",
    no_of_house: "",
    financial_literacy: "",
    views_on_invest: "",
    How_many_debts: "",
    comfort_with_tech: "",
    electronic_devices: "",
    appliances_in_use: "",
    technological_interests: "",
    how_often_chge_devices: "",
    traditional_items: "",
    types_of_brands: "",
    volunteer_services: "",
    fears: "",
    motivations_drawbacks: "",
    free_time: "",
    outings: "",
  });

  // Get initial values if the user has pre-existing details
  useEffect(() => {
    if (authState.isAuthenticated) {
      const token = authState.token;

      // Fetch user details
      axios
        .get(`http://localhost:5001/api/auth/user-details/${member.id}`, {
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
    }
  }, [authState.isAuthenticated]);

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

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
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

  const memberDetails = {
    memberId: "D1001",
    memberName: "Gopi Krishna",
    role: "Secondary Member",
  };

  const tableData = [
    {
      id: 1,
      productName: "Product A",
      date: "2024-01-01",
      price: "$100",
      commission: "$10",
    },
    {
      id: 2,
      productName: "Product B",
      date: "2024-02-15",
      price: "$150",
      commission: "$15",
    },
    {
      id: 3,
      productName: "Product C",
      date: "2024-03-20",
      price: "$200",
      commission: "$20",
    },
  ];

  return (
    <div className="bg-light member-details">
      {/* Navigation Bar */}
      <Header />

      {/* Hero Section */}
      <div className="container mt-4 bg-white md-box p-4">
        <div className="">
          <div className="d-flex align-items-center rounded">
            {/* Logo Column */}
            <div className=" d-flex flex-column align-items-center justify-content-center me-3">
              <div className="user-avatar d-flex align-items-center justify-content-center">
                {/* Dynamically displaying the initials */}
                <h1>{getInitials(member.firstName, member.lastName)}</h1>
              </div>
            </div>

            {/* Text Column */}
            <div className="user-info">
              <h3 className="user-name">
                {member.firstName + " " + member.lastName}
              </h3>
              <p className="user-role">{member.role}</p>
            </div>
          </div>
        </div>
        <div className=" my-2 cursor" onClick={goBack}>
          <img src={Back} alt="back" /> Back to Member Portal
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
              All Transaction Details
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
              <div>
                <h4>Transaction History</h4>
                <div>
                  {/* Member Details */}
                  <div>
                    <strong>Member ID:</strong> {member.id}
                  </div>
                  <div>
                    <strong>Member Name:</strong> {member.firstName}
                  </div>
                  <div>
                    <strong>Role:</strong> {member.role}
                  </div>

                  {/* Table */}
                  <div className="d-flex justify-content-between my-4 pb-2 border-bottom">
                    <h4>Product Details</h4>
                    <button onClick={openModal} className="btn btn-primary">
                      Add Product Detail
                    </button>
                  </div>

                  <table className="product-table product-table">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Product Name</th>
                        <th>Date</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>Product A</td>
                        <td>2024-01-01</td>
                        <td>$100</td>
                      </tr>
                      <tr>
                        <td>2</td>
                        <td>Product B</td>
                        <td>2024-02-15</td>
                        <td>$150</td>
                      </tr>
                      <tr>
                        <td>3</td>
                        <td>Product C</td>
                        <td>2024-03-20</td>
                        <td>$200</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
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
