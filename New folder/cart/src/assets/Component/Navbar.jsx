import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; 
import { CartContext } from "../pages/context/CartContext";
import "./Navbar.css";

const Navbar = () => {
    const [user, setUser] = useState(null);
    const [showProfile, setShowProfile] = useState(false);
    const navigate = useNavigate();
    const { cart } = useContext(CartContext); 

    useEffect(() => {
        
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        
        const handleClickOutside = (event) => {
            if (!event.target.closest(".profile-container")) {
                setShowProfile(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/"); 
    };

    return (
        <nav className="navbar">
            <h2 className="logo" onClick={() => navigate("/products")}>MyShop</h2>

            <div className="nav-links">
                <button onClick={() => navigate("/products")}>Products</button>
                <button onClick={() => navigate("/cart")}>
                    Cart {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
                </button>

                
                {user && (
                    <div className="profile-container">
                        <FaUserCircle className="profile-icon" onClick={(e) => {
                            e.stopPropagation(); 
                            setShowProfile(!showProfile);
                        }} />

                        {showProfile && (
                            <div className="profile-dropdown">
                                <p><strong>{user.name}</strong></p>
                                <p>{user.email}</p>
                                <p>Wallet: ${user.walletMoney}</p>
                                <button className="logout-btn" onClick={handleLogout}>Logout</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;