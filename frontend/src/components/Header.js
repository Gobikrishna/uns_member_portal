import { Link } from "react-router-dom";
import logo from "../assets/images/logo.png";

const Header = () => {
  return (
    <header className="text-white navbar-bg">
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              <img width="100" src={logo} alt="Logo" />
            </Link>
            <div className="d-flex gap-2">
              <div className="nav-item">
                <Link className="nav-link home-link" to="/login">
                  Sign In
                </Link>
              </div>
              <div className="nav-item">|</div>
              <div className="nav-item">
                <Link className="nav-link home-link" to="/register">
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
