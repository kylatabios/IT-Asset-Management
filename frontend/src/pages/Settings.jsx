import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Card,
    Form,
    Input,
    Button,
    Avatar,
    Typography,
    Alert,
    Divider,
    Space
} from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const API_URL = "http://localhost:5000/api";

function Settings() {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const [currentUser, setCurrentUser] = useState(null);
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

    const initial = displayName.charAt(0).toUpperCase();

    const handleChangePassword = async (values) => {
        setMessage("");
        setError("");

        if (!currentUser?.id && !currentUser?.Id) {
            setError("User information not found. Please log in again.");
            return;
        }

        const userId = currentUser.id || currentUser.Id;

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
                        currentPassword: values.currentPassword,
                        newPassword: values.newPassword
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
            form.resetFields();
        } catch (error) {
            console.error("Change password error:", error);
            setError("Unable to connect to the server.");
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
        <div
            style={{
                flex: 1,
                minWidth: 0,
                padding: "34px 40px",
                background: "#f5f7fb"
            }}
        >
            <div style={{ marginBottom: 24 }}>
                <Title level={2} style={{ marginBottom: 4 }}>
                    Settings
                </Title>
                <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                    Manage your account and security settings.
                </Paragraph>
            </div>

            <Card
                title="Account"
                style={{ marginBottom: 20 }}
            >
                <Paragraph
                    type="secondary"
                    style={{ marginTop: -8 }}
                >
                    Your current account information.
                </Paragraph>

                <Space align="center" size={14}>
                    <Avatar
                        size={46}
                        style={{ background: "#edf3ff", color: "#1d4ed8" }}
                        icon={!displayName ? <UserOutlined /> : undefined}
                    >
                        {initial}
                    </Avatar>

                    <div>
                        <div style={{ fontWeight: 600, color: "#263146" }}>
                            {displayName}
                        </div>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            System Admin
                        </Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 11 }}>
                            {displayEmail}
                        </Text>
                    </div>
                </Space>
            </Card>

            <Card
                title="Security"
                style={{ marginBottom: 20 }}
            >
                <Paragraph
                    type="secondary"
                    style={{ marginTop: -8 }}
                >
                    Change your account password.
                </Paragraph>

                {error && (
                    <Alert
                        type="error"
                        showIcon
                        message={error}
                        style={{ marginBottom: 16 }}
                        closable
                        onClose={() => setError("")}
                    />
                )}

                {message && (
                    <Alert
                        type="success"
                        showIcon
                        message={message}
                        style={{ marginBottom: 16 }}
                        closable
                        onClose={() => setMessage("")}
                    />
                )}

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleChangePassword}
                    style={{ maxWidth: 420 }}
                >
                    <Form.Item
                        label="Current Password"
                        name="currentPassword"
                        rules={[
                            {
                                required: true,
                                message: "Please enter your current password."
                            }
                        ]}
                    >
                        <Input.Password placeholder="Enter current password" />
                    </Form.Item>

                    <Form.Item
                        label="New Password"
                        name="newPassword"
                        rules={[
                            {
                                required: true,
                                message: "Please enter a new password."
                            },
                            {
                                min: 6,
                                message:
                                    "New password must be at least 6 characters."
                            }
                        ]}
                    >
                        <Input.Password placeholder="Enter new password" />
                    </Form.Item>

                    <Form.Item
                        label="Confirm New Password"
                        name="confirmPassword"
                        dependencies={["newPassword"]}
                        rules={[
                            {
                                required: true,
                                message: "Please confirm your new password."
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (
                                        !value ||
                                        getFieldValue("newPassword") === value
                                    ) {
                                        return Promise.resolve();
                                    }

                                    return Promise.reject(
                                        new Error(
                                            "New passwords do not match."
                                        )
                                    );
                                }
                            })
                        ]}
                    >
                        <Input.Password placeholder="Confirm new password" />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
                        <Divider style={{ margin: "0 0 16px" }} />

                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                        >
                            Change Password
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

            <Card title="Session">
                <Space
                    align="center"
                    style={{
                        width: "100%",
                        justifyContent: "space-between"
                    }}
                    wrap
                >
                    <div>
                        <div style={{ fontWeight: 600, color: "#263146" }}>
                            Sign out of your account
                        </div>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            You will be returned to the login page.
                        </Text>
                    </div>

                    <Button
                        danger
                        icon={<LogoutOutlined />}
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </Space>
            </Card>
        </div>
    );
}

export default Settings;