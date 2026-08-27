
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Settings.css";

const API_URL = "http://localhost:5000/api";

function Settings() {
    const navigate = useNavigate();

    const [currentUser, setCurrentUser] = useState(null);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");

            if (storedUser) {
                setCurrentUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Failed to load user:", error);
        }
    }, []);

    const displayName =
        currentUser?.fullName ||
        currentUser?.FullName ||
        "Administrator";

    const displayEmail =
        currentUser?.email ||
        currentUser?.Email ||
        "";

    const displayRole =
        currentUser?.role ||
        currentUser?.Role ||
        "admin";

    const initial = displayName
        .charAt(0)
        .toUpperCase();

    const handleChangePassword = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (!currentPassword || !newPassword || !confirmPassword) {
            setError("Please fill in all password fields.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("New passwords do not match.");
            return;
        }

        if (newPassword.length < 6) {
            setError("New password must be at least 6 characters.");
            return;
        }

        if (!currentUser?.id && !currentUser?.Id) {
            setError("User information not found. Please log in again.");
            return;
        }

        const userId =
            currentUser.id ||
            currentUser.Id;

        try {
            setLoading(true);

            const response = await fetch(
                `${API_URL}/users/${userId}/password`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        currentPassword,
                        newPassword
                    })
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                setError(
                    data.message ||
                    "Failed to change password."
                );
                return;
            }

            setMessage("Password changed successfully.");

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            console.error(
                "Change password error:",
                error
            );

            setError(
                "Unable to connect to the server."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/", { replace: true });
    };

    return (
        <main className="settings-page">
            <header className="settings-header">
                <div>
                    <h1>Settings</h1>

                    <p>
                        Manage your account and security settings.
                    </p>
                </div>
            </header>

            {/* ACCOUNT */}
            <section className="settings-card">
                <div className="settings-card-header">
                    <div>
                        <h2>Account</h2>

                        <p>
                            Your current account information.
                        </p>
                    </div>
                </div>

                <div className="settings-account">
                    <div className="settings-avatar">
                        {initial}
                    </div>

                    <div className="settings-account-info">
                        <strong>
                            {displayName}
                        </strong>

                        <span>
                            System Admin
                        </span>

                        <small>
                            {displayEmail}
                        </small>
                    </div>
                </div>
            </section>

            {/* SECURITY */}
            <section className="settings-card">
                <div className="settings-card-header">
                    <div>
                        <h2>Security</h2>

                        <p>
                            Change your account password.
                        </p>
                    </div>
                </div>

                <form
                    className="settings-form"
                    onSubmit={handleChangePassword}
                >
                    <div className="settings-form-group">
                        <label htmlFor="currentPassword">
                            Current Password
                        </label>

                        <input
                            id="currentPassword"
                            type="password"
                            placeholder="Enter current password"
                            value={currentPassword}
                            onChange={(e) =>
                                setCurrentPassword(
                                    e.target.value
                                )
                            }
                        />
                    </div>

                    <div className="settings-form-group">
                        <label htmlFor="newPassword">
                            New Password
                        </label>

                        <input
                            id="newPassword"
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) =>
                                setNewPassword(
                                    e.target.value
                                )
                            }
                        />
                    </div>

                    <div className="settings-form-group">
                        <label htmlFor="confirmPassword">
                            Confirm New Password
                        </label>

                        <input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(
                                    e.target.value
                                )
                            }
                        />
                    </div>

                    {error && (
                        <p className="settings-error">
                            {error}
                        </p>
                    )}

                    {message && (
                        <p className="settings-success">
                            {message}
                        </p>
                    )}

                    <div className="settings-actions">
                        <button
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Changing Password..."
                                : "Change Password"}
                        </button>
                    </div>
                </form>
            </section>

            {/* SESSION */}
            <section className="settings-card">
                <div className="settings-card-header">
                    <div>
                        <h2>Session</h2>

                        <p>
                            Manage your current session.
                        </p>
                    </div>
                </div>

                <div className="settings-session">
                    <div>
                        <strong>
                            Sign out of your account
                        </strong>

                        <p>
                            You will be returned to the login page.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="logout-settings-btn"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </section>
        </main>
    );
}

export default Settings;

