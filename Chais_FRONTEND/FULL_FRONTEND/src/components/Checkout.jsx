import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { useNavbar } from "../contexts/NavbarContext";
import "./Checkout.css";

export default function Checkout() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [orderStep, setOrderStep] = useState(1); // 1: Cart Review, 2: Shipping, 3: Payment, 4: Confirmation
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const { isCollapsed } = useNavbar();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      navigate("/register");
    }

    // Load cart from localStorage
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      setCart(parsedCart);
      if (parsedCart.length === 0) {
        navigate("/store");
      }
    } else {
      navigate("/store");
    }
  }, [navigate]);

  const getCartSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getShippingCost = () => {
    const subtotal = getCartSubtotal();
    return subtotal >= 4250 ? 0 : 849.15; // Free shipping over ₹4250
  };

  const getTaxAmount = () => {
    return getCartSubtotal() * 0.08; // 8% tax
  };

  const getTotalAmount = () => {
    return getCartSubtotal() + getShippingCost() + getTaxAmount();
  };

  const updateQuantity = (cartId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartId);
      return;
    }

    const newCart = cart.map((item) =>
      item.cartId === cartId ? { ...item, quantity: newQuantity } : item
    );
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const removeFromCart = (cartId) => {
    const newCart = cart.filter((item) => item.cartId !== cartId);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));

    if (newCart.length === 0) {
      navigate("/store");
    }
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setOrderStep(3);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setOrderStep(4);
      // Clear cart after successful order
      localStorage.removeItem("cart");
    }, 3000);
  };

  const stepIndicators = [
    { step: 1, label: "Cart Review", icon: "🛒" },
    { step: 2, label: "Shipping", icon: "📦" },
    { step: 3, label: "Payment", icon: "💳" },
    { step: 4, label: "Confirmation", icon: "✅" },
  ];

  if (!user) return null;

  return (
    <>
      <Navbar />
      <div
        className={`checkout-page with-navbar ${
          isCollapsed ? "collapsed" : ""
        }`}
      >
        {/* Progress Indicator */}
        <div className="checkout-progress">
          <div className="progress-container">
            {stepIndicators.map((indicator, index) => (
              <div key={indicator.step} className="progress-step">
                <div
                  className={`step-circle ${
                    orderStep >= indicator.step ? "active" : ""
                  } ${orderStep > indicator.step ? "completed" : ""}`}
                >
                  <span className="step-icon">{indicator.icon}</span>
                </div>
                <span className="step-label">{indicator.label}</span>
                {index < stepIndicators.length - 1 && (
                  <div
                    className={`step-line ${
                      orderStep > indicator.step ? "completed" : ""
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="checkout-container">
          {/* Step 1: Cart Review */}
          {orderStep === 1 && (
            <div className="checkout-step">
              <div className="step-header">
                <h1 className="step-title">Review Your Order</h1>
                <p className="step-subtitle">
                  Verify your items before proceeding
                </p>
              </div>

              <div className="checkout-content">
                <div className="cart-review">
                  {cart.map((item) => (
                    <div key={item.cartId} className="checkout-item">
                      <div className="item-image">
                        <img src={item.image} alt={item.name} />
                      </div>

                      <div className="item-details">
                        <h3 className="item-name">{item.name}</h3>
                        <div className="item-specs">
                          {item.selectedSize !== "Standard" &&
                            item.selectedSize !== "One Size" && (
                              <span className="spec">
                                Size: {item.selectedSize}
                              </span>
                            )}
                          <span className="spec">
                            Color: {item.selectedColor}
                          </span>
                        </div>
                        <div className="item-price">
                          ₹{item.price.toFixed(2)}
                        </div>
                      </div>

                      <div className="item-controls">
                        <div className="quantity-controls">
                          <button
                            className="qty-btn"
                            onClick={() =>
                              updateQuantity(item.cartId, item.quantity - 1)
                            }
                          >
                            -
                          </button>
                          <span className="quantity">{item.quantity}</span>
                          <button
                            className="qty-btn"
                            onClick={() =>
                              updateQuantity(item.cartId, item.quantity + 1)
                            }
                          >
                            +
                          </button>
                        </div>

                        <button
                          className="remove-btn"
                          onClick={() => removeFromCart(item.cartId)}
                        >
                          Remove
                        </button>
                      </div>

                      <div className="item-total">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-summary">
                  <h3 className="summary-title">Order Summary</h3>
                  <div className="summary-line">
                    <span>Subtotal:</span>
                    <span>₹{getCartSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="summary-line">
                    <span>Shipping:</span>
                    <span>₹{getShippingCost().toFixed(2)}</span>
                  </div>
                  <div className="summary-line">
                    <span>Tax:</span>
                    <span>₹{getTaxAmount().toFixed(2)}</span>
                  </div>
                  <div className="summary-line total">
                    <span>Total:</span>
                    <span>₹{getTotalAmount().toFixed(2)}</span>
                  </div>

                  <button
                    className="continue-btn"
                    onClick={() => setOrderStep(2)}
                  >
                    Continue to Shipping
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Shipping Information */}
          {orderStep === 2 && (
            <div className="checkout-step">
              <div className="step-header">
                <h1 className="step-title">Shipping Information</h1>
                <p className="step-subtitle">
                  Where should we send your order?
                </p>
              </div>

              <form onSubmit={handleShippingSubmit} className="shipping-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.firstName}
                      onChange={(e) =>
                        setShippingInfo({
                          ...shippingInfo,
                          firstName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.lastName}
                      onChange={(e) =>
                        setShippingInfo({
                          ...shippingInfo,
                          lastName: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      required
                      value={shippingInfo.email}
                      onChange={(e) =>
                        setShippingInfo({
                          ...shippingInfo,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      required
                      value={shippingInfo.phone}
                      onChange={(e) =>
                        setShippingInfo({
                          ...shippingInfo,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    required
                    value={shippingInfo.address}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        address: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.city}
                      onChange={(e) =>
                        setShippingInfo({
                          ...shippingInfo,
                          city: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.state}
                      onChange={(e) =>
                        setShippingInfo({
                          ...shippingInfo,
                          state: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>ZIP Code</label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.zipCode}
                      onChange={(e) =>
                        setShippingInfo({
                          ...shippingInfo,
                          zipCode: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="back-btn"
                    onClick={() => setOrderStep(1)}
                  >
                    Back to Cart
                  </button>
                  <button type="submit" className="continue-btn">
                    Continue to Payment
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Step 3: Payment */}
          {orderStep === 3 && (
            <div className="checkout-step">
              <div className="step-header">
                <h1 className="step-title">Payment Information</h1>
                <p className="step-subtitle">Complete your secure payment</p>
              </div>

              <form onSubmit={handlePaymentSubmit} className="payment-form">
                <div className="form-group">
                  <label>Cardholder Name</label>
                  <input
                    type="text"
                    required
                    value={paymentInfo.cardholderName}
                    onChange={(e) =>
                      setPaymentInfo({
                        ...paymentInfo,
                        cardholderName: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Card Number</label>
                  <input
                    type="text"
                    required
                    placeholder="1234 5678 9012 3456"
                    value={paymentInfo.cardNumber}
                    onChange={(e) =>
                      setPaymentInfo({
                        ...paymentInfo,
                        cardNumber: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      value={paymentInfo.expiryDate}
                      onChange={(e) =>
                        setPaymentInfo({
                          ...paymentInfo,
                          expiryDate: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input
                      type="text"
                      required
                      placeholder="123"
                      value={paymentInfo.cvv}
                      onChange={(e) =>
                        setPaymentInfo({ ...paymentInfo, cvv: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="payment-summary">
                  <div className="summary-line">
                    <span>Total Amount:</span>
                    <span className="total-amount">
                      ₹{getTotalAmount().toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="back-btn"
                    onClick={() => setOrderStep(2)}
                  >
                    Back to Shipping
                  </button>
                  <button
                    type="submit"
                    className="pay-btn"
                    disabled={isProcessing}
                  >
                    {isProcessing
                      ? "Processing..."
                      : `Pay ₹${getTotalAmount().toFixed(2)}`}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Step 4: Order Confirmation */}
          {orderStep === 4 && (
            <div className="checkout-step">
              <div className="confirmation-content">
                <div className="success-icon">✅</div>
                <h1 className="confirmation-title">Order Confirmed!</h1>
                <p className="confirmation-subtitle">
                  Thank you for your purchase. Your order has been successfully
                  placed.
                </p>

                <div className="order-details">
                  <h3>Order Summary</h3>
                  <div className="order-number">
                    Order #CF{Date.now().toString().slice(-6)}
                  </div>
                  <div className="order-total">
                    Total: ₹{getTotalAmount().toFixed(2)}
                  </div>
                </div>

                <div className="confirmation-actions">
                  <button
                    className="continue-shopping-btn"
                    onClick={() => navigate("/store")}
                  >
                    Continue Shopping
                  </button>
                  <button
                    className="view-orders-btn"
                    onClick={() => navigate("/profile")}
                  >
                    View Orders
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
