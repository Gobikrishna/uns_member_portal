import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
// import FileUpload from "./FileUpload";
import Header from "./Header";
import Footer from "./Footer";

const MemberDetails = () => {

const [userData, setUserData] = useState({});

// to get the initials of first name and last name
const getInitials = (firstName, lastName) => {
  const firstInitial = firstName?.charAt(0).toUpperCase() || "";
  const lastInitial = lastName?.charAt(0).toUpperCase() || "";
  return firstInitial + lastInitial;
};

  return (
    <div>
      {/* Navigation Bar */}
      <Header />

      {/* Hero Section */}
      <div className="container mt-4">
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
              <h3 className="user-name">{userData.firstName}</h3>
              <p className="user-role">{userData.role}</p>
            </div>
          </div>
        </div>
      <h3 className="text-center mb-4">Detailed Form</h3>
      <form>
        {/* First Section */}
        <div className="memberfillform grid align-items-center flex-wrap gap-4 mb-4">
        <div>
  <label>Mental Age (Practical, Home attached, Independent)</label>
  <input type="text" name="mental_age" />
</div>
<div>
  <label>Family Values (Open, Conservative, Orthodox)</label>
  <input type="text" name="family_values" />
</div>
<div>
  <label>Traditions of Family (Community services, Gatherings, House parties)</label>
  <input type="text" name="traditions_family" />
</div>
<div>
  <label>Family Member Name - & Age</label>
  <input type="text" name="family_member_name_age" />
</div>
<div>
  <label>Legacy of the Family (Business, Govt. Jobs, Settled Abroad)</label>
  <input type="text" name="family_legacy" />
</div>
<div>
  <label>Emotional Range</label>
  <input type="text" name="emotional_range" />
</div>
<div>
  <label>Thoughts about people</label>
  <input type="text" name="thoughts_about_people" />
</div>
<div>
  <label>Conversation style</label>
  <input type="text" name="conversation_style" />
</div>
<div>
  <label>Working style</label>
  <input type="text" name="working_style" />
</div>
<div>
  <label>Spending Style</label>
  <input type="text" name="spending_style" />
</div>
<div>
  <label>Thoughts on Lifestyle</label>
  <input type="text" name="thoughts_lifestyle" />
</div>
<div>
  <label>Past Vacations and Family Holidays</label>
  <input type="text" name="past_vacations" />
</div>
<div>
  <label>Physical Looks (Skin, Hair)</label>
  <input type="text" name="physical_looks" />
</div>
<div>
  <label>Disfigurements</label>
  <input type="text" name="disfigurements" />
</div>
<div>
  <label>Internal Organs Health (Liver, Stomach, Digestion, Mental Health, Respiration, Physical Movement)</label>
  <input type="text" name="internal_organs_health" />
</div>
<div>
  <label>Personality</label>
  <input type="text" name="personality" />
</div>
<div>
  <label>Dressing</label>
  <input type="text" name="dressing" />
</div>
<div>
  <label>Behaviour in Social Gatherings</label>
  <input type="text" name="social_behaviour" />
</div>
<div>
  <label>Area of living</label>
  <input type="text" name="area_of_living" />
</div>
<div>
  <label>How many transfers</label>
  <input type="text" name="number_of_transfers" />
</div>
<div>
  <label>Idea of Settlement</label>
  <input type="text" name="idea_of_settlement" />
</div>
<div>
  <label>Areas of Interest</label>
  <input type="text" name="areas_of_interest" />
</div>
<div>
  <label>Possession (Parental, Purchased)</label>
  <input type="text" name="possessions" />
</div>
<div>
  <label>Future Travel Interests</label>
  <input type="text" name="future_travel_interests" />
</div>
<div>
  <label>Marks during academic years</label>
  <input type="text" name="academic_marks" />
</div>
<div>
  <label>Courses Apart from Formal Education</label>
  <input type="text" name="extra_courses" />
</div>
<div>
  <label>Areas of Successful/ unsuccessful side hustles</label>
  <input type="text" name="side_hustles" />
</div>
<div>
  <label>Activities involved apart from curriculum and success in them</label>
  <input type="text" name="extra_activities" />
</div>
<div>
  <label>Leadership position through life</label>
  <input type="text" name="leadership_positions" />
</div>
<div>
  <label>Typing Speed</label>
  <input type="text" name="typing_speed" />
</div>
<div>
  <label>Interesting Subjects</label>
  <input type="text" name="interesting_subjects" />
</div>
<div>
  <label>Current occupation</label>
  <input type="text" name="current_occupation" />
</div>
<div>
  <label>Interest in occupation</label>
  <input type="text" name="occupation_interest" />
</div>
<div>
  <label>Work designation (and from how long working in the same designation?)</label>
  <input type="text" name="work_designation" />
</div>
<div>
  <label>Interaction with co-workers</label>
  <input type="text" name="coworker_interaction" />
</div>
<div>
  <label>Nature of Job and Nature of Boss</label>
  <input type="text" name="job_nature" />
</div>
<div>
  <label>Relation with spouse/ Family/ Kids</label>
  <input type="text" name="relation_family" />
</div>
<div>
  <label>Issues in family (Health, Material, Personal Interest)</label>
  <input type="text" name="family_issues" />
</div>
<div>
  <label>Circle of Friends</label>
  <input type="text" name="friends_circle" />
</div>
<div>
  <label>Number of Relationships / Partners</label>
  <input type="text" name="relationships" />
</div>
<div>
  <label>Fluency in languages</label>
  <input type="text" name="language_fluency" />
</div>
<div>
  <label>Interest in other languages</label>
  <input type="text" name="other_language_interest" />
</div>
<div>
  <label>Caste (inside religion)</label>
  <input type="text" name="caste" />
</div>
<div>
  <label>Faiths (believes in spirituality, god fearing, practical)</label>
  <input type="text" name="faiths" />
</div>
<div>
  <label>Beliefs (Shri Krishna, Shri Ram, Lord Shiva etc)</label>
  <input type="text" name="beliefs" />
</div>
<div>
  <label>No. of Cars, Bikes, EVs</label>
  <input type="text" name="vehicles" />
</div>
<div>
  <label>No. of Houses and Shops</label>
  <input type="text" name="houses_shops" />
</div>
<div>
  <label>Financial Literacy</label>
  <input type="text" name="financial_literacy" />
</div>
<div>
  <label>Views on Investments, Saving and Spends</label>
  <input type="text" name="investment_views" />
</div>
<div>
  <label>How many debts/ Loans</label>
  <input type="text" name="debts_loans" />
</div>
<div>
  <label>Comfort with technology</label>
  <input type="text" name="technology_comfort" />
</div>
<div>
  <label>Electronic Devices (Number and Spends and usages)</label>
  <input type="text" name="electronic_devices" />
</div>
<div>
  <label>Appliances in use (Fridge, Washing Machine, ACs, Wifi, Google Home)</label>
  <input type="text" name="appliances" />
</div>
<div>
  <label>Technological Interests & wishes</label>
  <input type="text" name="tech_interests" />
</div>
<div>
  <label>How frequently changes devices (mobile/ laptop)</label>
  <input type="text" name="device_changes" />
</div>
<div>
  <label>Usage of Traditional items</label>
  <input type="text" name="traditional_items_usage" />
</div>
<div>
  <label>Types of Brands used</label>
  <input type="text" name="brands_used" />
</div>
<div>
  <label>Volunteer Services</label>
  <input type="text" name="volunteer_services" />
</div>
<div>
  <label>Fears</label>
  <input type="text" name="fears" />
</div>
<div>
  <label>Motivations and Drawbacks</label>
  <input type="text" name="motivations_drawbacks" />
</div>
<div>
  <label>What do they do in their free time?</label>
  <input type="text" name="free_time_activities" />
</div>
<div>
  <label>Daily/Weekly/Monthly Outings</label>
  <input type="text" name="outings" />
</div>
</div>

        {/* Submit Button */}
        <div className="text-center mt-4">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>

      {/* Footer */}
     <Footer />
    </div>
  );
}

export default MemberDetails;
