const API_BASE = import.meta.env.VITE_API_BASE;

export async function shortenUrl(url: string) {
  const res = await fetch(`${API_BASE}/url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  if (!res.ok) {
    throw new Error("Failed to shorten URL");
  }

  return res.json();
}

export async function getAnalytics() {
  const res = await fetch(`${API_BASE}/url/analytics`);
  return res.json();
}

export async function getUrlAnalytics(shortId: string) {
  const res = await fetch(`${API_BASE}/url/analytics/${shortId}`);
  return res.json();
}
