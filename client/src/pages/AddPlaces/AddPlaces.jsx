import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AddPlaces = () => {
  const navigate = useNavigate();
  const [newPlace, setNewPlace] = useState({
    name: "",
    address: "",
    description: "",
    submitted_by: "",
    lat: "",
    lng: "",
  });
  const [images, setImages] = useState([]);

  useEffect(() => {
    loadGoogleMapsScript(() => initAutocomplete("new-place-address"));
  }, []);

  const loadGoogleMapsScript = (callback) => {
    if (window.google) {
      callback();
      return;
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = callback;
    document.body.appendChild(script);
  };

  const initAutocomplete = (inputId) => {
    const input = document.getElementById(inputId);
    if (!input) return;

    const autocomplete = new window.google.maps.places.Autocomplete(input, { types: ["geocode"] });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        setNewPlace((prevState) => ({
          ...prevState,
          address: place.formatted_address,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          place_id: place.place_id || `custom_${Date.now()}`,
        }));
      }
    });
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]); 
  };

  const handleAddPlace = async () => {
    if (!newPlace.lat || !newPlace.lng) {
      alert("Please select an address from Google Maps.");
      return;
    }

    const formData = new FormData();
    formData.append("name", newPlace.name);
    formData.append("address", newPlace.address);
    formData.append("description", newPlace.description);
    formData.append("submitted_by", newPlace.submitted_by);
    formData.append("lat", newPlace.lat);
    formData.append("lng", newPlace.lng);
    
    images.forEach((image) => {
      formData.append("images", image);
    });

    const res = await fetch("http://localhost:8080/places", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      navigate("/");
    } else {
      alert("Error adding place. Please try again.");
    }
  };

  return (
    <div className="add-place-container">
      <h2>Add a New Place</h2>
      <input type="text" placeholder="Name" value={newPlace.name} onChange={(e) => setNewPlace({ ...newPlace, name: e.target.value })} />
      <input id="new-place-address" type="text" placeholder="Enter Address" value={newPlace.address} onChange={(e) => setNewPlace({ ...newPlace, address: e.target.value })} />
      <input type="text" placeholder="Description" value={newPlace.description} onChange={(e) => setNewPlace({ ...newPlace, description: e.target.value })} />
      <input type="text" placeholder="Your Name" value={newPlace.submitted_by} onChange={(e) => setNewPlace({ ...newPlace, submitted_by: e.target.value })} />
      
      {/* Multiple Image Upload */}
      <input type="file" accept="image/*" multiple onChange={handleImageChange} />
      
      <button onClick={handleAddPlace}>Submit Place</button>
      <button onClick={() => navigate("/")}>Back to Main Page</button>
    </div>
  );
};

export default AddPlaces;
