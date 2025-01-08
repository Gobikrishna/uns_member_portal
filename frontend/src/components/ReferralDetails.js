import { useContext, useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import formDataConfig from "./config/formDataConfig";
const ReferralDetails = (referralId) => {
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState(formDataConfig); // Initialize with imported config

  // Get initial values if the user has pre-existing details
  useEffect(() => {
    if (authState.isAuthenticated) {
      const token = authState.token;
      const memberId = referralId.referralId;

      if (!memberId) {
        // Redirect to the dashboard if member data is null or undefined
        navigate("/admin-dashboard");
      } else {
        // Fetch user details
        axios
          .get(`http://localhost:5001/api/auth/user-details/${memberId}`, {
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
    }
  }, [authState.isAuthenticated, referralId]);

  console.log("member.id", referralId.referralId);

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1); // Go back to the previous route
    } else {
      navigate("/defaultRoute"); // Redirect to a default route
    }
  };

  return (
    <div>
      <div>
        <p>
          <strong> Mental Age (Practical, Home attached, Independent):</strong>{" "}
          {formData?.mental_age ?? ""}
        </p>
        <p>
          <strong> Family Values (Open, Conservative, Orthodox):</strong>{" "}
          {formData?.family_values ?? ""}
        </p>
        <p>
          <strong>
            Traditions of Family (Community services, Gatherings, House
            parties):
          </strong>{" "}
          {formData?.traditions_of_family ?? ""}
        </p>

        <p>
          <strong>Family Member Name - & Age</strong>{" "}
          {formData?.family_member_details ?? ""}
        </p>
        <p>
          <strong>
            Legacy of the Family (Business, Govt. Jobs, Settled Abroad)
          </strong>{" "}
          {formData?.legacy_of_family ?? ""}
        </p>

        <p>
          <strong>Emotional Range</strong> {formData?.emotional_range ?? ""}
        </p>

        <p>
          <strong>Thoughts about people</strong>{" "}
          {formData?.thoughts_about ?? ""}
        </p>

        <p>
          <strong>Conversation style</strong>{" "}
          {formData?.conversation_style ?? ""}
        </p>

        <p>
          <strong>Working style:</strong> {formData?.working_style ?? ""}
        </p>

        <p>
          <strong>Spending Style:</strong> {formData?.spending_style ?? ""}
        </p>
        <p>
          <strong>Thoughts on Lifestyle:</strong>{" "}
          {formData?.thoughts_on_lifestyle ?? ""}
        </p>

        <p>
          <strong>Past Vacations and Family Holidays:</strong>{" "}
          {formData?.past_vacations ?? ""}
        </p>
        <p>
          <strong>Physical Looks (Skin, Hair):</strong>{" "}
          {formData?.physical_looks ?? ""}
        </p>
        <p>
          <strong>Disfigurements:</strong> {formData?.disfigurements ?? ""}
        </p>

        <p>
          <strong>
            Internal Organs Health (Liver, Stomach, Digestion, Mental Health,
            Respiration, Physical Movement):
          </strong>{" "}
          {formData?.internal_organs_health ?? ""}
        </p>

        <p>
          <strong>Personality:</strong> {formData?.personality ?? ""}
        </p>

        <p>
          <strong>Dressing:</strong> {formData?.dressing ?? ""}
        </p>

        <p>
          <strong>Behaviour in Social Gatherings:</strong>{" "}
          {formData?.behaviour_in_sg ?? ""}
        </p>

        <p>
          <strong>Area of living:</strong> {formData?.area_of_livig ?? ""}
        </p>

        <p>
          <strong>How many transfers:</strong>{" "}
          {formData?.how_many_transfer ?? ""}
        </p>

        <p>
          <strong>Idea of Settlement:</strong> {formData?.idea_of_settle ?? ""}
        </p>

        <p>
          <strong>Areas of Interest:</strong>{" "}
          {formData?.areas_of_interest ?? ""}
        </p>

        <p>
          <strong> Possession (Parental, Purchased):</strong>{" "}
          {formData?.possession ?? ""}
        </p>
        <p>
          <strong>Future Travel Interests:</strong>{" "}
          {formData?.future_travel ?? ""}
        </p>
        <p>
          <strong>Marks during academic years:</strong> {formData?.marks ?? ""}
        </p>
        <p>
          <strong>Courses Apart from Formal Education:</strong>{" "}
          {formData?.courses_apart ?? ""}
        </p>
        <p>
          <strong> Areas of Successful/ unsuccessful side hustles:</strong>{" "}
          {formData?.areas_of_success ?? ""}
        </p>
        <p>
          <strong>
            Activities involved apart from curriculum and success in them:
          </strong>{" "}
          {formData?.activities_involved ?? ""}
        </p>
        <p>
          <strong>Leadership position through life:</strong>{" "}
          {formData?.leadership_position ?? ""}
        </p>
        <p>
          <strong>Typing Speed:</strong> {formData?.typing_speed ?? ""}
        </p>
        <p>
          <strong>Interesting Subjects:</strong>{" "}
          {formData?.interesting_subjects ?? ""}
        </p>
        <p>
          <strong>Current occupation:</strong>{" "}
          {formData?.current_occupation ?? ""}
        </p>
        <p>
          <strong>Interest in occupation:</strong>{" "}
          {formData?.interest_in_occupation ?? ""}
        </p>
        <p>
          <strong>
            {" "}
            Work designation (and from how long working in the same
            designation?):
          </strong>{" "}
          {formData?.work_designation ?? ""}
        </p>
        <p>
          <strong>Interaction with co-workers:</strong>{" "}
          {formData?.interact_with_coworkers ?? ""}
        </p>
        <p>
          <strong>Nature of Job and Nature of Boss:</strong>{" "}
          {formData?.nature_of_job ?? ""}
        </p>
        <p>
          <strong>Relation with spouse/ Family/ Kids:</strong>{" "}
          {formData?.relation_with ?? ""}
        </p>
        <p>
          <strong>
            Issues in family (Health, Material, Personal Interest):
          </strong>{" "}
          {formData?.issues_in_family ?? ""}
        </p>
        <p>
          <strong>Circle of Friends:</strong> {formData?.circle_of_frnds ?? ""}
        </p>
        <p>
          <strong>Number of Relationships / Partners:</strong>{" "}
          {formData?.number_of_partners ?? ""}
        </p>
        <p>
          <strong>Fluency in languages:</strong>{" "}
          {formData?.fluency_in_lang ?? ""}
        </p>
        <p>
          <strong>Interest in other languages:</strong>{" "}
          {formData?.interest_in_other_lang ?? ""}
        </p>
        <p>
          <strong>Caste (inside religion):</strong> {formData?.caste ?? ""}
        </p>
        <p>
          <strong>
            Faiths (believes in spirituality, god fearing, practical):
          </strong>{" "}
          {formData?.faiths ?? ""}
        </p>
        <p>
          <strong>Beliefs (Shri Krishna, Shri Ram, Lord Shiva etc):</strong>{" "}
          {formData?.beliefs ?? ""}
        </p>
        <p>
          <strong>No. of Cars, Bikes, EVs:</strong> {formData?.no_of_cars ?? ""}
        </p>
        <p>
          <strong>No. of Houses and Shops:</strong>{" "}
          {formData?.no_of_house ?? ""}
        </p>
        <p>
          <strong>Financial Literacy:</strong>{" "}
          {formData?.financial_literacy ?? ""}
        </p>
        <p>
          <strong>Views on Investments, Saving and Spends:</strong>{" "}
          {formData?.views_on_invest ?? ""}
        </p>
        <p>
          <strong>How many debts/ Loans:</strong>{" "}
          {formData?.How_many_debts ?? ""}
        </p>
        <p>
          <strong>Comfort with technology:</strong>{" "}
          {formData?.comfort_with_tech ?? ""}
        </p>
        <p>
          <strong>Electronic Devices (Number and Spends and usages):</strong>{" "}
          {formData?.electronic_devices ?? ""}
        </p>
        <p>
          <strong>
            Appliances in use (Fridge, Washing Machine, ACs, Wifi, Google Home):
          </strong>{" "}
          {formData?.appliances_in_use ?? ""}
        </p>
        <p>
          <strong>Technological Interests & wishes:</strong>{" "}
          {formData?.technological_interests ?? ""}
        </p>
        <p>
          <strong>How frequently changes devices (mobile/ laptop):</strong>{" "}
          {formData?.how_often_chge_devices ?? ""}
        </p>
        <p>
          <strong>Usage of Traditional items:</strong>{" "}
          {formData?.traditional_items ?? ""}
        </p>
        <p>
          <strong>Types of Brands used:</strong>{" "}
          {formData?.types_of_brands ?? ""}
        </p>
        <p>
          <strong>Volunteer Services:</strong>{" "}
          {formData?.volunteer_services ?? ""}
        </p>
        <p>
          <strong>Fears:</strong> {formData?.fears ?? ""}
        </p>
        <p>
          <strong>Motivations and Drawbacks:</strong>{" "}
          {formData?.motivations_drawbacks ?? ""}
        </p>
        <p>
          <strong>What do they do in their free time?:</strong>{" "}
          {formData?.free_time ?? ""}
        </p>
        <p>
          <strong>Daily/Weekly/Monthly Outings:</strong>{" "}
          {formData?.outings ?? ""}
        </p>
      </div>
    </div>
  );
};

export default ReferralDetails;
