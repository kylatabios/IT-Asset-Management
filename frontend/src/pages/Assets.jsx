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
  Space,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  LaptopOutlined,
  DesktopOutlined,
  PrinterOutlined,
  WifiOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "./Assets.css";

const { Title, Text } = Typography;

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

    if (!keyword) return true;

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
      status: "Active",
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
        : null,
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
        : "",
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
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
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
          method: "DELETE",
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
      width: 300,
      render: (_, record) => (
        <div className="asset-cell">
          <div className="asset-icon">
            {getAssetIcon(record.Category)}
          </div>

          <div className="asset-details">
            <div className="asset-name">
              {record.AssetName}
            </div>

            <div className="asset-tag">
              {record.AssetTag}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "Category",
      key: "category",
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "status",
      render: (status) => (
        <Tag
          className={`asset-status status-${String(
            status
          ).toLowerCase()}`}
        >
          <span className="status-dot" />
          {status}
        </Tag>
      ),
      filters: [
        { text: "Active", value: "Active" },
        { text: "Maintenance", value: "Maintenance" },
        { text: "Unavailable", value: "Unavailable" },
      ],
      onFilter: (value, record) =>
        record.Status === value,
    },
    {
      title: "Assigned To",
      dataIndex: "AssignedTo",
      key: "assignedTo",
      render: (value) => (
        <span className={value ? "" : "unassigned"}>
          {value || "Unassigned"}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <Space size={6}>
          <Button
            size="small"
            className="asset-edit-button"
            onClick={() => openEditModal(record)}
          >
            Edit
          </Button>

          <Popconfirm
            title="Delete this asset?"
            description={`Are you sure you want to delete ${record.AssetName}?`}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(record)}
          >
            <Button
              size="small"
              danger
              className="asset-delete-button"
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="assets-page">
      <div className="assets-header">
        <div>
          <Title level={2} className="assets-title">
            Assets
          </Title>

          <Text className="assets-subtitle">
            Manage and monitor all registered IT assets.
          </Text>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="add-asset-button"
          onClick={openAddModal}
        >
          Add New Asset
        </Button>
      </div>

      <Row
        gutter={[16, 16]}
        className="asset-stat-row"
      >
        <Col xs={24} sm={12} lg={6}>
          <Card className="asset-stat-card">
            <Statistic
              title="Total Assets"
              value={assets.length}
              styles={{
                content: {
                  color: "#2563eb",
                },
              }}
            />

            <span className="stat-description">
              Registered equipment
            </span>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="asset-stat-card">
            <Statistic
              title="Active Assets"
              value={activeAssets}
              styles={{
                content: {
                  color: "#159957",
                },
              }}
            />

            <span className="stat-description">
              Currently in use
            </span>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="asset-stat-card">
            <Statistic
              title="Maintenance"
              value={maintenanceAssets}
              styles={{
                content: {
                  color: "#d97706",
                },
              }}
            />

            <span className="stat-description">
              Needs attention
            </span>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="asset-stat-card">
            <Statistic
              title="Unavailable"
              value={unavailableAssets}
              styles={{
                content: {
                  color: "#dc2626",
                },
              }}
            />

            <span className="stat-description">
              Not currently available
            </span>
          </Card>
        </Col>
      </Row>

      <Card className="assets-table-card">
        <div className="assets-table-header">
          <div>
            <h3>Asset List</h3>
            <p>
              View and manage all registered equipment
            </p>
          </div>

          <Input
            className="asset-search"
            placeholder="Search assets..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            allowClear
          />
        </div>

        <Table
          className="assets-table"
          columns={columns}
          dataSource={filteredAssets}
          rowKey="Id"
          loading={loading}
          pagination={{
            pageSize: 8,
            showSizeChanger: false,
          }}
        />
      </Card>

      <Modal
        title={
          editingAsset
            ? "Edit Asset"
            : "Add New Asset"
        }
        open={showModal}
        onCancel={closeModal}
        footer={null}
        width={560}
        className="asset-modal"
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="asset-form"
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
                message: "Asset name is required",
              },
            ]}
          >
            <Input placeholder="e.g. Dell OptiPlex 7090" />
          </Form.Item>

          <Row gutter={14}>
            <Col span={12}>
              <Form.Item
                label="Category"
                name="category"
              >
                <Select>
                  <Select.Option value="Desktop">
                    Desktop
                  </Select.Option>
                  <Select.Option value="Laptop">
                    Laptop
                  </Select.Option>
                  <Select.Option value="Printer">
                    Printer
                  </Select.Option>
                  <Select.Option value="Monitor">
                    Monitor
                  </Select.Option>
                  <Select.Option value="Network">
                    Network
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Status"
                name="status"
              >
                <Select>
                  <Select.Option value="Active">
                    Active
                  </Select.Option>
                  <Select.Option value="Maintenance">
                    Maintenance
                  </Select.Option>
                  <Select.Option value="Unavailable">
                    Unavailable
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={14}>
            <Col span={12}>
              <Form.Item
                label="Brand"
                name="brand"
              >
                <Input placeholder="e.g. Dell" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Model"
                name="model"
              >
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

          <Row gutter={14}>
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
                <DatePicker
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>

          <div className="asset-form-actions">
            <Button onClick={closeModal}>
              Cancel
            </Button>

            <Button
              type="primary"
              htmlType="submit"
              loading={saving}
            >
              {editingAsset
                ? "Save Changes"
                : "Add Asset"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default Assets;