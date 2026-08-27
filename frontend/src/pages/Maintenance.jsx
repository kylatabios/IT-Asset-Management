import { useState } from "react";
import "./Maintenance.css";

function Maintenance() {
    const [records, setRecords] = useState([
        {
            id: 1,
            asset: "HP LaserJet Pro",
            assetId: "IT-2026-003",
            type: "Repair",
            assignedTo: "IT Department",
            date: "2026-08-20",
            status: "In Progress"
        },
        {
            id: 2,
            asset: "Dell OptiPlex 7090",
            assetId: "IT-2026-001",
            type: "Preventive",
            assignedTo: "John Smith",
            date: "2026-08-18",
            status: "Completed"
        },
        {
            id: 3,
            asset: "Cisco Business Router",
            assetId: "IT-2026-005",
            type: "Inspection",
            assignedTo: "IT Department",
            date: "2026-08-15",
            status: "Pending"
        }
    ]);

    const [showModal, setShowModal] = useState(false);

    const [form, setForm] = useState({
        asset: "",
        assetId: "",
        type: "Repair",
        assignedTo: "",
        date: "",
        status: "Pending"
    });

    const completed = records.filter(
        (item) => item.status === "Completed"
    ).length;

    const inProgress = records.filter(
        (item) => item.status === "In Progress"
    ).length;

    const pending = records.filter(
        (item) => item.status === "Pending"
    ).length;

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (
            !form.asset.trim() ||
            !form.assetId.trim() ||
            !form.assignedTo.trim() ||
            !form.date
        ) {
            return;
        }

        const newRecord = {
            id:
                records.length > 0
                    ? Math.max(...records.map((item) => item.id)) + 1
                    : 1,
            asset: form.asset.trim(),
            assetId: form.assetId.trim(),
            type: form.type,
            assignedTo: form.assignedTo.trim(),
            date: form.date,
            status: form.status
        };

        setRecords((previous) => [...previous, newRecord]);

        setForm({
            asset: "",
            assetId: "",
            type: "Repair",
            assignedTo: "",
            date: "",
            status: "Pending"
        });

        setShowModal(false);
    };

    const handleDelete = (id) => {
        const record = records.find((item) => item.id === id);

        if (!record) return;

        const confirmed = window.confirm(
            `Delete maintenance record for ${record.asset}?`
        );

        if (!confirmed) return;

        setRecords((previous) =>
            previous.filter((item) => item.id !== id)
        );
    };

    const getStatusClass = (status) => {
        if (status === "Completed") {
            return "status-completed";
        }

        if (status === "In Progress") {
            return "status-progress";
        }

        return "status-pending";
    };

    return (
        <main className="maintenance-page">

            {/* HEADER */}
            <header className="maintenance-header">
                <div>
                    <h1>Maintenance</h1>
                    <p>
                        Track and manage asset maintenance records.
                    </p>
                </div>

                <button
                    className="maintenance-primary-btn"
                    onClick={() => setShowModal(true)}
                >
                    <span>+</span>
                    Add Maintenance
                </button>
            </header>

            {/* STATISTICS */}
            <section className="maintenance-stats">

                <div className="maintenance-stat-card completed">
                    <div className="maintenance-stat-icon">
                        ✓
                    </div>

                    <div>
                        <span>Completed</span>
                        <strong>{completed}</strong>
                        <small>Completed records</small>
                    </div>
                </div>

                <div className="maintenance-stat-card progress">
                    <div className="maintenance-stat-icon">
                        ↻
                    </div>

                    <div>
                        <span>In Progress</span>
                        <strong>{inProgress}</strong>
                        <small>Currently being handled</small>
                    </div>
                </div>

                <div className="maintenance-stat-card pending">
                    <div className="maintenance-stat-icon">
                        !
                    </div>

                    <div>
                        <span>Pending</span>
                        <strong>{pending}</strong>
                        <small>Waiting for action</small>
                    </div>
                </div>

            </section>

            {/* MAIN CARD */}
            <section className="maintenance-card">

                <div className="maintenance-card-header">
                    <div>
                        <h2>Maintenance Records</h2>
                        <p>
                            View and manage asset maintenance activities.
                        </p>
                    </div>

                    <div className="maintenance-record-count">
                        {records.length} Records
                    </div>
                </div>

                {/* DESKTOP TABLE */}
                <div className="maintenance-table">

                    <div className="maintenance-table-head">
                        <span>Asset</span>
                        <span>Type</span>
                        <span>Assigned To</span>
                        <span>Date</span>
                        <span>Status</span>
                        <span>Actions</span>
                    </div>

                    {records.length === 0 ? (
                        <div className="maintenance-empty">
                            <div className="maintenance-empty-icon">
                                M
                            </div>

                            <strong>No maintenance records</strong>

                            <span>
                                Add a maintenance record to get started.
                            </span>

                            <button
                                onClick={() => setShowModal(true)}
                            >
                                Add Maintenance
                            </button>
                        </div>
                    ) : (
                        records.map((record) => (
                            <div
                                className="maintenance-row"
                                key={record.id}
                            >

                                <div className="maintenance-asset">
                                    <div className="maintenance-asset-icon">
                                        {record.type === "Repair"
                                            ? "R"
                                            : record.type === "Preventive"
                                                ? "P"
                                                : "I"}
                                    </div>

                                    <div>
                                        <strong>
                                            {record.asset}
                                        </strong>

                                        <small>
                                            {record.assetId}
                                        </small>
                                    </div>
                                </div>

                                <div className="maintenance-detail">
                                    <span className="mobile-label">
                                        Type
                                    </span>

                                    <span>
                                        {record.type}
                                    </span>
                                </div>

                                <div className="maintenance-detail">
                                    <span className="mobile-label">
                                        Assigned To
                                    </span>

                                    <span>
                                        {record.assignedTo}
                                    </span>
                                </div>

                                <div className="maintenance-detail">
                                    <span className="mobile-label">
                                        Date
                                    </span>

                                    <span>
                                        {record.date}
                                    </span>
                                </div>

                                <div className="maintenance-detail">
                                    <span className="mobile-label">
                                        Status
                                    </span>

                                    <span
                                        className={`maintenance-status ${getStatusClass(
                                            record.status
                                        )}`}
                                    >
                                        <span className="status-dot"></span>
                                        {record.status}
                                    </span>
                                </div>

                                <div className="maintenance-actions">
                                    <button
                                        className="maintenance-delete-btn"
                                        onClick={() =>
                                            handleDelete(record.id)
                                        }
                                    >
                                        Delete
                                    </button>
                                </div>

                            </div>
                        ))
                    )}

                </div>

            </section>

            {/* MODAL */}
            {showModal && (
                <div
                    className="maintenance-modal-overlay"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) {
                            setShowModal(false);
                        }
                    }}
                >

                    <div className="maintenance-modal">

                        <div className="maintenance-modal-header">

                            <div className="maintenance-modal-title">
                                <div className="maintenance-modal-icon">
                                    M
                                </div>

                                <div>
                                    <h2>Add Maintenance</h2>
                                    <p>
                                        Enter the maintenance details.
                                    </p>
                                </div>
                            </div>

                            <button
                                className="maintenance-modal-close"
                                onClick={() => setShowModal(false)}
                            >
                                ×
                            </button>

                        </div>

                        <form
                            className="maintenance-form"
                            onSubmit={handleSubmit}
                        >

                            <div className="maintenance-form-group">
                                <label>Asset Name</label>

                                <input
                                    name="asset"
                                    value={form.asset}
                                    onChange={handleChange}
                                    placeholder="e.g. HP LaserJet Pro"
                                    required
                                />
                            </div>

                            <div className="maintenance-form-group">
                                <label>Asset ID</label>

                                <input
                                    name="assetId"
                                    value={form.assetId}
                                    onChange={handleChange}
                                    placeholder="e.g. IT-2026-003"
                                    required
                                />
                            </div>

                            <div className="maintenance-form-row">

                                <div className="maintenance-form-group">
                                    <label>Maintenance Type</label>

                                    <select
                                        name="type"
                                        value={form.type}
                                        onChange={handleChange}
                                    >
                                        <option>
                                            Repair
                                        </option>

                                        <option>
                                            Preventive
                                        </option>

                                        <option>
                                            Inspection
                                        </option>
                                    </select>
                                </div>

                                <div className="maintenance-form-group">
                                    <label>Status</label>

                                    <select
                                        name="status"
                                        value={form.status}
                                        onChange={handleChange}
                                    >
                                        <option>
                                            Pending
                                        </option>

                                        <option>
                                            In Progress
                                        </option>

                                        <option>
                                            Completed
                                        </option>
                                    </select>
                                </div>

                            </div>

                            <div className="maintenance-form-group">
                                <label>Assigned To</label>

                                <input
                                    name="assignedTo"
                                    value={form.assignedTo}
                                    onChange={handleChange}
                                    placeholder="e.g. IT Department"
                                    required
                                />
                            </div>

                            <div className="maintenance-form-group">
                                <label>Maintenance Date</label>

                                <input
                                    type="date"
                                    name="date"
                                    value={form.date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="maintenance-modal-actions">

                                <button
                                    type="button"
                                    className="maintenance-cancel-btn"
                                    onClick={() =>
                                        setShowModal(false)
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="maintenance-save-btn"
                                >
                                    Add Maintenance
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </main>
    );
}

export default Maintenance;