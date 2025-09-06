import React, { useState, useEffect } from "react";
import axios from "axios";
import "./OrderDashboard.css";

const OrderDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8000/api/v1",
    withCredentials: true,
  });

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/orders/my-orders?limit=50");

      if (response.data.success) {
        const ordersData = response.data.data.orders;
        setOrders(ordersData);
        calculateStats(ordersData);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (ordersData) => {
    const stats = {
      total: ordersData.length,
      pending: 0,
      confirmed: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };

    ordersData.forEach((order) => {
      if (stats.hasOwnProperty(order.status)) {
        stats[order.status]++;
      }
    });

    setStats(stats);
  };

  const updateOrderStatus = async (orderId, newStatus, trackingNumber = "") => {
    try {
      const payload = { status: newStatus };
      if (trackingNumber) {
        payload.trackingNumber = trackingNumber;
      }

      const response = await axiosInstance.patch(
        `/orders/${orderId}/status`,
        payload
      );

      if (response.data.success) {
        fetchAllOrders(); // Refresh data
        alert(`Order status updated to ${newStatus}`);
      }
    } catch (err) {
      console.error("Error updating order status:", err);
      alert("Failed to update order status.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#ffa500";
      case "confirmed":
        return "#4CAF50";
      case "processing":
        return "#2196F3";
      case "shipped":
        return "#9C27B0";
      case "delivered":
        return "#4CAF50";
      case "cancelled":
        return "#f44336";
      default:
        return "#666";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const StatCard = ({ title, count, color, percentage }) => (
    <div className="stat-card">
      <div className="stat-header">
        <h3>{title}</h3>
        <div className="stat-count" style={{ color }}>
          {count}
        </div>
      </div>
      <div className="stat-bar">
        <div
          className="stat-fill"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        ></div>
      </div>
    </div>
  );

  const OrderRow = ({ order }) => {
    const [showActions, setShowActions] = useState(false);
    const [trackingInput, setTrackingInput] = useState(
      order.trackingNumber || ""
    );

    return (
      <tr className="order-row">
        <td>#{order._id.slice(-8)}</td>
        <td>{order.shippingDetails?.fullName || "N/A"}</td>
        <td>₹{order.amount}</td>
        <td>
          <span
            className="status-badge"
            style={{ backgroundColor: getStatusColor(order.status) }}
          >
            {order.status.toUpperCase()}
          </span>
        </td>
        <td>{formatDate(order.createdAt)}</td>
        <td>{order.trackingNumber || "Not assigned"}</td>
        <td>
          <button
            onClick={() => setShowActions(!showActions)}
            className="action-btn"
          >
            Actions
          </button>

          {showActions && (
            <div className="action-dropdown">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    updateOrderStatus(order._id, e.target.value, trackingInput);
                    setShowActions(false);
                  }
                }}
                defaultValue=""
                className="status-select-dropdown"
              >
                <option value="">Update Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <input
                type="text"
                placeholder="Tracking Number"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                className="tracking-input"
              />

              <button
                onClick={() => setSelectedOrder(order)}
                className="view-btn"
              >
                View Details
              </button>
            </div>
          )}
        </td>
      </tr>
    );
  };

  const OrderDetailModal = ({ order, onClose }) => {
    if (!order) return null;

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Order Details - #{order._id.slice(-8)}</h2>
            <button onClick={onClose} className="close-btn">
              &times;
            </button>
          </div>

          <div className="modal-body">
            <div className="detail-grid">
              <div className="detail-section">
                <h3>Order Information</h3>
                <p>
                  <strong>Order ID:</strong> {order._id}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span style={{ color: getStatusColor(order.status) }}>
                    {order.status.toUpperCase()}
                  </span>
                </p>
                <p>
                  <strong>Amount:</strong> ₹{order.amount}
                </p>
                <p>
                  <strong>Shipping Cost:</strong> ₹{order.shippingCost}
                </p>
                <p>
                  <strong>Created:</strong> {formatDate(order.createdAt)}
                </p>
                <p>
                  <strong>Tracking Number:</strong>{" "}
                  {order.trackingNumber || "Not assigned"}
                </p>
              </div>

              <div className="detail-section">
                <h3>Customer Information</h3>
                <p>
                  <strong>Name:</strong> {order.shippingDetails?.fullName}
                </p>
                <p>
                  <strong>Phone:</strong> {order.shippingDetails?.phone}
                </p>
                <p>
                  <strong>Address:</strong>
                </p>
                <p>{order.shippingDetails?.address?.street}</p>
                <p>
                  {order.shippingDetails?.address?.city},{" "}
                  {order.shippingDetails?.address?.state}
                </p>
                <p>{order.shippingDetails?.address?.pincode}</p>
              </div>

              {order.shippingInfo && (
                <div className="detail-section">
                  <h3>Shipping Information</h3>
                  <p>
                    <strong>Zone:</strong> {order.shippingInfo.zone}
                  </p>
                  <p>
                    <strong>Distance:</strong> {order.shippingInfo.distance}
                  </p>
                  <p>
                    <strong>Duration:</strong> {order.shippingInfo.duration}
                  </p>
                  <p>
                    <strong>Estimated Delivery:</strong>{" "}
                    {order.shippingInfo.estimatedDeliveryDays} days
                  </p>
                  <p>
                    <strong>Method:</strong> {order.shippingInfo.method}
                  </p>
                </div>
              )}

              {order.items && order.items.length > 0 && (
                <div className="detail-section">
                  <h3>Items</h3>
                  {order.items.map((item, index) => (
                    <div key={index} className="item-row">
                      <span>
                        {item.name} x {item.qty}
                      </span>
                      <span>₹{item.price * item.qty}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  return (
    <div className="order-dashboard">
      <div className="dashboard-header">
        <h1>Order Management Dashboard</h1>
        <button onClick={fetchAllOrders} className="refresh-btn">
          Refresh Data
        </button>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Total Orders"
          count={stats.total}
          color="#333"
          percentage={100}
        />
        <StatCard
          title="Pending"
          count={stats.pending}
          color="#ffa500"
          percentage={stats.total ? (stats.pending / stats.total) * 100 : 0}
        />
        <StatCard
          title="Confirmed"
          count={stats.confirmed}
          color="#4CAF50"
          percentage={stats.total ? (stats.confirmed / stats.total) * 100 : 0}
        />
        <StatCard
          title="Processing"
          count={stats.processing}
          color="#2196F3"
          percentage={stats.total ? (stats.processing / stats.total) * 100 : 0}
        />
        <StatCard
          title="Shipped"
          count={stats.shipped}
          color="#9C27B0"
          percentage={stats.total ? (stats.shipped / stats.total) * 100 : 0}
        />
        <StatCard
          title="Delivered"
          count={stats.delivered}
          color="#4CAF50"
          percentage={stats.total ? (stats.delivered / stats.total) * 100 : 0}
        />
        <StatCard
          title="Cancelled"
          count={stats.cancelled}
          color="#f44336"
          percentage={stats.total ? (stats.cancelled / stats.total) * 100 : 0}
        />
      </div>

      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Tracking</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <OrderRow key={order._id} order={order} />
            ))}
          </tbody>
        </table>

        {orders.length === 0 && <div className="no-data">No orders found.</div>}
      </div>

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default OrderDashboard;
