require("dotenv").config();
const express = require("express");
const { connectDB } = require("./connect");
const cors = require("cors");
const urlRoutes = require("./routes/url");
const redisClient = require("./redis");
const { handleRedirect } = require("./controllers/url");

const app = express();
const PORT =  process.env.PORT || 8001;

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  })
);

app.use(express.json());

// Connect to MongoDB and start the server: then-catch block used why?
//Every major operation needs DB access. So making sure DB connects before starting server.
//Safer choice.
connectDB(process.env.MONGO_URL)
  .then(async () => {
    console.log("MongoDB connected");

    await redisClient.connect();
    console.log("Redis connected");

    app.use("/url", urlRoutes); // All routes prefixed with '/url'.
                                              // Why? --> Logical grouping.
    app.get("/:shortId", handleRedirect); // Catch-all for short URL redirects.
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
  });
