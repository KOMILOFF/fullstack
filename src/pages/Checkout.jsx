import React, { useState, useEffect } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

const Checkout = ({ items, setItems }) => {
  const [address, setAddress] = useState("");
  const [savedAddresses, setSavedAddresses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSavedAddresses = async () => {
      const currentUserId = localStorage.getItem("userId");
      if (!currentUserId || currentUserId === "undefined") return;
      try {
        const res = await API.get("/api/addresses", {
          params: { userId: Number(currentUserId) }
        });
        setSavedAddresses(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSavedAddresses();
  }, []);

  const handlePlaceOrder = async () => {
    const currentUserId = localStorage.getItem("userId");

    if (!currentUserId || currentUserId === "undefined") {
      alert("Tizimga qaytadan kiring, foydalanuvchi ID si topilmadi!");
      navigate("/login");
      return;
    }
    if (!address.trim()) {
      alert("Iltimos, yetkazib berish manzilingizni kiriting yoki tanlang!");
      return;
    }
    if (!items || items.length === 0) {
      alert("Savat bo'sh, buyurtma berib bo'lmaydi!");
      return;
    }

    try {
      const orderItems = items.map((item) => {
        const actualSmartphoneId = item.smartphoneId || item.SmartphoneId || item.Smartphone?.id;
        return {
          id: Number(actualSmartphoneId),
          qty: Number(item.qty || 1),
        };
      });

      if (orderItems.some(i => !i.id || isNaN(i.id))) {
        alert("Savatdagi mahsulot ID sida muammo bor. Savatni tozalab qaytadan urinib ko'ring.");
        return;
      }

      await API.post(
        "/api/orders",
        { items: orderItems, address, userId: Number(currentUserId) },
        { headers: { "Content-Type": "application/json" } }
      );

      alert("Buyurtmangiz muvaffaqiyatli qabul qilindi!");
      setItems([]); 
      window.location.href = "/profile";
    } catch (err) {
      console.error("Buyurtma xatoligi:", err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || "Server bilan ulanishda xatolik yuz berdi.";
      alert(`Xatolik: ${errorMessage}`);
    }
  };

  return (
    <div className="Stepcontainer">
      <h2>Checkout</h2>
      <div className="step-wrapp">
        <div className="opt-addres">
          <h3>Yetkazib berish manzili</h3>
        </div>

        {savedAddresses.length > 0 && (
          <div className="checkout-select-wrapper">
            <label className="checkout-select-label">Saqlangan manzillarizdan tanlang:</label>
            <select 
              onChange={(e) => setAddress(e.target.value)}
              className="checkout-select"
              defaultValue=""
            >
              <option value="" disabled>-- Manzilni tanlang --</option>
              {savedAddresses.map((addr) => (
                <option key={addr.id} value={addr.details}>
                  {addr.title} ({addr.details})
                </option>
              ))}
            </select>
            <div className="checkout-divider">YOKI</div>
          </div>
        )}
        
        <div className="opt1">
          <input
            type="text"
            className="form-inp home-inp"
            placeholder="Viloyat, shahar, ko'cha, uy raqamini qo'lda kiriting..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="buttons">
          <button className="next last" onClick={() => navigate("/cart")}>
            Savatga qaytish
          </button>
          <button className="next again" onClick={handlePlaceOrder}>
            Buyurtmani yakunlash
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;