"use client";

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./Places.scss";

const Places = ({ onSelectPlace }) => {
  const [places, setPlaces] = useState([]);
  const [selectedItem, setSelectedItem] = useState(0);
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleDeletePlace = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this place?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:8080/places/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete place");

      const updatedPlaces = places.filter((place) => place.id !== id);
      setPlaces(updatedPlaces); 

      
      if (updatedPlaces.length > 0) {
        setSelectedItem(0);
        onSelectPlace(updatedPlaces[0]);
      } else {
        setSelectedItem(null);
        onSelectPlace(null);
      }
    } catch (err) {
      console.error("Error deleting place:", err);
      alert("Error deleting place. Please try again.");
    }
  };

  const setSlide = (newDirection) => {
    if (places.length === 0) return;

    let nextIndex = (selectedItem + newDirection + places.length) % places.length;
    setSelectedItem(nextIndex);
    setDirection(newDirection);
    onSelectPlace(places[nextIndex]);
  };

  const selectedPlace = places[selectedItem] || {};

  return (
    <div className="places-container">
      <section className="intro">
        <h1>Welcome to the Interesting Place Explorer</h1>
        <p>Click the arrows to explore</p>
      </section>

      {/* Show Loading or Error Messages */}
      {loading ? <p>Loading places...</p> : error ? <p className="error">{error}</p> : null}

      <div className="slider-container">
        <motion.button
          initial={false}
          animate={{ backgroundColor: "#0cdcf7" }}
          aria-label="Previous"
          className="slider-button"
          onClick={() => setSlide(-1)}
          whileFocus={{ outline: "2px solid #0cdcf7" }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft />
        </motion.button>

        <AnimatePresence custom={direction} initial={false} mode="popLayout">
          {places.length > 0 && (
            <motion.div
              key={selectedPlace.id}
              initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
              animate={{
                opacity: 1,
                x: 0,
                transition: { type: "spring", stiffness: 300, damping: 30 },
              }}
              exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
              className="place-slide"
              onClick={() => onSelectPlace(selectedPlace)}
            >
              <img
                src={
                  selectedPlace.image_url?.startsWith("/images")
                    ? `http://localhost:8080${selectedPlace.image_url}`
                    : selectedPlace.image_url || "https://via.placeholder.com/300x200"
                }
                alt={selectedPlace.name}
                className="place-image"
                onError={(e) => (e.target.src = "https://via.placeholder.com/300x200")}
              />
              <h3>{selectedPlace.name}</h3>
              <p>{selectedPlace.address}</p>
              <div className="place-actions">
                <Link to={`/place/${selectedPlace.id}`}>
                  <motion.button whileHover={{ scale: 1.1 }}>View Details</motion.button>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  className="delete-button"
                  onClick={() => handleDeletePlace(selectedPlace.id)}
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          initial={false}
          animate={{ backgroundColor: "#0cdcf7" }}
          aria-label="Next"
          className="slider-button"
          onClick={() => setSlide(1)}
          whileFocus={{ outline: "2px solid #0cdcf7" }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowRight />
        </motion.button>
      </div>
    </div>
  );
};

export default Places;


function ArrowLeft() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
