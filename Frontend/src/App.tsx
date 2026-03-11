import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Analytics from "./pages/Analytics";
import UrlAnalytics from "./pages/UrlAnalytics";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/analytics/:shortId" element={<UrlAnalytics />} />
    </Routes>
  );
}
