import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  Link,
  Outlet
} from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";
import "./pages/Login.css";

import Sidebar from "./components/Sidebar";
import Assets from "./pages/Assets";
import Users from "./pages/Users";
import Maintenance from "./pages/Maintenance";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import logo from "./assets/images/logo.png";

const ASSETS_API_URL = "http://localhost:5000/api/assets";
const MAINTENANCE_API_URL = "http://localhost:5000/api/maintenance";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username,
            password
          })
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Invalid username or password");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (error) {
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-background-shape login-background-shape-one"></div>
      <div className="login-background-shape login-background-shape-two"></div>

      <div className="login-card">
        <div className="login-brand">
          <div className="login-logo">
            <img src={logo} alt="IT Asset Management System Logo" />
          </div>

          <div className="login-brand-text">
            <h1>IT Asset Management</h1>
            <span>Asset Management System</span>
          </div>
        </div>

        <div className="login-heading">
          <h2>Welcome back</h2>
          <p>Sign in to access your IT asset management system.</p>
        </div>

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <form className="login-form" onSubmit={handleLogin}>
          <div className="login-form-group">
            <label htmlFor="username">
              Username or Email
            </label>

            <input
              id="username"
              type="text"
              placeholder="Enter your username or email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="login-form-group">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="login-footer">
          <span>IT Asset Management System</span>
        </div>
      </div>
    </div>
  );
}

function DashboardHome() {
  const [assets, setAssets] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [assetsResponse, maintenanceResponse] =
        await Promise.all([
          fetch(ASSETS_API_URL),
          fetch(MAINTENANCE_API_URL)
        ]);

      const assetsData = await assetsResponse.json();
      const maintenanceData = await maintenanceResponse.json();

      if (!assetsResponse.ok || !assetsData.success) {
        throw new Error(
          assetsData.message || "Failed to load assets"
        );
      }

      if (
        !maintenanceResponse.ok ||
        !maintenanceData.success
      ) {
        throw new Error(
          maintenanceData.message ||
            "Failed to load maintenance records"
        );
      }

      setAssets(assetsData.assets || []);
      setMaintenance(maintenanceData.maintenance || []);
    } catch (error) {
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const totalAssets = assets.length;

  const activeAssets = assets.filter(
    (asset) =>
      asset.Status?.toLowerCase() === "active"
  ).length;

  const unavailableAssets = assets.filter(
    (asset) =>
      asset.Status?.toLowerCase() === "unavailable"
  ).length;

  const maintenanceAssets = maintenance.length;

  const recentAssets = [...assets]
    .slice(-3)
    .reverse();

  return (
    <div className="dashboard-main">
      <header className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>
            Overview of your IT asset management system.
          </p>
        </div>

        <button className="notification-btn">
          Notifications
        </button>
      </header>

      {error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}

      <section className="stats-grid">
        <div className="stat-card">
          <span>Total Assets</span>
          <div className="stat-number blue">
            {loading ? "..." : totalAssets}
          </div>
          <small>Registered equipment</small>
        </div>

        <div className="stat-card">
          <span>Active Assets</span>
          <div className="stat-number green">
            {loading ? "..." : activeAssets}
          </div>
          <small>Currently in use</small>
        </div>

        <div className="stat-card">
          <span>Maintenance</span>
          <div className="stat-number orange">
            {loading ? "..." : maintenanceAssets}
          </div>
          <small>Needs attention</small>
        </div>

        <div className="stat-card">
          <span>Unavailable</span>
          <div className="stat-number red">
            {loading ? "..." : unavailableAssets}
          </div>
          <small>Not currently available</small>
        </div>
      </section>

      <section className="dashboard-content">
        <div className="content-card">
          <div className="card-header">
            <div>
              <h2>Recent Assets</h2>
              <p>Recently added or updated assets</p>
            </div>

            <Link
              to="/assets"
              className="view-btn"
            >
              View All →
            </Link>
          </div>

          <div className="asset-table">
            <div className="table-row table-head">
              <span>Asset</span>
              <span>Category</span>
              <span>Status</span>
              <span>Assigned To</span>
            </div>

            {loading ? (
              <div className="table-row">
                <span>Loading...</span>
              </div>
            ) : recentAssets.length === 0 ? (
              <div className="table-row">
                <span>No assets found.</span>
              </div>
            ) : (
              recentAssets.map((asset) => {
                const statusClass =
                  asset.Status?.toLowerCase() ===
                  "active"
                    ? "active-status"
                    : asset.Status?.toLowerCase() ===
                      "unavailable"
                    ? "status-unavailable"
                    : "maintenance-status";

                return (
                  <div
                    className="table-row"
                    key={asset.Id}
                  >
                    <div className="asset-name">
                      <strong>
                        {asset.AssetName}
                      </strong>
                      <small>
                        {asset.AssetTag}
                      </small>
                    </div>

                    <span>{asset.Category}</span>

                    <div>
                      <span
                        className={`status ${statusClass}`}
                      >
                        {asset.Status}
                      </span>
                    </div>

                    <span>
                      {asset.AssignedTo ||
                        "Unassigned"}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="content-card quick-actions">
          <div className="card-header">
            <div>
              <h2>Quick Actions</h2>
              <p>Common management tasks</p>
            </div>
          </div>

          <div className="quick-actions-body">
            <Link
              to="/assets"
              className="quick-action-btn"
            >
              Add New Asset
            </Link>

            <Link
              to="/users"
              className="quick-action-btn"
            >
              Manage Users
            </Link>

            <Link
              to="/reports"
              className="quick-action-btn"
            >
              Generate Report
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function SystemLayout() {
  return (
    <div className="dashboard-page">
      <div className="no-print">
        <Sidebar />
      </div>
      <Outlet />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        element={
          <ProtectedRoute>
            <SystemLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/dashboard"
          element={<DashboardHome />}
        />

        <Route
          path="/assets"
          element={<Assets />}
        />

        <Route
          path="/users"
          element={<Users />}
        />

        <Route
          path="/maintenance"
          element={<Maintenance />}
        />

        <Route
          path="/reports"
          element={<Reports />}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />
      </Route>
    </Routes>
  );
}

export default App;