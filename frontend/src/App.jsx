import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import "./App.css";

import Sidebar from "./components/Sidebar";
import Assets from "./pages/Assets";
import Users from "./pages/Users";
import Maintenance from "./pages/Maintenance";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";


/* ============================================
   Login Page
   ============================================ */

function Login() {
    return (
        <div className="login-page">
            <div className="login-card">

                <div className="brand">
                    <div className="brand-icon">
                        IT
                    </div>

                    <div>
                        <h1>IT Asset Management</h1>
                        <span>Management System</span>
                    </div>
                </div>

                <div className="login-header">
                    <h2>Welcome back</h2>
                    <p>
                        Sign in to access your account.
                    </p>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        window.location.href = "/dashboard";
                    }}
                >
                    <div className="form-group">
                        <label>
                            Email Address
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            Password
                        </label>

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


/* ============================================
   Dashboard Home
   ============================================ */

function DashboardHome() {
    return (
        <div className="dashboard-home">

            {/* Dashboard Header */}

            <header className="dashboard-header">
                <div>
                    <h1>
                        Dashboard
                    </h1>

                    <p>
                        Overview of your IT asset management system.
                    </p>
                </div>

                <button className="notification-btn">
                    Notifications
                </button>
            </header>


            {/* Statistics */}

            <section className="stats-grid">

                <div className="stat-card">
                    <div className="stat-icon blue">
                        A
                    </div>

                    <div>
                        <span>
                            Total Assets
                        </span>

                        <h2>
                            128
                        </h2>

                        <small>
                            All registered assets
                        </small>
                    </div>
                </div>


                <div className="stat-card">
                    <div className="stat-icon green">
                        A
                    </div>

                    <div>
                        <span>
                            Active Assets
                        </span>

                        <h2>
                            112
                        </h2>

                        <small>
                            Currently in use
                        </small>
                    </div>
                </div>


                <div className="stat-card">
                    <div className="stat-icon orange">
                        M
                    </div>

                    <div>
                        <span>
                            Maintenance
                        </span>

                        <h2>
                            10
                        </h2>

                        <small>
                            Needs attention
                        </small>
                    </div>
                </div>


                <div className="stat-card">
                    <div className="stat-icon red">
                        U
                    </div>

                    <div>
                        <span>
                            Unavailable
                        </span>

                        <h2>
                            6
                        </h2>

                        <small>
                            Not currently available
                        </small>
                    </div>
                </div>

            </section>


            {/* Dashboard Content */}

            <section className="dashboard-content">

                {/* Recent Assets */}

                <div className="content-card">

                    <div className="card-header">
                        <div>
                            <h2>
                                Recent Assets
                            </h2>

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

                        {/* Table Header */}

                        <div className="table-row table-head">
                            <span>
                                Asset
                            </span>

                            <span>
                                Category
                            </span>

                            <span>
                                Status
                            </span>

                            <span>
                                Assigned To
                            </span>
                        </div>


                        {/* Asset 1 */}

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

                            <span>
                                Desktop
                            </span>

                            <span className="status active-status">
                                Active
                            </span>

                            <span>
                                John Smith
                            </span>

                        </div>


                        {/* Asset 2 */}

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

                            <span>
                                Laptop
                            </span>

                            <span className="status active-status">
                                Active
                            </span>

                            <span>
                                Maria Santos
                            </span>

                        </div>


                        {/* Asset 3 */}

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

                            <span>
                                Printer
                            </span>

                            <span className="status maintenance-status">
                                Maintenance
                            </span>

                            <span>
                                IT Department
                            </span>

                        </div>

                    </div>

                </div>


                {/* Quick Actions */}

                <div className="content-card quick-actions">

                    <div className="card-header">

                        <div>
                            <h2>
                                Quick Actions
                            </h2>

                            <p>
                                Common management tasks
                            </p>
                        </div>

                    </div>


                    <a
                        href="/assets"
                        className="quick-action-btn"
                    >
                        <span>
                            +
                        </span>

                        Add New Asset
                    </a>


                    <a
                        href="/users"
                        className="quick-action-btn"
                    >
                        <span>
                            U
                        </span>

                        Manage Users
                    </a>


                    <a
                        href="/reports"
                        className="quick-action-btn"
                    >
                        <span>
                            R
                        </span>

                        Generate Report
                    </a>

                </div>

            </section>

        </div>
    );
}


/* ============================================
   System Layout
   ============================================ */

function SystemLayout() {
    return (
        <div className="dashboard-page">

            <Sidebar />

            <main className="dashboard-main">

                <Routes>

                    {/* Dashboard */}

                    <Route
                        path="/dashboard"
                        element={
                            <DashboardHome />
                        }
                    />


                    {/* Assets */}

                    <Route
                        path="/assets"
                        element={
                            <Assets />
                        }
                    />


                    {/* Users */}

                    <Route
                        path="/users"
                        element={
                            <Users />
                        }
                    />


                    {/* Maintenance */}

                    <Route
                        path="/maintenance"
                        element={
                            <Maintenance />
                        }
                    />


                    {/* Reports */}

                    <Route
                        path="/reports"
                        element={
                            <Reports />
                        }
                    />


                    {/* Settings */}

                    <Route
                        path="/settings"
                        element={
                            <Settings />
                        }
                    />


                    {/* Unknown route */}

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


/* ============================================
   Main App
   ============================================ */

function App() {
    return (
        <BrowserRouter>

            <Routes>

                {/* Login */}

                <Route
                    path="/"
                    element={
                        <Login />
                    }
                />


                {/* System */}

                <Route
                    path="/*"
                    element={
                        <SystemLayout />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}


export default App;