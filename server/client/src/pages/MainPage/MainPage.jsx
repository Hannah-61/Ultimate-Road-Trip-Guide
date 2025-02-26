import React, { useEffect } from "react";
import CommutesWidget from "../../components/CommutesWidget/CommutesWidget";
import "./MainPage.scss";

const MainPage = ({ googleApiKey }) => {
  useEffect(() => {
    fetch("http://localhost:8080/")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Server not responding");
        }
        return res.json();
      })
      .catch((err) => console.error("Error checking server:", err));
  }, []);

  return (
    <div className="main-page">
      <h1>Welcome to the ROAD BUDDY</h1>
      <CommutesWidget googleApiKey={googleApiKey} />
    </div>
  );
};

export default MainPage;
