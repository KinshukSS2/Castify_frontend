import React, { useState, useEffect } from "react";
import axios from "axios";
import "./OrderTracking.css";

const OrderTracking = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingData, setTrackingData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null);

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8000/api/v1",
    withCredentials: true,
  });

  // Check if user is logged in
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    console.log("Saved user:", savedUser);
    console.log("Saved token:", savedToken);

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Error parsing saved user:", e);
        localStorage.removeItem("user");
      }
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [currentPage, statusFilter]);

  const fetchOrders = async () => {
    // Skip fetching if no user is logged in
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!savedUser || !token) {
      setLoading(false);
      setError("Please log in to view your orders.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axiosInstance.get(
        `/orders/my-orders?page=${currentPage}&status=${statusFilter}&limit=10`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setOrders(response.data.data.orders);
        setTotalPages(response.data.data.pagination.totalPages);
        setError("");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      console.error("Error response:", err.response);

      // Check if it's an authentication error
      if (err.response?.status === 401) {
        setError(
          "Your session has expired. Please log in again to view your orders."
        );
        // Clear invalid session data
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
      } else if (err.response?.status === 404) {
        setError("Order service is not available. Please try again later.");
      } else {
        setError(
          "Failed to fetch orders. Please check your connection and try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const trackOrder = async (identifier) => {
    if (!identifier || identifier.trim() === "") {
      setError("Please enter an Order ID or Tracking Number");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Try public endpoint first (doesn't require auth)
      const response = await axiosInstance.get(
        `/orders/track-public/${identifier.trim()}`
      );

      if (response.data.success) {
        setTrackingData(response.data.data);
        setError("");
      }
    } catch (err) {
      console.error("Error tracking order:", err);

      if (err.response?.status === 404) {
        setError(
          "Order not found. Please check your Order ID or Tracking Number and try again."
        );
      } else if (err.response?.status === 401) {
        setError(
          "Authentication required. Please log in to track your orders."
        );
      } else {
        setError(
          "Failed to track order. Please check your Order ID/Tracking Number and try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to update order status.");
        return;
      }

      // Additional check - only allow if user is logged in and order belongs to them
      const orderToUpdate = orders.find((order) => order._id === orderId);
      if (!user || !orderToUpdate || orderToUpdate.user !== user._id) {
        alert("You can only update your own orders.");
        return;
      }

      const response = await axiosInstance.patch(
        `/orders/${orderId}/status`,
        {
          status: newStatus,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        fetchOrders(); // Refresh the orders list
        alert(`Order status updated to ${newStatus}`);
      }
    } catch (err) {
      console.error("Error updating order status:", err);
      if (err.response?.status === 401) {
        alert("Your session has expired. Please log in again.");
      } else if (err.response?.status === 403) {
        alert("You don't have permission to update this order.");
      } else {
        alert("Failed to update order status.");
      }
    }
  };

  const createDemoOrder = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please log in first to create orders.");
        setLoading(false);
        return;
      }

      const demoOrderData = {
        amount: 1299,
        items: [
          { name: "Premium T-Shirt", qty: 1, price: 999 },
          { name: "Sticker Pack", qty: 1, price: 300 },
        ],
        shippingDetails: {
          fullName: "Demo User",
          phone: "9876543210",
          address: {
            street: "123 Demo Street",
            city: "Mumbai",
            state: "Maharashtra",
            pincode: "400001",
            country: "India",
          },
        },
      };

      const response = await axiosInstance.post(
        "/orders/create",
        demoOrderData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        alert(
          `Demo order created successfully! Order ID: ${response.data.order._id}`
        );
        fetchOrders(); // Refresh the orders list
      }
    } catch (err) {
      console.error("Error creating demo order:", err);
      if (err.response?.status === 401) {
        alert(
          "Your session has expired. Please log in again to create orders."
        );
      } else {
        alert("Failed to create demo order. Please try again.");
      }
    } finally {
      setLoading(false);
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

  const TrackingTimeline = ({ timeline }) => (
    <div className="tracking-timeline">
      {timeline.map((item, index) => (
        <div key={index} className={`timeline-item ${item.status}`}>
          <div
            className="timeline-icon"
            style={{ backgroundColor: getStatusColor(item.status) }}
          >
            ✓
          </div>
          <div className="timeline-content">
            <h4>{item.title}</h4>
            <p>{item.description}</p>
            <span className="timeline-date">{formatDate(item.timestamp)}</span>
          </div>
        </div>
      ))}
    </div>
  );

  const OrderCard = ({ order }) => (
    <div className="order-card">
      <div className="order-header">
        <div className="order-id">
          <strong>Order #{order._id.slice(-8)}</strong>
          {order.trackingNumber && (
            <span className="tracking-number">
              Tracking: {order.trackingNumber}
            </span>
          )}
        </div>
        <div
          className="order-status"
          style={{ backgroundColor: getStatusColor(order.status) }}
        >
          {order.status.toUpperCase()}
        </div>
      </div>

      <div className="order-details">
        <div className="order-info">
          <p>
            <strong>Amount:</strong> ₹{order.amount}
          </p>
          <p>
            <strong>Shipping:</strong> ₹{order.shippingCost}
          </p>
          <p>
            <strong>Date:</strong> {formatDate(order.createdAt)}
          </p>
        </div>

        <div className="shipping-address">
          <h4>Shipping Address:</h4>
          <p>{order.shippingDetails?.fullName}</p>
          <p>{order.shippingDetails?.address?.street}</p>
          <p>
            {order.shippingDetails?.address?.city},{" "}
            {order.shippingDetails?.address?.state}
          </p>
          <p>{order.shippingDetails?.address?.pincode}</p>
        </div>
      </div>

      <div className="order-actions">
        <button onClick={() => trackOrder(order._id)} className="track-btn">
          Track Order
        </button>
        <button onClick={() => setSelectedOrder(order)} className="details-btn">
          View Details
        </button>

        {/* Only allow status change for order owner */}
        {user && order.user === user._id && (
          <select
            value={order.status}
            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
            className="status-select"
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        )}

        {/* Show current status if not owner */}
        {(!user || order.user !== user._id) && (
          <div className="status-display">
            <span
              className="status-badge"
              style={{ backgroundColor: getStatusColor(order.status) }}
            >
              {order.status.toUpperCase()}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  const OrderDetailsModal = ({ order, onClose }) => {
    if (!order) return null;

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Order Details</h2>
            <button onClick={onClose} className="close-btn">
              &times;
            </button>
          </div>

          <div className="modal-body">
            <div className="order-summary">
              <h3>Order #{order._id.slice(-8)}</h3>
              <p>
                <strong>Status:</strong>{" "}
                <span style={{ color: getStatusColor(order.status) }}>
                  {order.status.toUpperCase()}
                </span>
              </p>
              <p>
                <strong>Total Amount:</strong> ₹{order.amount}
              </p>
              <p>
                <strong>Shipping Cost:</strong> ₹{order.shippingCost}
              </p>
              <p>
                <strong>Order Date:</strong> {formatDate(order.createdAt)}
              </p>
              {order.trackingNumber && (
                <p>
                  <strong>Tracking Number:</strong> {order.trackingNumber}
                </p>
              )}
            </div>

            {order.items && order.items.length > 0 && (
              <div className="order-items">
                <h4>Items:</h4>
                {order.items.map((item, index) => (
                  <div key={index} className="item">
                    <span>
                      {item.name} x {item.qty}
                    </span>
                    <span>₹{item.price * item.qty}</span>
                  </div>
                ))}
              </div>
            )}

            {order.shippingInfo && (
              <div className="shipping-info">
                <h4>Shipping Information:</h4>
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
              </div>
            )}

            {order.notes && (
              <div className="order-notes">
                <h4>Notes:</h4>
                <p>{order.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const TrackingModal = ({ trackingData, onClose }) => {
    if (!trackingData) return null;

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div
          className="modal-content tracking-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h2>Order Tracking</h2>
            <button onClick={onClose} className="close-btn">
              &times;
            </button>
          </div>

          <div className="modal-body">
            <div className="tracking-summary">
              <h3>Order #{trackingData.order._id.slice(-8)}</h3>
              <p>
                <strong>Current Status:</strong>{" "}
                <span
                  style={{ color: getStatusColor(trackingData.order.status) }}
                >
                  {trackingData.order.status.toUpperCase()}
                </span>
              </p>
              {trackingData.order.trackingNumber && (
                <p>
                  <strong>Tracking Number:</strong>{" "}
                  {trackingData.order.trackingNumber}
                </p>
              )}
              {trackingData.estimatedDelivery && (
                <p>
                  <strong>Estimated Delivery:</strong>{" "}
                  {formatDate(trackingData.estimatedDelivery)}
                </p>
              )}
            </div>

            <TrackingTimeline timeline={trackingData.trackingTimeline} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="order-tracking">
      <div className="header">
        <div>
          <h1>My Orders</h1>
          {user && (
            <p
              style={{ color: "#64748b", marginTop: "10px", fontSize: "14px" }}
            >
              Welcome back, {user.fullname}! 👋
            </p>
          )}
        </div>

        <div className="search-track">
          <input
            type="text"
            placeholder="Enter Order ID or Tracking Number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button onClick={() => trackOrder(searchTerm)} className="track-btn">
            Track Order
          </button>
        </div>
      </div>

      <div className="filters">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="status-filter"
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading && <div className="loading">Loading orders...</div>}

      {error && (
        <div className="error">
          {error}
          {(error.includes("log in") ||
            error.includes("session has expired")) && (
            <div style={{ marginTop: "15px" }}>
              <a
                href="/login"
                style={{
                  color: "#007bff",
                  textDecoration: "none",
                  padding: "10px 20px",
                  background: "#e3f2fd",
                  borderRadius: "5px",
                  display: "inline-block",
                  marginRight: "10px",
                }}
              >
                🔑 Go to Login
              </a>
              <button
                onClick={() => {
                  setError("");
                  window.location.reload();
                }}
                style={{
                  color: "#28a745",
                  textDecoration: "none",
                  padding: "10px 20px",
                  background: "#e8f5e8",
                  borderRadius: "5px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                🔄 Refresh Page
              </button>
            </div>
          )}
        </div>
      )}

      <div className="orders-list">
        {orders.length === 0 && !loading ? (
          <div className="no-orders">
            <h3>No orders found.</h3>
            <p>You haven't placed any orders yet.</p>
            <div style={{ marginTop: "20px" }}>
              <button
                onClick={() => (window.location.href = "/store")}
                style={{
                  padding: "12px 24px",
                  background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontSize: "14px",
                  marginRight: "15px",
                }}
              >
                🛍️ Visit Store
              </button>
              <button
                onClick={() => createDemoOrder()}
                style={{
                  padding: "12px 24px",
                  background: "linear-gradient(135deg, #059669, #047857)",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                🧪 Create Demo Order
              </button>
            </div>
          </div>
        ) : (
          orders.map((order) => <OrderCard key={order._id} order={order} />)
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="page-btn"
          >
            Previous
          </button>

          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="page-btn"
          >
            Next
          </button>
        </div>
      )}

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}

      {trackingData && (
        <TrackingModal
          trackingData={trackingData}
          onClose={() => setTrackingData(null)}
        />
      )}
    </div>
  );
};

export default OrderTracking;
