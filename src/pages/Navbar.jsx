import React from "react";
import "../../src/index.css";
import logo from "../assets/cyberlogo.png";
import { IoIosSearch } from "react-icons/io";
import { FaRegHeart } from "react-icons/fa";
import { SlBasket } from "react-icons/sl";
import { FaRegUser } from "react-icons/fa";
import { Link } from "react-router-dom";

const Navbar = ({ cartCount, searchInput, setSearchInput }) => {
  return (
    <div className="nav-wrapper">
      <Link to="/">
        <img src={logo} alt="logo" />
      </Link>

      <div className="nav-inp">
        <IoIosSearch className="sr-icon" />
        <input 
          type="text" 
          placeholder="Search" 
          className="sr-inp" 
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      <nav className="navbar-nav">
        <ul className="nav-ul">
          <li><Link to="/" style={{ color: "black" }}>Home</Link></li>
          <li>About</li>
          <li>Contact Us</li>
          <li>Blog</li>
        </ul>
      </nav>

      <div className="bask">
        <p><FaRegHeart /></p>

        {/* Savat tugmasi bosilganda to'g'ri /cart sahifasiga o'tadi */}
        <Link to="/cart" style={{ color: "black", position: "relative", cursor: "pointer", display: "flex", alignItems: "center" }}>
          <SlBasket size={22} />
          {cartCount > 0 && (
            <span 
              className="card-count" 
              style={{
                position: "absolute",
                top: "-10px",
                right: "-10px",
                backgroundColor: "black",
                color: "white",
                borderRadius: "50%",
                padding: "2px 6px",
                fontSize: "12px"
              }}
            >
              {cartCount}
            </span>
          )}
        </Link>

        <p style={{ cursor: "pointer" }}>
          <Link to="/profile" style={{ color: "black" }}>
            <FaRegUser />
          </Link>
        </p>
      </div>
      <hr />
    </div>
  );
};

export default Navbar;