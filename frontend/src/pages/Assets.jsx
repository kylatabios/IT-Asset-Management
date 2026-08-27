import { useEffect, useState } from "react";
import {
    Table,
    Card,
    Row,
    Col,
    Statistic,
    Button,
    Modal,
    Form,
    Input,
    Select,
    DatePicker,
    Tag,
    Popconfirm,
    message,
    Typography,
    Space
} from "antd";
import {
    PlusOutlined,
    SearchOutlined,
    LaptopOutlined,
    DesktopOutlined,
    PrinterOutlined,
    WifiOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;

const API_URL = "http://localhost:5000/api/assets";

function Assets() {
    const [assets, setAssets] = useState([]);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingAsset, setEditingAsset] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [form] = Form.useForm();

    const loadAssets = async () => {
        try {
            setLoading(true);

            const response = await fetch(API_URL);
            const data = await response.json();

            if (data.success) {
                setAssets(data.assets);
            }
        } catch (error) {
            console.error("Failed to load assets:", error);
            message.error("Failed to load assets");
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
                return <LaptopOutlined />;
            case "Printer":
                return <PrinterOutlined />;
            case "Monitor":
                return <DesktopOutlined />;
            case "Network":
                return <WifiOutlined />;
            default:
                return <DesktopOutlined />;
        }
    };

    const getStatusColor = (status) => {
        if (status === "Active") return "success";
        if (status === "Maintenance") return "warning";
        return "error";
    };

    const openAddModal = () => {
        setEditingAsset(null);
        form.resetFields();
        form.setFieldsValue({
            category: "Desktop",
            status: "Active"
        });
        setShowModal(true);
    };

    const openEditModal = (asset) => {
        setEditingAsset(asset);

        form.setFieldsValue({
            assetTag: asset.AssetTag || "",
            assetName: asset.AssetName || "",
            category: asset.Category || "Desktop",
            brand: asset.Brand || "",
            model: asset.Model || "",
            serialNumber: asset.SerialNumber || "",
            status: asset.Status || "Active",
            assignedTo: asset.AssignedTo || "",
            purchaseDate: asset.PurchaseDate
                ? dayjs(asset.PurchaseDate.substring(0, 10))
                : null
        });

        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingAsset(null);
        form.resetFields();
    };

    const handleSubmit = async (values) => {
        const payload = {
            assetTag: values.assetTag,
            assetName: values.assetName.trim(),
            category: values.category,
            brand: values.brand || "",
            model: values.model || "",
            serialNumber: values.serialNumber || "",
            status: values.status,
            assignedTo: values.assignedTo?.trim() || null,
            purchaseDate: values.purchaseDate
                ? values.purchaseDate.format("YYYY-MM-DD")
                : ""
        };

        try {
            setSaving(true);

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
                message.error(data.message || "Failed to save asset");
                return;
            }

            message.success(
                editingAsset ? "Asset updated" : "Asset added"
            );

            await loadAssets();
            closeModal();
        } catch (error) {
            console.error("Save asset error:", error);
            message.error("Failed to connect to the server");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (asset) => {
        try {
            const response = await fetch(
                `${API_URL}/${asset.Id}`,
                {
                    method: "DELETE"
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                message.error(data.message || "Failed to delete asset");
                return;
            }

            message.success(`${asset.AssetName} deleted`);
            await loadAssets();
        } catch (error) {
            console.error("Delete asset error:", error);
            message.error("Failed to connect to the server");
        }
    };

    const columns = [
        {
            title: "Asset",
            key: "asset",
            render: (_, record) => (
                <Space>
                    <div
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 9,
                            background: "#eef2fb",
                            color: "#3852a4",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 16
                        }}
                    >
                        {getAssetIcon(record.Category)}
                    </div>
                    <div>
                        <div style={{ fontWeight: 600 }}>
                            {record.AssetName}
                        </div>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            {record.AssetTag}
                        </Text>
                    </div>
                </Space>
            )
        },
        {
            title: "Category",
            dataIndex: "Category",
            key: "category"
        },
        {
            title: "Status",
            dataIndex: "Status",
            key: "status",
            render: (status) => (
                <Tag color={getStatusColor(status)}>{status}</Tag>
            ),
            filters: [
                { text: "Active", value: "Active" },
                { text: "Maintenance", value: "Maintenance" },
                { text: "Unavailable", value: "Unavailable" }
            ],
            onFilter: (value, record) => record.Status === value
        },
        {
            title: "Assigned To",
            dataIndex: "AssignedTo",
            key: "assignedTo",
            render: (value) => value || "Unassigned"
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button
                        size="small"
                        onClick={() => openEditModal(record)}
                    >
                        Edit
                    </Button>

                    <Popconfirm
                        title="Delete this asset?"
                        description={`Are you sure you want to delete ${record.AssetName}?`}
                        okText="Delete"
                        okButtonProps={{ danger: true }}
                        onConfirm={() => handleDelete(record)}
                    >
                        <Button size="small" danger>
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <div style={{ padding: "8px 4px" }}>
            <Row
                justify="space-between"
                align="middle"
                style={{ marginBottom: 24 }}
            >
                <Col>
                    <Title level={3} style={{ margin: 0 }}>
                        Assets
                    </Title>
                    <Text type="secondary">
                        Manage and monitor all registered IT assets.
                    </Text>
                </Col>

                <Col>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={openAddModal}
                    >
                        Add New Asset
                    </Button>
                </Col>
            </Row>

            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Total Assets"
                            value={assets.length}
                            valueStyle={{ color: "#2563eb" }}
                        />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Registered equipment
                        </Text>
                    </Card>
                </Col>

                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Active Assets"
                            value={activeAssets}
                            valueStyle={{ color: "#159957" }}
                        />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Currently in use
                        </Text>
                    </Card>
                </Col>

                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Maintenance"
                            value={maintenanceAssets}
                            valueStyle={{ color: "#d97706" }}
                        />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Needs attention
                        </Text>
                    </Card>
                </Col>

                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Unavailable"
                            value={unavailableAssets}
                            valueStyle={{ color: "#dc2626" }}
                        />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Not currently available
                        </Text>
                    </Card>
                </Col>
            </Row>

            <Card
                title="Asset List"
                extra={
                    <Input
                        placeholder="Search assets..."
                        prefix={<SearchOutlined />}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        allowClear
                        style={{ width: 240 }}
                    />
                }
            >
                <Table
                    columns={columns}
                    dataSource={filteredAssets}
                    rowKey="Id"
                    loading={loading}
                    pagination={{ pageSize: 8 }}
                />
            </Card>

            <Modal
                title={editingAsset ? "Edit Asset" : "Add New Asset"}
                open={showModal}
                onCancel={closeModal}
                footer={null}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        label="Asset Tag"
                        name="assetTag"
                    >
                        <Input placeholder="e.g. IT-2026-002" />
                    </Form.Item>

                    <Form.Item
                        label="Asset Name"
                        name="assetName"
                        rules={[
                            {
                                required: true,
                                message: "Asset name is required"
                            }
                        ]}
                    >
                        <Input placeholder="e.g. Dell OptiPlex 7090" />
                    </Form.Item>

                    <Row gutter={12}>
                        <Col span={12}>
                            <Form.Item
                                label="Category"
                                name="category"
                            >
                                <Select>
                                    <Option value="Desktop">Desktop</Option>
                                    <Option value="Laptop">Laptop</Option>
                                    <Option value="Printer">Printer</Option>
                                    <Option value="Monitor">Monitor</Option>
                                    <Option value="Network">Network</Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Status"
                                name="status"
                            >
                                <Select>
                                    <Option value="Active">Active</Option>
                                    <Option value="Maintenance">
                                        Maintenance
                                    </Option>
                                    <Option value="Unavailable">
                                        Unavailable
                                    </Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={12}>
                        <Col span={12}>
                            <Form.Item label="Brand" name="brand">
                                <Input placeholder="e.g. Dell" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item label="Model" name="model">
                                <Input placeholder="e.g. OptiPlex 7090" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label="Serial Number"
                        name="serialNumber"
                    >
                        <Input placeholder="e.g. SN-TEST-002" />
                    </Form.Item>

                    <Row gutter={12}>
                        <Col span={12}>
                            <Form.Item
                                label="Assigned To"
                                name="assignedTo"
                            >
                                <Input placeholder="e.g. John Smith" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Purchase Date"
                                name="purchaseDate"
                            >
                                <DatePicker style={{ width: "100%" }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
                        <Space>
                            <Button onClick={closeModal}>Cancel</Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={saving}
                            >
                                {editingAsset ? "Save Changes" : "Add Asset"}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default Assets;