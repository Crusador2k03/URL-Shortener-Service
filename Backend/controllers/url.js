const { nanoid } = require("nanoid");
const URL = require("../models/url");
const redisClient = require("../redis");

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

  URL.updateOne(
    { shortUrl: shortId },
    { $push: { visitHistory: { timestamp: Date.now() } } }
  ).catch(console.error);

  const cachedUrl = await redisClient.get(shortId);
  if (cachedUrl) {
    console.log("Redis Cache hit:", shortId);
    return res.redirect(cachedUrl);
  }

  console.log("MongoDB hit:", shortId);
  const entry = await URL.findOne({ shortUrl: shortId });
  if (!entry) {
    return res.status(404).json({ error: "Short URL not found" });
  }

await redisClient.set(shortId, entry.originalUrl, {EX: 60 * 60 * 24}); // Cache for 1 day



  entry.visitHistory.push({ timestamp: Date.now() });
  await entry.save();

  return res.redirect(entry.originalUrl);
}

async function handleGetAllAnalytics(req, res) {
  const urls = await URL.find({});

  const analytics = urls.map((url) => ({
    shortUrl: url.shortUrl,
    originalUrl: url.originalUrl,
    totalClicks: url.visitHistory.length,
    visitHistory: url.visitHistory,
  }));

  return res.json(analytics);
}

async function handleGetUrlAnalytics(req, res) {
  const { shortId } = req.params;

  const url = await URL.findOne({ shortUrl: shortId });
  if (!url) {
    return res.status(404).json({ error: "URL not found" });
  }

  return res.json({
    shortUrl: url.shortUrl,
    originalUrl: url.originalUrl,
    totalClicks: url.visitHistory.length,
    visitHistory: url.visitHistory,
  });
}



module.exports = {
  handleCreateShortURL,
  handleRedirect,
  handleGetAllAnalytics,
  handleGetUrlAnalytics,
};
