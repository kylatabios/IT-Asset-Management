import { useState } from "react";
import "./Reports.css";

function Reports() {
    const [reportType, setReportType] = useState("Asset Report");

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
        },
        {
            id: "IT-2026-004",
            name: "Dell UltraSharp U2722D",
            category: "Monitor",
            status: "Active",
            assignedTo: "James Wilson"
        },
        {
            id: "IT-2026-005",
            name: "Cisco Business Router",
            category: "Network",
            status: "Unavailable",
            assignedTo: "IT Department"
        }
    ];

    const generateReport = () => {
        window.print();
    };

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

                    <span>{assets.length} records</span>
                </div>

                <div className="reports-table">
                    <div className="reports-table-head">
                        <span>Asset ID</span>
                        <span>Asset</span>
                        <span>Category</span>
                        <span>Status</span>
                        <span>Assigned To</span>
                    </div>

                    {assets.map((asset) => (
                        <div
                            className="reports-row"
                            key={asset.id}
                        >
                            <span>{asset.id}</span>
                            <strong>{asset.name}</strong>
                            <span>{asset.category}</span>
                            <span>{asset.status}</span>
                            <span>{asset.assignedTo}</span>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}

export default Reports;