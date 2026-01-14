const { nanoid } = require("nanoid");
const URL = require("../models/url");

async function handleCreateShortURL(req, res) {
  const { url } = req.body;
  console.log("BODY:", req.body);

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  const shortId = nanoid(8);

  await URL.create({
    shortUrl: shortId,
    originalUrl: url,
    visitHistory: [],
  });

  return res.status(201).json({ id: shortId });
}

async function handleRedirect(req, res) {             
  const { shortId } = req.params;

  const entry = await URL.findOne({ shortUrl: shortId });

  if (!entry) {
    return res.status(404).json({ error: "Short URL not found" });
  }

  entry.visitHistory.push({ timestamp: Date.now() });
  await entry.save();

  return res.redirect(entry.originalUrl);
}

module.exports = {
  handleCreateShortURL,
  handleRedirect,
};
