import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import "./App.css";

import Sidebar from "./components/Sidebar";
import Assets from "./pages/Assets";
import Users from "./pages/Users";

function Login() {
    return (
        <div className="login-page">
            <div className="login-card">

                <div className="brand">
                    <div className="brand-icon">IT</div>

                    <div>
                        <h1>IT Asset Management</h1>
                        <span>Management System</span>
                    </div>
                </div>

                <div className="login-header">
                    <h2>Welcome back</h2>
                    <p>Sign in to access your account.</p>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        window.location.href = "/dashboard";
                    }}
                >
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="signin-btn"
                    >
                        Sign In
                    </button>
                </form>

            </div>
        </div>
    );
}

function DashboardHome() {
    return (
        <div className="dashboard-home">

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

            <section className="stats-grid">

                <div className="stat-card">
                    <div className="stat-icon blue">A</div>

                    <div>
                        <span>Total Assets</span>
                        <h2>128</h2>
                        <small>All registered assets</small>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon green">A</div>

                    <div>
                        <span>Active Assets</span>
                        <h2>112</h2>
                        <small>Currently in use</small>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon orange">M</div>

                    <div>
                        <span>Maintenance</span>
                        <h2>10</h2>
                        <small>Needs attention</small>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon red">U</div>

                    <div>
                        <span>Unavailable</span>
                        <h2>6</h2>
                        <small>Not currently available</small>
                    </div>
                </div>

            </section>

            <section className="dashboard-content">

                <div className="content-card">

                    <div className="card-header">
                        <div>
                            <h2>Recent Assets</h2>
                            <p>
                                Recently added or updated assets
                            </p>
                        </div>

                        <a
                            href="/assets"
                            className="view-btn"
                        >
                            View All
                        </a>
                    </div>

                    <div className="asset-table">

                        <div className="table-row table-head">
                            <span>Asset</span>
                            <span>Category</span>
                            <span>Status</span>
                            <span>Assigned To</span>
                        </div>

                        <div className="table-row">

                            <div className="asset-name">
                                <div className="asset-icon">
                                    PC
                                </div>

                                <div>
                                    <strong>
                                        Dell OptiPlex 7090
                                    </strong>

                                    <small>
                                        IT-2026-001
                                    </small>
                                </div>
                            </div>

                            <span>Desktop</span>

                            <span className="status active-status">
                                Active
                            </span>

                            <span>John Smith</span>

                        </div>

                        <div className="table-row">

                            <div className="asset-name">
                                <div className="asset-icon">
                                    LT
                                </div>

                                <div>
                                    <strong>
                                        Lenovo ThinkPad E14
                                    </strong>

                                    <small>
                                        IT-2026-002
                                    </small>
                                </div>
                            </div>

                            <span>Laptop</span>

                            <span className="status active-status">
                                Active
                            </span>

                            <span>Maria Santos</span>

                        </div>

                        <div className="table-row">

                            <div className="asset-name">
                                <div className="asset-icon">
                                    PR
                                </div>

                                <div>
                                    <strong>
                                        HP LaserJet Pro
                                    </strong>

                                    <small>
                                        IT-2026-003
                                    </small>
                                </div>
                            </div>

                            <span>Printer</span>

                            <span className="status maintenance-status">
                                Maintenance
                            </span>

                            <span>IT Department</span>

                        </div>

                    </div>

                </div>

                <div className="content-card quick-actions">

                    <div className="card-header">
                        <div>
                            <h2>Quick Actions</h2>
                            <p>
                                Common management tasks
                            </p>
                        </div>
                    </div>

                    <a
                        href="/assets"
                        className="quick-action-btn"
                    >
                        <span>+</span>
                        Add New Asset
                    </a>

                    <a
                        href="/users"
                        className="quick-action-btn"
                    >
                        <span>U</span>
                        Manage Users
                    </a>

                    <a
                        href="/reports"
                        className="quick-action-btn"
                    >
                        <span>R</span>
                        Generate Report
                    </a>

                </div>

            </section>

        </div>
    );
}

function SystemLayout() {
    return (
        <div className="dashboard-page">

            <Sidebar />

            <main className="dashboard-main">
                <Routes>

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
                        element={
                            <div className="page-placeholder">
                                <h1>Maintenance</h1>
                                <p>
                                    Maintenance management page.
                                </p>
                            </div>
                        }
                    />

                    <Route
                        path="/reports"
                        element={
                            <div className="page-placeholder">
                                <h1>Reports</h1>
                                <p>
                                    Reports management page.
                                </p>
                            </div>
                        }
                    />

                    <Route
                        path="/settings"
                        element={
                            <div className="page-placeholder">
                                <h1>Settings</h1>
                                <p>
                                    System settings page.
                                </p>
                            </div>
                        }
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

                </Routes>
            </main>

        </div>
    );
}

function App() {
    return (
        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/*"
                    element={<SystemLayout />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;