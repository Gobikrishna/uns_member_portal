import { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import formDataConfig from "./config/formDataConfig";
import Header from "./Header";
import Footer from "./Footer";

const ReferralDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);
  const [formData, setFormData] = useState(formDataConfig); // Initialize with imported config

  useEffect(() => {
    const referralId = location?.state ?? null; // Access the passed member data
    console.log("Location state (referralId):", referralId);

    let isMounted = true; // Track whether the component is mounted

    if (authState.isAuthenticated && referralId) {
      const token = authState.token;

      // Fetch user details
      axios
        .get(`http://localhost:5001/api/auth/user-details/${referralId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (isMounted) {
            setFormData(res.data.user_details);
          }
        })
        .catch((error) => {
          console.error("Error fetching user details:", error);
          if (isMounted) {
            navigate("/admin-dashboard", {
              state: { error: "Failed to fetch details" },
            });
          }
        });
    } else {
      navigate("/admin-dashboard", {
        state: { error: "Invalid referral ID or authentication" },
      });
    }

    return () => {
      isMounted = false; // Cleanup to prevent state updates on unmounted component
    };
  }, [authState.isAuthenticated, location.state, navigate]);

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1); // Go back to the previous route
    } else {
      navigate("/defaultRoute"); // Redirect to a default route
    }
  };
  return (
    <div className="bg-light member-details">
      {/* Navigation Bar */}
      <Header readOnly />
      {/* Hero Section */}

      <div className="container mt-4 bg-white md-box p-4">
        <div className="">
          <div className=" my-2 cursor back-lnk" onClick={goBack}>
            &larr; Back to dashborad
          </div>
        </div>

        <div>
          {/* Tab Links */}

          <div className="tab-content">
            <div>
              <div className="d-flex justify-content-between mb-4 pb-2 border-bottom">
                <h4>Referral Details</h4>
              </div>
              <form>
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
                      defaultValue={formData?.mental_age ?? ""}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      Family Values (Open, Conservative, Orthodox)
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      name="family_defaultValues"
                      defaultValue={formData?.family_defaultValues ?? ""}
                      readOnly
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
                      defaultValue={formData?.traditions_of_family ?? ""}
                      readOnly
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
                      defaultValue={formData?.family_member_details ?? ""}
                      readOnly
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
                      defaultValue={formData?.legacy_of_family ?? ""}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Emotional Range</label>
                    <input
                      className="form-control"
                      type="text"
                      name="emotional_range"
                      defaultValue={formData?.emotional_range ?? ""}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Thoughts about people</label>
                    <input
                      className="form-control"
                      type="text"
                      name="thoughts_about"
                      defaultValue={formData?.thoughts_about ?? ""}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Conversation style</label>
                    <input
                      className="form-control"
                      type="text"
                      name="conversation_style"
                      defaultValue={formData?.conversation_style ?? ""}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Working style</label>
                    <input
                      className="form-control"
                      type="text"
                      name="working_style"
                      defaultValue={formData?.working_style ?? ""}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Spending Style</label>
                    <input
                      className="form-control"
                      type="text"
                      name="spending_style"
                      defaultValue={formData?.spending_style ?? ""}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Thoughts on Lifestyle</label>
                    <input
                      className="form-control"
                      type="text"
                      name="thoughts_on_lifestyle"
                      defaultValue={formData?.thoughts_on_lifestyle ?? ""}
                      readOnly
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
                      defaultValue={formData?.past_vacations ?? ""}
                      readOnly
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
                      defaultValue={formData?.physical_looks ?? ""}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Disfigurements</label>
                    <input
                      className="form-control"
                      type="text"
                      name="disfigurements"
                      defaultValue={formData?.disfigurements ?? ""}
                      readOnly
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
                      defaultValue={formData?.internal_organs_health ?? ""}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Personality</label>
                    <input
                      className="form-control"
                      type="text"
                      name="personality"
                      defaultValue={formData?.personality ?? ""}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Dressing</label>
                    <input
                      className="form-control"
                      type="text"
                      name="dressing"
                      defaultValue={formData?.dressing ?? ""}
                      readOnly
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
                      defaultValue={formData?.behaviour_in_sg ?? ""}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Area of living</label>
                    <input
                      className="form-control"
                      type="text"
                      name="area_of_livig"
                      defaultValue={formData?.area_of_livig ?? ""}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">How many transfers</label>
                    <input
                      className="form-control"
                      type="text"
                      name="how_many_transfer"
                      defaultValue={formData?.how_many_transfer ?? ""}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Idea of Settlement</label>
                    <input
                      className="form-control"
                      type="text"
                      name="idea_of_settle"
                      defaultValue={formData?.idea_of_settle ?? ""}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Areas of Interest</label>
                    <input
                      className="form-control"
                      type="text"
                      name="areas_of_interest"
                      defaultValue={formData?.areas_of_interest ?? ""}
                      readOnly
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
                      defaultValue={formData?.possession ?? ""}
                      readOnly
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
                      defaultValue={formData?.future_travel ?? ""}
                      readOnly
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
                      defaultValue={formData?.marks ?? ""}
                      readOnly
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
                      defaultValue={formData?.courses_apart ?? ""}
                      readOnly
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
                      defaultValue={formData?.areas_of_success ?? ""}
                      readOnly
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
                      defaultValue={formData?.activities_involved ?? ""}
                      readOnly
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
                      defaultValue={formData?.leadership_position ?? ""}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Typing Speed</label>
                    <input
                      className="form-control"
                      type="text"
                      name="typing_speed"
                      defaultValue={formData?.typing_speed ?? ""}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Interesting Subjects</label>
                    <input
                      className="form-control"
                      type="text"
                      name="interesting_subjects"
                      defaultValue={formData?.interesting_subjects ?? ""}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Current occupation</label>
                    <input
                      className="form-control"
                      type="text"
                      name="current_occupation"
                      defaultValue={formData?.current_occupation ?? ""}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Interest in occupation</label>
                    <input
                      className="form-control"
                      type="text"
                      name="interest_in_occupation"
                      defaultValue={formData?.interest_in_occupation ?? ""}
                      readOnly
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
                      defaultValue={formData?.work_designation ?? ""}
                      readOnly
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
                      defaultValue={formData?.interact_with_coworkers ?? ""}
                      readOnly
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
                      defaultValue={formData?.nature_of_job ?? ""}
                      readOnly
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
                      defaultValue={formData?.relation_with ?? ""}
                      readOnly
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
                      defaultValue={formData?.issues_in_family ?? ""}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Circle of Friends</label>
                    <input
                      className="form-control"
                      type="text"
                      name="circle_of_frnds"
                      defaultValue={formData?.circle_of_frnds ?? ""}
                      readOnly
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
                      defaultValue={formData?.number_of_partners ?? ""}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Fluency in languages</label>
                    <input
                      className="form-control"
                      type="text"
                      name="fluency_in_lang"
                      defaultValue={formData?.fluency_in_lang ?? ""}
                      readOnly
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
                      defaultValue={formData?.interest_in_other_lang ?? ""}
                      readOnly
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
                      defaultValue={formData?.caste ?? ""}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      Faiths (believes in spirituality, god fearing, practical)
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      name="faiths"
                      defaultValue={formData?.faiths ?? ""}
                      readOnly
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
                      defaultValue={formData?.beliefs ?? ""}
                      readOnly
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
                      defaultValue={formData?.no_of_cars ?? ""}
                      readOnly
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
                      defaultValue={formData?.no_of_house ?? ""}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Financial Literacy</label>
                    <input
                      className="form-control"
                      type="text"
                      name="financial_literacy"
                      defaultValue={formData?.financial_literacy ?? ""}
                      readOnly
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
                      defaultValue={formData?.views_on_invest ?? ""}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">How many debts/ Loans</label>
                    <input
                      className="form-control"
                      type="text"
                      name="How_many_debts"
                      defaultValue={formData?.How_many_debts ?? ""}
                      readOnly
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
                      defaultValue={formData?.comfort_with_tech ?? ""}
                      readOnly
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
                      defaultValue={formData?.electronic_devices ?? ""}
                      readOnly
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
                      defaultValue={formData?.appliances_in_use ?? ""}
                      readOnly
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
                      defaultValue={formData?.technological_interests ?? ""}
                      readOnly
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
                      defaultValue={formData?.how_often_chge_devices ?? ""}
                      readOnly
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
                      defaultValue={formData?.traditional_items ?? ""}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Types of Brands used</label>
                    <input
                      className="form-control"
                      type="text"
                      name="types_of_brands"
                      defaultValue={formData?.types_of_brands ?? ""}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Volunteer Services</label>
                    <input
                      className="form-control"
                      type="text"
                      name="volunteer_services"
                      defaultValue={formData?.volunteer_services ?? ""}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Fears</label>
                    <input
                      className="form-control"
                      type="text"
                      name="fears"
                      defaultValue={formData?.fears ?? ""}
                      readOnly
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
                      defaultValue={formData?.motivations_drawbacks ?? ""}
                      readOnly
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
                      defaultValue={formData?.free_time ?? ""}
                      readOnly
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
                      defaultValue={formData?.outings ?? ""}
                      readOnly
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer readOnly />
    </div>
  );
};

export default ReferralDetails;
