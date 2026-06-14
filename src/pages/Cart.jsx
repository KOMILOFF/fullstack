import React from "react";
import { MdOutlineCancel } from "react-icons/md";
import { FiMinus } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
import { Link } from "react-router-dom";
import axios from "axios";

const Cart = ({ items, setItems }) => {
  const userId = localStorage.getItem("userId");

  const updateQuantity = async (id, newQty) => {
    if (newQty < 1) return;
    
    if (userId) {
      try {
        await axios.put(
          `http://localhost:4000/api/cart/${id}`,
          { qty: newQty, userId: userId }
        );
      } catch (err) {
        console.error("Savat miqdorini yangilashda xatolik:", err);
      }
    }
    

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, qty: newQty } : item
      )
    );
  };

  const deleteItem = async (id) => {
    if (userId) {
      try {
        await axios.delete(`http://localhost:4000/api/cart/${id}`, {
          data: { userId: userId }
        });
      } catch (err) {
        console.error("Savatdan o'chirishda xatolik:", err);
      }
    }
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const totalPrice = items.reduce(
    (total, item) => {
      const targetProduct = item.Smartphone || item.smartphone || item.product || item;
      const price = targetProduct.price || item.price || 0;
      return total + (price * (item.qty || 1));
    },
    0
  );
  const totalQty = items.reduce((total, item) => total + Number(item.qty || 1), 0);

  return (
    <div className="cart" style={{ padding: "20px" }}>
      <div className="left-card">
        <h2>Cart</h2>

        {items.length === 0 ? (
          <p style={{ padding: "20px 0" }}>Cart is empty 🛒</p>
        ) : (
          <ul className="cart-ul">
            {items.map((item) => {
              // Backenddan kelishi mumkin bo'lgan barcha variantlarni tekshiramiz:
              const targetProduct = item.Smartphone || item.smartphone || item.product || item;
              
              const currentImage = targetProduct.image || targetProduct.img || item.image || item.img || "";
              const currentName = targetProduct.name || targetProduct.title || item.name || item.title || "Unknown Device";
              const currentMemory = targetProduct.memory || item.memory || "";
              const currentPrice = targetProduct.price || item.price || 0;

              return (
                <li key={item.id} className="cart-item">
                  <img 
                    src={currentImage} 
                    alt={currentName} 
                    className="cart-img" 
                    style={{ width: "80px", height: "80px", objectFit: "contain" }}
                  />

                  <div className="cart-info">
                    <p style={{ fontWeight: "bold" }}>{currentName}</p>
                    {currentMemory && <p style={{ fontSize: "14px", color: "gray" }}>{currentMemory}</p>}
                  </div>

                  <button onClick={() => updateQuantity(item.id, (item.qty || 1) - 1)} className="count-btn">
                    <FiMinus />
                  </button>

                  <span className="total">{item.qty || 1}</span>

                  <button onClick={() => updateQuantity(item.id, (item.qty || 1) + 1)} className="count-btn">
                    <FaPlus />
                  </button>
                  <p className="item-price">{currentPrice * (item.qty || 1)}$</p>

                  <button
                    onClick={() => deleteItem(item.id)}
                    className="delete-btn"
                    style={{ cursor: "pointer" }}
                  >
                    <MdOutlineCancel />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      
      <div className="right-card">
        <h2 className="total-title">Order Summary</h2>
        <form className="total-form" onSubmit={(e) => e.preventDefault()}>
          <label className="ipn-label">Discount code / Promo code</label>
          <input type="text" placeholder="Code" className="form-inp" />

          <label className="card-label">Your bonus card number</label>
          <div className="btn-inp">
            <input
              type="text"
              placeholder="Enter Card Number"
              className="number-inp"
            />
            <button className="apply-btn">Apply</button>
          </div>
          <div className="total-price">
            <div className="price-row">
              <h3>Subtotal (items):</h3>
              <p>{totalQty} ta</p>
            </div>

            <div className="price-row">
              <h3>Total:</h3>
              <p style={{ color: "green", fontWeight: "bold" }}>{totalPrice}$</p>
            </div>
          </div>
          <Link to="/step1">
            <button className="check">Checkout</button>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Cart;