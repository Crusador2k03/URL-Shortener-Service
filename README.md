# URL Shortener Service

A backend URL Shortener service built using **Node.js**, **Express**, and **MongoDB**.  
The application generates short URLs for long links, redirects users to the original URLs, and tracks visit history.

---

## 🚀 Features

- Generate short URLs for long links
- Redirect short URLs to original URLs
- Track visit timestamps for analytics
- Fail-fast startup with database readiness check
- Clean, modular backend architecture

---

## 🧠 Architecture Overview

The project follows a **layered backend architecture**:
Each layer has a clear responsibility, making the codebase easy to maintain and scale.
- index.js → Application entry point
- connect.js → Database connection logic
- routes/url.js → Route definitions
- controllers/url.js → Business logic
- models/url.js → MongoDB schema

---

## 🛠 Tech Stack

- **Node.js** – Runtime environment
- **Express.js** – Web framework
- **MongoDB** – Database
- **Mongoose** – ODM for MongoDB
- **nanoid** – Unique ID generation

---

## Dependencies Required

The following dependencies are required to run this project:

- **express** – Web framework for handling HTTP requests and routing
- **mongoose** – ODM for connecting to and interacting with MongoDB
- **nanoid** – Generates unique, URL-safe short IDs

Install dependencies:

```bash
npm install express mongoose nanoid
