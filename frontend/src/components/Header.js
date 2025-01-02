import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
  const { authState, setAuthState } = useContext(AuthContext); // Access context here
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // For controlling dropdown visibility
  const navigate = useNavigate(); // Hook to redirect after logout

  // Toggle the dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Logout the user and reset the auth state
  const onLogout = () => {
    // Clear the authState in context
    setAuthState({ isAuthenticated: false, token: null, user: null });

    // Clear the user token and details from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Log the user out
    console.log("Logout clicked");

    // Redirect the user to the login page after logout
    navigate("/login");
  };

  // to get the initials of first name and last name
  const getInitials = (firstName, lastName) => {
    const firstInitial = firstName?.charAt(0).toUpperCase() || "";
    const lastInitial = lastName?.charAt(0).toUpperCase() || "";
    return firstInitial + lastInitial;
  };

  return (
    <header className="bg-light bg-gradient">
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              <img width="100" src={logo} alt="Logo" />
            </Link>
            <div>
              {!authState.isAuthenticated ? (
                // If not authenticated, show login and register links
                <div className="hd-links d-flex gap-2">
                  <div className="nav-item">
                    <Link className="nav-link home-link" to="/login">
                      Sign In
                    </Link>
                  </div>
                  <div className="nav-item">|</div>
                  <div className="nav-item">
                    <Link className="nav-link home-link" to="/register">
                      Register
                    </Link>
                  </div>
                </div>
              ) : (
                // If authenticated, show user dropdown
                <div className={`dropdown ${isDropdownOpen ? "show" : ""}`}>
                  <button
                    className="btn btn-secondary dropdown-toggle"
                    type="button"
                    id="dropdownMenuButton"
                    aria-expanded={isDropdownOpen}
                    onClick={toggleDropdown}
                  >
                    {/* Dynamically displaying the initials */}
                    {getInitials(
                      authState.user.firstName,
                      authState.user.lastName
                    )}
                  </button>
                  <span className="ps-2">
                    {authState.user?.firstName + " " + authState.user?.lastName}
                  </span>

                  <ul
                    className={`dropdown-menu dropdown-menu-end ${
                      isDropdownOpen ? "show" : ""
                    }`}
                    aria-labelledby="dropdownMenuButton"
                  >
                    <li>
                      <Link className="dropdown-item" to="/settings">
                        <i className="fa fa-cog me-2"></i>Settings
                      </Link>
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={onLogout}>
                        <i className="fa fa-sign-out me-2"></i>Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
