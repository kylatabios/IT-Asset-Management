import { useEffect, useState } from "react";
import "./Reports.css";

const ASSETS_API_URL = "http://localhost:5000/api/assets";
const MAINTENANCE_API_URL = "http://localhost:5000/api/maintenance";
const USERS_API_URL = "http://localhost:5000/api/users";

function Reports() {
    const [reportType, setReportType] = useState("Asset Report");

    const [assets, setAssets] = useState([]);
    const [maintenance, setMaintenance] = useState([]);
    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadAllData();
    }, []);

    const loadAllData = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                assetsResponse,
                maintenanceResponse,
                usersResponse
            ] = await Promise.all([
                fetch(ASSETS_API_URL),
                fetch(MAINTENANCE_API_URL),
                fetch(USERS_API_URL)
            ]);

            const assetsData = await assetsResponse.json();
            const maintenanceData = await maintenanceResponse.json();
            const usersData = await usersResponse.json();

            if (!assetsResponse.ok || !assetsData.success) {
                throw new Error(
                    assetsData.message || "Failed to load assets"
                );
            }

            if (!maintenanceResponse.ok || !maintenanceData.success) {
                throw new Error(
                    maintenanceData.message ||
                    "Failed to load maintenance records"
                );
            }

            if (!usersResponse.ok) {
                throw new Error("Failed to load users");
            }

            setAssets(assetsData.assets || []);
            setMaintenance(maintenanceData.maintenance || []);
            setUsers(usersData.users || []);
        } catch (err) {
            console.error("Reports data error:", err);
            setError("Failed to load report data.");
        } finally {
            setLoading(false);
        }
    };

    const generateReport = () => {
        window.print();
    };

    const formatDate = (value) => {
        if (!value) return "—";
        return value.substring(0, 10);
    };

    // Column headers per report type
    const columnsByType = {
        "Asset Report": [
            "Asset ID",
            "Asset",
            "Category",
            "Status",
            "Assigned To",
            "Purchase Date"
        ],
        "Maintenance Report": [
            "Asset",
            "Type",
            "Assigned To",
            "Date",
            "Status"
        ],
        "User Report": [
            "User",
            "Email",
            "Date Created"
        ]
    };

    const columns = columnsByType[reportType];

    // Row data per report type
    const rowsByType = {
        "Asset Report": assets.map((asset) => ({
            key: asset.Id,
            cells: [
                asset.AssetTag,
                asset.AssetName,
                asset.Category,
                asset.Status,
                asset.AssignedTo || "Unassigned",
                formatDate(asset.PurchaseDate)
            ]
        })),
        "Maintenance Report": maintenance.map((record) => ({
            key: record.Id,
            cells: [
                record.Asset,
                record.Type,
                record.AssignedTo,
                formatDate(record.Date),
                record.Status
            ]
        })),
        "User Report": users.map((user) => ({
            key: user.Id,
            cells: [
                user.FullName,
                user.Email,
                user.CreatedAt
                    ? new Date(user.CreatedAt).toLocaleDateString()
                    : "—"
            ]
        }))
    };

    const rows = rowsByType[reportType];

    return (
        <main className="reports-page">
            <header className="reports-header">
                <div>
                    <h1>Reports</h1>
                    <p>Generate simple reports for the IT asset system.</p>
                </div>
            </header>

            <section className="reports-card">
                <div className="reports-card-header">
                    <div>
                        <h2>Generate Report</h2>
                        <p>Select a report type to generate.</p>
                    </div>
                </div>

                <div className="reports-form">
                    <div className="reports-form-group">
                        <label>Report Type</label>

                        <select
                            value={reportType}
                            onChange={(e) =>
                                setReportType(e.target.value)
                            }
                        >
                            <option>Asset Report</option>
                            <option>Maintenance Report</option>
                            <option>User Report</option>
                        </select>
                    </div>

                    <button
                        className="reports-generate-btn"
                        onClick={generateReport}
                    >
                        Generate Report
                    </button>
                </div>
            </section>

            <section className="reports-card report-preview">
                <div className="reports-preview-header">
                    <div>
                        <h2>{reportType}</h2>
                        <p>IT Asset Management System</p>
                    </div>

                    <span>{loading ? "..." : `${rows.length} records`}</span>
                </div>

                {error && (
                    <div
                        style={{
                            margin: "0 0 16px",
                            padding: "12px 16px",
                            borderRadius: "10px",
                            background: "#fee2e2",
                            color: "#b91c1c",
                            fontSize: "14px"
                        }}
                    >
                        {error}
                    </div>
                )}

                <div className="reports-table">
                    <div className="reports-table-head">
                        {columns.map((col) => (
                            <span key={col}>{col}</span>
                        ))}
                    </div>

                    {loading ? (
                        <div className="reports-row">
                            <span>Loading data...</span>
                        </div>
                    ) : rows.length === 0 ? (
                        <div className="reports-row">
                            <span>No records found.</span>
                        </div>
                    ) : (
                        rows.map((row) => (
                            <div
                                className="reports-row"
                                key={row.key}
                            >
                                {row.cells.map((cell, index) => (
                                    index === 0 ? (
                                        <strong key={index}>{cell}</strong>
                                    ) : (
                                        <span key={index}>{cell}</span>
                                    )
                                ))}
                            </div>
                        ))
                    )}
                </div>
            </section>
        </main>
    );
}

export default Reports;