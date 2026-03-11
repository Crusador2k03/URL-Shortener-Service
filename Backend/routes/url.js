const express = require("express");

const router = express.Router();

const {
  handleCreateShortURL,
  handleGetAllAnalytics,
  handleGetUrlAnalytics,
} = require("../controllers/url");

router.post("/", handleCreateShortURL);
router.get("/analytics", handleGetAllAnalytics);
router.get("/analytics/:shortId", handleGetUrlAnalytics);
//router.get("/:shortId", handleRedirect);

module.exports = router;