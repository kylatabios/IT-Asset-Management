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
    ToolOutlined,
    DeleteOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";

import "./Maintenance.css";

const { Title, Text } = Typography;

const API_URL = "http://localhost:5000/api/maintenance";
const ASSETS_API_URL = "http://localhost:5000/api/assets";

function Maintenance() {
    const [records, setRecords] = useState([]);
    const [assets, setAssets] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingAssets, setLoadingAssets] = useState(false);
    const [saving, setSaving] = useState(false);

    const [form] = Form.useForm();

    const fetchMaintenance = async () => {
        try {
            setLoading(true);

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
            message.error("Failed to load maintenance records");
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
            message.error("Failed to load assets");
        } finally {
            setLoadingAssets(false);
        }
    };

    useEffect(() => {
        fetchMaintenance();
        fetchAssets();
    }, []);

    const completed = records.filter(
        (item) => item.Status === "Completed"
    ).length;

    const inProgress = records.filter(
        (item) => item.Status === "In Progress"
    ).length;

    const pending = records.filter(
        (item) => item.Status === "Pending"
    ).length;

    const openAddModal = async () => {
        form.resetFields();

        form.setFieldsValue({
            assetId: undefined,
            type: "Repair",
            status: "Pending",
            assignedTo: "",
            date: null
        });

        setShowModal(true);

        if (assets.length === 0) {
            await fetchAssets();
        }
    };

    const closeModal = () => {
        if (saving) {
            return;
        }

        setShowModal(false);
        form.resetFields();
    };

    const handleSubmit = async (values) => {
        const selectedAsset = assets.find(
            (asset) => asset.AssetTag === values.assetId
        );

        if (!selectedAsset) {
            message.error("Please select a valid asset");
            return;
        }

        const payload = {
            asset: selectedAsset.AssetName,
            assetId: selectedAsset.AssetTag,
            type: values.type,
            assignedTo: values.assignedTo.trim(),
            date: values.date.format("YYYY-MM-DD"),
            status: values.status
        };

        try {
            setSaving(true);

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                message.error(
                    data.message ||
                    "Failed to create maintenance record"
                );
                return;
            }

            message.success("Maintenance record added");

            setRecords((previous) => [
                data.maintenance,
                ...previous
            ]);

            closeModal();
        } catch (error) {
            console.error(
                "Create maintenance error:",
                error
            );

            message.error(
                "Failed to connect to the server"
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (record) => {
        try {
            const response = await fetch(
                `${API_URL}/${record.Id}`,
                {
                    method: "DELETE"
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                message.error(
                    data.message ||
                    "Failed to delete maintenance record"
                );
                return;
            }

            message.success("Maintenance record deleted");

            setRecords((previous) =>
                previous.filter(
                    (item) => item.Id !== record.Id
                )
            );
        } catch (error) {
            console.error(
                "Delete maintenance error:",
                error
            );

            message.error(
                "Failed to connect to the server"
            );
        }
    };

    const getStatusColor = (status) => {
        if (status === "Completed") {
            return "success";
        }

        if (status === "In Progress") {
            return "processing";
        }

        return "warning";
    };

    const getTypeColor = (type) => {
        if (type === "Repair") {
            return "error";
        }

        if (type === "Preventive") {
            return "blue";
        }

        return "purple";
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
                        <ToolOutlined />
                    </div>

                    <div>
                        <div style={{ fontWeight: 600 }}>
                            {record.Asset}
                        </div>

                        <Text
                            type="secondary"
                            style={{ fontSize: 12 }}
                        >
                            {record.AssetId}
                        </Text>
                    </div>
                </Space>
            )
        },
        {
            title: "Type",
            dataIndex: "Type",
            key: "type",
            render: (type) => (
                <Tag color={getTypeColor(type)}>
                    {type}
                </Tag>
            )
        },
        {
            title: "Assigned To",
            dataIndex: "AssignedTo",
            key: "assignedTo",
            render: (value) =>
                value || "Unassigned"
        },
        {
            title: "Date",
            dataIndex: "Date",
            key: "date",
            render: (value) =>
                value
                    ? dayjs(value).format("MMM D, YYYY")
                    : "-"
        },
        {
            title: "Status",
            dataIndex: "Status",
            key: "status",
            render: (status) => (
                <Tag color={getStatusColor(status)}>
                    {status}
                </Tag>
            ),
            filters: [
                {
                    text: "Pending",
                    value: "Pending"
                },
                {
                    text: "In Progress",
                    value: "In Progress"
                },
                {
                    text: "Completed",
                    value: "Completed"
                }
            ],
            onFilter: (value, record) =>
                record.Status === value
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Popconfirm
                    title="Delete maintenance record?"
                    description={`Delete the maintenance record for ${record.Asset}?`}
                    okText="Delete"
                    cancelText="Cancel"
                    okButtonProps={{
                        danger: true
                    }}
                    onConfirm={() =>
                        handleDelete(record)
                    }
                >
                    <Button
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                    >
                        Delete
                    </Button>
                </Popconfirm>
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
                    <Title
                        level={3}
                        style={{ margin: 0 }}
                    >
                        Maintenance
                    </Title>

                    <Text type="secondary">
                        Track and manage asset maintenance records.
                    </Text>
                </Col>

                <Col>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={openAddModal}
                    >
                        Add Maintenance
                    </Button>
                </Col>
            </Row>

            <Row
                gutter={16}
                style={{ marginBottom: 24 }}
            >
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Completed"
                            value={completed}
                            valueStyle={{
                                color: "#159957"
                            }}
                        />

                        <Text
                            type="secondary"
                            style={{ fontSize: 12 }}
                        >
                            Completed records
                        </Text>
                    </Card>
                </Col>

                <Col span={8}>
                    <Card>
                        <Statistic
                            title="In Progress"
                            value={inProgress}
                            valueStyle={{
                                color: "#2563eb"
                            }}
                        />

                        <Text
                            type="secondary"
                            style={{ fontSize: 12 }}
                        >
                            Currently being handled
                        </Text>
                    </Card>
                </Col>

                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Pending"
                            value={pending}
                            valueStyle={{
                                color: "#d97706"
                            }}
                        />

                        <Text
                            type="secondary"
                            style={{ fontSize: 12 }}
                        >
                            Waiting for action
                        </Text>
                    </Card>
                </Col>
            </Row>

            <Card
                title="Maintenance Records"
                extra={
                    <Text type="secondary">
                        {records.length} Records
                    </Text>
                }
            >
                <Table
                    columns={columns}
                    dataSource={records}
                    rowKey="Id"
                    loading={loading}
                    pagination={{
                        pageSize: 8
                    }}
                    locale={{
                        emptyText:
                            "No maintenance records"
                    }}
                />
            </Card>

            <Modal
                title="Add Maintenance"
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
                        label="Asset"
                        name="assetId"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Please select an asset"
                            }
                        ]}
                    >
                        <Select
                            placeholder={
                                loadingAssets
                                    ? "Loading assets..."
                                    : "Select an asset"
                            }
                            loading={loadingAssets}
                            showSearch
                            optionFilterProp="label"
                            options={assets.map(
                                (asset) => ({
                                    value:
                                        asset.AssetTag,
                                    label:
                                        `${asset.AssetName} - ${asset.AssetTag}`
                                })
                            )}
                        />
                    </Form.Item>

                    <Row gutter={12}>
                        <Col span={12}>
                            <Form.Item
                                label="Maintenance Type"
                                name="type"
                                rules={[
                                    {
                                        required: true
                                    }
                                ]}
                            >
                                <Select
                                    options={[
                                        {
                                            value: "Repair",
                                            label: "Repair"
                                        },
                                        {
                                            value: "Preventive",
                                            label: "Preventive"
                                        },
                                        {
                                            value: "Inspection",
                                            label: "Inspection"
                                        }
                                    ]}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Status"
                                name="status"
                                rules={[
                                    {
                                        required: true
                                    }
                                ]}
                            >
                                <Select
                                    options={[
                                        {
                                            value: "Pending",
                                            label: "Pending"
                                        },
                                        {
                                            value: "In Progress",
                                            label: "In Progress"
                                        },
                                        {
                                            value: "Completed",
                                            label: "Completed"
                                        }
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label="Assigned To"
                        name="assignedTo"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Assigned person or department is required"
                            }
                        ]}
                    >
                        <Input
                            placeholder="e.g. IT Department"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Maintenance Date"
                        name="date"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Please select a date"
                            }
                        ]}
                    >
                        <DatePicker
                            style={{
                                width: "100%"
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        style={{
                            marginBottom: 0,
                            textAlign: "right"
                        }}
                    >
                        <Space>
                            <Button
                                onClick={closeModal}
                                disabled={saving}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={saving}
                            >
                                Add Maintenance
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default Maintenance;