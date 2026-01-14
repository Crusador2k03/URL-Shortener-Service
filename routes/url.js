const express = require("express");
const {
  handleCreateShortURL,
  handleRedirect,
} = require("../controllers/url");

const router = express.Router();

router.post("/", handleCreateShortURL);
router.get("/:shortId", handleRedirect);

module.exports = router;
