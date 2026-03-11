import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const API_BASE = import.meta.env.VITE_API_BASE;

type Visit = {
  timestamp: number;
};

type AnalyticsItem = {
  shortId: string;
  originalUrl: string;
  totalClicks: number;
  visitHistory: Visit[];
};

export default function Analytics() {
  const [data, setData] = useState<AnalyticsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  fetch(`${API_BASE}/url/analytics`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch analytics");
      }
      return res.json();
    })
    .then((json) => {
      setData(json);
      setLoading(false);
    })
    .catch(() => setLoading(false));

  if (loading) {
    return <p className="p-6 text-center">Loading analytics...</p>;
  }

  const globalChartData = Object.values(
    data.reduce((acc: any, item) => {
      item.visitHistory.forEach((v) => {
        const date = new Date(v.timestamp).toLocaleDateString();
        acc[date] = acc[date] || { date, clicks: 0 };
        acc[date].clicks += 1;
      });
      return acc;
    }, {})
  );

  return (
    <div
      className="min-h-screen text-[#c9d1d9] flex flex-col items-center py-10
    bg-[#0d1117]
    bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)]
    bg-[size:12px_12px]"
    >

      <div className="w-full max-w-6xl relative">

        <h1 className="text-3xl font-semibold text-white text-center mb-10 tracking-tight">
          Global Analytics
        </h1>

        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-6 mb-8">

          <div className="bg-[#161b22] border border-[#30363d] rounded-lg shadow-lg p-6 text-center">
            <p className="text-sm text-[#8b949e]">Total URLs</p>
            <p className="text-2xl font-semibold text-white">{data.length}</p>
          </div>

          <div className="bg-[#161b22] border border-[#30363d] rounded-lg shadow-lg p-6 text-center">
            <p className="text-sm text-[#8b949e]">Total Clicks</p>
            <p className="text-2xl font-semibold text-white">
              {data.reduce((sum, item) => sum + item.totalClicks, 0)}
            </p>
          </div>

        </div>

        {/* Global chart */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg shadow-lg p-6 mb-8">

          <h2 className="text-lg font-semibold text-white mb-4">
            Global Clicks Over Time
          </h2>

          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={globalChartData}>

              <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />

              <XAxis
                dataKey="date"
                stroke="#8b949e"
              />

              <YAxis
                allowDecimals={false}
                stroke="#8b949e"
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#161b22",
                  border: "1px solid #30363d",
                  color: "#c9d1d9"
                }}
              />

              <Area
                type="monotone"
                dataKey="clicks"
                stroke="#58a6ff"
                fill="#58a6ff"
                fillOpacity={0.25}
              />

            </AreaChart>
          </ResponsiveContainer>

        </div>

        {/* Table */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg shadow-lg overflow-hidden">

          {data.length === 0 ? (
            <p className="text-center text-[#8b949e] py-10">
              No URLs shortened yet.
            </p>
          ) : (

            <table className="w-full border-collapse">

              <thead className="bg-[#0d1117] border-b border-[#30363d]">
                <tr>
                  <th className="p-4 text-left text-[#8b949e] font-medium">Short ID</th>
                  <th className="p-4 text-left text-[#8b949e] font-medium">Original URL</th>
                  <th className="p-4 text-center text-[#8b949e] font-medium">Clicks</th>
                </tr>
              </thead>

              <tbody>

                {data.map((item) => (
                  <tr
                    key={item.shortId}
                    className="border-t border-[#30363d] hover:bg-[#0d1117] cursor-pointer transition"
                    onClick={() => navigate(`/analytics/${item.shortId}`)}
                  >

                    <td className="p-4 text-[#58a6ff] underline">
                      /{item.shortId}
                    </td>

                    <td className="p-4 break-all text-[#c9d1d9]">
                      {item.originalUrl}
                    </td>

                    <td className="p-4 text-center font-medium">
                      {item.totalClicks}
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          )}

        </div>

      </div>
    </div>
  );
}