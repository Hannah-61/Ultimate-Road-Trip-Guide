import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.scss";
import MainPage from "./pages/MainPage/MainPage"; 
import AddPlaces from "./pages/AddPlaces/AddPlaces"; 
import PlaceDetails from "./pages/PlaceDetails/PlaceDetails"; 
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

function App({ googleApiKey }) {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch("http://localhost:8080/")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => {
        console.error("Error fetching data:", err);
        setMessage("Failed to connect to the server.");
      });
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<MainPage googleApiKey={googleApiKey} />} />
            <Route path="/add-place" element={<AddPlaces />} />
            <Route path="/place/:id" element={<PlaceDetails />} />
            <Route path="*" element={<h1>404 - Page Not Found</h1>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
