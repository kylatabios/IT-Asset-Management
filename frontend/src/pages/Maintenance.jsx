import { useEffect, useState } from "react";
import "./Maintenance.css";

const API_URL = "http://localhost:5000/api/maintenance";
const ASSETS_API_URL = "http://localhost:5000/api/assets";

function Maintenance() {
    const [records, setRecords] = useState([]);
    const [assets, setAssets] = useState([]);

    const [showModal, setShowModal] = useState(false);

    const [loading, setLoading] = useState(true);
    const [loadingAssets, setLoadingAssets] = useState(false);

    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const [error, setError] = useState("");

    const [form, setForm] = useState({
        asset: "",
        assetId: "",
        type: "Repair",
        assignedTo: "",
        date: "",
        status: "Pending"
    });

    useEffect(() => {
        fetchMaintenance();
        fetchAssets();
    }, []);

    const fetchMaintenance = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(API_URL);
            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Failed to load maintenance records"
                );
            }

            setRecords(data.maintenance || []);
        } catch (error) {
            console.error("Fetch maintenance error:", error);
            setError("Failed to load maintenance records.");
        } finally {
            setLoading(false);
        }
    };

    const fetchAssets = async () => {
        try {
            setLoadingAssets(true);

            const response = await fetch(ASSETS_API_URL);
            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Failed to load assets"
                );
            }

            setAssets(data.assets || []);
        } catch (error) {
            console.error("Fetch assets error:", error);
            setError("Failed to load assets.");
        } finally {
            setLoadingAssets(false);
        }
    };

    const completed = records.filter(
        (item) => item.Status === "Completed"
    ).length;

    const inProgress = records.filter(
        (item) => item.Status === "In Progress"
    ).length;

    const pending = records.filter(
        (item) => item.Status === "Pending"
    ).length;

    const handleAssetChange = (e) => {
        const assetTag = e.target.value;

        const selectedAsset = assets.find(
            (asset) => asset.AssetTag === assetTag
        );

        if (!selectedAsset) {
            setForm((previous) => ({
                ...previous,
                asset: "",
                assetId: ""
            }));

            return;
        }

        setForm((previous) => ({
            ...previous,
            asset: selectedAsset.AssetName,
            assetId: selectedAsset.AssetTag
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const resetForm = () => {
        setForm({
            asset: "",
            assetId: "",
            type: "Repair",
            assignedTo: "",
            date: "",
            status: "Pending"
        });
    };

    const openAddModal = () => {
        setError("");
        resetForm();
        setShowModal(true);

        if (assets.length === 0) {
            fetchAssets();
        }
    };

    const closeModal = () => {
        if (saving) return;

        setShowModal(false);
        resetForm();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !form.asset ||
            !form.assetId ||
            !form.assignedTo.trim() ||
            !form.date
        ) {
            setError("Please complete all required fields.");
            return;
        }

        try {
            setSaving(true);
            setError("");

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    asset: form.asset,
                    assetId: form.assetId,
                    type: form.type,
                    assignedTo: form.assignedTo.trim(),
                    date: form.date,
                    status: form.status
                })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message ||
                    "Failed to create maintenance record"
                );
            }

            setRecords((previous) => [
                data.maintenance,
                ...previous
            ]);

            resetForm();
            setShowModal(false);

        } catch (error) {
            console.error(
                "Create maintenance error:",
                error
            );

            setError(
                error.message ||
                "Failed to create maintenance record."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        const record = records.find(
            (item) => item.Id === id
        );

        if (!record) return;

        const confirmed = window.confirm(
            `Delete maintenance record for ${record.Asset}?`
        );

        if (!confirmed) return;

        try {
            setDeletingId(id);
            setError("");

            const response = await fetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message ||
                    "Failed to delete maintenance record"
                );
            }

            setRecords((previous) =>
                previous.filter(
                    (item) => item.Id !== id
                )
            );

        } catch (error) {
            console.error(
                "Delete maintenance error:",
                error
            );

            setError(
                error.message ||
                "Failed to delete maintenance record."
            );
        } finally {
            setDeletingId(null);
        }
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

    const getTypeIcon = (type) => {
        if (type === "Repair") {
            return "R";
        }

        if (type === "Preventive") {
            return "P";
        }

        return "I";
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
                    onClick={openAddModal}
                >
                    <span>+</span>
                    Add Maintenance
                </button>
            </header>

            {/* ERROR */}
            {error && (
                <div
                    style={{
                        marginBottom: "20px",
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

            {/* STATISTICS */}
            <section className="maintenance-stats">

                <div className="maintenance-stat-card completed">
                    <div className="maintenance-stat-icon">
                        ✓
                    </div>

                    <div>
                        <span>Completed</span>

                        <strong>
                            {completed}
                        </strong>

                        <small>
                            Completed records
                        </small>
                    </div>
                </div>

                <div className="maintenance-stat-card progress">
                    <div className="maintenance-stat-icon">
                        ↻
                    </div>

                    <div>
                        <span>In Progress</span>

                        <strong>
                            {inProgress}
                        </strong>

                        <small>
                            Currently being handled
                        </small>
                    </div>
                </div>

                <div className="maintenance-stat-card pending">
                    <div className="maintenance-stat-icon">
                        !
                    </div>

                    <div>
                        <span>Pending</span>

                        <strong>
                            {pending}
                        </strong>

                        <small>
                            Waiting for action
                        </small>
                    </div>
                </div>

            </section>

            {/* MAIN CARD */}
            <section className="maintenance-card">

                <div className="maintenance-card-header">

                    <div>
                        <h2>
                            Maintenance Records
                        </h2>

                        <p>
                            View and manage asset maintenance activities.
                        </p>
                    </div>

                    <div className="maintenance-record-count">
                        {records.length} Records
                    </div>

                </div>

                {/* TABLE */}
                <div className="maintenance-table">

                    <div className="maintenance-table-head">
                        <span>Asset</span>
                        <span>Type</span>
                        <span>Assigned To</span>
                        <span>Date</span>
                        <span>Status</span>
                        <span>Actions</span>
                    </div>

                    {loading ? (

                        <div className="maintenance-empty">

                            <div className="maintenance-empty-icon">
                                M
                            </div>

                            <strong>
                                Loading maintenance records...
                            </strong>

                            <span>
                                Please wait while the records are being loaded.
                            </span>

                        </div>

                    ) : records.length === 0 ? (

                        <div className="maintenance-empty">

                            <div className="maintenance-empty-icon">
                                M
                            </div>

                            <strong>
                                No maintenance records
                            </strong>

                            <span>
                                Add a maintenance record to get started.
                            </span>

                            <button
                                onClick={openAddModal}
                            >
                                Add Maintenance
                            </button>

                        </div>

                    ) : (

                        records.map((record) => (

                            <div
                                className="maintenance-row"
                                key={record.Id}
                            >

                                {/* ASSET */}
                                <div className="maintenance-asset">

                                    <div className="maintenance-asset-icon">
                                        {getTypeIcon(record.Type)}
                                    </div>

                                    <div>

                                        <strong>
                                            {record.Asset}
                                        </strong>

                                        <small>
                                            {record.AssetId}
                                        </small>

                                    </div>

                                </div>

                                {/* TYPE */}
                                <div className="maintenance-detail">

                                    <span className="mobile-label">
                                        Type
                                    </span>

                                    <span>
                                        {record.Type}
                                    </span>

                                </div>

                                {/* ASSIGNED TO */}
                                <div className="maintenance-detail">

                                    <span className="mobile-label">
                                        Assigned To
                                    </span>

                                    <span>
                                        {record.AssignedTo}
                                    </span>

                                </div>

                                {/* DATE */}
                                <div className="maintenance-detail">

                                    <span className="mobile-label">
                                        Date
                                    </span>

                                    <span>
                                        {record.Date
                                            ? record.Date.substring(0, 10)
                                            : ""}
                                    </span>

                                </div>

                                {/* STATUS */}
                                <div className="maintenance-detail">

                                    <span className="mobile-label">
                                        Status
                                    </span>

                                    <span
                                        className={`maintenance-status ${getStatusClass(
                                            record.Status
                                        )}`}
                                    >
                                        <span className="status-dot"></span>

                                        {record.Status}
                                    </span>

                                </div>

                                {/* ACTIONS */}
                                <div className="maintenance-actions">

                                    <button
                                        className="maintenance-delete-btn"
                                        onClick={() =>
                                            handleDelete(record.Id)
                                        }
                                        disabled={
                                            deletingId === record.Id
                                        }
                                    >
                                        {deletingId === record.Id
                                            ? "Deleting..."
                                            : "Delete"}
                                    </button>

                                </div>

                            </div>

                        ))

                    )}

                </div>

            </section>

            {/* ADD MAINTENANCE MODAL */}
            {showModal && (

                <div
                    className="maintenance-modal-overlay"
                    onMouseDown={(e) => {

                        if (
                            e.target === e.currentTarget &&
                            !saving
                        ) {
                            closeModal();
                        }

                    }}
                >

                    <div className="maintenance-modal">

                        {/* MODAL HEADER */}
                        <div className="maintenance-modal-header">

                            <div className="maintenance-modal-title">

                                <div className="maintenance-modal-icon">
                                    M
                                </div>

                                <div>

                                    <h2>
                                        Add Maintenance
                                    </h2>

                                    <p>
                                        Enter the maintenance details.
                                    </p>

                                </div>

                            </div>

                            <button
                                className="maintenance-modal-close"
                                onClick={closeModal}
                                disabled={saving}
                            >
                                ×
                            </button>

                        </div>

                        {/* FORM */}
                        <form
                            className="maintenance-form"
                            onSubmit={handleSubmit}
                        >

                            {/* ASSET */}
                            <div className="maintenance-form-group">

                                <label>
                                    Asset
                                </label>

                                <select
                                    value={form.assetId}
                                    onChange={handleAssetChange}
                                    required
                                    disabled={
                                        saving ||
                                        loadingAssets
                                    }
                                >

                                    <option value="">
                                        {loadingAssets
                                            ? "Loading assets..."
                                            : assets.length === 0
                                                ? "No assets available"
                                                : "Select an asset"}
                                    </option>

                                    {assets.map((asset) => (

                                        <option
                                            key={asset.Id}
                                            value={asset.AssetTag}
                                        >
                                            {asset.AssetName} - {asset.AssetTag}
                                        </option>

                                    ))}

                                </select>

                            </div>

                            {/* SELECTED ASSET */}
                            {form.assetId && (

                                <div
                                    style={{
                                        padding: "12px 14px",
                                        borderRadius: "10px",
                                        background: "#f8fafc",
                                        border: "1px solid #e2e8f0",
                                        fontSize: "13px",
                                        color: "#475569"
                                    }}
                                >

                                    <strong>
                                        Selected Asset
                                    </strong>

                                    <div
                                        style={{
                                            marginTop: "4px"
                                        }}
                                    >
                                        {form.asset}
                                    </div>

                                    <div
                                        style={{
                                            marginTop: "2px"
                                        }}
                                    >
                                        Asset Tag: {form.assetId}
                                    </div>

                                </div>

                            )}

                            {/* TYPE + STATUS */}
                            <div className="maintenance-form-row">

                                <div className="maintenance-form-group">

                                    <label>
                                        Maintenance Type
                                    </label>

                                    <select
                                        name="type"
                                        value={form.type}
                                        onChange={handleChange}
                                        disabled={saving}
                                    >

                                        <option value="Repair">
                                            Repair
                                        </option>

                                        <option value="Preventive">
                                            Preventive
                                        </option>

                                        <option value="Inspection">
                                            Inspection
                                        </option>

                                    </select>

                                </div>

                                <div className="maintenance-form-group">

                                    <label>
                                        Status
                                    </label>

                                    <select
                                        name="status"
                                        value={form.status}
                                        onChange={handleChange}
                                        disabled={saving}
                                    >

                                        <option value="Pending">
                                            Pending
                                        </option>

                                        <option value="In Progress">
                                            In Progress
                                        </option>

                                        <option value="Completed">
                                            Completed
                                        </option>

                                    </select>

                                </div>

                            </div>

                            {/* ASSIGNED TO */}
                            <div className="maintenance-form-group">

                                <label>
                                    Assigned To
                                </label>

                                <input
                                    name="assignedTo"
                                    value={form.assignedTo}
                                    onChange={handleChange}
                                    placeholder="e.g. IT Department"
                                    required
                                    disabled={saving}
                                />

                            </div>

                            {/* DATE */}
                            <div className="maintenance-form-group">

                                <label>
                                    Maintenance Date
                                </label>

                                <input
                                    type="date"
                                    name="date"
                                    value={form.date}
                                    onChange={handleChange}
                                    required
                                    disabled={saving}
                                />

                            </div>

                            {/* ACTIONS */}
                            <div className="maintenance-modal-actions">

                                <button
                                    type="button"
                                    className="maintenance-cancel-btn"
                                    onClick={closeModal}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="maintenance-save-btn"
                                    disabled={
                                        saving ||
                                        loadingAssets ||
                                        !form.assetId
                                    }
                                >
                                    {saving
                                        ? "Saving..."
                                        : "Add Maintenance"}
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