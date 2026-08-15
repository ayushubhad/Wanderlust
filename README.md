# 🌍 Wanderlust — Full-Stack Airbnb Clone with AI Features

> A feature-rich, full-stack web application that replicates the core functionalities of Airbnb—including property management, interactive maps, user authentication, review systems, and image uploads. Enhanced with planned AI capabilities like intelligent lexical search, automated review summaries, and smart travel recommendations.

---

## 📌 Table of Contents
- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture & Design Pattern](#-architecture--design-pattern)
- [Implementation Timeline & Milestones](#-implementation-timeline--milestones)
- [Upcoming AI Features](#-upcoming-ai-features)
- [Project Setup & Installation](#-project-setup--installation)
- [Environment Variables](#-environment-variables)

---

## 🚀 Project Overview

**Wanderlust** is built using the **MERN (MongoDB, Express, Node.js)** ecosystem along with **EJS Templating** for dynamic rendering. The application allows users to create, explore, update, and delete property listings, leave interactive reviews, upload high-resolution images via Cloudinary, and pinpoint listing locations using Mapbox integration.

The project strictly follows the **MVC (Model-View-Controller)** pattern, robust server/client-side input validation using **Joi** and **Bootstrap**, session authentication via **Passport.js**, and secure authorization layers for property and review management.

---

## ✨ Key Features

### 🏡 Property Listings (CRUD & Search)
- **Full CRUD Support:** Users can create, view, edit, and delete property listings.
- **Dynamic Category Filters:** Browse listings by specific travel categories (e.g., Castles, Beachfront, Mountains, Iconic Cities).
- **Owner Tracking:** Every listing is mapped directly to its creator.

### 🗺️ Interactive Maps & Geocoding
- **Mapbox Integration:** Forward geocoding converts text-based address entries into precise geographic coordinates stored in MongoDB.
- **Interactive Markers & Popups:** Pinpoint property locations on interactive maps with customized information popups.

### 🔒 Authentication & Authorization
- **Passport.js Integration:** Session-based user authentication supporting registration, login, auto-login upon signup, and logout.
- **Role-Based Authorization:** Only the original owner of a listing can edit or delete it. Only the author of a review can remove it.
- **Route Guards & Middleware:** Custom middleware ensures non-authenticated users cannot perform sensitive actions.

### 💬 Review & Rating System
- **Interactive Star Ratings:** Custom interactive rating system powered by `Starability`.
- **Cascading Deletes:** Deleting a listing automatically purges all associated reviews from the database.
- **User Ownership:** Displays author details for each individual review.

### 🖼️ Image Upload & Cloudinary Storage
- **Direct File Uploads:** Integrated `Multer` middleware to handle multipart form data.
- **Cloudinary Storage:** Securely stores images in the cloud and saves optimized image URLs in MongoDB.
- **Image Transformation & Preview:** Automatically scales down image resolution for edit-page previews to optimize bandwidth.

### 🛡️ Robust Validation & Error Handling
- **Client-Side Validation:** Custom Bootstrap form validation for immediate UI feedback.
- **Server-Side Schema Validation:** Comprehensive Joi schema validation isolated into modular middleware.
- **Asynchronous Error Wrapping:** Custom `wrapAsync` and `ExpressError` structures handle unexpected database and runtime errors gracefully with a default `err.ejs` page.

---

## 🛠️ Tech Stack

### **Backend**
* **Node.js** & **Express.js** — Core server framework and routing
* **MongoDB** & **Mongoose** — NoSQL database and Object Data Modeling (ODM)
* **Passport.js** — Authentication middleware (Local Strategy)
* **Joi** — Data schema validation for API security
* **Multer** & **Multer-Storage-Cloudinary** — Handling file uploads

### **Frontend**
* **EJS** & **ejs-mate** — Templating engine and layout management
* **Bootstrap 5** — Responsive grid system, navbar, cards, and modal components
* **CSS3** — Custom layout styling, sticky navigation, and media queries
* **Starability** — Accessible CSS star rating library

### **Third-Party Services**
* **Cloudinary** — Cloud image storage and dynamic image transformations
* **Mapbox GL JS & SDK** — Interactive mapping, geospatial indexing, and forward geocoding

---

## 🏗️ Architecture & Design Pattern

The application follows a strict **Model-View-Controller (MVC)** framework to ensure maximum scalability and maintainability.

```text
├── controllers/       # Business logic for Listings, Reviews, and Users
├── models/            # Mongoose schemas (Listing, Review, User)
├── routes/            # Express Router modules for segregated endpoints
├── middleware/        # Custom authentication, authorization, and validation checks
├── views/             # EJS layouts, partials, and page views
├── public/            # Static assets (Custom CSS, Client JS)
├── utils/             # ExpressError and wrapAsync helpers
├── cloudConfig.js     # Cloudinary service configurations
└── app.js             # Application entry point & global configurations
