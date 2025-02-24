import React, { useEffect, useState } from "react";
import CommutesWidget from "../../components/CommutesWidget/CommutesWidget";
import "./MainPage.scss";

const MainPage = ({ googleApiKey }) => {
  const [serverStatus, setServerStatus] = useState("Checking server...");

  useEffect(() => {
    fetch("http://localhost:8080/")
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Server not responding");
        }
      })
      .then((data) => setServerStatus(`Server is running: ${data.message}`))
      .catch((err) => {
        console.error("Error checking server:", err);
        setServerStatus("Server is down");
      });
  }, []);

  return (
    <div className="main-page">
      <h1>Welcome to the ROAD BUDDY</h1>
      <p className="server-status">{serverStatus}</p>
      <CommutesWidget googleApiKey={googleApiKey} />
    </div>
  );
};

export default MainPage;
