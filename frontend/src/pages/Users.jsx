import { useEffect, useState } from "react";
import {
    Table,
    Modal,
    Form,
    Input,
    Button,
    Popconfirm,
    message,
    Empty
} from "antd";
import {
    PlusOutlined,
    DeleteOutlined
} from "@ant-design/icons";
import "./Users.css";

const API_URL = "http://localhost:5000/api/users";

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [form] = Form.useForm();

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error("Failed to load users");
            }

            const data = await response.json();

            setUsers(data.users || []);
        } catch (error) {
            console.error("Load users error:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleAddUser = async (values) => {
        try {
            setSubmitting(true);

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(values)
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Failed to create user"
                );
            }

            message.success("User added successfully.");

            form.resetFields();
            setShowModal(false);

            await loadUsers();
        } catch (error) {
            console.error("Create user error:", error);

            message.error(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Failed to delete user"
                );
            }

            message.success("User deleted successfully.");

            await loadUsers();
        } catch (error) {
            console.error("Delete user error:", error);

            message.error(error.message);
        }
    };

    const columns = [
        {
            title: "User",
            key: "user",
            render: (_, user) => (
                <div className="user-info">
                    <div className="user-avatar">
                        {user.FullName
                            ?.charAt(0)
                            .toUpperCase()}
                    </div>

                    <div>
                        <strong>
                            {user.FullName}
                        </strong>

                        <small>
                            User #{user.Id}
                        </small>
                    </div>
                </div>
            )
        },
        {
            title: "Email",
            dataIndex: "Email",
            key: "email",
            render: (email) => (
                <span className="user-email">
                    {email}
                </span>
            )
        },
        {
            title: "Created",
            dataIndex: "CreatedAt",
            key: "created",
            render: (date) =>
                new Date(date).toLocaleDateString()
        },
        {
            title: "Actions",
            key: "actions",
            width: 120,
            render: (_, user) => (
                <Popconfirm
                    title="Delete user"
                    description={
                        `Are you sure you want to delete ${user.FullName}?`
                    }
                    okText="Delete"
                    cancelText="Cancel"
                    okButtonProps={{
                        danger: true
                    }}
                    onConfirm={() =>
                        handleDelete(user.Id)
                    }
                >
                    <Button
                        danger
                        type="text"
                        icon={<DeleteOutlined />}
                    >
                        Delete
                    </Button>
                </Popconfirm>
            )
        }
    ];

    return (
        <div className="users-page">
            <header className="users-page-header">
                <div>
                    <h1>Users</h1>

                    <p>
                        Manage system users and their accounts.
                    </p>
                </div>

                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        form.resetFields();
                        setShowModal(true);
                    }}
                    className="users-primary-btn"
                >
                    Add New User
                </Button>
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

                {error ? (
                    <div className="users-empty">
                        <strong>
                            Failed to load users
                        </strong>

                        <span>
                            {error}
                        </span>

                        <Button
                            type="primary"
                            onClick={loadUsers}
                        >
                            Try Again
                        </Button>
                    </div>
                ) : (
                    <div className="users-table">
                        <Table
                            columns={columns}
                            dataSource={users}
                            rowKey="Id"
                            loading={loading}
                            pagination={{
                                pageSize: 10,
                                showSizeChanger: false
                            }}
                            locale={{
                                emptyText: (
                                    <Empty
                                        description="No users found"
                                    />
                                )
                            }}
                        />
                    </div>
                )}
            </section>

            <Modal
                title="Add New User"
                open={showModal}
                onCancel={() => {
                    if (!submitting) {
                        setShowModal(false);
                    }
                }}
                footer={null}
                destroyOnClose
            >
                <p className="user-modal-description">
                    Enter the details for the new user.
                </p>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleAddUser}
                    requiredMark={false}
                >
                    <Form.Item
                        label="Full Name"
                        name="fullName"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Please enter the full name."
                            }
                        ]}
                    >
                        <Input
                            placeholder="e.g. Maria Santos"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Please enter the email."
                            },
                            {
                                type: "email",
                                message:
                                    "Please enter a valid email."
                            }
                        ]}
                    >
                        <Input
                            placeholder="e.g. maria@gmail.com"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Please enter a password."
                            },
                            {
                                min: 6,
                                message:
                                    "Password must be at least 6 characters."
                            }
                        ]}
                    >
                        <Input.Password
                            placeholder="Enter password"
                        />
                    </Form.Item>

                    <div className="user-form-actions">
                        <Button
                            onClick={() =>
                                setShowModal(false)
                            }
                            disabled={submitting}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={submitting}
                        >
                            Add User
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
}

export default Users;