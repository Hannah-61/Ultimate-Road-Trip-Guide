# Ultimate Road Trip Guide

## Overview

The **Ultimate Road Trip Guide** is a **full-stack web application** designed to help users discover unique and hidden spots around the province. It will feature **pre-determined road trips from Toronto** that highlight these locations. Additionally, users will be able to engage with the community by **leaving comments, liking spots, and uploading their own unique locations for others to review.**

Users will also be able to **interactively view the address of these locations on Google Maps**, ensuring they can easily navigate to their chosen destinations.

---

## Problem Space

Many travelers seek **off-the-beaten-path destinations** but struggle to find curated recommendations. Existing road trip planning tools focus on navigation and generic locations but lack community-driven insights and local hidden gems. The **Ultimate Road Trip Guide** solves this by creating a **user-powered travel guide**, allowing travelers to **discover, share, and engage with unique road trip experiences** in an interactive and meaningful way.

---

## User Profile

### Target Users:
- **Road Trip Enthusiasts** – People who love exploring new places.
- **Adventure Travelers** – Those looking for unique and lesser-known destinations.
- **Local Explorers** – Residents who want to discover hidden gems in their area.
- **Community-Driven Users** – Users who want to contribute by adding locations, reviews, and feedback.

### Usage:
- Users can **browse** curated road trips and locations.
- Users can **add, like, and comment** on unique road trip spots.
- Users can **interactively explore locations via Google Maps**.
- Users can **upload and review unique locations** submitted by the community.

---

## Features

### Core Features:
✅ **Discover Unique Spots** – Showcasing hidden and must-visit locations around the province.  
✅ **Pre-Determined Road Trips** – Providing curated routes from Toronto to visit these locations.  
✅ **User Comments & Reviews** – Allowing users to leave feedback on each location.  
✅ **Like & Favorite Spots** – Users can like and save favorite locations.  
✅ **User-Generated Locations** – Enabling users to upload their own unique road trip spots for others to explore.  
✅ **Interactive Map** – Displaying **routes, hidden spots, and user-added locations** on a map with Google Maps integration.  

### Additional Features (Stretch Goals):
🚀 **User Authentication** – Allows users to **create accounts and manage saved locations.**  
🚀 **Photo Uploads** – Users can add images to their uploaded locations.  
🚀 **Advanced Filtering & Search** – Searching by categories like nature, historical sites, or adventure spots.  

---

## Implementation

### Tech Stack
| **Technology**       | **Purpose**                                      |
| -------------------- | ------------------------------------------------ |
| **React.js**         | Frontend framework for UI                        |
| **Express.js**       | Backend framework for API                        |
| **Google Maps API**  | Distance calculation & interactive map visualization |
| **Google Places API**| Location data for unique spots                   |
| **Axios**            | API requests to backend                          |
| **Node.js**          | Server-side runtime                              |

### APIs
- **Google Maps API** – For interactive location viewing and routing.
- **Google Places API** – To retrieve details about locations.

### Sitemap
1. **Home Page** – Displays featured locations and pre-determined trips.
2. **Location Details Page** – Shows spot details, comments, and Google Maps view.
3. **User Upload Page** – Allows users to submit new locations.
4. **User Authentication (if implemented)** – Login/Register to manage saved locations.

### Mockups

#### 🛣️ Home Page Mockup
📌 **Welcome Message & Quick Search for Unique Spots**  
📌 **Highlighted Pre-Determined Road Trips from Toronto**  
📌 **Community Featured Spots (Most Liked & Reviewed)**  

![Home Page Mockup](UPLOAD_HERE)

#### 🌍 Unique Spot Details Page
📌 **Spot Information (Name, Description, Images, Map Location with Google Maps link)**  
📌 **User Comments & Reviews**  
📌 **Like & Save Option**  

![Spot Details Mockup](UPLOAD_HERE)

#### 📍 User Submission Page
📌 **Upload New Unique Spot (Location, Description, Images, Google Maps Integration)**  
📌 **Pending Review System (Admin Approval)**  

![Upload Page Mockup](UPLOAD_HERE)

### Data
#### Data Entities & Relationships:
- **Users**: Can upload locations, leave reviews, and like spots.
- **Locations**: Contain details such as name, description, coordinates, and images.
- **Reviews**: Users can leave comments and ratings for each location.

### Endpoints
| **Endpoint**               | **Method** | **Description**                                  |
|---------------------------|------------|------------------------------------------------|
| `/api/locations`         | GET        | Fetches all unique spots.                      |
| `/api/locations/:id`     | GET        | Fetches details of a specific location.       |
| `/api/locations/add`     | POST       | Allows users to add a new unique location.    |
| `/api/locations/:id/like` | POST       | Adds a like to a specific location.           |
| `/api/comments/:id`      | POST       | Allows users to leave a comment on a location.|

---

## Roadmap

1️⃣ **Project Setup** – Create GitHub repository and project structure.  
2️⃣ **Backend Development** – Set up Express.js API with location management.  
3️⃣ **Frontend Development** – Build React UI and integrate with APIs.  
4️⃣ **Google Maps Integration** – Display locations interactively.  
5️⃣ **User Features** – Enable comments, likes, and user submissions.  
6️⃣ **Final Testing & Deployment** – Ensure stability and user experience.  

---

## Future Implementations
🚀 **User Authentication** – If not completed during MVP, add secure login/logout.  
🚀 **Enhanced Search & Filters** – Improve search functionality by adding advanced filtering.  
🚀 **Gamification** – Adding user badges and rewards for frequent contributors.  

---



