import { Link } from "react-router-dom";
import logo from "../assets/images/logo.png";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
  const { authState, setAuthState } = useContext(AuthContext); // Access context here
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const onLogout = () => {
    setAuthState({ isAuthenticated: false, user: null }); // Clear auth state
    console.log("Logout clicked");
  };

  return (
    <header className="text-white navbar-bg">
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              <img width="100" src={logo} alt="Logo" />
            </Link>
            <div>
              {!authState.isAuthenticated ? (
                // Show Login and Register Links
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
                // Show Dropdown for Logged-In Users
                <div className={`dropdown ${isDropdownOpen ? "show" : ""}`}>
                  <button
                    className="btn btn-secondary dropdown-toggle"
                    type="button"
                    id="dropdownMenuButton"
                    aria-expanded={isDropdownOpen}
                    onClick={toggleDropdown}
                  >
                    {authState.user?.initials || "KR"}
                  </button>
                  <span className="ps-2">{authState.user?.name || "User Name"}</span>

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
                      <button
                        className="dropdown-item"
                        onClick={onLogout}
                      >
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
