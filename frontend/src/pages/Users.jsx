import { useState } from "react";
import "./Users.css";

function Users() {
    const [users, setUsers] = useState([
        {
            id: 1,
            name: "John Smith",
            email: "john.smith@company.com",
            department: "IT Department",
            role: "Employee",
            status: "Active"
        },
        {
            id: 2,
            name: "Maria Santos",
            email: "maria.santos@company.com",
            department: "Finance",
            role: "Employee",
            status: "Active"
        },
        {
            id: 3,
            name: "James Wilson",
            email: "james.wilson@company.com",
            department: "Human Resources",
            role: "Employee",
            status: "Active"
        },
        {
            id: 4,
            name: "Sarah Johnson",
            email: "sarah.johnson@company.com",
            department: "Marketing",
            role: "Employee",
            status: "Inactive"
        }
    ]);

    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const [form, setForm] = useState({
        name: "",
        email: "",
        department: "IT Department",
        role: "Employee",
        status: "Active"
    });

    const activeUsers = users.filter(
        (user) => user.status === "Active"
    ).length;

    const inactiveUsers = users.filter(
        (user) => user.status === "Inactive"
    ).length;

    const filteredUsers = users.filter((user) => {
        const keyword = search.toLowerCase().trim();

        return (
            user.name.toLowerCase().includes(keyword) ||
            user.email.toLowerCase().includes(keyword) ||
            user.department.toLowerCase().includes(keyword) ||
            user.role.toLowerCase().includes(keyword) ||
            user.status.toLowerCase().includes(keyword)
        );
    });

    const getAvatarClass = (id) => {
        const classes = [
            "avatar-blue",
            "avatar-purple",
            "avatar-green",
            "avatar-orange",
            "avatar-pink",
            "avatar-cyan"
        ];

        return classes[(id - 1) % classes.length];
    };

    const openAddModal = () => {
        setEditingUser(null);

        setForm({
            name: "",
            email: "",
            department: "IT Department",
            role: "Employee",
            status: "Active"
        });

        setShowModal(true);
    };

    const openEditModal = (user) => {
        setEditingUser(user);

        setForm({
            name: user.name,
            email: user.email,
            department: user.department,
            role: user.role,
            status: user.status
        });

        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingUser(null);
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

        if (!form.name.trim() || !form.email.trim()) {
            return;
        }

        if (editingUser) {
            setUsers((previous) =>
                previous.map((user) =>
                    user.id === editingUser.id
                        ? {
                              ...user,
                              name: form.name.trim(),
                              email: form.email.trim(),
                              department: form.department,
                              role: form.role,
                              status: form.status
                          }
                        : user
                )
            );
        } else {
            const newUser = {
                id:
                    users.length > 0
                        ? Math.max(...users.map((user) => user.id)) + 1
                        : 1,
                name: form.name.trim(),
                email: form.email.trim(),
                department: form.department,
                role: form.role,
                status: form.status
            };

            setUsers((previous) => [...previous, newUser]);
        }

        closeModal();
    };

    const handleDelete = (id) => {
        const user = users.find((item) => item.id === id);

        if (!user) return;

        const confirmed = window.confirm(
            `Delete ${user.name}?`
        );

        if (!confirmed) return;

        setUsers((previous) =>
            previous.filter((item) => item.id !== id)
        );
    };

    return (
        <main className="users-page">

            {/* Page Header */}
            <header className="users-page-header">
                <div>
                    <h1>Users</h1>

                    <p>
                        Manage users and their system access.
                    </p>
                </div>

                <button
                    className="users-primary-btn"
                    onClick={openAddModal}
                >
                    <span>+</span>
                    Add User
                </button>
            </header>

            {/* Statistics */}
            <section className="users-stats">

                <div className="users-stat-card total">
                    <div className="users-stat-icon">
                        U
                    </div>

                    <div>
                        <span>Total Users</span>

                        <strong>
                            {users.length}
                        </strong>

                        <small>
                            Registered accounts
                        </small>
                    </div>
                </div>

                <div className="users-stat-card active">
                    <div className="users-stat-icon">
                        A
                    </div>

                    <div>
                        <span>Active Users</span>

                        <strong>
                            {activeUsers}
                        </strong>

                        <small>
                            Currently active
                        </small>
                    </div>
                </div>

                <div className="users-stat-card inactive">
                    <div className="users-stat-icon">
                        I
                    </div>

                    <div>
                        <span>Inactive Users</span>

                        <strong>
                            {inactiveUsers}
                        </strong>

                        <small>
                            Inactive accounts
                        </small>
                    </div>
                </div>

            </section>

            {/* Users Card */}
            <section className="users-card">

                <div className="users-card-header">

                    <div>
                        <h2>System Users</h2>

                        <p>
                            View and manage registered users.
                        </p>
                    </div>

                    <div className="users-search">

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
                            placeholder="Search users..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                    </div>

                </div>

                {/* Results Bar */}
                <div className="users-results-bar">

                    <span>
                        Showing{" "}
                        <strong>
                            {filteredUsers.length}
                        </strong>{" "}
                        of{" "}
                        <strong>
                            {users.length}
                        </strong>{" "}
                        users
                    </span>

                    {search && (
                        <button
                            className="clear-search-btn"
                            onClick={() => setSearch("")}
                        >
                            Clear search
                        </button>
                    )}

                </div>

                {/* Table */}
                <div className="users-table">

                    <div className="users-table-head">
                        <span>User</span>
                        <span>Department</span>
                        <span>Role</span>
                        <span>Status</span>
                        <span>Actions</span>
                    </div>

                    <div className="users-list">

                        {filteredUsers.map((user) => (

                            <div
                                className="user-row"
                                key={user.id}
                            >

                                {/* User */}
                                <div className="user-info">

                                    <div
                                        className={`user-avatar ${getAvatarClass(
                                            user.id
                                        )}`}
                                    >
                                        {user.name.charAt(0)}
                                    </div>

                                    <div className="user-name-info">

                                        <strong>
                                            {user.name}
                                        </strong>

                                        <small>
                                            {user.email}
                                        </small>

                                    </div>

                                </div>

                                {/* Department */}
                                <div className="user-detail">

                                    <span className="mobile-label">
                                        Department
                                    </span>

                                    <span className="department-badge">
                                        {user.department}
                                    </span>

                                </div>

                                {/* Role */}
                                <div className="user-detail">

                                    <span className="mobile-label">
                                        Role
                                    </span>

                                    <span
                                        className={`role-badge ${
                                            user.role ===
                                            "Administrator"
                                                ? "role-admin"
                                                : user.role ===
                                                  "Manager"
                                                ? "role-manager"
                                                : "role-employee"
                                        }`}
                                    >
                                        {user.role}
                                    </span>

                                </div>

                                {/* Status */}
                                <div className="user-detail">

                                    <span className="mobile-label">
                                        Status
                                    </span>

                                    <span
                                        className={`user-status ${
                                            user.status ===
                                            "Active"
                                                ? "user-active"
                                                : "user-inactive"
                                        }`}
                                    >
                                        <span className="status-dot"></span>

                                        {user.status}
                                    </span>

                                </div>

                                {/* Actions */}
                                <div className="user-actions">

                                    <button
                                        className="user-edit-btn"
                                        onClick={() =>
                                            openEditModal(user)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="user-delete-btn"
                                        onClick={() =>
                                            handleDelete(
                                                user.id
                                            )
                                        }
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                        ))}

                        {/* Empty State */}
                        {filteredUsers.length === 0 && (

                            <div className="users-empty">

                                <div className="users-empty-icon">

                                    <svg
                                        width="24"
                                        height="24"
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
                                            x2="16"
                                            y2="16"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                        />
                                    </svg>

                                </div>

                                <strong>
                                    No users found
                                </strong>

                                <span>
                                    Try changing your search.
                                </span>

                                {search && (
                                    <button
                                        onClick={() =>
                                            setSearch("")
                                        }
                                    >
                                        Clear Search
                                    </button>
                                )}

                            </div>

                        )}

                    </div>

                </div>

            </section>

            {/* Add / Edit Modal */}
            {showModal && (

                <div
                    className="users-modal-overlay"
                    onMouseDown={(e) => {
                        if (
                            e.target ===
                            e.currentTarget
                        ) {
                            closeModal();
                        }
                    }}
                >

                    <div className="users-modal">

                        {/* Modal Header */}
                        <div className="users-modal-header">

                            <div>

                                <div className="modal-title-row">

                                    <div className="modal-icon">
                                        U
                                    </div>

                                    <h2>
                                        {editingUser
                                            ? "Edit User"
                                            : "Add New User"}
                                    </h2>

                                </div>

                                <p>
                                    {editingUser
                                        ? "Update the user's information."
                                        : "Enter the details for the new user."}
                                </p>

                            </div>

                            <button
                                className="users-modal-close"
                                onClick={closeModal}
                            >
                                ×
                            </button>

                        </div>

                        {/* Form */}
                        <form
                            className="users-form"
                            onSubmit={handleSubmit}
                        >

                            <div className="users-form-group">

                                <label htmlFor="name">
                                    Full Name
                                </label>

                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={
                                        handleInputChange
                                    }
                                    placeholder="e.g. John Smith"
                                    required
                                />

                            </div>

                            <div className="users-form-group">

                                <label htmlFor="email">
                                    Email Address
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={
                                        handleInputChange
                                    }
                                    placeholder="e.g. john.smith@company.com"
                                    required
                                />

                            </div>

                            <div className="users-form-row">

                                <div className="users-form-group">

                                    <label htmlFor="department">
                                        Department
                                    </label>

                                    <select
                                        id="department"
                                        name="department"
                                        value={
                                            form.department
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                    >
                                        <option>
                                            IT Department
                                        </option>

                                        <option>
                                            Finance
                                        </option>

                                        <option>
                                            Human Resources
                                        </option>

                                        <option>
                                            Marketing
                                        </option>

                                        <option>
                                            Operations
                                        </option>
                                    </select>

                                </div>

                                <div className="users-form-group">

                                    <label htmlFor="role">
                                        Role
                                    </label>

                                    <select
                                        id="role"
                                        name="role"
                                        value={form.role}
                                        onChange={
                                            handleInputChange
                                        }
                                    >
                                        <option>
                                            Employee
                                        </option>

                                        <option>
                                            Manager
                                        </option>

                                        <option>
                                            Administrator
                                        </option>
                                    </select>

                                </div>

                            </div>

                            <div className="users-form-group">

                                <label htmlFor="status">
                                    Status
                                </label>

                                <select
                                    id="status"
                                    name="status"
                                    value={form.status}
                                    onChange={
                                        handleInputChange
                                    }
                                >
                                    <option>
                                        Active
                                    </option>

                                    <option>
                                        Inactive
                                    </option>
                                </select>

                            </div>

                            {/* Modal Buttons */}
                            <div className="users-modal-actions">

                                <button
                                    type="button"
                                    className="users-cancel-btn"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="users-save-btn"
                                >
                                    {editingUser
                                        ? "Save Changes"
                                        : "Add User"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </main>
    );
}

export default Users;