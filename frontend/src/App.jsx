import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Assets from "./Assets";
import "./App.css";

function Login() {
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        navigate("/dashboard");
    };

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

                <form onSubmit={handleLogin}>

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

                    <button type="submit" className="signin-btn">
                        Sign In
                    </button>

                </form>
            </div>
        </div>
    );
}

function Dashboard() {
    const navigate = useNavigate();

    return (
        <div className="dashboard-page">

            <aside className="sidebar">

                <div className="sidebar-brand">
                    <div className="brand-icon">IT</div>

                    <div>
                        <h2>IT Asset</h2>
                        <span>Management</span>
                    </div>
                </div>

                <nav className="sidebar-nav">

                    <a
                        className="active"
                        onClick={() => navigate("/dashboard")}
                    >
                        <span>▦</span>
                        Dashboard
                    </a>

                    <a
                        onClick={() => navigate("/assets")}
                    >
                        <span>▣</span>
                        Assets
                    </a>

                    <a>
                        <span>♙</span>
                        Users
                    </a>

                    <a>
                        <span>⌁</span>
                        Maintenance
                    </a>

                    <a>
                        <span>▤</span>
                        Reports
                    </a>

                    <a>
                        <span>⚙</span>
                        Settings
                    </a>

                </nav>

                <div className="sidebar-bottom">
                    <div className="user-profile">
                        <div className="avatar">A</div>

                        <div>
                            <strong>Administrator</strong>
                            <span>System Admin</span>
                        </div>
                    </div>
                </div>

            </aside>

            <main className="dashboard-main">

                <header className="dashboard-header">
                    <div>
                        <h1>Dashboard</h1>
                        <p>Overview of your IT asset management system.</p>
                    </div>

                    <button className="notification-btn">
                        Notifications
                    </button>
                </header>

                <section className="stats-grid">

                    <div className="stat-card">
                        <div className="stat-icon blue">▣</div>

                        <div>
                            <span>Total Assets</span>
                            <h2>128</h2>
                            <small>All registered assets</small>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon green">✓</div>

                        <div>
                            <span>Active Assets</span>
                            <h2>112</h2>
                            <small>Currently in use</small>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon orange">!</div>

                        <div>
                            <span>Maintenance</span>
                            <h2>10</h2>
                            <small>Needs attention</small>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon red">×</div>

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
                                <p>Recently added or updated assets</p>
                            </div>

                            <button
                                className="view-btn"
                                onClick={() => navigate("/assets")}
                            >
                                View All
                            </button>
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
                                    <div className="asset-icon">PC</div>

                                    <div>
                                        <strong>Dell OptiPlex 7090</strong>
                                        <small>IT-2026-001</small>
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
                                    <div className="asset-icon">LT</div>

                                    <div>
                                        <strong>Lenovo ThinkPad E14</strong>
                                        <small>IT-2026-002</small>
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
                                    <div className="asset-icon">PR</div>

                                    <div>
                                        <strong>HP LaserJet Pro</strong>
                                        <small>IT-2026-003</small>
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
                                <p>Common management tasks</p>
                            </div>
                        </div>

                        <button onClick={() => navigate("/assets")}>
                            <span>+</span>
                            Add New Asset
                        </button>

                        <button>
                            <span>♙</span>
                            Manage Users
                        </button>

                        <button>
                            <span>▤</span>
                            Generate Report
                        </button>

                        <button onClick={() => navigate("/")}>
                            <span>↪</span>
                            Sign Out
                        </button>

                    </div>

                </section>

            </main>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<Login />} />

                <Route path="/dashboard" element={<Dashboard />} />

                <Route path="/assets" element={<Assets />} />

                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;