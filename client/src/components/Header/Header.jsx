import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Header.scss";

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="header">
            <div className="header__logo">
                <svg
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 200 200"
                    width="50"
                    height="50"
                >
                    <circle cx="100" cy="100" r="90" fill="#2AB7A9" />
                    <path
                        d="M100,40 C80,40 60,60 60,80 C60,100 100,160 100,160 C100,160 140,100 140,80 C140,60 120,40 100,40 Z"
                        fill="#FFFFFF"
                        stroke="#0D3B66"
                        strokeWidth="6"
                    />
                    <path
                        d="M100,80 L100,130"
                        stroke="#0D3B66"
                        strokeWidth="5"
                        strokeDasharray="10,10"
                        strokeLinecap="round"
                    />
                    <circle cx="100" cy="80" r="10" fill="#0D3B66" />
                </svg>
                <span>Route Buddy</span>
            </div>
            <div className="dropdown" ref={dropdownRef}>
                <button 
                    className="dropdown__button" 
                    onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen((prev) => !prev);
                    }}
                >
                    Menu ▾
                </button>
                <ul className={`dropdown__menu ${menuOpen ? "dropdown__menu--open" : ""}`}>
                    <li>
                        <Link 
                            to="/" 
                            className="dropdown__link" 
                            onClick={() => setMenuOpen(false)}
                        >
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link 
                            to="/add-place" 
                            className="dropdown__link" 
                            onClick={() => setMenuOpen(false)}
                        >
                            Add a Place
                        </Link>
                    </li>
                </ul>
            </div>
        </header>
    );
}

export default Header;
