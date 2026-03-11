import { useEffect, useState } from "react";
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
  timestamp: string;
};

type AnalyticsItem = {
  shortUrl: string;
  originalUrl: string;
  totalClicks: number;
  visitHistory: Visit[];
};

export default function Analytics() {
  const [data, setData] = useState<AnalyticsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE}/url/analytics`)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="p-6 text-center">Loading analytics...</p>;
  }

  const globalChartData = Object.values(
    data.reduce((acc: any, item) => {
      item.visitHistory.forEach((v: any) => {
        const date = new Date(v.timestamp).toLocaleDateString();
        acc[date] = acc[date] || { date, clicks: 0 };
        acc[date].clicks += 1;
      });
      return acc;
    }, {})
  );


  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="w-full max-w-6xl">
        <h1 className="text-3xl font-bold text-center mb-8">
          Global Analytics
        </h1>

        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-5 text-center">
            <p className="text-sm text-gray-500">Total URLs</p>
            <p className="text-2xl font-bold">{data.length}</p>
          </div>

          <div className="bg-white rounded-xl shadow p-5 text-center">
            <p className="text-sm text-gray-500">Total Clicks</p>
            <p className="text-2xl font-bold">
              {data.reduce((sum, item) => sum + item.totalClicks, 0)}
            </p>
          </div>
        </div>

        {/* Global chart */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">
            Global Clicks Over Time
          </h2>

          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={globalChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="clicks"
                stroke="#2563eb"
                fill="#93c5fd"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>


        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {data.length === 0 ? (
            <p className="text-center text-gray-500 py-10">
              No URLs shortened yet.
            </p>
          ) : (
            <table className="w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left">Short ID</th>
                  <th className="p-3 text-left">Original URL</th>
                  <th className="p-3 text-center">Clicks</th>
                </tr>
              </thead>

              <tbody>
                {data.map((item) => (
                  <tr
                    key={item.shortUrl}
                    className="border-t hover:bg-gray-50 cursor-pointer"
                    onClick={() =>
                      navigate(`/analytics/${item.shortUrl}`)
                    }
                  >
                    <td className="p-3 text-blue-600 underline">
                      /{item.shortUrl}
                    </td>

                    <td className="p-3 break-all text-gray-700">
                      {item.originalUrl}
                    </td>

                    <td className="p-3 text-center font-medium">
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
