import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { useNavbar } from "../contexts/NavbarContext";
import "./Merchandise.css";

export default function Merchandise() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({});
  const { isCollapsed } = useNavbar();

  // Sample merchandise data
  const merchandiseData = [
    {
      id: 1,
      name: "Castify Premium T-Shirt",
      category: "clothing",
      price: 2549.15,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEwZYF3oaBtFkKTW5nuN8V_mJjjp0ARmNx_g&s",
      description: "Ultra-soft premium cotton with embroidered Castify logo",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      colors: ["Black", "Navy", "Charcoal"],
    },
    {
      id: 2,
      name: "Director's Hoodie",
      category: "clothing",
      price: 4249.15,
      image:
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop",
      description: "Cozy fleece hoodie perfect for creative sessions",
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: ["Black", "Gray", "Burgundy"],
    },
    {
      id: 3,
      name: "Castify Coffee Mug",
      category: "accessories",
      price: 1274.15,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMqYp0Px2WkFzyoy1hM7Lqbq05KnFW2rimUw&s",
      description: "Premium ceramic mug for your creative fuel",
      sizes: ["Standard"],
      colors: ["Black", "White", "Navy"],
    },
    {
      id: 4,
      name: "Creator's Cap",
      category: "accessories",
      price: 2124.15,
      image:
        "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=400&fit=crop",
      description: "Adjustable cap with embroidered logo",
      sizes: ["One Size"],
      colors: ["Black", "White", "Navy", "Red"],
    },
    {
      id: 5,
      name: "Story Creator Notebook",
      category: "stationery",
      price: 1699.15,
      image:
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop",
      description: "Premium notebook for plotting your next masterpiece",
      sizes: ["A5"],
      colors: ["Black", "Brown", "Navy"],
    },
    {
      id: 6,
      name: "Castify Sticker Pack",
      category: "stationery",
      price: 849.15,
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
      description: "Collection of 12 premium vinyl stickers",
      sizes: ["Standard"],
      colors: ["Mixed"],
    },
    {
      id: 7,
      name: "Premium Tote Bag",
      category: "accessories",
      price: 2974.15,
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
      description: "Durable canvas tote for creators on the go",
      sizes: ["Standard"],
      colors: ["Black", "Natural", "Navy"],
    },
    {
      id: 8,
      name: "Creator's Joggers",
      category: "clothing",
      price: 3399.15,
      image:
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop",
      description: "Comfortable joggers for relaxed creative sessions",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      colors: ["Black", "Gray", "Navy"],
    },
  ];

  const categories = [
    { value: "all", label: "All Products", icon: "🛍️" },
    { value: "clothing", label: "Clothing", icon: "👕" },
    { value: "accessories", label: "Accessories", icon: "🎭" },
    { value: "stationery", label: "Stationery", icon: "📝" },
  ];

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
      setCart(JSON.parse(savedCart));
    }

    // Filter products
    filterProducts();
  }, [navigate, selectedCategory]);

  const filterProducts = () => {
    if (selectedCategory === "all") {
      setProducts(merchandiseData);
    } else {
      setProducts(
        merchandiseData.filter(
          (product) => product.category === selectedCategory
        )
      );
    }
  };

  const addToCart = (product, selectedSize = null, selectedColor = null) => {
    const productId = product.id;
    const options = selectedOptions[productId] || {};
    const finalSize = selectedSize || options.size || product.sizes[0];
    const finalColor = selectedColor || options.color || product.colors[0];

    const cartItem = {
      ...product,
      cartId: `${product.id}-${finalSize}-${finalColor}`,
      selectedSize: finalSize,
      selectedColor: finalColor,
      quantity: 1,
    };

    const existingItemIndex = cart.findIndex(
      (item) => item.cartId === cartItem.cartId
    );
    let newCart;

    if (existingItemIndex >= 0) {
      newCart = [...cart];
      newCart[existingItemIndex].quantity += 1;
    } else {
      newCart = [...cart, cartItem];
    }

    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const updateProductOptions = (productId, optionType, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [optionType]: value,
      },
    }));
  };

  const removeFromCart = (cartId) => {
    const newCart = cart.filter((item) => item.cartId !== cartId);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
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

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  if (!user) return null;

  return (
    <>
      <Navbar />
      <div
        className={`merchandise-page with-navbar ${
          isCollapsed ? "collapsed" : ""
        }`}
      >
        {/* Floating background elements */}
        <div className="merchandise-background">
          <div className="bg-orb orb-1"></div>
          <div className="bg-orb orb-2"></div>
          <div className="bg-orb orb-3"></div>
        </div>

        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <div className="welcome-badge">
              <span className="badge-icon">🛍️</span>
              <span className="badge-text">Official Store</span>
            </div>
            <h1 className="hero-title">
              Castify <span className="gradient-text">Merchandise</span>
            </h1>
            <p className="hero-subtitle">
              Premium quality products for creators and storytellers
            </p>
          </div>
        </section>

        {/* Category Filter */}
        <section className="category-section">
          <div className="category-tabs">
            {categories.map((category) => (
              <button
                key={category.value}
                className={`category-tab ${
                  selectedCategory === category.value ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(category.value)}
              >
                <span className="tab-icon">{category.icon}</span>
                <span className="tab-label">{category.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Products Grid */}
        <section className="products-section">
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-icon">✨</span>
              {categories.find((cat) => cat.value === selectedCategory)
                ?.label || "All Products"}
            </h2>
            <div className="cart-summary">
              <button
                className="cart-toggle"
                onClick={() => setIsCartOpen(!isCartOpen)}
              >
                <span className="cart-icon">🛒</span>
                <span className="cart-count">{getCartItemCount()}</span>
                <span className="cart-total">₹{getCartTotal().toFixed(2)}</span>
              </button>
            </div>
          </div>

          <div className="products-grid">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="product-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  <div className="product-overlay">
                    <button
                      className="quick-add-btn"
                      onClick={() => addToCart(product)}
                    >
                      <span className="btn-icon">+</span>
                      <span className="btn-text">Quick Add</span>
                    </button>
                  </div>
                </div>

                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">{product.description}</p>

                  <div className="product-options">
                    <div className="size-options">
                      <span className="option-label">Size:</span>
                      <div className="option-values">
                        {product.sizes.map((size) => (
                          <button
                            key={size}
                            className={`size-tag ${
                              (selectedOptions[product.id]?.size ||
                                product.sizes[0]) === size
                                ? "selected"
                                : ""
                            }`}
                            onClick={() =>
                              updateProductOptions(product.id, "size", size)
                            }
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="color-options">
                      <span className="option-label">Color:</span>
                      <div className="option-values">
                        {product.colors.map((color) => (
                          <button
                            key={color}
                            className={`color-tag ${
                              (selectedOptions[product.id]?.color ||
                                product.colors[0]) === color
                                ? "selected"
                                : ""
                            }`}
                            onClick={() =>
                              updateProductOptions(product.id, "color", color)
                            }
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="product-footer">
                    <div className="product-price">₹{product.price}</div>
                    <button
                      className="add-to-cart-btn"
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Shopping Cart Sidebar */}
        <div className={`cart-sidebar ${isCartOpen ? "open" : ""}`}>
          <div className="cart-header">
            <h3 className="cart-title">Shopping Cart</h3>
            <button className="cart-close" onClick={() => setIsCartOpen(false)}>
              ×
            </button>
          </div>

          <div className="cart-content">
            {cart.length === 0 ? (
              <div className="empty-cart">
                <div className="empty-icon">🛒</div>
                <p>Your cart is empty</p>
                <span>Add some awesome products!</span>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <div key={item.cartId} className="cart-item">
                      <div className="item-image">
                        <img src={item.image} alt={item.name} />
                      </div>

                      <div className="item-details">
                        <h4 className="item-name">{item.name}</h4>
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
                        <div className="item-price">₹{item.price}</div>
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
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cart-footer">
                  <div className="cart-total">
                    <div className="total-label">Total:</div>
                    <div className="total-amount">
                      ₹{getCartTotal().toFixed(2)}
                    </div>
                  </div>

                  <button
                    className="checkout-btn"
                    onClick={() => navigate("/checkout")}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Cart Overlay */}
        {isCartOpen && (
          <div
            className="cart-overlay"
            onClick={() => setIsCartOpen(false)}
          ></div>
        )}
      </div>
    </>
  );
}
