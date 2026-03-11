import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function UrlShortener() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [customAlias, setCustomAlias] = useState("");

  const handleShorten = async () => {
    if (!url) return;

    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_BASE}/url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          customAlias: customAlias || undefined,
        }),
      });

      if (!res.ok) throw new Error("Request failed");

      const data = await res.json();
      setShortUrl(data.shortUrl);
    } catch {
      setError("Failed to shorten URL");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen text-[#c9d1d9] flex flex-col bg-[#0d1117]">

      {/* Header */}
      <header className="border-b border-[#30363d]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center">

          <h1 className="italic text-lg font-bold bg-gradient-to-r from-[#58a6ff] to-[#79c0ff] bg-clip-text text-gray-300">
            🔗 LinkZIP
          </h1>

        </div>
      </header>


      {/* Main Content */}
      <main
          className="relative flex-1 flex items-center justify-center px-6
          bg-[#0d1117]
          bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)]
          bg-[size:12px_12px]"
        >
        <div className="absolute inset-0 pointer-events-none
            bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_45%)]">
        </div>

        <div className="relative bg-[#161b22] border border-[#30363d] rounded-lg shadow-lg w-[460px] px-10 py-10 text-center">

          <h2 className="text-2xl font-semibold text-grey-300 mb-2 tracking-tight">
             Still sharing long, boring links?
          </h2>

          <p className="text-sm text-[#8b949e] mb-6">
            Transform your URLs into sleek, shareable links in seconds!
          </p>


          {/* Inputs */}
          <div className="flex gap-2 mb-4">
            <div className="flex flex-col gap-2 w-full">

              <input
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-4 py-2 text-sm focus:outline-none focus:border-[#58a6ff]"
                placeholder="Enter long URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />

              <input
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-4 py-2 text-sm focus:outline-none focus:border-[#58a6ff]"
                placeholder="Custom alias (optional)"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
              />

            </div>

            <button
              onClick={handleShorten}
              disabled={loading}
              className="bg-[#005b96] hover:bg-[#2485ab] text-white px-4 rounded-md text-sm font-medium"
            >
              {loading ? "Generating..." : "Generate Short URL"}
            </button>
          </div>

          {/* Result */}
          {shortUrl && (
            <div className="space-y-2 mt-4">

              <a
                href={shortUrl}
                target="_blank"
                rel="noreferrer"
                className="block text-[#58a6ff] underline break-all text-sm"
              >
                {shortUrl}
              </a>

              <button
                onClick={handleCopy}
                className="text-sm text-[#8b949e] hover:text-white underline"
              >
                {copied ? "Copied ✓" : "Copy to clipboard"}
              </button>
            </div>
            )}


          {error && (
            <p className="text-red-400 text-sm mt-3">
              {error}
            </p>
          )}

          <button
                onClick={() => (window.location.href = "/analytics")}
                className="underline text-sm text-[#8b949e] hover:text-gray-300"
          >
                 View URL Analytics
          </button>

        </div>
      </main>
    </div>
  );
}