import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function UrlShortener() {
  const [url, setUrl] = useState("");
  const [shortId, setShortId] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleShorten = async () => {
    if (!url) return;

    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_BASE}/url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) throw new Error("Request failed");

      const data = await res.json();
      setShortId(data.id);
    } catch {
      setError("Failed to shorten URL");
    } finally {
      setLoading(false);
    }
  };

  const shortUrl = `${API_BASE}/url/${shortId}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-[420px] rounded-xl shadow-md px-8 py-10 text-center">
        <h1 className="text-2xl font-semibold mb-6">
          Paste your link here
        </h1>

        <div className="flex gap-2 mb-4">
          <input
            className="flex-1 border rounded px-4 py-2"
            placeholder="Enter long URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            onClick={handleShorten}
            disabled={loading}
            className="bg-blue-600 text-white px-4 rounded"
          >
            {loading ? "Generating..." : "Create short URL"}
          </button>
        </div>

        {shortId && (
          <div className="space-y-2">
            <a
              href={shortUrl}
              target="_blank"
              rel="noreferrer"
              className="block text-blue-600 underline break-all"
            >
              {shortUrl}
            </a>

            <button
              onClick={handleCopy}
              className="text-sm text-gray-600 underline"
            >
              {copied ? "Copied ✓" : "Copy to clipboard"}
            </button>
          </div>
        )}

        {error && (
          <p className="text-red-500 text-sm mt-3">{error}</p>
        )}

        <button
          onClick={() => (window.location.href = "/analytics")}
          className="block mx-auto text-sm text-gray-600 underline mt-2"
        >
          View Analytics
        </button>
      </div>
    </div>
  );
}
