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

  const onSettings = (event) => {
    event.preventDefault();
    console.log("Settings clicked");
  };

  const onLogout = () => {
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
            <div className="d-flex gap-2">
              {!authState.isAuthenticated ? (
                <div className="hd-links">
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
                <div className="dropdown">
                  {/* Dropdown Button */}
                  <button
                    className="btn btn-secondary dropdown-toggle"
                    type="button"
                    id="dropdownMenuButton"
                    aria-expanded={isDropdownOpen}
                    onClick={toggleDropdown}
                  >
                    KR
                  </button>
                  <span className="ps-2">Kalyana Raman</span>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <ul
                      className="dropdown-menu dropdown-menu-end"
                      aria-labelledby="dropdownMenuButton"
                    >
                      <li>
                        <a
                          className="dropdown-item"
                          href="#"
                          onClick={onSettings}
                        >
                          <i className="fa fa-cog me-2"></i>Settings
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item"
                          href="#"
                          onClick={onLogout}
                        >
                          <i className="fa fa-sign-out me-2"></i>Logout
                        </a>
                      </li>
                    </ul>
                  )}
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
