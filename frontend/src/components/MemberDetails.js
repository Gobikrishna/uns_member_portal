import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
// import FileUpload from "./FileUpload";
import Header from "./Header";
import Footer from "./Footer";

const MemberDetails = () => {

  return (
    <div>
      {/* Navigation Bar */}
      <Header />

      {/* Hero Section */}
      <div className="container mt-4">
      <h3 className="text-center mb-4">Detailed Form</h3>
      <form>
        {/* First Section */}
        <div className="row mb-3">
          <div className="col-md-4 mb-3">
            <label>Mental Age</label>
            <input type="text" className="form-control" placeholder="Practical, Home attached, Independent" />
          </div>
          <div className="col-md-4 mb-3">
            <label>Type of Household</label>
            <input type="text" className="form-control" placeholder="Organized, Messy" />
          </div>
          <div className="col-md-4 mb-3">
            <label>Family Values</label>
            <input type="text" className="form-control" placeholder="Open, Conservative, Orthodox" />
          </div>
        </div>

        {/* Second Section */}
        <div className="row mb-3">
          <div className="col-md-4 mb-3">
            <label>Traditions of Family</label>
            <input type="text" className="form-control" placeholder="Community services, Gatherings, House parties" />
          </div>
          <div className="col-md-4 mb-3">
            <label>Family Member Name & Age</label>
            <textarea className="form-control" placeholder="aaa&#10;bbb&#10;ccc"></textarea>
          </div>
          <div className="col-md-4 mb-3">
            <label>Legacy of the Family</label>
            <input type="text" className="form-control" placeholder="Business, Govt. Jobs, Settled Abroad" />
          </div>
        </div>

        {/* Third Section */}
        <div className="row mb-3">
          <div className="col-md-4 mb-3">
            <label>Emotional Range</label>
            <input type="text" className="form-control" placeholder="aaaa" />
          </div>
          <div className="col-md-4 mb-3">
            <label>Thoughts about people</label>
            <input type="text" className="form-control" placeholder="aaaa" />
          </div>
          <div className="col-md-4 mb-3">
            <label>Conversation Style</label>
            <input type="text" className="form-control" placeholder="aaaa" />
          </div>
        </div>

        {/* Fourth Section */}
        <div className="row mb-3">
          <div className="col-md-4 mb-3">
            <label>Working Style</label>
            <input type="text" className="form-control" placeholder="aaaa" />
          </div>
          <div className="col-md-4 mb-3">
            <label>Spending Style</label>
            <input type="text" className="form-control" placeholder="aaaa" />
          </div>
          <div className="col-md-4 mb-3">
            <label>Thoughts on Lifestyle</label>
            <input type="text" className="form-control" placeholder="aaaa" />
          </div>
        </div>

        {/* Fifth Section */}
        <div className="row mb-3">
          <div className="col-md-4 mb-3">
            <label>Past Vacations and Family Holidays</label>
            <input type="text" className="form-control" placeholder="aaaa" />
          </div>
          <div className="col-md-4 mb-3">
            <label>Physical Looks</label>
            <input type="text" className="form-control" placeholder="Skin, Hair" />
          </div>
          <div className="col-md-4 mb-3">
            <label>Disfigurements</label>
            <input type="text" className="form-control" placeholder="aaaa" />
          </div>
        </div>

        {/* Add More Sections */}
        <div className="row mb-3">
          <div className="col-md-4 mb-3">
            <label>Internal Organs Health</label>
            <input type="text" className="form-control" placeholder="Liver, Stomach, Digestion, etc." />
          </div>
          <div className="col-md-4 mb-3">
            <label>Personality</label>
            <input type="text" className="form-control" placeholder="aaaa" />
          </div>
          <div className="col-md-4 mb-3">
            <label>Dressing</label>
            <input type="text" className="form-control" placeholder="aaaa" />
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
