import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router";
import { MainLayout } from "./components/layouts";
import DashboardPage from "./pages/dashboard";
import GamesPage from "./pages/videos";
import VideoAnalysisPage from "./pages/videos/[id]";
import { routes } from "./config/route";
import TeamsPage from "./pages/team";
import TeamDetailPage from "./pages/team/[id]";

// Create a wrapper component to access router context
function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activePath, setActivePath] = useState(location.pathname);

  const handleRouteChange = (path: string) => {
    setActivePath(path);
    navigate(path);
  };

  return (
    <MainLayout
      routes={routes}
      activePath={activePath}
      onRouteChange={handleRouteChange}
    >
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/videos" element={<GamesPage />} />
        <Route path="/videos/:id" element={<VideoAnalysisPage />} />
        <Route path="/toolbox" element={<div>Coach's Toolbox</div>} />
        <Route path="/team" element={<TeamsPage />} />
        <Route path="/teams/:id" element={<TeamDetailPage />} />
      </Routes>
    </MainLayout>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
