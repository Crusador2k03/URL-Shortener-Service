import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  CartesianGrid,
} from "recharts";

const API_BASE = import.meta.env.VITE_API_BASE;

type Visit = {
  timestamp: number;
};

type UrlAnalyticsData = {
  shortId: string;
  nanoid: string;
  originalUrl: string;
  totalClicks: number;
  visitHistory: Visit[];
};

type Range = "24h" | "7d" | "30d";

export default function UrlAnalytics() {
  const { shortId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<UrlAnalyticsData | null>(null);
  const [range, setRange] = useState<Range>("7d");

  useEffect(() => {
    fetch(`${API_BASE}/url/analytics/${shortId}`, {
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch URL analytics");
        }
        return res.json();
      })
      .then(setData)
      .catch(() => navigate("/analytics"));
  }, [shortId, navigate]);

  if (!data) {
    return <p className="p-6 text-center">Loading...</p>;
  }

  const getCutoffTime = () => {
    const now = Date.now();

    switch (range) {
      case "24h":
        return now - 24 * 60 * 60 * 1000;
      case "7d":
        return now - 7 * 24 * 60 * 60 * 1000;
      case "30d":
        return now - 30 * 24 * 60 * 60 * 1000;
      default:
        return 0;
    }
  };

  const cutoff = getCutoffTime();
  const filteredVisits = data.visitHistory.filter(
    (v) => v.timestamp >= cutoff
  );

  const chartData = filteredVisits
    .sort((a, b) => a.timestamp - b.timestamp)
    .map((v, index) => ({
      time: new Date(v.timestamp).toLocaleTimeString(),
      clicks: index + 1,
    }));

  return (
    <div
      className="min-h-screen text-[#c9d1d9] flex justify-center p-6
        bg-[#0d1117]
        bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)]
        bg-[size:12px_12px]"
    >
      <div className="w-full max-w-4xl relative">

        <button
          onClick={() => navigate("/analytics")}
          className="text-sm text-[#8b949e] hover:text-white underline mb-4"
        >
          ← Back to Analytics
        </button>

        {/* URL Info */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-semibold text-white mb-1">
            Analytics for short ID: {data.nanoid}
          </h1>

          <p className="text-[#8b949e] break-all">
            Original URL: {data.originalUrl}
          </p>
        </div>

        {/* Click counter */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg shadow-lg p-6 mb-6 text-center">
          <p className="text-sm text-[#8b949e]">Total Clicks</p>
          <p className="text-3xl font-semibold text-white">
            {data.totalClicks}
          </p>
        </div>

        {/* Range buttons */}
        <div className="flex gap-2 mb-6">
          {["24h", "7d", "30d"].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r as Range)}
              className={`px-4 py-1 rounded-md border text-sm transition ${range === r
                  ? "bg-[#58a6ff] text-white border-[#58a6ff]"
                  : "bg-[#161b22] text-[#8b949e] border-[#30363d] hover:bg-[#0d1117]"
                }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Chart */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Click Timeline
          </h2>

          <div
            className="transition-opacity duration-300 ease-in-out"
            key={range}
          >
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={chartData}>

                <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />

                <XAxis
                  dataKey="time"
                  stroke="#8b949e"
                  tick={{ fontSize: 11 }}
                  interval="preserveStartEnd"
                  minTickGap={20}
                />

                <YAxis
                  allowDecimals={false}
                  domain={[0, "dataMax + 1"]}
                  stroke="#8b949e"
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "Clicks",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#8b949e"
                  }}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#161b22",
                    border: "1px solid #30363d",
                    color: "#c9d1d9"
                  }}
                  formatter={(value) => [`${value}`, "Clicks"]}
                  labelFormatter={(label) => `Time: ${label}`}
                />

                <Line
                  type="monotone"
                  dataKey="clicks"
                  stroke="#58a6ff"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                  isAnimationActive={true}
                  animationDuration={600}
                  animationEasing="ease-in-out"
                />

              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}