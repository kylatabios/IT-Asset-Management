import { useEffect, useState } from "react";
import "./Assets.css";

const API_URL = "http://localhost:5000/api/assets";

function Assets() {
    const [assets, setAssets] = useState([]);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingAsset, setEditingAsset] = useState(null);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        assetTag: "",
        assetName: "",
        category: "Desktop",
        brand: "",
        model: "",
        serialNumber: "",
        status: "Active",
        assignedTo: "",
        purchaseDate: ""
    });

    const loadAssets = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();

            if (data.success) {
                setAssets(data.assets);
            }
        } catch (error) {
            console.error("Failed to load assets:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAssets();
    }, []);

    const activeAssets = assets.filter(
        (asset) => asset.Status === "Active"
    ).length;

    const maintenanceAssets = assets.filter(
        (asset) => asset.Status === "Maintenance"
    ).length;

    const unavailableAssets = assets.filter(
        (asset) => asset.Status === "Unavailable"
    ).length;

    const filteredAssets = assets.filter((asset) => {
        const keyword = search.toLowerCase().trim();

        if (!keyword) {
            return true;
        }

        return (
            String(asset.AssetTag || "").toLowerCase().includes(keyword) ||
            String(asset.AssetName || "").toLowerCase().includes(keyword) ||
            String(asset.Category || "").toLowerCase().includes(keyword) ||
            String(asset.Status || "").toLowerCase().includes(keyword) ||
            String(asset.AssignedTo || "").toLowerCase().includes(keyword)
        );
    });

    const getAssetIcon = (category) => {
        switch (category) {
            case "Laptop":
                return "LT";
            case "Printer":
                return "PR";
            case "Monitor":
                return "MN";
            case "Network":
                return "NW";
            default:
                return "PC";
        }
    };

    const openAddModal = () => {
        setEditingAsset(null);

        setForm({
            assetTag: "",
            assetName: "",
            category: "Desktop",
            brand: "",
            model: "",
            serialNumber: "",
            status: "Active",
            assignedTo: "",
            purchaseDate: ""
        });

        setShowModal(true);
    };

    const openEditModal = (asset) => {
        setEditingAsset(asset);

        setForm({
            assetTag: asset.AssetTag || "",
            assetName: asset.AssetName || "",
            category: asset.Category || "Desktop",
            brand: asset.Brand || "",
            model: asset.Model || "",
            serialNumber: asset.SerialNumber || "",
            status: asset.Status || "Active",
            assignedTo: asset.AssignedTo || "",
            purchaseDate: asset.PurchaseDate
                ? asset.PurchaseDate.substring(0, 10)
                : ""
        });

        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingAsset(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.assetName.trim()) {
            return;
        }

        const payload = {
            ...form,
            assetName: form.assetName.trim(),
            assignedTo: form.assignedTo.trim() || null
        };

        try {
            const response = await fetch(
                editingAsset
                    ? `${API_URL}/${editingAsset.Id}`
                    : API_URL,
                {
                    method: editingAsset ? "PUT" : "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                alert(data.message || "Failed to save asset");
                return;
            }

            await loadAssets();
            closeModal();
        } catch (error) {
            console.error("Save asset error:", error);
            alert("Failed to connect to the server");
        }
    };

    const handleDelete = async (id) => {
        const asset = assets.find(
            (item) => item.Id === id
        );

        if (!asset) {
            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to delete ${asset.AssetName}?`
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                alert(data.message || "Failed to delete asset");
                return;
            }

            await loadAssets();
        } catch (error) {
            console.error("Delete asset error:", error);
            alert("Failed to connect to the server");
        }
    };

    return (
        <div className="assets-page">

            <header className="assets-page-header">
                <div>
                    <h1>Assets</h1>
                    <p>
                        Manage and monitor all registered IT assets.
                    </p>
                </div>

                <button
                    className="assets-primary-btn"
                    onClick={openAddModal}
                >
                    <span>+</span>
                    Add New Asset
                </button>
            </header>

            <section className="asset-stats">

                <div className="asset-stat-card total">
                    <div className="asset-stat-icon">
                        A
                    </div>

                    <div>
                        <span>Total Assets</span>
                        <strong>{assets.length}</strong>
                        <small>
                            Registered equipment
                        </small>
                    </div>
                </div>

                <div className="asset-stat-card active">
                    <div className="asset-stat-icon">
                        A
                    </div>

                    <div>
                        <span>Active Assets</span>
                        <strong>{activeAssets}</strong>
                        <small>
                            Currently in use
                        </small>
                    </div>
                </div>

                <div className="asset-stat-card maintenance">
                    <div className="asset-stat-icon">
                        M
                    </div>

                    <div>
                        <span>Maintenance</span>
                        <strong>{maintenanceAssets}</strong>
                        <small>
                            Needs attention
                        </small>
                    </div>
                </div>

                <div className="asset-stat-card unavailable">
                    <div className="asset-stat-icon">
                        U
                    </div>

                    <div>
                        <span>Unavailable</span>
                        <strong>{unavailableAssets}</strong>
                        <small>
                            Not currently available
                        </small>
                    </div>
                </div>

            </section>

            <section className="assets-card">

                <div className="assets-card-header">

                    <div>
                        <h2>Asset List</h2>
                        <p>
                            View and manage your registered IT equipment.
                        </p>
                    </div>

                    <div className="assets-search">

                        <svg
                            width="17"
                            height="17"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <circle
                                cx="11"
                                cy="11"
                                r="7"
                                stroke="currentColor"
                                strokeWidth="2"
                            />

                            <line
                                x1="20"
                                y1="20"
                                x2="16.5"
                                y2="16.5"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>

                        <input
                            type="text"
                            placeholder="Search assets..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                        {search && (
                            <button
                                type="button"
                                className="assets-search-clear"
                                onClick={() => setSearch("")}
                            >
                                ×
                            </button>
                        )}

                    </div>

                </div>

                <div className="assets-table">

                    <div className="assets-table-head">
                        <span>Asset</span>
                        <span>Category</span>
                        <span>Status</span>
                        <span>Assigned To</span>
                        <span>Actions</span>
                    </div>

                    {loading ? (
                        <div className="assets-empty">
                            <strong>Loading assets...</strong>
                        </div>
                    ) : (
                        filteredAssets.map((asset) => (
                            <div
                                className="assets-table-row"
                                key={asset.Id}
                            >

                                <div className="asset-info">

                                    <div
                                        className={`asset-type-icon ${String(
                                            asset.Category || ""
                                        )
                                            .toLowerCase()
                                            .replace(/\s+/g, "-")}`}
                                    >
                                        {getAssetIcon(
                                            asset.Category
                                        )}
                                    </div>

                                    <div>
                                        <strong>
                                            {asset.AssetName}
                                        </strong>

                                        <small>
                                            {asset.AssetTag}
                                        </small>
                                    </div>

                                </div>

                                <div className="asset-category">
                                    {asset.Category}
                                </div>

                                <div>
                                    <span
                                        className={`asset-status ${
                                            asset.Status === "Active"
                                                ? "status-active"
                                                : asset.Status === "Maintenance"
                                                ? "status-maintenance"
                                                : "status-unavailable"
                                        }`}
                                    >
                                        <span className="status-dot"></span>
                                        {asset.Status}
                                    </span>
                                </div>

                                <div className="asset-assigned">
                                    {asset.AssignedTo || "Unassigned"}
                                </div>

                                <div className="asset-actions">

                                    <button
                                        type="button"
                                        className="asset-edit-btn"
                                        onClick={() =>
                                            openEditModal(asset)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        className="asset-delete-btn"
                                        onClick={() =>
                                            handleDelete(asset.Id)
                                        }
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>
                        ))
                    )}

                    {!loading &&
                        filteredAssets.length === 0 && (
                            <div className="assets-empty">
                                <strong>
                                    No assets found
                                </strong>

                                <span>
                                    Try changing your search.
                                </span>
                            </div>
                        )}

                </div>

            </section>

            {showModal && (
                <div
                    className="asset-modal-overlay"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) {
                            closeModal();
                        }
                    }}
                >

                    <div className="asset-modal">

                        <div className="asset-modal-header">

                            <div>
                                <h2>
                                    {editingAsset
                                        ? "Edit Asset"
                                        : "Add New Asset"}
                                </h2>

                                <p>
                                    {editingAsset
                                        ? "Update the asset information."
                                        : "Enter the details for the new asset."}
                                </p>
                            </div>

                            <button
                                type="button"
                                className="modal-close"
                                onClick={closeModal}
                            >
                                ×
                            </button>

                        </div>

                        <form
                            className="asset-form"
                            onSubmit={handleSubmit}
                        >

                            <div className="asset-form-group">
                                <label htmlFor="asset-tag">
                                    Asset Tag
                                </label>

                                <input
                                    id="asset-tag"
                                    type="text"
                                    name="assetTag"
                                    value={form.assetTag}
                                    onChange={handleInputChange}
                                    placeholder="e.g. IT-2026-002"
                                />
                            </div>

                            <div className="asset-form-group">
                                <label htmlFor="asset-name">
                                    Asset Name
                                </label>

                                <input
                                    id="asset-name"
                                    type="text"
                                    name="assetName"
                                    value={form.assetName}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Dell OptiPlex 7090"
                                    required
                                />
                            </div>

                            <div className="asset-form-row">

                                <div className="asset-form-group">
                                    <label htmlFor="asset-category">
                                        Category
                                    </label>

                                    <select
                                        id="asset-category"
                                        name="category"
                                        value={form.category}
                                        onChange={handleInputChange}
                                    >
                                        <option value="Desktop">
                                            Desktop
                                        </option>
                                        <option value="Laptop">
                                            Laptop
                                        </option>
                                        <option value="Printer">
                                            Printer
                                        </option>
                                        <option value="Monitor">
                                            Monitor
                                        </option>
                                        <option value="Network">
                                            Network
                                        </option>
                                    </select>
                                </div>

                                <div className="asset-form-group">
                                    <label htmlFor="asset-status">
                                        Status
                                    </label>

                                    <select
                                        id="asset-status"
                                        name="status"
                                        value={form.status}
                                        onChange={handleInputChange}
                                    >
                                        <option value="Active">
                                            Active
                                        </option>
                                        <option value="Maintenance">
                                            Maintenance
                                        </option>
                                        <option value="Unavailable">
                                            Unavailable
                                        </option>
                                    </select>
                                </div>

                            </div>

                            <div className="asset-form-row">

                                <div className="asset-form-group">
                                    <label htmlFor="asset-brand">
                                        Brand
                                    </label>

                                    <input
                                        id="asset-brand"
                                        type="text"
                                        name="brand"
                                        value={form.brand}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Dell"
                                    />
                                </div>

                                <div className="asset-form-group">
                                    <label htmlFor="asset-model">
                                        Model
                                    </label>

                                    <input
                                        id="asset-model"
                                        type="text"
                                        name="model"
                                        value={form.model}
                                        onChange={handleInputChange}
                                        placeholder="e.g. OptiPlex 7090"
                                    />
                                </div>

                            </div>

                            <div className="asset-form-group">
                                <label htmlFor="asset-serial">
                                    Serial Number
                                </label>

                                <input
                                    id="asset-serial"
                                    type="text"
                                    name="serialNumber"
                                    value={form.serialNumber}
                                    onChange={handleInputChange}
                                    placeholder="e.g. SN-TEST-002"
                                />
                            </div>

                            <div className="asset-form-row">

                                <div className="asset-form-group">
                                    <label htmlFor="asset-assigned">
                                        Assigned To
                                    </label>

                                    <input
                                        id="asset-assigned"
                                        type="text"
                                        name="assignedTo"
                                        value={form.assignedTo}
                                        onChange={handleInputChange}
                                        placeholder="e.g. John Smith"
                                    />
                                </div>

                                <div className="asset-form-group">
                                    <label htmlFor="asset-purchase-date">
                                        Purchase Date
                                    </label>

                                    <input
                                        id="asset-purchase-date"
                                        type="date"
                                        name="purchaseDate"
                                        value={form.purchaseDate}
                                        onChange={handleInputChange}
                                    />
                                </div>

                            </div>

                            <div className="asset-form-actions">

                                <button
                                    type="button"
                                    className="asset-cancel-btn"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="asset-save-btn"
                                >
                                    {editingAsset
                                        ? "Save Changes"
                                        : "Add Asset"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </div>
    );
}

export default Assets;