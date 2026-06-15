import React, { useState } from "react";
import logo from "../assets/cyberlogo.webp";
import { IoIosSearch } from "react-icons/io";
import { FaRegHeart, FaRegUser } from "react-icons/fa";
import { SlBasket } from "react-icons/sl";
import { FiMenu, FiX } from "react-icons/fi"; 
import { Link } from "react-router-dom";

const Navbar = ({ cartCount, searchInput, setSearchInput }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="nav-wrapper">
      <div className="mobile-menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FiX /> : <FiMenu />}
      </div>

      <Link to="/" onClick={() => setMenuOpen(false)}>
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
          <li><Link to="/">Home</Link></li>
          <li>About</li>
          <li>Contact Us</li>
          <li>Blog</li>
        </ul>
      </nav>

      <div className="bask">
        <span><FaRegHeart /></span>

        <Link to="/cart">
          <SlBasket size={22} />
          {cartCount > 0 && <span className="card-count">{cartCount}</span>}
        </Link>

        <Link to="/profile">
          <FaRegUser />
        </Link>
      </div>

      <div className={`mobile-nav-menu ${menuOpen ? "active" : ""}`}>
        <div className="nav-inp-mobile">
          <IoIosSearch className="sr-icon" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="sr-inp" 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <ul>
          <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
          <li onClick={() => setMenuOpen(false)}>About</li>
          <li onClick={() => setMenuOpen(false)}>Contact Us</li>
          <li onClick={() => setMenuOpen(false)}>Blog</li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;