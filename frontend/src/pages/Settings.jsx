import { useState } from "react";
import "./Settings.css";

function Settings() {
    const [form, setForm] = useState({
        systemName: "IT Asset Management",
        email: "admin@company.com",
        notifications: true
    });

    const [saved, setSaved] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: type === "checkbox" ? checked : value
        }));

        setSaved(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSaved(true);
    };

    return (
        <main className="settings-page">
            <header className="settings-header">
                <div>
                    <h1>Settings</h1>
                    <p>
                        Manage system preferences and account settings.
                    </p>
                </div>
            </header>

            <section className="settings-card">
                <div className="settings-card-header">
                    <div>
                        <h2>System Settings</h2>
                        <p>Update basic system information.</p>
                    </div>
                </div>

                <form
                    className="settings-form"
                    onSubmit={handleSubmit}
                >
                    <div className="settings-form-group">
                        <label htmlFor="systemName">
                            System Name
                        </label>

                        <input
                            id="systemName"
                            name="systemName"
                            value={form.systemName}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="settings-form-group">
                        <label htmlFor="email">
                            Administrator Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="settings-option">
                        <div>
                            <strong>Email Notifications</strong>
                            <p>
                                Receive notifications for maintenance
                                updates.
                            </p>
                        </div>

                        <label className="settings-switch">
                            <input
                                type="checkbox"
                                name="notifications"
                                checked={form.notifications}
                                onChange={handleChange}
                            />

                            <span></span>
                        </label>
                    </div>

                    <div className="settings-actions">
                        {saved && (
                            <span className="settings-saved">
                                Settings saved.
                            </span>
                        )}

                        <button type="submit">
                            Save Changes
                        </button>
                    </div>
                </form>
            </section>

            <section className="settings-card">
                <div className="settings-card-header">
                    <div>
                        <h2>Account</h2>
                        <p>Current administrator account.</p>
                    </div>
                </div>

                <div className="settings-account">
                    <div className="settings-avatar">
                        A
                    </div>

                    <div>
                        <strong>Administrator</strong>
                        <span>System Admin</span>
                        <small>{form.email}</small>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Settings;