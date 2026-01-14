const express = require("express");
const { connectDB } = require("./connect");
const urlRoutes = require("./routes/url");

const app = express();
const PORT = 8001;

app.use(express.json());

// Connect to MongoDB and start the server: then-catch block used why?
//Every major operation needs DB access. So making sure DB connects before starting server.
//Safer choice.
connectDB("mongodb+srv://karsiddharth1009_db_user:j1tQP5c6bhn9QVwn@cluster0.s7ab5zn.mongodb.net/short-url-db?retryWrites=true&w=majority")
  .then(() => {
    console.log("MongoDB connected");

    app.use("/url", urlRoutes); // All routes prefixed with '/url'.
                                              // Why? --> Logical grouping.

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
  });
