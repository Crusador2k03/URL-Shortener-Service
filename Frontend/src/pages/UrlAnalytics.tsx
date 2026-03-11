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
  shortUrl: string;
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
    fetch(`${API_BASE}/url/analytics/${shortId}`)
      .then((res) => res.json())
      .then(setData);
  }, [shortId]);

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
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="w-full max-w-4xl">
        <button
          onClick={() => navigate("/analytics")}
          className="text-sm text-gray-500 underline mb-4"
        >
          ← Back to Analytics
        </button>

        {/* URL Info */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h1 className="text-2xl font-bold mb-1">
            Analytics for short ID: {data.shortUrl}
          </h1>
          <p className="text-gray-600 break-all">
            Original URL: {data.originalUrl}
          </p>
        </div>

        {/* Click counter */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-6">
          <p className="text-sm text-blue-600">Total Clicks</p>
          <p className="text-3xl font-bold text-blue-700">
            {data.totalClicks}
          </p>
        </div>

        <div className="flex gap-2 mb-4">
          {["24h", "7d", "30d"].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r as any)}
              className={`px-4 py-1 rounded border text-sm ${range === r
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
            >
              {r}
            </button>
          ))}
        </div>



        {/* Chart */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">
            Click Timeline
          </h2>

          <div className="transition-opacity duration-300 ease-in-out" key={range}>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 11 }}
                  interval="preserveStartEnd"
                  minTickGap={20}
                  allowDataOverflow
                />

                <YAxis
                  allowDecimals={false}
                  domain={[0, "dataMax + 1"]}
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "Clicks",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />


                <Tooltip
                  animationDuration={200}
                  formatter={(value) => [`${value}`, "Clicks"]}
                  labelFormatter={(label) => `Time: ${label}`}
                />


                <Line
                  type="monotone"
                  dataKey="clicks"
                  stroke="#2563eb"
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