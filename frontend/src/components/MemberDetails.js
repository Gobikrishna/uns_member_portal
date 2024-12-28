import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
// import FileUpload from "./FileUpload";
import Header from "./Header";
import Footer from "./Footer";
import { Link, useNavigate } from "react-router-dom";
const MemberDetails = () => {
  const { authState } = useContext(AuthContext);

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
                <h1>
                  {getInitials(
                    authState.user.firstName,
                    authState.user.lastName
                  )}
                </h1>
              </div>
            </div>

            {/* Text Column */}
            <div className="user-info">
              <h3 className="user-name">
                {authState.user.firstName + " " + authState.user.lastName}
              </h3>
              <p className="user-role">{authState.user.role}</p>
            </div>
          </div>
        </div>
        <h3 className="text-center mb-4">Detailed Form</h3>
        <form>
          {/* First Section */}
          <div className="memberfillform grid align-items-center flex-wrap gap-4 mb-4">
            <div className="form-group">
              <label className="form-label">
                Mental Age (Practical, Home attached, Independent)
              </label>
              <input className="form-control" type="text" name="mental_age" />
            </div>
            <div className="form-group">
              <label className="form-label">
                Family Values (Open, Conservative, Orthodox)
              </label>
              <input
                className="form-control"
                type="text"
                name="family_values"
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                Traditions of Family (Community services, Gatherings, House
                parties)
              </label>
              <input
                className="form-control"
                type="text"
                name="traditions_family"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Family Member Name - & Age</label>
              <input
                className="form-control"
                type="text"
                name="family_member_name_age"
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                Legacy of the Family (Business, Govt. Jobs, Settled Abroad)
              </label>
              <input
                className="form-control"
                type="text"
                name="family_legacy"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Emotional Range</label>
              <input
                className="form-control"
                type="text"
                name="emotional_range"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Thoughts about people</label>
              <input
                className="form-control"
                type="text"
                name="thoughts_about_people"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Conversation style</label>
              <input
                className="form-control"
                type="text"
                name="conversation_style"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Working style</label>
              <input
                className="form-control"
                type="text"
                name="working_style"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Spending Style</label>
              <input
                className="form-control"
                type="text"
                name="spending_style"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Thoughts on Lifestyle</label>
              <input
                className="form-control"
                type="text"
                name="thoughts_lifestyle"
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
              />
            </div>
            <div className="form-group">
              <label className="form-label">Physical Looks (Skin, Hair)</label>
              <input
                className="form-control"
                type="text"
                name="physical_looks"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Disfigurements</label>
              <input
                className="form-control"
                type="text"
                name="disfigurements"
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                Internal Organs Health (Liver, Stomach, Digestion, Mental
                Health, Respiration, Physical Movement)
              </label>
              <input
                className="form-control"
                type="text"
                name="internal_organs_health"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Personality</label>
              <input className="form-control" type="text" name="personality" />
            </div>
            <div className="form-group">
              <label className="form-label">Dressing</label>
              <input className="form-control" type="text" name="dressing" />
            </div>
            <div className="form-group">
              <label className="form-label">
                Behaviour in Social Gatherings
              </label>
              <input
                className="form-control"
                type="text"
                name="social_behaviour"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Area of living</label>
              <input
                className="form-control"
                type="text"
                name="area_of_living"
              />
            </div>
            <div className="form-group">
              <label className="form-label">How many transfers</label>
              <input
                className="form-control"
                type="text"
                name="number_of_transfers"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Idea of Settlement</label>
              <input
                className="form-control"
                type="text"
                name="idea_of_settlement"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Areas of Interest</label>
              <input
                className="form-control"
                type="text"
                name="areas_of_interest"
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                Possession (Parental, Purchased)
              </label>
              <input className="form-control" type="text" name="possessions" />
            </div>
            <div className="form-group">
              <label className="form-label">Future Travel Interests</label>
              <input
                className="form-control"
                type="text"
                name="future_travel_interests"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Marks during academic years</label>
              <input
                className="form-control"
                type="text"
                name="academic_marks"
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                Courses Apart from Formal Education
              </label>
              <input
                className="form-control"
                type="text"
                name="extra_courses"
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                Areas of Successful/ unsuccessful side hustles
              </label>
              <input className="form-control" type="text" name="side_hustles" />
            </div>
            <div className="form-group">
              <label className="form-label">
                Activities involved apart from curriculum and success in them
              </label>
              <input
                className="form-control"
                type="text"
                name="extra_activities"
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                Leadership position through life
              </label>
              <input
                className="form-control"
                type="text"
                name="leadership_positions"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Typing Speed</label>
              <input className="form-control" type="text" name="typing_speed" />
            </div>
            <div className="form-group">
              <label className="form-label">Interesting Subjects</label>
              <input
                className="form-control"
                type="text"
                name="interesting_subjects"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Current occupation</label>
              <input
                className="form-control"
                type="text"
                name="current_occupation"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Interest in occupation</label>
              <input
                className="form-control"
                type="text"
                name="occupation_interest"
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
              />
            </div>
            <div className="form-group">
              <label className="form-label">Interaction with co-workers</label>
              <input
                className="form-control"
                type="text"
                name="coworker_interaction"
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                Nature of Job and Nature of Boss
              </label>
              <input className="form-control" type="text" name="job_nature" />
            </div>
            <div className="form-group">
              <label className="form-label">
                Relation with spouse/ Family/ Kids
              </label>
              <input
                className="form-control"
                type="text"
                name="relation_family"
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                Issues in family (Health, Material, Personal Interest)
              </label>
              <input
                className="form-control"
                type="text"
                name="family_issues"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Circle of Friends</label>
              <input
                className="form-control"
                type="text"
                name="friends_circle"
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                Number of Relationships / Partners
              </label>
              <input
                className="form-control"
                type="text"
                name="relationships"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Fluency in languages</label>
              <input
                className="form-control"
                type="text"
                name="language_fluency"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Interest in other languages</label>
              <input
                className="form-control"
                type="text"
                name="other_language_interest"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Caste (inside religion)</label>
              <input className="form-control" type="text" name="caste" />
            </div>
            <div className="form-group">
              <label className="form-label">
                Faiths (believes in spirituality, god fearing, practical)
              </label>
              <input className="form-control" type="text" name="faiths" />
            </div>
            <div className="form-group">
              <label className="form-label">
                Beliefs (Shri Krishna, Shri Ram, Lord Shiva etc)
              </label>
              <input className="form-control" type="text" name="beliefs" />
            </div>
            <div className="form-group">
              <label className="form-label">No. of Cars, Bikes, EVs</label>
              <input className="form-control" type="text" name="vehicles" />
            </div>
            <div className="form-group">
              <label className="form-label">No. of Houses and Shops</label>
              <input className="form-control" type="text" name="houses_shops" />
            </div>
            <div className="form-group">
              <label className="form-label">Financial Literacy</label>
              <input
                className="form-control"
                type="text"
                name="financial_literacy"
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                Views on Investments, Saving and Spends
              </label>
              <input
                className="form-control"
                type="text"
                name="investment_views"
              />
            </div>
            <div className="form-group">
              <label className="form-label">How many debts/ Loans</label>
              <input className="form-control" type="text" name="debts_loans" />
            </div>
            <div className="form-group">
              <label className="form-label">Comfort with technology</label>
              <input
                className="form-control"
                type="text"
                name="technology_comfort"
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
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                Appliances in use (Fridge, Washing Machine, ACs, Wifi, Google
                Home)
              </label>
              <input className="form-control" type="text" name="appliances" />
            </div>
            <div className="form-group">
              <label className="form-label">
                Technological Interests & wishes
              </label>
              <input
                className="form-control"
                type="text"
                name="tech_interests"
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                How frequently changes devices (mobile/ laptop)
              </label>
              <input
                className="form-control"
                type="text"
                name="device_changes"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Usage of Traditional items</label>
              <input
                className="form-control"
                type="text"
                name="traditional_items_usage"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Types of Brands used</label>
              <input className="form-control" type="text" name="brands_used" />
            </div>
            <div className="form-group">
              <label className="form-label">Volunteer Services</label>
              <input
                className="form-control"
                type="text"
                name="volunteer_services"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Fears</label>
              <input className="form-control" type="text" name="fears" />
            </div>
            <div className="form-group">
              <label className="form-label">Motivations and Drawbacks</label>
              <input
                className="form-control"
                type="text"
                name="motivations_drawbacks"
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                What do they do in their free time?
              </label>
              <input
                className="form-control"
                type="text"
                name="free_time_activities"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Daily/Weekly/Monthly Outings</label>
              <input className="form-control" type="text" name="outings" />
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

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MemberDetails;
