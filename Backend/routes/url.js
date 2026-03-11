const express = require("express");
const {
  handleCreateShortURL,
  handleRedirect,
  handleGetAllAnalytics,
  handleGetUrlAnalytics,
} = require("../controllers/url");

const router = express.Router();

router.post("/", handleCreateShortURL);
router.get("/analytics", handleGetAllAnalytics);
router.get("/analytics/:shortId", handleGetUrlAnalytics);
router.get("/:shortId", handleRedirect);

module.exports = router;
