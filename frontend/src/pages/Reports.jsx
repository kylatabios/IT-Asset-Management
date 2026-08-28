import { useEffect, useState } from "react";
import "./Reports.css";

const ASSETS_API_URL = "http://localhost:5000/api/assets";
const MAINTENANCE_API_URL = "http://localhost:5000/api/maintenance";
const USERS_API_URL = "http://localhost:5000/api/users";

function Reports() {
    const [reportType, setReportType] = useState("Asset Inventory Report");

    const [assets, setAssets] = useState([]);
    const [maintenance, setMaintenance] = useState([]);
    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [generatedAt, setGeneratedAt] = useState(new Date());

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

    const formatDate = (value) => {
        if (!value) return "—";
        return value.substring(0, 10);
    };

    const statusClassName = (status) => {
        const normalized = (status || "").toLowerCase();

        if (normalized === "active") return "report-status active";
        if (normalized === "maintenance") return "report-status maintenance";
        if (normalized === "unavailable") return "report-status unavailable";
        if (normalized === "in progress") return "report-status in-progress";
        if (normalized === "completed") return "report-status completed";

        return "report-status default";
    };

    const StatusCell = ({ value }) => (
        <span className={statusClassName(value)}>{value || "—"}</span>
    );

    // ---------------- Report definitions ----------------
    // Only existing fields are referenced (AssetTag, AssetName, Category,
    // Status, AssignedTo, PurchaseDate / Asset, Type, AssignedTo, Date,
    // Status / FullName, Email, CreatedAt) — matches current API responses.

    const reportDefs = {
        "Asset Inventory Report": {
            columns: [
                "Asset Tag",
                "Asset Name",
                "Category",
                "Status",
                "Assigned To",
                "Purchase Date"
            ],
            rows: assets.map((asset) => ({
                key: asset.Id,
                cells: [
                    asset.AssetTag,
                    asset.AssetName,
                    asset.Category,
                    <StatusCell key="status" value={asset.Status} />,
                    asset.AssignedTo || "Unassigned",
                    formatDate(asset.PurchaseDate)
                ]
            }))
        },
        "Asset Assignment Report": {
            columns: [
                "Assigned To",
                "Asset Tag",
                "Asset Name",
                "Category",
                "Status"
            ],
            rows: assets.map((asset) => ({
                key: asset.Id,
                cells: [
                    asset.AssignedTo || "Unassigned",
                    asset.AssetTag,
                    asset.AssetName,
                    asset.Category,
                    <StatusCell key="status" value={asset.Status} />
                ]
            }))
        },
        "Maintenance Report": {
            columns: [
                "Asset",
                "Maintenance Type",
                "Assigned To",
                "Maintenance Date",
                "Status"
            ],
            rows: maintenance.map((record) => ({
                key: record.Id,
                cells: [
                    record.Asset,
                    record.Type,
                    record.AssignedTo,
                    formatDate(record.Date),
                    <StatusCell key="status" value={record.Status} />
                ]
            }))
        },
        "User Report": {
            columns: ["Full Name", "Email", "Date Created"],
            rows: users.map((user) => ({
                key: user.Id,
                cells: [
                    user.FullName,
                    user.Email,
                    user.CreatedAt
                        ? new Date(user.CreatedAt).toLocaleDateString()
                        : "—"
                ]
            }))
        }
    };

    const { columns, rows } = reportDefs[reportType];

    const generateReport = () => {
        setGeneratedAt(new Date());
        // let the new generatedAt value render before the print dialog opens
        setTimeout(() => window.print(), 50);
    };

    return (
        <main className="reports-page reports-print-root">
            <header className="reports-header no-print">
                <div>
                    <h1>Reports</h1>
                    <p>Generate simple reports for the IT asset system.</p>
                </div>
            </header>

            <section className="reports-card no-print">
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
                            <option>Asset Inventory Report</option>
                            <option>Asset Assignment Report</option>
                            <option>Maintenance Report</option>
                            <option>User Report</option>
                        </select>
                    </div>

                    <button
                        className="reports-generate-btn"
                        onClick={generateReport}
                        disabled={loading}
                    >
                        <span className="printer-icon" aria-hidden="true" />
                        Generate Report
                    </button>
                </div>
            </section>

            <section className="reports-card report-preview">
                {/* Visible on screen only */}
                <div className="reports-preview-header no-print">
                    <div>
                        <h2>{reportType}</h2>
                        <p>IT Asset Management System</p>
                    </div>

                    <span>{loading ? "..." : `${rows.length} records`}</span>
                </div>

                {/* Visible on the printed page only */}
                <div className="print-only-header">
                    <div className="print-only-brand">
                        IT Asset Management System
                    </div>
                    <h1>{reportType}</h1>
                    <div className="print-only-meta">
                        <span>
                            Date generated: {generatedAt.toLocaleString()}
                        </span>
                        <span>Total records: {rows.length}</span>
                    </div>
                </div>

                {error && (
                    <div className="reports-error no-print">
                        {error}
                    </div>
                )}

                <div
                    className="reports-table"
                    style={{ "--col-count": columns.length }}
                >
                    <div className="reports-table-head">
                        {columns.map((col) => (
                            <span key={col}>{col}</span>
                        ))}
                    </div>

                    {loading ? (
                        <div className="reports-empty no-print">
                            <strong>Loading data...</strong>
                        </div>
                    ) : rows.length === 0 ? (
                        <div className="reports-empty">
                            <strong>No records found.</strong>
                            <span>
                                There is no data available for this report
                                yet.
                            </span>
                        </div>
                    ) : (
                        rows.map((row) => (
                            <div
                                className="reports-row"
                                key={row.key}
                            >
                                {row.cells.map((cell, index) =>
                                    index === 0 ? (
                                        <strong key={index}>{cell}</strong>
                                    ) : (
                                        <span key={index}>{cell}</span>
                                    )
                                )}
                            </div>
                        ))
                    )}
                </div>
            </section>
        </main>
    );
}

export default Reports;