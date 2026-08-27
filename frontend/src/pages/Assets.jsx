import { useState } from "react";
import "./Assets.css";

function Assets() {
    const [assets, setAssets] = useState([
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
    ]);

    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingAsset, setEditingAsset] = useState(null);

    const [form, setForm] = useState({
        name: "",
        category: "Desktop",
        status: "Active",
        assignedTo: ""
    });

    const activeAssets = assets.filter(
        (asset) => asset.status === "Active"
    ).length;

    const maintenanceAssets = assets.filter(
        (asset) => asset.status === "Maintenance"
    ).length;

    const unavailableAssets = assets.filter(
        (asset) => asset.status === "Unavailable"
    ).length;

    const filteredAssets = assets.filter((asset) => {
        const keyword = search.toLowerCase().trim();

        if (!keyword) {
            return true;
        }

        return (
            asset.id.toLowerCase().includes(keyword) ||
            asset.name.toLowerCase().includes(keyword) ||
            asset.category.toLowerCase().includes(keyword) ||
            asset.status.toLowerCase().includes(keyword) ||
            asset.assignedTo.toLowerCase().includes(keyword)
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
            name: "",
            category: "Desktop",
            status: "Active",
            assignedTo: ""
        });

        setShowModal(true);
    };

    const openEditModal = (asset) => {
        setEditingAsset(asset);

        setForm({
            name: asset.name,
            category: asset.category,
            status: asset.status,
            assignedTo:
                asset.assignedTo === "Unassigned"
                    ? ""
                    : asset.assignedTo
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

    const handleSubmit = (e) => {
        e.preventDefault();

        const assetName = form.name.trim();

        if (!assetName) {
            return;
        }

        const assignedPerson =
            form.assignedTo.trim() || "Unassigned";

        if (editingAsset) {
            setAssets((previous) =>
                previous.map((asset) =>
                    asset.id === editingAsset.id
                        ? {
                              ...asset,
                              name: assetName,
                              category: form.category,
                              status: form.status,
                              assignedTo: assignedPerson
                          }
                        : asset
                )
            );
        } else {
            const highestNumber = assets.reduce(
                (highest, asset) => {
                    const number = Number(
                        asset.id.split("-").pop()
                    );

                    return number > highest
                        ? number
                        : highest;
                },
                0
            );

            const newId = `IT-2026-${String(
                highestNumber + 1
            ).padStart(3, "0")}`;

            const newAsset = {
                id: newId,
                name: assetName,
                category: form.category,
                status: form.status,
                assignedTo: assignedPerson
            };

            setAssets((previous) => [
                ...previous,
                newAsset
            ]);
        }

        closeModal();
    };

    const handleDelete = (id) => {
        const asset = assets.find(
            (item) => item.id === id
        );

        if (!asset) {
            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to delete ${asset.name}?`
        );

        if (!confirmed) {
            return;
        }

        setAssets((previous) =>
            previous.filter((item) => item.id !== id)
        );
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

                    {filteredAssets.map((asset) => (
                        <div
                            className="assets-table-row"
                            key={asset.id}
                        >

                            <div className="asset-info">

                                <div
                                    className={`asset-type-icon ${asset.category
                                        .toLowerCase()
                                        .replace(/\s+/g, "-")}`}
                                >
                                    {getAssetIcon(
                                        asset.category
                                    )}
                                </div>

                                <div>
                                    <strong>
                                        {asset.name}
                                    </strong>

                                    <small>
                                        {asset.id}
                                    </small>
                                </div>

                            </div>

                            <div className="asset-category">
                                {asset.category}
                            </div>

                            <div>
                                <span
                                    className={`asset-status ${
                                        asset.status === "Active"
                                            ? "status-active"
                                            : asset.status ===
                                              "Maintenance"
                                            ? "status-maintenance"
                                            : "status-unavailable"
                                    }`}
                                >
                                    <span className="status-dot"></span>
                                    {asset.status}
                                </span>
                            </div>

                            <div className="asset-assigned">
                                {asset.assignedTo}
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
                                        handleDelete(asset.id)
                                    }
                                >
                                    Delete
                                </button>

                            </div>

                        </div>
                    ))}

                    {filteredAssets.length === 0 && (
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
                        if (
                            e.target === e.currentTarget
                        ) {
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

                                <label htmlFor="asset-name">
                                    Asset Name
                                </label>

                                <input
                                    id="asset-name"
                                    type="text"
                                    name="name"
                                    value={form.name}
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