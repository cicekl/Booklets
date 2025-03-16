import React from "react";
import { TbBooks } from "react-icons/tb";
import '../styles/Navbar.css';
import { NavLink, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";


function Navbar({onSearch}) {

    const navigate = useNavigate();
    const handleLogout = () => {
        navigate("/");
    }

    return (
        <div>
            <nav className="navBar">
                <div className="upBox">
                    <div className="logoTitle"><TbBooks className="booksIcon" /> Booklets</div>
                    <SearchBar onSearch={onSearch} />
                    <p onClick={handleLogout} className="logOut">Log out</p>
                </div>

                <div className="downBox">
                        <div className="links"><NavLink className="navLinks" to="/dashboard"><p className="linkText">Main</p></NavLink></div>
                        <div className="links"><NavLink className="navLinks" to="/library"><p className="linkText">My library</p></NavLink></div>
                        <div className="links"><NavLink className="navLinks" to="/favourites"><p className="linkText">Favourites</p></NavLink></div>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;