const { nanoid } = require("nanoid");
const URL = require("../models/url");
const redisClient = require("../redis");

const RESERVED = ["api", "login", "signup", "admin"];

async function handleCreateShortURL(req, res) {
  const { url, customAlias } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  let normalizedAlias;

  if (customAlias) {
    normalizedAlias = customAlias
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-_]/g, "");

    if (!normalizedAlias) {
      return res.status(400).json({ error: "Invalid custom alias" });
    }

    if (RESERVED.includes(normalizedAlias)) {
      return res.status(400).json({ error: "Alias is reserved" });
    }

    const exists =
      (await redisClient.get(normalizedAlias)) ||
      (await URL.findOne({ shortId: normalizedAlias }));

    if (exists) {
      return res.status(409).json({ error: "Alias already taken" });
    }
  }

  // ✅ ALWAYS generate canonical nanoid
  const generatedNanoId = nanoid(8);

  // ✅ Alias is just a cover
  const shortId = normalizedAlias || generatedNanoId;

  try {
    await URL.create({
      shortId,
      nanoid: generatedNanoId,
      originalUrl: url,
      visitHistory: [],
    });

    return res.status(201).json({
      shortUrl: `${process.env.BASE_URL}/${shortId}`,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        error: "Alias already taken",
      });
    }

    console.error(err);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
}

async function handleRedirect(req, res) {
  const alias = req.params.shortId;

  const entry = await URL.findOne({ shortId: alias });
  if (!entry) {
    return res.status(404).send("Not found");
  }

  const canonicalId = entry.nanoid;

  const cachedUrl = await redisClient.get(canonicalId);
  if (cachedUrl) {
    URL.updateOne(
      { nanoid: canonicalId },
      { $push: { visitHistory: { timestamp: Date.now() } } }
    ).catch(console.error);

    return res.redirect(cachedUrl);
  }

  await redisClient.set(canonicalId, entry.originalUrl, {
    EX: 60 * 60 * 24,
  });

  await URL.updateOne(
    { nanoid: canonicalId },
    { $push: { visitHistory: { timestamp: Date.now() } } }
  );
  return res.redirect(entry.originalUrl);
}




async function handleGetAllAnalytics(req, res) {
  const urls = await URL.find({});

  const analytics = urls.map((url) => ({
    shortId: url.shortId,
    nanoid: url.nanoid,
    originalUrl: url.originalUrl,
    totalClicks: url.visitHistory.length,
    visitHistory: url.visitHistory,
  }));

  return res.json(analytics);
}

async function handleGetUrlAnalytics(req, res) {
  const { shortId } = req.params;

  const url = await URL.findOne({ shortId});
  if (!url) {
    return res.status(404).json({ error: "URL not found" });
  }

  return res.json({
    shortId: url.shortId,
    nanoid: url.nanoid,
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