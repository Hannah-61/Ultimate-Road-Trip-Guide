"use client";

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Places.scss";

const Places = ({ onSelectPlace }) => {
  const [places, setPlaces] = useState([]);
  const [selectedItem, setSelectedItem] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      const response = await fetch("http://localhost:8080/places");
      if (!response.ok) throw new Error("Failed to fetch places");

      const data = await response.json();
      setPlaces(data);
      if (data.length > 0) onSelectPlace(data[0]);
    } catch (err) {
      console.error("Error fetching places:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const handlePrevPlace = () => {
    if (places.length === 0) return;
    const newIndex = (selectedItem - 1 + places.length) % places.length;
    setSelectedItem(newIndex);
    onSelectPlace(places[newIndex]);
    setCurrentImageIndex(0); 
  };


  const handleNextPlace = () => {
    if (places.length === 0) return;
    const newIndex = (selectedItem + 1) % places.length;
    setSelectedItem(newIndex);
    onSelectPlace(places[newIndex]);
    setCurrentImageIndex(0); 
  };

  const selectedPlace = places[selectedItem] || {};
  const images = selectedPlace.image_urls || [];

  return (
    <div className="places-container">
      <h1 className="title">Explore Amazing Places</h1>

      {loading ? <p className="loading">Loading places...</p> : error ? <p className="error">{error}</p> : null}

      <div className="image-section">
        {places.length > 0 && (
          <div className="image-container">

            <button className="nav-button left" onClick={handlePrevPlace}>
              ❮
            </button>

            <img
              src={images.length > 0 ? images[currentImageIndex] : "https://via.placeholder.com/300x200"}
              alt={selectedPlace.name}
              className="place-image"
              onClick={() => navigate(`/place/${selectedPlace.id}`)}
              style={{ cursor: "pointer" }}
            />


            <button className="nav-button right" onClick={handleNextPlace}>
              ❯
            </button>
          </div>
        )}

        <h3 className="place-name">{selectedPlace.name}</h3>
        <p className="place-address">{selectedPlace.address}</p>
      </div>


      <div className="dot-navigation">
        {places.map((_, index) => (
          <button
            key={index}
            className={`dot ${selectedItem === index ? "active" : ""}`}
            onClick={() => {
              setSelectedItem(index);
              onSelectPlace(places[index]);
              setCurrentImageIndex(0);
            }}
          ></button>
        ))}
      </div>

   
      <div className="details-btn-section">
        <motion.button 
          className="details-button" 
          whileHover={{ scale: 1.1 }} 
          onClick={() => navigate(`/place/${selectedPlace.id}`)}
        >
          View Place Details
        </motion.button>
      </div>

      <div className="add-place-section">
        <Link to="/add-place">
          <motion.button className="add-button" whileHover={{ scale: 1.1 }}>
            Add New Place
          </motion.button>
        </Link>
      </div>
    </div>
  );
};

export default Places;
