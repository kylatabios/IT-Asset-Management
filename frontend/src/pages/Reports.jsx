import { useEffect, useState } from "react";
import {
    Card,
    Row,
    Col,
    Select,
    Button,
    Table,
    Typography,
    Space,
    Statistic,
    Tag,
    Divider,
    message
} from "antd";
import {
    FileTextOutlined,
    PrinterOutlined,
    DatabaseOutlined,
    ToolOutlined,
    UserOutlined,
    BarChartOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    CloseCircleOutlined,
    SyncOutlined
} from "@ant-design/icons";
import "./Reports.css";

const { Title, Text } = Typography;

const ASSETS_API_URL = "http://localhost:5000/api/assets";
const MAINTENANCE_API_URL = "http://localhost:5000/api/maintenance";
const USERS_API_URL = "http://localhost:5000/api/users";

export default function Reports() {
    const [reportType, setReportType] = useState("Asset Report");
    const [assets, setAssets] = useState([]);
    const [maintenance, setMaintenance] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAllData();
    }, []);

    const loadAllData = async () => {
        try {
            setLoading(true);

            const [assetsResponse, maintenanceResponse, usersResponse] = await Promise.all([
                fetch(ASSETS_API_URL),
                fetch(MAINTENANCE_API_URL),
                fetch(USERS_API_URL)
            ]);

            const assetsData = await assetsResponse.json();
            const maintenanceData = await maintenanceResponse.json();
            const usersData = await usersResponse.json();

            if (!assetsResponse.ok || !assetsData.success) {
                throw new Error(assetsData.message || "Failed to load assets");
            }
            if (!maintenanceResponse.ok || !maintenanceData.success) {
                throw new Error(maintenanceData.message || "Failed to load maintenance records");
            }
            if (!usersResponse.ok || !usersData.success) {
                throw new Error(usersData.message || "Failed to load users");
            }

            setAssets(assetsData.assets || []);
            setMaintenance(maintenanceData.maintenance || []);
            setUsers(usersData.users || []);
        } catch (error) {
            console.error("Reports data error:", error);
            message.error(error.message || "Failed to load report data.");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (value) => {
        if (!value) return "—";
        return String(value).substring(0, 10);
    };

    const generateReport = () => {
        window.print();
    };

    // Summary Calculations
    const totalAssets = assets.length;
    const activeAssets = assets.filter((asset) => asset.Status === "Active").length;
    const maintenanceAssets = assets.filter((asset) => asset.Status === "Maintenance").length;
    const unavailableAssets = assets.filter((asset) => asset.Status === "Unavailable").length;

    const totalMaintenance = maintenance.length;
    const completedMaintenance = maintenance.filter((record) => record.Status === "Completed").length;
    const pendingMaintenance = maintenance.filter((record) => record.Status === "Pending").length;
    const inProgressMaintenance = maintenance.filter((record) => record.Status === "In Progress").length;

    const totalUsers = users.length;

    const getReportIcon = () => {
        switch (reportType) {
            case "Asset Report":
                return <DatabaseOutlined />;
            case "Maintenance Report":
                return <ToolOutlined />;
            case "User Report":
                return <UserOutlined />;
            case "System Summary Report":
                return <BarChartOutlined />;
            default:
                return <FileTextOutlined />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Active":
            case "Completed":
                return "success";
            case "Maintenance":
            case "Pending":
                return "warning";
            case "Unavailable":
                return "error";
            case "In Progress":
                return "processing";
            default:
                return "default";
        }
    };

    const getReportData = () => {
        if (reportType === "Asset Report") return assets;
        if (reportType === "Maintenance Report") return maintenance;
        if (reportType === "User Report") return users;
        return [];
    };

    const getRowKey = (record, index) => {
        if (reportType === "Asset Report") return record.AssetTag || record._id || index;
        if (reportType === "Maintenance Report") return record._id || index;
        if (reportType === "User Report") return record.Email || record._id || index;
        return index;
    };

    const getColumns = () => {
        if (reportType === "Asset Report") {
            return [
                { title: "Asset Tag", dataIndex: "AssetTag", key: "AssetTag" },
                {
                    title: "Asset Name",
                    dataIndex: "AssetName",
                    key: "AssetName",
                    render: (text) => <Text strong>{text}</Text>
                },
                { title: "Category", dataIndex: "Category", key: "Category" },
                {
                    title: "Status",
                    dataIndex: "Status",
                    key: "Status",
                    render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>
                },
                {
                    title: "Assigned To",
                    dataIndex: "AssignedTo",
                    key: "AssignedTo",
                    render: (val) => val || "Unassigned"
                },
                {
                    title: "Purchase Date",
                    dataIndex: "PurchaseDate",
                    key: "PurchaseDate",
                    render: (val) => formatDate(val)
                }
            ];
        }

        if (reportType === "Maintenance Report") {
            return [
                {
                    title: "Asset",
                    dataIndex: "Asset",
                    key: "Asset",
                    render: (text) => <Text strong>{text}</Text>
                },
                { title: "Maintenance Type", dataIndex: "Type", key: "Type" },
                { title: "Assigned To", dataIndex: "AssignedTo", key: "AssignedTo" },
                {
                    title: "Date",
                    dataIndex: "Date",
                    key: "Date",
                    render: (val) => formatDate(val)
                },
                {
                    title: "Status",
                    dataIndex: "Status",
                    key: "Status",
                    render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>
                }
            ];
        }

        return [
            {
                title: "User",
                dataIndex: "FullName",
                key: "FullName",
                render: (val) => (
                    <Space>
                        <div className="report-user-avatar">
                            {val?.charAt(0).toUpperCase()}
                        </div>
                        <Text strong>{val}</Text>
                    </Space>
                )
            },
            { title: "Email", dataIndex: "Email", key: "Email" },
            {
                title: "Date Created",
                dataIndex: "CreatedAt",
                key: "CreatedAt",
                render: (val) => (val ? new Date(val).toLocaleDateString() : "—")
            }
        ];
    };

    const renderSummaryReport = () => (
        <div className="summary-report">
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic title="Total Assets" value={totalAssets} prefix={<DatabaseOutlined />} />
                        <Text type="secondary">All registered assets</Text>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic title="Active Assets" value={activeAssets} prefix={<CheckCircleOutlined />} />
                        <Text type="secondary">Currently in use</Text>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic title="Maintenance Assets" value={maintenanceAssets} prefix={<ToolOutlined />} />
                        <Text type="secondary">Needs attention</Text>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic title="Unavailable Assets" value={unavailableAssets} prefix={<CloseCircleOutlined />} />
                        <Text type="secondary">Not available</Text>
                    </Card>
                </Col>
            </Row>

            <Divider />

            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic title="Total Maintenance Records" value={totalMaintenance} prefix={<ToolOutlined />} />
                        <Text type="secondary">All maintenance activities</Text>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic title="Completed Maintenance" value={completedMaintenance} prefix={<CheckCircleOutlined />} />
                        <Text type="secondary">Completed records</Text>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic title="Pending Maintenance" value={pendingMaintenance} prefix={<ExclamationCircleOutlined />} />
                        <Text type="secondary">Waiting for action</Text>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic title="In Progress Maintenance" value={inProgressMaintenance} prefix={<SyncOutlined />} />
                        <Text type="secondary">Currently being handled</Text>
                    </Card>
                </Col>
            </Row>

            <Divider />

            <Row>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic title="Total Users" value={totalUsers} prefix={<UserOutlined />} />
                        <Text type="secondary">Registered system users</Text>
                    </Card>
                </Col>
            </Row>
        </div>
    );

    return (
        <div className="reports-page">
            <div className="reports-screen-only">
                <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                    <Col>
                        <Title level={3} style={{ margin: 0 }}>Reports</Title>
                        <Text type="secondary">Generate simple reports for the IT asset management system.</Text>
                    </Col>
                    <Col>
                        <Button type="primary" icon={<PrinterOutlined />} onClick={generateReport}>
                            Print Report
                        </Button>
                    </Col>
                </Row>

                <Card style={{ marginBottom: 24 }}>
                    <Row justify="space-between" align="middle" gutter={[16, 16]}>
                        <Col>
                            <Space align="center" size="middle">
                                <div className="report-generator-icon">
                                    {getReportIcon()}
                                </div>
                                <div>
                                    <Title level={4} style={{ margin: 0 }}>Generate Report</Title>
                                    <Text type="secondary">Select a report type to view dynamic metrics.</Text>
                                </div>
                            </Space>
                        </Col>
                        <Col>
                            <Select
                                value={reportType}
                                onChange={setReportType}
                                style={{ width: 220 }}
                                options={[
                                    { value: "Asset Report", label: "Asset Report" },
                                    { value: "Maintenance Report", label: "Maintenance Report" },
                                    { value: "User Report", label: "User Report" },
                                    { value: "System Summary Report", label: "System Summary Report" }
                                ]}
                            />
                        </Col>
                    </Row>
                </Card>
            </div>

            {/* PREVIEW CONTAINER */}
            <div className="report-preview">
                <div className="reports-preview-header">
                    <div>
                        <Title level={4} style={{ margin: 0 }}>{reportType}</Title>
                        <Text type="secondary">Generated System Export</Text>
                    </div>
                    <span>{new Date().toLocaleDateString()}</span>
                </div>

                {reportType === "System Summary Report" ? (
                    renderSummaryReport()
                ) : (
                    <Table
                        rowKey={getRowKey}
                        columns={getColumns()}
                        dataSource={getReportData()}
                        loading={loading}
                        pagination={false}
                        bordered
                    />
                )}
            </div>
        </div>
    );
}