import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Places from "../Places/Places";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const loadGoogleMapsScript = (callback) => {
  if (window.google && window.google.maps) {
    callback();
    return;
  }

  if (document.querySelector("script[src*='maps.googleapis.com']")) {
    return;
  }

  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,directions`;
  script.async = true;
  script.defer = true;
  script.onload = callback;
  document.body.appendChild(script);
};

const CommutesWidget = () => {
  const [map, setMap] = useState(null);
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [autocompleteStart, setAutocompleteStart] = useState(null);
  const [autocompleteEnd, setAutocompleteEnd] = useState(null);

  useEffect(() => {
    if (GOOGLE_MAPS_API_KEY) {
      loadGoogleMapsScript(() => {
        initGoogleMaps();
        initAutocomplete();
      });
    }
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      const response = await fetch("http://localhost:8080/places");
      const data = await response.json();
      setPlaces(data);
      if (data.length > 0) setSelectedPlace(data[0]);
    } catch (error) {
      console.error("Error fetching places:", error);
    }
  };

  const initGoogleMaps = () => {
    if (!window.google || !window.google.maps) return;

    const mapElement = document.getElementById("map-view");
    if (!mapElement) return;

    const googleMap = new window.google.maps.Map(mapElement, {
      center: { lat: 43.65107, lng: -79.347015 },
      zoom: 12,
    });

    setMap(googleMap);
    setDirectionsService(new window.google.maps.DirectionsService());
    setDirectionsRenderer(new window.google.maps.DirectionsRenderer({ map: googleMap }));
  };

  const initAutocomplete = () => {
    if (!window.google || !window.google.maps || !window.google.maps.places) return;

    const startInput = document.getElementById("start-location-input");
    const endInput = document.getElementById("end-location-input");

    if (startInput) {
      const autocompleteStartInstance = new window.google.maps.places.Autocomplete(startInput);
      autocompleteStartInstance.addListener("place_changed", () => {
        const place = autocompleteStartInstance.getPlace();
        if (place && place.formatted_address) {
          setStartLocation(place.formatted_address);
        }
      });
      setAutocompleteStart(autocompleteStartInstance);
    }

    if (endInput) {
      const autocompleteEndInstance = new window.google.maps.places.Autocomplete(endInput);
      autocompleteEndInstance.addListener("place_changed", () => {
        const place = autocompleteEndInstance.getPlace();
        if (place && place.formatted_address) {
          setEndLocation(place.formatted_address);
        }
      });
      setAutocompleteEnd(autocompleteEndInstance);
    }
  };

  useEffect(() => {
    if (map && places.length > 0) {
      markers.forEach((marker) => marker.setMap(null));

      const newMarkers = places.map((place) => {
        const marker = new window.google.maps.Marker({
          position: { lat: parseFloat(place.lat), lng: parseFloat(place.lng) },
          map,
          title: place.name,
          icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          },
        });

        marker.addListener("click", () => {
          setSelectedPlace(place);
          map.setCenter({ lat: parseFloat(place.lat), lng: parseFloat(place.lng) });
          map.setZoom(14);
        });

        return marker;
      });

      setMarkers(newMarkers);
    }
  }, [map, places]);

  const handleGetDirections = () => {
    if (!startLocation || !endLocation) {
      alert("Please enter both start and destination addresses.");
      return;
    }

    if (!directionsService || !directionsRenderer) {
      alert("Google Maps is still loading. Please wait.");
      return;
    }

    const request = {
      origin: startLocation,
      destination: endLocation,
      travelMode: window.google.maps.TravelMode.DRIVING,
    };

    directionsService.route(request, (result, status) => {
      if (status === "OK") {
        directionsRenderer.setDirections(result);
      } else {
        alert("Could not find a route. Please check the addresses.");
        console.error("Directions error:", status);
      }
    });
  };

  return (
    <div className="commutes-container">
      <h2>Recommended Places</h2>
      <div id="map-view" style={{ width: "100%", height: "400px", border: "1px solid #ccc" }}></div>

      <h3>Plan Your Trip</h3>
      <input
        id="start-location-input"
        type="text"
        placeholder="Enter Start Location"
        value={startLocation}
        onChange={(e) => setStartLocation(e.target.value)}
      />
      <input
        id="end-location-input"
        type="text"
        placeholder="Enter Destination"
        value={endLocation}
        onChange={(e) => setEndLocation(e.target.value)}
      />
      <button onClick={handleGetDirections}>Get Directions</button>

      <Places onSelectPlace={setSelectedPlace} />

      <Link to="/add-place">
        <button>Add New Place</button>
      </Link>
    </div>
  );
};

export default CommutesWidget;
