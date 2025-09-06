import React, { useState } from "react";
import axios from "axios";

const OrderTestPopulator = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8000/api/v1",
    withCredentials: true,
  });

  const sampleOrders = [
    {
      orderData: {
        items: [
          { name: "Premium T-Shirt", qty: 2, price: 999 },
          { name: "Coffee Mug", qty: 1, price: 299 },
        ],
        shippingDetails: {
          fullName: "Rahul Sharma",
          phone: "9876543210",
          address: {
            street: "123 MG Road",
            city: "Mumbai",
            state: "Maharashtra",
            pincode: "400001",
            country: "India",
          },
        },
        totalAmount: 2297,
      },
      status: "pending",
    },
    {
      orderData: {
        items: [
          { name: "Hoodie", qty: 1, price: 1499 },
          { name: "Stickers Pack", qty: 3, price: 199 },
        ],
        shippingDetails: {
          fullName: "Priya Patel",
          phone: "8765432109",
          address: {
            street: "456 Brigade Road",
            city: "Bangalore",
            state: "Karnataka",
            pincode: "560001",
            country: "India",
          },
        },
        totalAmount: 2096,
      },
      status: "confirmed",
    },
    {
      orderData: {
        items: [
          { name: "Phone Case", qty: 1, price: 599 },
          { name: "Notebook", qty: 2, price: 149 },
        ],
        shippingDetails: {
          fullName: "Amit Kumar",
          phone: "7654321098",
          address: {
            street: "789 CP",
            city: "Delhi",
            state: "Delhi",
            pincode: "110001",
            country: "India",
          },
        },
        totalAmount: 897,
      },
      status: "processing",
    },
    {
      orderData: {
        items: [{ name: "Premium Cap", qty: 1, price: 799 }],
        shippingDetails: {
          fullName: "Sneha Reddy",
          phone: "6543210987",
          address: {
            street: "321 Banjara Hills",
            city: "Hyderabad",
            state: "Telangana",
            pincode: "500034",
            country: "India",
          },
        },
        totalAmount: 799,
      },
      status: "shipped",
    },
    {
      orderData: {
        items: [
          { name: "Water Bottle", qty: 1, price: 399 },
          { name: "Keychain", qty: 5, price: 99 },
        ],
        shippingDetails: {
          fullName: "Vikram Singh",
          phone: "5432109876",
          address: {
            street: "654 MI Road",
            city: "Jaipur",
            state: "Rajasthan",
            pincode: "302001",
            country: "India",
          },
        },
        totalAmount: 894,
      },
      status: "delivered",
    },
  ];

  const createSampleOrder = async (orderData, targetStatus) => {
    try {
      // First create the order
      const createResponse = await axiosInstance.post(
        "/orders/create",
        orderData
      );

      if (createResponse.data.success) {
        const orderId = createResponse.data.data.order._id;
        console.log(`Created order: ${orderId}`);

        // If status is not pending, update it
        if (targetStatus !== "pending") {
          const trackingNumber =
            targetStatus === "shipped" || targetStatus === "delivered"
              ? `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}`
              : "";

          await axiosInstance.patch(`/orders/${orderId}/status`, {
            status: targetStatus,
            trackingNumber,
            note: `Demo order set to ${targetStatus}`,
          });

          console.log(`Updated order ${orderId} to status: ${targetStatus}`);
        }

        return true;
      }
      return false;
    } catch (error) {
      console.error("Error creating order:", error);
      return false;
    }
  };

  const populateOrders = async () => {
    setLoading(true);
    setMessage("Creating sample orders...");

    try {
      let successCount = 0;

      for (let i = 0; i < sampleOrders.length; i++) {
        const { orderData, status } = sampleOrders[i];
        const success = await createSampleOrder(orderData, status);

        if (success) {
          successCount++;
          setMessage(
            `Created ${successCount}/${sampleOrders.length} orders...`
          );
        }

        // Small delay between requests
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      setMessage(
        `✅ Successfully created ${successCount} sample orders! You can now test the order tracking system.`
      );
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const clearAllOrders = async () => {
    if (
      !window.confirm(
        "Are you sure you want to clear all orders? This action cannot be undone."
      )
    ) {
      return;
    }

    setLoading(true);
    setMessage("Clearing all orders...");

    try {
      // This is a demo function - in production, you'd have proper admin endpoints
      const response = await axiosInstance.get("/orders/my-orders?limit=100");

      if (response.data.success) {
        const orders = response.data.data.orders;
        let deletedCount = 0;

        for (const order of orders) {
          try {
            // Update to cancelled status instead of deleting
            await axiosInstance.patch(`/orders/${order._id}/status`, {
              status: "cancelled",
              note: "Cleared by test populator",
            });
            deletedCount++;
          } catch (error) {
            console.error(`Failed to cancel order ${order._id}:`, error);
          }
        }

        setMessage(`✅ Cancelled ${deletedCount} orders.`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "50px auto",
        padding: "30px",
        background: "white",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#333", marginBottom: "30px" }}>
        Order Test Populator
      </h2>

      <p style={{ color: "#666", marginBottom: "30px", lineHeight: "1.6" }}>
        This tool will create sample orders with different statuses to test the
        order tracking system. Make sure you're logged in before using this
        tool.
      </p>

      <div style={{ display: "flex", gap: "15px", flexDirection: "column" }}>
        <button
          onClick={populateOrders}
          disabled={loading}
          style={{
            padding: "15px 20px",
            background: loading ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "500",
          }}
        >
          {loading ? "Creating Orders..." : "Create Sample Orders"}
        </button>

        <button
          onClick={clearAllOrders}
          disabled={loading}
          style={{
            padding: "15px 20px",
            background: loading ? "#ccc" : "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "500",
          }}
        >
          {loading ? "Processing..." : "Clear All Orders"}
        </button>
      </div>

      {message && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            background: message.includes("❌") ? "#f8d7da" : "#d4edda",
            border: `1px solid ${
              message.includes("❌") ? "#f5c6cb" : "#c3e6cb"
            }`,
            borderRadius: "8px",
            color: message.includes("❌") ? "#721c24" : "#155724",
          }}
        >
          {message}
        </div>
      )}

      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          background: "#f8f9fa",
          borderRadius: "8px",
        }}
      >
        <h4 style={{ margin: "0 0 15px 0", color: "#333" }}>
          Sample Orders Created:
        </h4>
        <ul style={{ margin: 0, paddingLeft: "20px", color: "#666" }}>
          <li>Order with "pending" status</li>
          <li>Order with "confirmed" status</li>
          <li>Order with "processing" status</li>
          <li>Order with "shipped" status (with tracking number)</li>
          <li>Order with "delivered" status</li>
        </ul>

        <div style={{ marginTop: "15px", fontSize: "14px", color: "#666" }}>
          <strong>Next Steps:</strong>
          <br />• Visit <strong>/orders</strong> to see the order tracking page
          <br />• Visit <strong>/dashboard</strong> to see the order management
          dashboard
          <br />• Test tracking orders by Order ID or tracking number
        </div>
      </div>
    </div>
  );
};

export default OrderTestPopulator;
