import { useNavigate } from "react-router-dom";

function Assets() {
    const navigate = useNavigate();

    const assets = [
        {
            id: "IT-2026-001",
            name: "Dell OptiPlex 7090",
            category: "Desktop",
            status: "Active",
            assignedTo: "John Smith"
        },
        {
            id: "IT-2026-002",
            name: "Lenovo ThinkPad E14",
            category: "Laptop",
            status: "Active",
            assignedTo: "Maria Santos"
        },
        {
            id: "IT-2026-003",
            name: "HP LaserJet Pro",
            category: "Printer",
            status: "Maintenance",
            assignedTo: "IT Department"
        }
    ];

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

                    <a onClick={() => navigate("/dashboard")}>
                        <span>▦</span>
                        Dashboard
                    </a>

                    <a className="active">
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
                        <h1>Assets</h1>
                        <p>Manage all registered IT assets.</p>
                    </div>

                    <button
                        className="signin-btn"
                        style={{ width: "auto", padding: "0 20px" }}
                    >
                        Add New Asset
                    </button>
                </header>

                <div className="content-card">

                    <div className="card-header">
                        <div>
                            <h2>Asset List</h2>
                            <p>View and manage your IT equipment.</p>
                        </div>
                    </div>

                    <div className="asset-table">

                        <div className="table-row table-head">
                            <span>Asset</span>
                            <span>Category</span>
                            <span>Status</span>
                            <span>Assigned To</span>
                        </div>

                        {assets.map((asset) => (
                            <div className="table-row" key={asset.id}>

                                <div className="asset-name">
                                    <div className="asset-icon">
                                        {asset.category === "Laptop"
                                            ? "LT"
                                            : asset.category === "Printer"
                                            ? "PR"
                                            : "PC"}
                                    </div>

                                    <div>
                                        <strong>{asset.name}</strong>
                                        <small>{asset.id}</small>
                                    </div>
                                </div>

                                <span>{asset.category}</span>

                                <span
                                    className={
                                        asset.status === "Active"
                                            ? "status active-status"
                                            : "status maintenance-status"
                                    }
                                >
                                    {asset.status}
                                </span>

                                <span>{asset.assignedTo}</span>

                            </div>
                        ))}

                    </div>

                </div>

            </main>
        </div>
    );
}

export default Assets;