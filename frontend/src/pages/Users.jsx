import { useEffect, useState } from "react";
import "./Users.css";

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: ""
    });

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch("http://localhost:5000/api/users");

            if (!response.ok) {
                throw new Error("Failed to load users");
            }

            const data = await response.json();
            setUsers(data.users || []);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                "http://localhost:5000/api/users",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(form)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to create user");
            }

            setForm({
                fullName: "",
                email: "",
                password: ""
            });

            setShowModal(false);
            loadUsers();
        } catch (error) {
            window.alert(error.message);
        }
    };

    const handleDelete = async (id, fullName) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete " + fullName + "?"
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:5000/api/users/" + id,
                {
                    method: "DELETE"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to delete user");
            }

            loadUsers();
        } catch (error) {
            window.alert(error.message);
        }
    };

    return (
        <div className="users-page">
            <header className="users-page-header">
                <div>
                    <h1>Users</h1>
                    <p>Manage system users and their accounts.</p>
                </div>

                <button
                    className="users-primary-btn"
                    onClick={() => setShowModal(true)}
                >
                    <span>+</span>
                    Add New User
                </button>
            </header>

            <section className="users-card">
                <div className="users-card-header">
                    <div>
                        <h2>User List</h2>
                        <p>
                            View and manage registered system users.
                        </p>
                    </div>

                    <div className="users-count">
                        {users.length} Users
                    </div>
                </div>

                {loading ? (
                    <div className="users-empty">
                        Loading users...
                    </div>
                ) : error ? (
                    <div className="users-empty">
                        <strong>Failed to load users</strong>
                        <span>{error}</span>
                    </div>
                ) : users.length === 0 ? (
                    <div className="users-empty">
                        <strong>No users found</strong>
                        <span>Add a new user to get started.</span>
                    </div>
                ) : (
                    <div className="users-table">
                        <div className="users-table-head">
                            <span>User</span>
                            <span>Email</span>
                            <span>Created</span>
                            <span>Actions</span>
                        </div>

                        {users.map((user) => (
                            <div
                                className="users-table-row"
                                key={user.Id}
                            >
                                <div className="user-info">
                                    <div className="user-avatar">
                                        {user.FullName
                                            ?.charAt(0)
                                            .toUpperCase()}
                                    </div>

                                    <div>
                                        <strong>{user.FullName}</strong>
                                        <small>User #{user.Id}</small>
                                    </div>
                                </div>

                                <div className="user-email">
                                    {user.Email}
                                </div>

                                <div className="user-created">
                                    {new Date(
                                        user.CreatedAt
                                    ).toLocaleDateString()}
                                </div>

                                <div className="user-actions">
                                    <button
                                        type="button"
                                        className="user-delete-btn"
                                        onClick={() =>
                                            handleDelete(
                                                user.Id,
                                                user.FullName
                                            )
                                        }
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {showModal && (
                <div
                    className="user-modal-overlay"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) {
                            setShowModal(false);
                        }
                    }}
                >
                    <div className="user-modal">
                        <div className="user-modal-header">
                            <div>
                                <h2>Add New User</h2>
                                <p>
                                    Enter the details for the new user.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="user-modal-close"
                                onClick={() => setShowModal(false)}
                            >
                                ×
                            </button>
                        </div>

                        <form
                            className="user-form"
                            onSubmit={handleSubmit}
                        >
                            <div className="user-form-group">
                                <label htmlFor="fullName">
                                    Full Name
                                </label>

                                <input
                                    id="fullName"
                                    type="text"
                                    name="fullName"
                                    value={form.fullName}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Maria Santos"
                                    required
                                />
                            </div>

                            <div className="user-form-group">
                                <label htmlFor="email">
                                    Email
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleInputChange}
                                    placeholder="e.g. maria@gmail.com"
                                    required
                                />
                            </div>

                            <div className="user-form-group">
                                <label htmlFor="password">
                                    Password
                                </label>

                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleInputChange}
                                    placeholder="Enter password"
                                    required
                                />
                            </div>

                            <div className="user-form-actions">
                                <button
                                    type="button"
                                    className="user-cancel-btn"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="user-save-btn"
                                >
                                    Add User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Users;